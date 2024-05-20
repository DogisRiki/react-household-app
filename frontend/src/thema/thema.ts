import { PaletteColor, PaletteColorOptions, createTheme } from "@mui/material";
import { amber, blue, cyan, deepOrange, green, lightBlue, lightGreen, pink, purple, red } from "@mui/material/colors";

import { ExpenseCategory, IncomeCategory } from "../types";

/* Material UIのPaletteインターフェースを拡張 */
declare module "@mui/material/styles" {
    interface Palette {
        incomeColor: PaletteColor;
        expenseColor: PaletteColor;
        balanceColor: PaletteColor;
        incomeCategoryColor: Record<IncomeCategory, string>;
        expenseCategoryColor: Record<ExpenseCategory, string>;
    }

    interface PaletteOptions {
        incomeColor?: PaletteColorOptions;
        expenseColor?: PaletteColorOptions;
        balanceColor?: PaletteColorOptions;
        incomeCategoryColor?: Record<IncomeCategory, string>;
        expenseCategoryColor?: Record<ExpenseCategory, string>;
    }
}

export const theme = createTheme({
    // サイト全体で使用するフォント定義
    typography: {
        fontFamily: 'Noto Sans JP, Roboto, "Helvetica Neue", Arial, sans-serif',
        fontWeightRegular: 400, // フォントウェイト400
        fontWeightMedium: 500, // フォントウェイト500
        fontWeightBold: 700, // フォントウェイト700
    },
    // サイト全体で使用するカラー定義
    palette: {
        // 収入用のカラーを定義
        incomeColor: {
            main: blue[500],
            light: blue[100],
            dark: blue[700],
        },
        // 支出用のカラーを定義
        expenseColor: {
            main: red[500],
            light: red[100],
            dark: red[700],
        },
        // 残高用のカラーを定義
        balanceColor: {
            main: green[500],
            light: green[100],
            dark: green[700],
        },
        // 収入用カテゴリーのカラーを定義
        incomeCategoryColor: {
            給与: lightBlue[600],
            副収入: cyan[200],
            お小遣い: lightGreen["A700"],
        },
        // 支出用カテゴリーのカラーを定義
        expenseCategoryColor: {
            食費: deepOrange[500],
            日用品: lightGreen[500],
            住居費: amber[500],
            交際費: pink[300],
            娯楽: cyan[200],
            交通費: purple[400],
        },
    },
});
