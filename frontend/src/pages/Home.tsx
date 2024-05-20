import { Box } from "@mui/material";
import { format } from "date-fns";
import { useMemo, useState } from "react";

import { Calendar } from "../components/Calendar";
import { MonthlySummary } from "../components/MonthlySummary";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionMenu } from "../components/TransactionMenu";
import { useAppContext } from "../contexts/AppContext";
import { useMonthlyTransactions } from "../hooks/useMonthlyTransactions";
import { Transaction } from "../types";

export const Home = () => {
    const { isMobile } = useAppContext();
    const monthlyTransactions = useMonthlyTransactions();
    const [currentDay, setCurrentDay] = useState<string>(format(new Date(), "yyyy-MM-dd")); // 現在の日付
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null); // 選択中の取引
    const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState<boolean>(false); // 取引Drawerの開閉状態
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false); // モバイル用Drawerの開閉状態
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false); // モバイル用Formのダイアログの開閉状態

    // 1日分のデータを取得
    const dailyTransactions = useMemo(() => {
        return monthlyTransactions.filter((transaction) => transaction.date === currentDay);
    }, [monthlyTransactions, currentDay]);

    // フォームを閉じる関数
    const handleCloseForm = () => {
        // モバイルの場合はダイアログを閉じる
        if (isMobile) {
            setIsDialogOpen(!isDialogOpen);
        } else {
            setIsEntryDrawerOpen(!isEntryDrawerOpen);
        }
    };
    // フォームを開く関数
    const handleOpenForm = () => {
        // モバイルの場合はダイアログを開く
        if (isMobile) {
            setIsDialogOpen(true);
        } else {
            setIsEntryDrawerOpen(true);
        }
    };
    return (
        <Box sx={{ display: "flex" }}>
            {/* 左側コンテンツ */}
            <Box sx={{ flexGrow: 1 }}>
                <MonthlySummary />
                <Calendar
                    setCurrentDay={setCurrentDay}
                    currentDay={currentDay}
                    setIsMobileDrawerOpen={setIsMobileDrawerOpen}
                />
            </Box>
            {/* 右側コンテンツ */}
            <Box>
                <TransactionMenu
                    dailyTransactions={dailyTransactions}
                    currentDay={currentDay}
                    isEntryDrawerOpen={isEntryDrawerOpen}
                    onOpenForm={handleOpenForm}
                    onCloseForm={handleCloseForm}
                    setSelectedTransaction={setSelectedTransaction}
                    isMobileDrawerOpen={isMobileDrawerOpen}
                    setIsMobileDrawerOpen={setIsMobileDrawerOpen}
                />
                <TransactionForm
                    onCloseForm={handleCloseForm}
                    isEntryDrawerOpen={isEntryDrawerOpen}
                    currentDay={currentDay}
                    selectedTransaction={selectedTransaction}
                    setSelectedTransaction={setSelectedTransaction}
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                />
            </Box>
        </Box>
    );
};
