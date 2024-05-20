import { DatesSetArg, EventContentArg } from "@fullcalendar/core";
import jaLocale from "@fullcalendar/core/locales/ja";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { useTheme } from "@mui/material";
import { isSameMonth, format } from "date-fns";
import { useCallback, useMemo } from "react";

import { useAppContext } from "../contexts/AppContext";
import { useMonthlyTransactions } from "../hooks/useMonthlyTransactions";
import { CalendarContent, Balance } from "../types/";
import { calculateDailyBalances } from "../utils/financeCalculations";
import { formatCurrency } from "../utils/formattings";

import "../css/calendar.css";

// プロップスの型定義
interface CalendarProps {
    setCurrentDay: React.Dispatch<React.SetStateAction<string>>; // 現在の日を設定する関数
    currentDay: string; // 選択されているカレンダーデータの日付
    setIsMobileDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>; // モバイル用Drawerの開閉状態更新関数
}

// 日々の残高からカレンダーイベントを作成する関数
const createCalendarEvents = (dailyBalances: Record<string, Balance<number>>): CalendarContent[] => {
    return Object.keys(dailyBalances).map((date) => {
        const { income, expense, balance } = dailyBalances[date];
        return {
            start: date,
            income: formatCurrency(income),
            expense: formatCurrency(expense),
            balance: formatCurrency(balance),
        };
    });
};

export const Calendar = ({ setCurrentDay, currentDay, setIsMobileDrawerOpen }: CalendarProps) => {
    const monthlyTransactions = useMonthlyTransactions();
    const { setCurrentMonth } = useAppContext();
    // 1日の残高
    const dailyBalances = useMemo(() => calculateDailyBalances(monthlyTransactions), [monthlyTransactions]);
    // カレンダーイベントを呼び出す関数
    const calendarEvents = useMemo(() => createCalendarEvents(dailyBalances), [dailyBalances]);
    // MUIからテーマを取得
    const theme = useTheme();
    // 選択したカレンダーデータの色
    const selectedDateColor = {
        start: currentDay,
        display: "background",
        backgroundColor: theme.palette.incomeColor.light,
    };

    // イベントの内容をレンダリングする関数
    const renderEventContent = useCallback((eventInfo: EventContentArg) => {
        return (
            <div>
                <div className="money" id="event-income">
                    {eventInfo.event.extendedProps.income}
                </div>
                <div className="money" id="event-expense">
                    {eventInfo.event.extendedProps.expense}
                </div>
                <div className="money" id="event-balance">
                    {eventInfo.event.extendedProps.balance}
                </div>
            </div>
        );
    }, []);

    // 現在の月が変更されたときに呼び出される関数
    const handleDateSet = useCallback(
        (datesetInfo: DatesSetArg) => {
            const currentMonth = datesetInfo.view.currentStart;
            setCurrentMonth(currentMonth);
            const todayDate = new Date();
            if (isSameMonth(todayDate, currentMonth)) {
                setCurrentDay(format(todayDate, "yyyy-MM-dd"));
            }
        },
        [setCurrentMonth],
    );

    // 日付がクリックされたときに呼び出される関数
    const handleDateClick = useCallback(
        (dateClickInfo: DateClickArg) => {
            setCurrentDay(dateClickInfo.dateStr);
            setIsMobileDrawerOpen(true);
        },
        [setCurrentDay],
    );

    return (
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]} // 使用するプラグイン
            initialView="dayGridMonth" // 初期表示ビュー
            locale={jaLocale} // 初期表示ビュー
            events={[...calendarEvents, selectedDateColor]} // イベント
            eventContent={renderEventContent} // イベント内容のレンダリング
            datesSet={handleDateSet} // 日付セット時の処理
            dateClick={handleDateClick} // 日付クリック時の処理
        />
    );
};
