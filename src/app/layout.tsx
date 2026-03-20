import Layout from "@/components/layout/Layout";
import { APP_DESCRIPTION, APP_NAME } from "@/config/brand";
import type { Metadata } from "next";
import Providers from "./provider/page";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg", sizes: "174x174" }],
    apple: [{ url: "/logo.svg", type: "image/svg" }]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
