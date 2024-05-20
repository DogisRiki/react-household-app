import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import {
    Box,
    Button,
    ButtonGroup,
    Dialog,
    DialogContent,
    IconButton,
    ListItemIcon,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { useAppContext } from "../contexts/AppContext";
import { Transaction, TransactionType } from "../types";
import { Schema, transactionSchema } from "../validations/schema";

import { categories, CategoryIcon } from "./common/CategoryIcon";

interface TransactionFormProps {
    onCloseForm: () => void;
    isEntryDrawerOpen: boolean;
    currentDay: string;
    selectedTransaction: Transaction | null;
    setSelectedTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>;
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TransactionForm = ({
    onCloseForm,
    isEntryDrawerOpen,
    currentDay,
    selectedTransaction,
    setSelectedTransaction,
    isDialogOpen,
    setIsDialogOpen,
}: TransactionFormProps) => {
    // コンテキスト
    const { isMobile, onSaveTransaction, onDeleteTransaction, onUpdateTransaction } = useAppContext();
    // フォームの横のサイズ
    const formWidth = 320;

    // フォームを初期化
    const {
        control,
        setValue,
        watch,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<Schema>({
        defaultValues: {
            type: "expense",
            date: currentDay,
            amount: 0,
            category: "",
            content: "",
        },
        resolver: zodResolver(transactionSchema), // ZodとReact Hook Formを接続
    });

    // 選択されている収支タイプ種類を監視する
    const currentTransactionType = watch("type");

    // 取引タブ切り替え時にカテゴリを初期化する
    const handleChangeCategoryTab = (categoryType: TransactionType): void => {
        setValue("type", categoryType);
        if (selectedTransaction) {
            setValue(
                "category",
                selectedTransaction.type === categoryType ? (selectedTransaction.category as Schema["category"]) : "",
            );
        } else {
            setValue("category", "");
        }
    };

    // フォームの日付を変更する
    useEffect(() => {
        setValue("date", currentDay);
    }, [currentDay]);

    // フォーム送信関数
    const onSubmit: SubmitHandler<Schema> = async (data): Promise<void> => {
        if (selectedTransaction) {
            await onUpdateTransaction(data, selectedTransaction.id);
            setSelectedTransaction(null);
            if (isMobile) {
                setIsDialogOpen(false);
            }
        } else {
            await onSaveTransaction(data);
        }
        // フォーム初期化
        reset({ type: "expense", date: currentDay, amount: 0, category: "", content: "" });
    };

    // 取引削除関数
    const handleDelete = (): void => {
        if (selectedTransaction) {
            onDeleteTransaction(selectedTransaction.id);
            setSelectedTransaction(null);
            if (isMobile) {
                setIsDialogOpen(false);
            }
        }
    };

    // フォームに取引内容を表示する
    useEffect(() => {
        if (selectedTransaction) {
            setValue("type", selectedTransaction.type);
            setValue("date", selectedTransaction.date);
            setValue("amount", selectedTransaction.amount);
            setValue("category", selectedTransaction.category as Schema["category"]);
            setValue("content", selectedTransaction.content);
        } else {
            reset({ type: "expense", date: currentDay, amount: 0, category: "", content: "" });
        }
    }, [selectedTransaction, currentDay, reset, setValue]);

    // フォームのコンテンツ
    const formContent = (
        <>
            {/* 入力エリアヘッダー */}
            <Box display={"flex"} justifyContent={"space-between"} mb={2}>
                <Typography variant="h6">入力</Typography>
                {/* 閉じるボタン */}
                <IconButton
                    onClick={onCloseForm}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
            {/* フォーム要素 */}
            <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    {/* 収支切り替えボタン */}
                    <Controller
                        name="type"
                        control={control}
                        render={() => (
                            <ButtonGroup fullWidth>
                                <Button
                                    variant={currentTransactionType === "expense" ? "contained" : "outlined"}
                                    color="error"
                                    onClick={() => handleChangeCategoryTab("expense")}
                                >
                                    支出
                                </Button>
                                <Button
                                    variant={currentTransactionType === "income" ? "contained" : "outlined"}
                                    color="primary"
                                    onClick={() => handleChangeCategoryTab("income")}
                                >
                                    収入
                                </Button>
                            </ButtonGroup>
                        )}
                    />
                    {/* 日付 */}
                    <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="日付"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                error={!!errors.date}
                                helperText={errors.date?.message}
                            />
                        )}
                    />
                    {/* カテゴリ */}
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="カテゴリ"
                                select
                                error={!!errors.category}
                                helperText={errors.category?.message}
                                InputLabelProps={{
                                    htmlFor: "category",
                                }}
                                inputProps={{ id: "category" }}
                            >
                                {categories
                                    .filter((category) =>
                                        currentTransactionType === "expense"
                                            ? category.type === "expense"
                                            : category.type === "income",
                                    )
                                    .map((category) => (
                                        <MenuItem value={category.label} key={category.label}>
                                            <ListItemIcon>
                                                <CategoryIcon category={category.label} />
                                            </ListItemIcon>
                                            {category.label}
                                        </MenuItem>
                                    ))}
                            </TextField>
                        )}
                    />
                    {/* 金額 */}
                    <Controller
                        name="amount"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={watch("amount") || ""}
                                onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                                label="金額"
                                type="number"
                                inputProps={{
                                    min: 0,
                                    step: 1,
                                }}
                                error={!!errors.amount}
                                helperText={errors.amount?.message}
                            />
                        )}
                    />
                    {/* 内容 */}
                    <Controller
                        name="content"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="内容"
                                type="text"
                                error={!!errors.content}
                                helperText={errors.content?.message}
                            />
                        )}
                    />
                    {/* 保存ボタン */}
                    <Button
                        type="submit"
                        variant="contained"
                        color={currentTransactionType === "income" ? "primary" : "error"}
                        fullWidth
                    >
                        {selectedTransaction ? "更新" : "保存"}
                    </Button>
                    {/* 削除ボタン */}
                    {selectedTransaction && (
                        <Button variant="outlined" color={"secondary"} fullWidth onClick={handleDelete}>
                            削除
                        </Button>
                    )}
                </Stack>
            </Box>
        </>
    );

    return (
        <>
            {isMobile ? (
                // mobile
                <Dialog open={isDialogOpen} onClose={onCloseForm} fullWidth maxWidth={"sm"}>
                    <DialogContent>{formContent}</DialogContent>
                </Dialog>
            ) : (
                // pc
                <Box
                    sx={{
                        position: "fixed",
                        top: 64,
                        right: isEntryDrawerOpen ? formWidth : "-2%", // フォームの位置を調整
                        width: formWidth,
                        height: "100%",
                        bgcolor: "background.paper",
                        zIndex: (theme) => theme.zIndex.drawer - 1,
                        transition: (theme) =>
                            theme.transitions.create("right", {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                        p: 2, // 内部の余白
                        boxSizing: "border-box", // ボーダーとパディングをwidthに含める
                        boxShadow: "0px 0px 15px -5px #777777",
                    }}
                >
                    {formContent}
                </Box>
            )}
        </>
    );
};
