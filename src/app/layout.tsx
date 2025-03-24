import { createTheme, MantineProvider } from '@mantine/core';
import UserProvider from '@/component/UserProvider';
import { WindowSizeProvider } from "@/context/WindowSizeContext";
import '@/styles/globals.css';

// metadata をエクスポート
export const metadata = {
    title: "LCC_demo",
    description: "Created by Active retech",
};

// viewport は別でエクスポート
export const viewport = "width=device-width, initial-scale=1, minimum-scale=1";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

    const theme = createTheme({
        fontFamily: 'Arial, sans-serif'
    });

    return (
        <html lang="en">
            <body>
                {/* UserContext.Provider で子コンポーネントにコンテキストを渡す */}
                <UserProvider>
                    <WindowSizeProvider>
                        <MantineProvider theme={theme}>
                            {children}
                        </MantineProvider>
                    </WindowSizeProvider>
                </UserProvider>
            </body>
        </html>
    );
}
