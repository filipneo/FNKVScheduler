import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ThemeProvider from '@/components/theme-provider'
import { NextIntlClientProvider, useMessages } from 'next-intl'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'FNKV Plánovač'
}

export default function RootLayout({
	children,
	params: {
		locale
	}
}: {
	children: React.ReactNode,
	params: {
		locale: string
	}
}) {

	const dictionaries = useMessages();

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={inter.className} >
				<ThemeProvider attribute="class" defaultTheme="system">
					<NextIntlClientProvider locale={locale} messages={dictionaries}>
						<main>
							{children}
						</main>
					</NextIntlClientProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}