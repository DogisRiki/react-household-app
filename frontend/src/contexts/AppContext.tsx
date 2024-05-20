import { useMediaQuery, useTheme } from "@mui/material";
import React, { ReactNode, createContext, useContext, useState } from "react";

import { saveTransaction, updateTransaction, deleteTransaction } from "../api/transactionApi";
import { Transaction } from "../types/index";
import { Schema } from "../validations/schema";

// コンテキストの型
interface AppContextType {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    currentMonth: Date;
    setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isMobile: boolean;
    onSaveTransaction: (transaction: Schema) => Promise<void>;
    onDeleteTransaction: (transactionIds: string | readonly string[]) => Promise<void>;
    onUpdateTransaction: (transaction: Schema, transactionId: string) => Promise<void>;
}

// プロバイダーの型
interface AppProviderProps {
    children: ReactNode;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// プロバイダーコンポーネント
export const AppContextProvider = ({ children }: AppProviderProps) => {
    const theme = useTheme();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

    // 取引をFirestoreに保存する
    const onSaveTransaction = async (transaction: Schema) => {
        const newTransaction = await saveTransaction(transaction);
        if (newTransaction) {
            setTransactions((prevTransaction) => [...prevTransaction, newTransaction]);
        }
    };

    // 取引をfirestoreへ更新する
    const onUpdateTransaction = async (transaction: Schema, transactionId: string) => {
        await updateTransaction(transaction, transactionId);
        const updatedTransactions = transactions.map((t) =>
            t.id === transactionId ? { ...t, ...transaction } : t,
        ) as Transaction[];
        setTransactions(updatedTransactions);
    };

    // 取引をFirestoreから削除する
    const onDeleteTransaction = async (transactionIds: string | readonly string[]): Promise<void> => {
        const targetIds = Array.isArray(transactionIds) ? transactionIds : [transactionIds];
        for (const id of targetIds) {
            await deleteTransaction(id);
        }
        // 削除後の取引一覧を再取得してstateを更新
        const filteredTransactions = transactions.filter((transaction) => !targetIds.includes(transaction.id));
        setTransactions(filteredTransactions);
    };

    return (
        <AppContext.Provider
            value={{
                transactions,
                setTransactions,
                currentMonth,
                setCurrentMonth,
                isLoading,
                setIsLoading,
                isMobile,
                onSaveTransaction,
                onDeleteTransaction,
                onUpdateTransaction,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

// コンテキストを使用するためのカスタムフック
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContextは、AppProvider内で使用する必要があります。");
    }
    return context;
};
