import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect, useState } from "react";

import { fetchTransactions } from "../../api/transactionApi";
import { useAppContext } from "../../contexts/AppContext";
import { Header } from "../common/Header";
import { Main } from "../common/Main";
import { Sidebar } from "../common/Sidebar";

const drawerWidth = 240;

export const AppLayout = () => {
    const { setTransactions, setIsLoading } = useAppContext();

    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const [isClosing, setIsClosing] = useState<boolean>(false);

    // 初期表示: 取引データを取得
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const transactionsData = await fetchTransactions();
                setTransactions(transactionsData);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDrawerClose = (): void => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = (): void => {
        setIsClosing(false);
    };

    const handleDrawerToggle = (): void => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    return (
        <Box sx={{ display: { md: "flex" }, bgcolor: (thema) => thema.palette.grey[100], minHeight: "100vh" }}>
            <CssBaseline />
            {/* ヘッダー領域 */}
            <Header drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
            {/* サイドバー領域 */}
            <Sidebar
                drawerWidth={drawerWidth}
                mobileOpen={mobileOpen}
                handleDrawerTransitionEnd={handleDrawerTransitionEnd}
                handleDrawerClose={handleDrawerClose}
            />
            {/* メインコンテンツ領域 */}
            <Main drawerWidth={drawerWidth} />
        </Box>
    );
};
