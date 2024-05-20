import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Outlet } from "react-router-dom";

export const Main = ({ drawerWidth }: { drawerWidth: number }) => {
    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
            <Toolbar />
            <Outlet />
        </Box>
    );
};
