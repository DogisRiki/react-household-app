import { Box, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { addMonths } from "date-fns";
import { ja } from "date-fns/locale";

import { useAppContext } from "../contexts/AppContext";

export const MonthlySelector = () => {
    const { currentMonth, setCurrentMonth } = useAppContext();
    // 月を移動する関数
    const handleMoveMonth = (moveValue: number): void => {
        const previousMonth = addMonths(currentMonth, moveValue);
        setCurrentMonth(previousMonth);
    };
    // 日付を選択した際の関数
    const handleDateChange = (newDate: Date | null) => {
        if (newDate) {
            setCurrentMonth(newDate);
        }
    };
    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={ja}
            dateFormats={{
                year: "yyyy年",
                month: "MM月",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Button color={"error"} variant="contained" onClick={() => handleMoveMonth(-1)}>
                    先月
                </Button>
                <DatePicker
                    value={currentMonth}
                    sx={{ mx: 2, background: "white" }}
                    views={["year", "month"]}
                    format="yyyy/MM"
                    label={"年月を選択"}
                    slotProps={{
                        toolbar: {
                            toolbarFormat: "yyyy/MM",
                            hidden: false,
                        },
                    }}
                    onChange={handleDateChange}
                />
                <Button color={"primary"} variant="contained" onClick={() => handleMoveMonth(1)}>
                    次月
                </Button>
            </Box>
        </LocalizationProvider>
    );
};
