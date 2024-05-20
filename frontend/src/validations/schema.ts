import { z } from "zod";

import { expenseCategories, incomeCategories } from "../common/category";
import { errorMessages } from "../common/messages";

// 取引登録フォームバリデーション
export const transactionSchema = z.object({
    type: z.enum(["income", "expense"]),
    date: z.string().min(1, { message: errorMessages.requiredDate }),
    amount: z.number().min(1, { message: errorMessages.invalidAmount }),
    content: z
        .string()
        .min(1, { message: errorMessages.requiredContent })
        .max(50, { message: errorMessages.maxContentLength }),
    category: z
        .union([z.enum(expenseCategories), z.enum(incomeCategories), z.literal("")])
        .refine((val) => val !== "", { message: errorMessages.requiredCategory }),
});

export type Schema = z.infer<typeof transactionSchema>;
