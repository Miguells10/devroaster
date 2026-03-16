import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarLink,
} from "@/components/ui/navbar";

const jetbrains = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-jetbrains",
});

export const metadata: Metadata = {
	title: "DevRoaster - Paste your code. Get roasted.",
	description: "The most brutal code review tool in the market.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={jetbrains.variable}>
			<body className="font-sans antialiased bg-bg-page text-text-primary min-h-screen">
				<Navbar>
					<NavbarBrand>devroast</NavbarBrand>
					<NavbarContent>
						<NavbarLink href="/leaderboard">leaderboard</NavbarLink>
					</NavbarContent>
				</Navbar>
				<div className="max-w-6xl mx-auto px-6">{children}</div>
			</body>
		</html>
	);
}
