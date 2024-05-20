import { useMemo } from "react";

import { useAppContext } from "../contexts/AppContext";
import { Transaction } from "../types";
import { formatMonth } from "../utils/formattings";

export const useMonthlyTransactions = (): Transaction[] => {
    // コンテキストを呼び出す
    const { transactions, currentMonth } = useAppContext();
    // 現在月に対応する取引データをフィルタリング
    const monthlyTransactions = useMemo(() => {
        return transactions.filter((transaction) => transaction.date.startsWith(formatMonth(currentMonth)));
    }, [transactions, currentMonth]);
    return monthlyTransactions;
};
