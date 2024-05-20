//アイコン
import AddCircleIcon from "@mui/icons-material/AddCircle";
import NotesIcon from "@mui/icons-material/Notes";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Drawer,
    Grid,
    List,
    ListItem,
    Stack,
    Typography,
} from "@mui/material";

import { useAppContext } from "../contexts/AppContext";
import { Transaction } from "../types";
import { formatCurrency } from "../utils/formattings";

import { CategoryIcon } from "./common/CategoryIcon";
import { DailySummary } from "./DailySummary";

interface TransactionProps {
    dailyTransactions: Transaction[];
    currentDay: string;
    isEntryDrawerOpen: boolean;
    onOpenForm: () => void;
    onCloseForm: () => void;
    setSelectedTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>;
    isMobileDrawerOpen: boolean;
    setIsMobileDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const TransactionMenu = ({
    dailyTransactions,
    currentDay,
    isEntryDrawerOpen,
    onOpenForm,
    onCloseForm,
    setSelectedTransaction,
    isMobileDrawerOpen,
    setIsMobileDrawerOpen,
}: TransactionProps) => {
    const { isMobile } = useAppContext();
    // Drawerの横幅
    const menuDrawerWidth = 320;
    // 取引が選択された時の処理
    const handleSelectTransaction = (transaction: Transaction) => {
        // フォームを開く
        onOpenForm();
        // 取引をセット
        setSelectedTransaction(transaction);
    };
    // 内訳追加ボタン押下時の処理
    const handleAddBreakDown = () => {
        // 既にDrawerを開いていれば閉じる
        if (isEntryDrawerOpen) {
            onCloseForm();
            return;
        }
        onOpenForm();
        setSelectedTransaction(null);
    };
    return (
        <Drawer
            sx={{
                width: isMobile ? "auto" : menuDrawerWidth,
                "& .MuiDrawer-paper": {
                    width: isMobile ? "auto" : menuDrawerWidth,
                    boxSizing: "border-box",
                    p: 2,
                    ...(isMobile && {
                        height: "80vh",
                        borderTopRightRadius: 8,
                        borderTopLeftRadius: 8,
                    }),
                    ...(!isMobile && {
                        top: 64,
                        height: `calc(100% - 64px)`, // AppBarの高さを引いたビューポートの高さ
                    }),
                },
            }}
            variant={isMobile ? "temporary" : "permanent"}
            anchor={isMobile ? "bottom" : "right"}
            open={isMobileDrawerOpen}
            onClose={() => setIsMobileDrawerOpen(false)}
            ModalProps={{
                // パフォーマンス向上
                keepMounted: true,
            }}
        >
            <Stack sx={{ height: "100%" }} spacing={2}>
                <Typography fontWeight={"fontWeightBold"}>日時： {currentDay}</Typography>
                <DailySummary dailyTransactions={dailyTransactions} columns={isMobile ? 3 : 2} />
                {/* 内訳タイトル&内訳追加ボタン */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 1,
                    }}
                >
                    {/* 左側のメモアイコンとテキスト */}
                    <Box display="flex" alignItems="center">
                        <NotesIcon sx={{ mr: 1 }} />
                        <Typography variant="body1">内訳</Typography>
                    </Box>
                    {/* 右側の追加ボタン */}
                    <Button startIcon={<AddCircleIcon />} color="primary" onClick={handleAddBreakDown}>
                        内訳を追加
                    </Button>
                </Box>
                {/* 取引一覧 */}
                <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                    <List aria-label="取引履歴">
                        <Stack spacing={2}>
                            {dailyTransactions.map((transaction) => (
                                <ListItem disablePadding key={transaction.id}>
                                    <Card
                                        sx={{
                                            width: "100%",
                                            backgroundColor:
                                                transaction.type === "income"
                                                    ? (theme) => theme.palette.incomeColor.light
                                                    : (theme) => theme.palette.expenseColor.light,
                                        }}
                                        onClick={() => handleSelectTransaction(transaction)}
                                    >
                                        <CardActionArea>
                                            <CardContent>
                                                <Grid container spacing={1} alignItems="center" wrap="wrap">
                                                    <Grid item xs={1}>
                                                        {/* icon */}
                                                        <CategoryIcon category={transaction.category} />
                                                    </Grid>
                                                    <Grid item xs={2.5}>
                                                        <Typography variant="caption" display="block" gutterBottom>
                                                            {transaction.category}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Typography variant="body2" gutterBottom>
                                                            {transaction.content}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={4.5}>
                                                        <Typography
                                                            gutterBottom
                                                            textAlign={"right"}
                                                            color="text.secondary"
                                                            sx={{
                                                                wordBreak: "break-all",
                                                            }}
                                                        >
                                                            ¥{formatCurrency(transaction.amount)}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </ListItem>
                            ))}
                        </Stack>
                    </List>
                </Box>
            </Stack>
        </Drawer>
    );
};
