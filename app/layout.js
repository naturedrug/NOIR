import "./globals.css";

import ContextMenu from "./components/ContextMenu";


export const metadata = {
  title: "Chat",
  icons: {
    icon: [
      {url: "/favicon.ico"}
    ]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ContextMenu></ContextMenu>
        {children}
      </body>
    </html>
  );
}
