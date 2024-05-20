export type TransactionType = "income" | "expense";

export type IncomeCategory = "給与" | "副収入" | "お小遣い";

export type ExpenseCategory = "食費" | "日用品" | "住居費" | "交際費" | "娯楽" | "交通費";

// 取引テーブルの型定義
export interface Transaction {
    id: string;
    amount: number;
    category: IncomeCategory | ExpenseCategory;
    content: string;
    date: string;
    type: TransactionType;
}

// 基本的なバランス情報を表すジェネリック型
export interface Balance<T> {
    income: T;
    expense: T;
    balance: T;
}

// 文字列を扱うカレンダーのコンテンツ
export interface CalendarContent extends Balance<string> {
    start: string;
}

// カテゴリーとアイコンの組み合わせ
export interface CategoryItem {
    type: TransactionType;
    label: IncomeCategory | ExpenseCategory;
    icon: React.ElementType;
}
