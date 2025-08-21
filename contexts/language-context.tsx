"use client"

import React from "react"

type Lang = "en" | "fr" | "ar"
type LanguageContextT = {
  lang: Lang
  setLang: (l: Lang) => void
}
export const LanguageContext = React.createContext<LanguageContextT | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = React.useState<Lang>(() => {
    if (typeof window === "undefined") return "en"
    return (localStorage.getItem("arc-lang") as Lang) || "en"
  })

  // Set document attributes only when values actually change to avoid effect loops.
  React.useEffect(() => {
    if (typeof document === "undefined") return
    const html = document.documentElement
    const desiredDir = lang === "ar" ? "rtl" : "ltr"
    const desiredLang = lang
    if (html.getAttribute("dir") !== desiredDir) html.setAttribute("dir", desiredDir)
    if (html.getAttribute("lang") !== desiredLang) html.setAttribute("lang", desiredLang)
    localStorage.setItem("arc-lang", lang)
  }, [lang])

  const value = React.useMemo(() => ({ lang, setLang }), [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
