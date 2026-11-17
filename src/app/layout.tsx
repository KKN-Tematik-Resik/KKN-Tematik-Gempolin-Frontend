import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/theme-context";
import { isRtl } from "@/i18n/languages";
import { type Locale } from "@/i18n/routing";
import { cn } from "@/utils";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const rtl = isRtl(locale as Locale);

  return (
    <html lang={locale} dir={rtl ? "rtl" : "ltr"}>
      <body
        className={cn("relative isolate dark:bg-gray-900", outfit.className)}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <DirectionProvider direction={rtl ? "rtl" : "ltr"}>
              <TooltipProvider>{children}</TooltipProvider>
            </DirectionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
