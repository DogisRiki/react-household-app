import { Transaction, Balance } from "../types/";

// 月の収支を計算する関数
export const financeCalclations = (transactions: Transaction[]): Balance<number> => {
    return transactions.reduce(
        (acc, transaction) => {
            if (transaction.type == "income") {
                acc.income += transaction.amount;
            } else {
                acc.expense += transaction.amount;
            }
            acc.balance = acc.income - acc.expense;
            return acc;
        },
        { income: 0, expense: 0, balance: 0 },
    );
};

// 日付ごとの収支を計算する関数
export const calculateDailyBalances = (transactions: Transaction[]): Record<string, Balance<number>> => {
    return transactions.reduce<Record<string, Balance<number>>>((acc, transaction) => {
        const day = transaction.date;
        if (!acc[day]) {
            acc[day] = { income: 0, expense: 0, balance: 0 };
        }
        if (transaction.type === "income") {
            acc[day].income += transaction.amount;
        } else {
            acc[day].expense += transaction.amount;
        }
        acc[day].balance = acc[day].income - acc[day].expense;
        return acc;
    }, {});
};
