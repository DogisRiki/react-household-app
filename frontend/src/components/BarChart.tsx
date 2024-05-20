import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData } from "chart.js";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";

import { useAppContext } from "../contexts/AppContext";
import { useMonthlyTransactions } from "../hooks/useMonthlyTransactions";
import { calculateDailyBalances } from "../utils/financeCalculations";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const BarChart = () => {
    const { isLoading } = useAppContext();
    const monthlyTransactions = useMonthlyTransactions();
    // テーマ読み込み
    const theme = useTheme();

    // 月別取引を取得
    const dailyTransactions = useMemo(() => calculateDailyBalances(monthlyTransactions), [monthlyTransactions]);

    // ラベルを作成
    const dateLabels = useMemo(() => Object.keys(dailyTransactions).sort(), [dailyTransactions]);

    // 支出データを取得
    const expenseData = useMemo(
        () => dateLabels.map((day) => dailyTransactions[day].expense),
        [dailyTransactions, dateLabels],
    );

    // 収入データを取得
    const incomeData = useMemo(
        () => dateLabels.map((day) => dailyTransactions[day].income),
        [dailyTransactions, dateLabels],
    );

    // チャートのオプション
    const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: "日別収支",
            },
        },
    };

    // 描画するデータ
    const data: ChartData<"bar"> = {
        labels: dateLabels,
        datasets: [
            {
                label: "支出",
                data: expenseData,
                backgroundColor: theme.palette.expenseColor.light,
            },
            {
                label: "収入",
                data: incomeData,
                backgroundColor: theme.palette.incomeColor.light,
            },
        ],
    };

    return (
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
                <Bar options={options} data={data} />
            ) : (
                <Typography>データがありません</Typography>
            )}
        </Box>
    );
};
