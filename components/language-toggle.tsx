"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage()
  const options: Array<{ code: "en" | "fr" | "ar"; label: string }> = [
    { code: "en", label: "EN" },
    { code: "fr", label: "FR" },
    { code: "ar", label: "AR" },
  ]
  return (
    <div className={`inline-flex items-center gap-1 ${className}`} aria-label="Language selector">
      {options.map((o) => (
        <Button
          key={o.code}
          variant={lang === o.code ? "default" : "outline"}
          size="sm"
          onClick={() => setLang(o.code)}
          className={lang === o.code ? "btn-brand border border-brand-gold" : ""}
        >
          {o.label}
        </Button>
      ))}
    </div>
  )
}
