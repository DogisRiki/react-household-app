import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import AddHomeIcon from "@mui/icons-material/AddHome";
import AlarmIcon from "@mui/icons-material/Alarm";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import SavingsIcon from "@mui/icons-material/Savings";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import TrainIcon from "@mui/icons-material/Train";
import WorkIcon from "@mui/icons-material/Work";

import { IncomeCategory, ExpenseCategory, CategoryItem } from "../../types";

export const categories: CategoryItem[] = [
    { type: "income", label: "給与", icon: WorkIcon },
    { type: "income", label: "副収入", icon: AddBusinessIcon },
    { type: "income", label: "お小遣い", icon: SavingsIcon },
    { type: "expense", label: "食費", icon: FastfoodIcon },
    { type: "expense", label: "日用品", icon: AlarmIcon },
    { type: "expense", label: "住居費", icon: AddHomeIcon },
    { type: "expense", label: "交際費", icon: Diversity3Icon },
    { type: "expense", label: "娯楽", icon: SportsTennisIcon },
    { type: "expense", label: "交通費", icon: TrainIcon },
];

type CategoryIconProps = {
    category: IncomeCategory | ExpenseCategory;
};

// カテゴリアイコンコンポーネントをを提供
export const CategoryIcon = ({ category }: CategoryIconProps) => {
    const categoryItem = categories.find((item) => item.label === category);

    if (!categoryItem) {
        return null;
    }

    const { icon: IconComponent } = categoryItem;

    return <IconComponent fontSize="small" />;
};
