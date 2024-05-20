import { Grid, Paper } from "@mui/material";

import { BarChart } from "../components/BarChart";
import { CategoryChart } from "../components/CategoryChart";
import { MonthlySelector } from "../components/MonthlySelector";
import { TransactionTable } from "../components/TransactionTable";

export const Report = () => {
    const commonPaperStyle = {
        height: "400px",
        display: "flex",
        flexDirection: "column",
        p: 2,
    };
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <MonthlySelector />
            </Grid>
            <Grid item xs={12} md={4}>
                <Paper sx={commonPaperStyle}>
                    {/* 円グラフ */}
                    <CategoryChart />
                </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
                <Paper sx={commonPaperStyle}>
                    {/* 棒グラフ */}
                    <BarChart />
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <TransactionTable />
            </Grid>
        </Grid>
    );
};
