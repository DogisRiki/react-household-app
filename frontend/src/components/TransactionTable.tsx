import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { compareDesc, parseISO } from "date-fns";
import * as React from "react";

import { useAppContext } from "../contexts/AppContext";
import { useMonthlyTransactions } from "../hooks/useMonthlyTransactions";
import { financeCalclations } from "../utils/financeCalculations";
import { formatCurrency } from "../utils/formattings";

import { CategoryIcon } from "./common/CategoryIcon";

interface Data {
    id: number;
    calories: number;
    carbs: number;
    fat: number;
    name: string;
    protein: number;
}

type Order = "asc" | "desc";

interface TransactionTableHeadProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

// テーブルヘッダー
function TransactionTableHead(props: TransactionTableHeadProps) {
    const { onSelectAllClick, numSelected, rowCount } = props;

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            "aria-label": "select all desserts",
                        }}
                    />
                </TableCell>
                <TableCell>日付</TableCell>
                <TableCell>カテゴリ</TableCell>
                <TableCell>金額</TableCell>
                <TableCell>内容</TableCell>
            </TableRow>
        </TableHead>
    );
}

interface TransactionTableToolbarProps {
    numSelected: number;
    onDelete: () => void;
}

// ツールバー
function TransactionTableToolbar(props: TransactionTableToolbarProps) {
    const { numSelected, onDelete } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
                    月の収支
                </Typography>
            )}
            {numSelected > 0 && (
                <Tooltip title="Delete">
                    <IconButton onClick={onDelete}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

interface FinancialItemProps {
    title: string;
    value: number;
    color: string;
}

// 収支表示コンポーネント
function FinancialItem({ title, value, color }: FinancialItemProps) {
    return (
        <Grid item xs={4} textAlign={"center"}>
            <Typography variant="subtitle1" component={"div"}>
                {title}
            </Typography>
            <Typography
                component={"span"}
                fontWeight={"fontWeightBold"}
                sx={{ color: color, fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" }, wordBreak: "break-word" }}
            >
                ￥{formatCurrency(value)}
            </Typography>
        </Grid>
    );
}

// テーブル本体
export const TransactionTable = () => {
    const { onDeleteTransaction } = useAppContext();
    const monthlyTransactions = useMonthlyTransactions();
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<keyof Data>("calories");
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0); // 現在のページ
    const [dense, _] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5); // １ページに表示する件数
    const theme = useTheme();

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = monthlyTransactions.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // 取引をゴミ箱ボタンを押下した際に呼び出す取引削除関数
    const handleTransactionDelete = async () => {
        onDeleteTransaction(selected);
        setSelected([]);
    };

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, monthlyTransactions.length - page * rowsPerPage);

    // ページネーション処理
    const visibleRows = React.useMemo(() => {
        // 日付の降順で並び替える
        const sortedMonthlyTransactions = [...monthlyTransactions].sort((a, b) =>
            compareDesc(parseISO(a.date), parseISO(b.date)),
        );
        return sortedMonthlyTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [page, rowsPerPage, monthlyTransactions]);

    // 月の収入、支出、残高を取得
    const { income, expense, balance } = financeCalclations(monthlyTransactions);

    return (
        <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
                <Grid container sx={{ borderBottom: "1px solid rgba(224,224,224,1)" }}>
                    <FinancialItem title={"支出"} value={expense} color={theme.palette.expenseColor.main} />
                    <FinancialItem title={"収入"} value={income} color={theme.palette.incomeColor.main} />
                    <FinancialItem title={"残高"} value={balance} color={theme.palette.balanceColor.main} />
                </Grid>
                {/* ツールバー */}
                <TransactionTableToolbar numSelected={selected.length} onDelete={handleTransactionDelete} />
                {/* 取引一覧 */}
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? "small" : "medium"}>
                        <TransactionTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={monthlyTransactions.length}
                        />
                        <TableBody>
                            {visibleRows.map((transaction, index) => {
                                const isItemSelected = isSelected(transaction.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, transaction.id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={transaction.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: "pointer" }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    "aria-labelledby": labelId,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell component="th" id={labelId} scope="transaction" padding="none">
                                            {transaction.date}
                                        </TableCell>
                                        <TableCell align="left" sx={{ display: "flex", alignItems: "center" }}>
                                            <CategoryIcon category={transaction.category} />
                                            {transaction.category}
                                        </TableCell>
                                        <TableCell align="left">{transaction.amount}</TableCell>
                                        <TableCell align="left">{transaction.content}</TableCell>
                                    </TableRow>
                                );
                            })}
                            {/* データが5件に満たない場合、空の行を挿入 */}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 53 * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* テーブル下部のページネーション */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={monthlyTransactions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
};
