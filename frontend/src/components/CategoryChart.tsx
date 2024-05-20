import { Box, CircularProgress, MenuItem, TextField, Typography, useTheme } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from "chart.js";
import { useState } from "react";
import React from "react";
import { Pie } from "react-chartjs-2";

import { useAppContext } from "../contexts/AppContext";
import { useMonthlyTransactions } from "../hooks/useMonthlyTransactions";
import { ExpenseCategory, IncomeCategory, TransactionType } from "../types";

ChartJS.register(ArcElement, Tooltip, Legend);

export const CategoryChart = () => {
    const { isLoading } = useAppContext();
    const monthlyTransactions = useMonthlyTransactions();
    // テーマ読み込み
    const theme = useTheme();
    // ドロップダウンの収支タイプを管理
    const [selectedType, setSelectedType] = useState<TransactionType>("expense");
    // ドロップダウンの収支タイプを変更する関数
    const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setSelectedType(e.target.value as TransactionType);
    };
    // カテゴリごとの合計値を算出する関数
    const totalByCategory = monthlyTransactions
        .filter((transaction) => transaction.type === selectedType)
        .reduce<Record<IncomeCategory | ExpenseCategory, number>>(
            (acc, transaction) => {
                const category = transaction.category;
                if (acc[category]) {
                    acc[category] += transaction.amount;
                } else {
                    acc[category] = transaction.amount;
                }
                return acc;
            },
            {} as Record<IncomeCategory | ExpenseCategory, number>,
        );

    // ラベルを作成
    const categoryLabels = Object.keys(totalByCategory) as (IncomeCategory | ExpenseCategory)[];

    // カテゴリデータを取得
    const categoryValues = Object.values(totalByCategory);

    // チャートのオプション
    const options = {
        maintainAspectRatio: false,
        responsive: true,
    };

    //収入用カテゴリカラー
    const incomeCategoryColor: Record<IncomeCategory, string> = {
        給与: theme.palette.incomeCategoryColor.給与,
        副収入: theme.palette.incomeCategoryColor.副収入,
        お小遣い: theme.palette.incomeCategoryColor.お小遣い,
    };

    //支出用カテゴリカラー
    const expenseCategoryColor: Record<ExpenseCategory, string> = {
        食費: theme.palette.expenseCategoryColor.食費,
        日用品: theme.palette.expenseCategoryColor.日用品,
        住居費: theme.palette.expenseCategoryColor.住居費,
        交際費: theme.palette.expenseCategoryColor.交際費,
        交通費: theme.palette.expenseCategoryColor.交通費,
        娯楽: theme.palette.expenseCategoryColor.娯楽,
    };

    // カテゴリーに対応するカラーを返却する関数
    const getCategoryColor = (category: IncomeCategory | ExpenseCategory): string => {
        if (selectedType === "income") {
            return incomeCategoryColor[category as IncomeCategory];
        } else {
            return expenseCategoryColor[category as ExpenseCategory];
        }
    };

    const data: ChartData<"pie"> = {
        labels: categoryLabels,
        datasets: [
            {
                data: categoryValues,
                backgroundColor: categoryLabels.map((category) => getCategoryColor(category)),
                borderColor: categoryLabels.map((category) => getCategoryColor(category)),
                borderWidth: 1,
            },
        ],
    };
    return (
        <>
            <TextField
                select
                fullWidth
                value={selectedType}
                label={"収支の種類"}
                onChange={handleTypeChange}
                InputLabelProps={{
                    htmlFor: "selectedType",
                }}
                inputProps={{ id: "selectedType" }}
            >
                <MenuItem value={"expense"}>支出</MenuItem>
                <MenuItem value={"income"}>収入</MenuItem>
            </TextField>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexGrow: 1,
                }}
            >
                {isLoading ? (
                    <CircularProgress />
                ) : monthlyTransactions.length > 0 ? (
                    <Pie data={data} options={options} />
                ) : (
                    <Typography>データがありません</Typography>
                )}
            </Box>
        </>
    );
};
