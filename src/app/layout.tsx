import type { Metadata } from "next"
import { Syne } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/ThemeProvider"

const syne = Syne({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "AgentLab - Build AI Agents",
  description: "Build, train, and deploy AI agents for any business use case. No coding required.",
  keywords: ["AI agents", "automation", "chatbots", "customer support"],
  authors: [{ name: "AgentLab" }],
  openGraph: {
    title: "AgentLab",
    description: "Build, train, and deploy AI agents",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0147FF" />
        <meta name="color-scheme" content="dark light" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={syne.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          forcedTheme={undefined}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}