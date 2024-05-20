import "./App.css";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppLayout } from "./components/layout/AppLayout";
import { AppContextProvider } from "./contexts/AppContext";
import { Home } from "./pages/Home";
import { NoMatch } from "./pages/NoMatch";
import { Report } from "./pages/Report";
import { theme } from "./thema/thema";

function App() {
    return (
        <AppContextProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<AppLayout />}>
                            <Route index element={<Home />} />
                            <Route path="/report" element={<Report />} />
                            <Route path="*" element={<NoMatch />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </AppContextProvider>
    );
}

export default App;
