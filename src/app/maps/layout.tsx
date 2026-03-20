import { APP_NAME } from "@/config/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Maps | ${APP_NAME}`,
  description: "Plan routes between two places and compare travel options on the map."
};

export default function MapsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
