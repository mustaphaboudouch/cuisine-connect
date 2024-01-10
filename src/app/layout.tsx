import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Cuisine Connect',
	icons: {
		icon: '/favicon.ico',
	},
} satisfies Metadata;

type LayoutProps = {
	children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
	return (
		<html lang='en'>
			<body className={inter.className}>{children}</body>
		</html>
	);
};

export default Layout;
