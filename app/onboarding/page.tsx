"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Building, Globe, MapPin, CreditCard, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

import { getTierInfo, type TierValue } from "@/lib/prices"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Version 1 step structure with icons and progress bar
const steps = [
  { id: 1, title: "Company Profile", icon: Building },
  { id: 2, title: "Trade Focus", icon: Globe },
  { id: 3, title: "Location & Compliance", icon: MapPin },
  { id: 4, title: "Choose Membership", icon: CreditCard },
] as const

type FormData = {
  companyName: string
  industry: string
  country: string
  website: string
  socials: string[]
  operatingRegions: string[]
  description: string
  tradeFocus: string[]
  locations: string[]
  complianceNeeds: string[]
  membership: string
}

const STORAGE_KEY = "arc-onboarding-v1"

function IndustryCombobox({
  value,
  onChange,
  placeholder = "Select your industry",
}: {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}) {
  "use client"
  const [open, setOpen] = useState(false)
  const industries = [
    { value: "automotive", label: "Automotive" },
    { value: "construction", label: "Construction" },
    { value: "agriculture", label: "Agriculture" },
    { value: "mining", label: "Mining & Energy" },
    { value: "logistics", label: "Logistics" },
    { value: "other", label: "Other" },
  ]

  const selected = industries.find((i) => i.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          {selected ? selected.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <div className="px-3 pt-3 text-xs font-medium text-muted-foreground">Select your industry</div>
          <CommandInput placeholder="Search industry..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {industries.map((i) => (
                <CommandItem
                  key={i.value}
                  value={i.label}
                  onSelect={() => {
                    onChange(i.value)
                    setOpen(false)
                  }}
                  className="cursor-pointer"
                >
                  <Check className={cn("mr-2 h-4 w-4", i.value === value ? "opacity-100" : "opacity-0")} />
                  {i.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "user_dev"
  const key = "arc-user-id"
  const existing = localStorage.getItem(key)
  if (existing) return existing
  const created = `user_${Math.random().toString(36).slice(2, 10)}`
  localStorage.setItem(key, created)
  return created
}

export default function OnboardingWizard() {
  // v1: minimal wireframe layout with autosave (localStorage)
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [formData, setFormData] = useState<FormData>(() => {
    const defaults: FormData = {
      companyName: "",
      industry: "",
      country: "",
      website: "",
      socials: [""],
      operatingRegions: [],
      description: "",
      tradeFocus: [],
      locations: [],
      complianceNeeds: [],
      membership: "builder",
    }
    if (typeof window === "undefined") return defaults
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return defaults
      const parsed = JSON.parse(raw) as Partial<FormData>
      return {
        ...defaults,
        ...parsed,
        socials: Array.isArray(parsed.socials) && parsed.socials.length > 0 ? parsed.socials : defaults.socials,
        operatingRegions: Array.isArray(parsed.operatingRegions) ? parsed.operatingRegions : defaults.operatingRegions,
      }
    } catch {
      return defaults
    }
  })

  // Autosave like v1
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    } catch {}
  }, [formData])

  const [userId, setUserId] = useState<string>("")
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setUserId(getOrCreateUserId())
  }, [])

  const tier = useMemo(() => getTierInfo((formData.membership || "builder") as TierValue), [formData.membership])

  async function startCheckout() {
    setError(null)
    setCreating(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: tier.priceId, userId }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => null)
        throw new Error(j?.error || "Failed to create session")
      }
      const { url } = (await res.json()) as { url: string }
      if (!url) throw new Error("No checkout URL returned")
      window.location.href = url
    } catch (e: any) {
      setError(e?.message || "Something went wrong starting checkout.")
      setCreating(false)
    }
  }

  const progress = useMemo(
    () => Math.max(0, Math.min(100, Math.round((currentStep / steps.length) * 100))),
    [currentStep],
  )

  const nextStep = () => setCurrentStep((s) => Math.min(steps.length, s + 1))
  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1))

  // Helpers
  const toggleArrayValue = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]

  const [errors, setErrors] = useState<{
    companyName?: string
    industry?: string
    country?: string
    website?: string
    socials?: Record<number, string>
    description?: string
  }>({})

  function isUrl(str: string) {
    try {
      // accept http(s) and bare domain-like strings prefixed with http
      const u = new URL(str.startsWith("http") ? str : `https://${str}`)
      return Boolean(u.hostname)
    } catch {
      return false
    }
  }

  function isHandle(str: string) {
    return /^@[\w.\-_]{2,}$/.test(str)
  }

  function isUrlOrHandle(str: string) {
    return isUrl(str) || isHandle(str)
  }

  function validateStep1(fd: FormData) {
    const next: {
      companyName?: string
      industry?: string
      country?: string
      website?: string
      socials?: Record<number, string>
      description?: string
    } = {}
    if (!fd.companyName.trim()) next.companyName = "Company Name is required"
    if (!fd.industry) next.industry = "Industry is required"
    if (!fd.country) next.country = "Country of Registration is required"
    if (fd.website && !isUrlOrHandle(fd.website.trim())) next.website = "Enter a valid URL or @handle"
    const socialsErrors: Record<number, string> = {}
    fd.socials.forEach((s, i) => {
      const v = s.trim()
      if (v && !isUrlOrHandle(v)) socialsErrors[i] = "Enter a valid URL or @handle"
    })
    if (Object.keys(socialsErrors).length) next.socials = socialsErrors
    if (fd.description.length > 200) next.description = "Max 200 characters"
    return next
  }

  function saveNow(current: FormData) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
    } catch {}
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header with back link (matches v1) */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-700 hover:underline mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2">Welcome to ARC Portal</h1>
          <p className="text-gray-600">Let's set up your account in just a few steps</p>
        </div>

        {/* Progress and step icons (v1 style) */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {steps.map((step) => {
              const Icon = step.icon
              const active = step.id <= currentStep
              return (
                <div key={step.id} className={`flex items-center ${active ? "text-gray-900" : "text-gray-400"}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      active ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="ml-2 text-sm font-medium hidden sm:block">{step.title}</span>
                </div>
              )
            })}
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Step Content (v1 clean wireframe, labels/placeholder updated) */}
        <Card>
          <CardHeader>
            <CardTitle>
              {"Step "}
              {currentStep}
              {": "}
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about your company"}
              {currentStep === 2 && "What do you trade in?"}
              {currentStep === 3 && "Where do you operate and which documents do you need?"}
              {currentStep === 4 && "Select your membership tier"}
            </CardDescription>
            {currentStep === 1 ? (
              <p className="mt-1 text-xs text-muted-foreground">Fields marked with * are required.</p>
            ) : null}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Company Profile (field order/labels from v1; placeholders aligned with current copy) */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">{"Company Name *"}</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    onBlur={() => saveNow(formData)}
                  />
                  {errors.companyName && <p className="mt-1 text-xs text-red-600">{errors.companyName}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="industry">{"Industry *"}</Label>
                    <IndustryCombobox
                      value={formData.industry}
                      onChange={(value) => {
                        setFormData({ ...formData, industry: value })
                        saveNow({ ...formData, industry: value })
                      }}
                      placeholder="Select your industry"
                    />
                    {errors.industry && <p className="mt-1 text-xs text-red-600">{errors.industry}</p>}
                  </div>

                  <div>
                    <Label htmlFor="country">{"Country of Registration *"}</Label>
                    <Select
                      value={formData.country || undefined}
                      onValueChange={(value) => {
                        setFormData({ ...formData, country: value })
                        saveNow({ ...formData, country: value })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morocco">Morocco</SelectItem>
                        <SelectItem value="algeria">Algeria</SelectItem>
                        <SelectItem value="libya">Libya</SelectItem>
                        <SelectItem value="tunisia">Tunisia</SelectItem>
                        <SelectItem value="mauritania">Mauritania</SelectItem>
                        <SelectItem value="turkey">Turkey</SelectItem>
                        <SelectItem value="united-states">United States</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website (optional)</Label>
                  <Input
                    id="website"
                    placeholder="https://yourcompany.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    onBlur={() => saveNow(formData)}
                  />
                  {errors.website && <p className="mt-1 text-xs text-red-600">{errors.website}</p>}
                </div>

                <div>
                  <Label>Social Media (optional)</Label>
                  <div className="space-y-2 mt-2">
                    {(Array.isArray(formData.socials) ? formData.socials : [""]).map((s, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input
                          placeholder="@yourhandle or https://social.com/your-handle"
                          value={s}
                          onChange={(e) => {
                            const next = [...formData.socials]
                            next[idx] = e.target.value
                            setFormData({ ...formData, socials: next })
                          }}
                          onBlur={() => saveNow(formData)}
                        />
                        {formData.socials.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const next = formData.socials.filter((_, i) => i !== idx)
                              setFormData({ ...formData, socials: next })
                              saveNow({ ...formData, socials: next })
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    {errors.socials &&
                      Object.entries(errors.socials).map(([i, msg]) => (
                        <p key={i} className="text-xs text-red-600">
                          {msg}
                        </p>
                      ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const next = [...formData.socials, ""]
                        setFormData({ ...formData, socials: next })
                        saveNow({ ...formData, socials: next })
                      }}
                    >
                      + Add another
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Operating Regions (optional)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {["Morocco", "Algeria", "Libya", "Tunisia", "Mauritania", "Turkey", "United States"].map(
                      (region) => {
                        const id = region.toLowerCase().replace(/\s+/g, "-")
                        const selected = formData.operatingRegions.includes(id)
                        return (
                          <div key={id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`reg-${id}`}
                              checked={selected}
                              onCheckedChange={() => {
                                const next = toggleArrayValue(formData.operatingRegions, id)
                                setFormData({ ...formData, operatingRegions: next })
                                saveNow({ ...formData, operatingRegions: next })
                              }}
                            />
                            <Label htmlFor={`reg-${id}`} className="text-sm">
                              {region}
                            </Label>
                          </div>
                        )
                      },
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Company Description</Label>
                  <div className="relative">
                    <Textarea
                      id="description"
                      placeholder="Brief overview: products, services, markets (max 200 chars)"
                      value={formData.description}
                      maxLength={200}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      onBlur={() => saveNow(formData)}
                    />
                    <span className="pointer-events-none absolute bottom-2 right-2 text-[10px] text-muted-foreground/70">
                      {formData.description.length}/200
                    </span>
                  </div>
                  {errors.description ? <p className="mt-1 text-xs text-red-600">{errors.description}</p> : null}
                </div>
              </div>
            )}

            {/* Step 2: Trade Focus (v1 cards w/ updated copy) */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">
                    What do you primarily trade in? (Select all that apply)
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {[
                      {
                        id: "agriculture",
                        label: "Agriculture",
                        desc: "Tractors, harvesters, irrigation systems, greenhouses, pumps, and agricultural inputs (fertilizers/seeds/soil).",
                      },
                      {
                        id: "machinery",
                        label: "Heavy Machinery",
                        desc: "Excavators, loaders, cranes, bulldozers, backhoes, graders, drill rigs, compactors.",
                      },
                      {
                        id: "mining",
                        label: "Mining & Energy",
                        desc: "Mining equipment, generators, drilling rigs, mineral processing, solar/wind/hydro, O&G equipment.",
                      },
                      {
                        id: "logistics",
                        label: "Logistics & Transport",
                        desc: "Trucks, trailers, forklifts, warehouse systems, material handling, shipping gear.",
                      },
                      {
                        id: "vehicles",
                        label: "Vehicles",
                        desc: "Fleets, specialized (ambulance/armored/tanker), off-road, passenger, dealership sourcing.",
                      },
                      {
                        id: "other",
                        label: "Other / Custom",
                        desc: "Tell us what you need. We’ll route you to the right team.",
                      },
                    ].map((focus) => {
                      const checked = formData.tradeFocus.includes(focus.id)
                      return (
                        <Card
                          key={focus.id}
                          className={`cursor-pointer hover:bg-gray-50 border ${
                            checked ? "border-gray-900" : "border-gray-200"
                          }`}
                          onClick={() =>
                            setFormData({ ...formData, tradeFocus: toggleArrayValue(formData.tradeFocus, focus.id) })
                          }
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Checkbox
                                id={focus.id}
                                checked={checked}
                                onCheckedChange={() =>
                                  setFormData({
                                    ...formData,
                                    tradeFocus: toggleArrayValue(formData.tradeFocus, focus.id),
                                  })
                                }
                                aria-label={focus.label}
                              />
                              <div>
                                <Label htmlFor={focus.id} className="font-medium cursor-pointer">
                                  {focus.label}
                                </Label>
                                <p className="text-sm text-gray-600 mt-1">{focus.desc}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Location & Compliance (v1 layout) */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label>Primary Business Location</Label>
                  <Select
                    value={formData.locations[0] || undefined}
                    onValueChange={(value) => setFormData({ ...formData, locations: value ? [value] : [] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uae">United Arab Emirates</SelectItem>
                      <SelectItem value="saudi">Saudi Arabia</SelectItem>
                      <SelectItem value="egypt">Egypt</SelectItem>
                      <SelectItem value="jordan">Jordan</SelectItem>
                      <SelectItem value="lebanon">Lebanon</SelectItem>
                      <SelectItem value="morocco">Morocco</SelectItem>
                      <SelectItem value="libya">Libya</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Additional Markets (Optional)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {["UAE", "Saudi Arabia", "Egypt", "Jordan", "Lebanon", "Morocco", "Libya"].map((country) => {
                      const id = country.toLowerCase().replace(/\s+/g, "-")
                      const selected = formData.locations.includes(id)
                      return (
                        <div key={country} className="flex items-center space-x-2">
                          <Checkbox
                            id={id}
                            checked={selected}
                            onCheckedChange={() =>
                              setFormData({ ...formData, locations: toggleArrayValue(formData.locations, id) })
                            }
                          />
                          <Label htmlFor={id} className="text-sm">
                            {country}
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <Label>Compliance Requirements</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      "Import/Export Documentation",
                      "Quality Certifications (ISO, CE)",
                      "Environmental Compliance",
                      "Safety Standards",
                    ].map((req) => {
                      const id = req.toLowerCase().replace(/[^\w]+/g, "-")
                      const selected = formData.complianceNeeds.includes(id)
                      return (
                        <div key={req} className="flex items-center space-x-2">
                          <Checkbox
                            id={id}
                            checked={selected}
                            onCheckedChange={() =>
                              setFormData({
                                ...formData,
                                complianceNeeds: toggleArrayValue(formData.complianceNeeds, id),
                              })
                            }
                          />
                          <Label htmlFor={id} className="text-sm">
                            {req}
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Membership selection (v1) */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="grid gap-4">
                  {[
                    {
                      value: "access-pass",
                      title: "ARC Access Pass – One-Time Service Entry",
                      price: "Starting from $[service price]",
                      sub: "(no monthly fee)",
                      description:
                        "Perfect for starting your first ARC project with flexibility. Purchase any one-time service and receive a complimentary credit toward a membership-only perk.",
                      desc: [
                        "Choose from one-time services (sourcing, inspection, advisory, verification)",
                        "Receive 1 complimentary membership-only service credit (must be used within 30 days)",
                        "Access to resource library and limited vendor previews",
                        "Upgrade to full membership anytime with credit applied",
                      ],
                    },
                    {
                      value: "builder",
                      title: "Business Builder",
                      price: "$1,500",
                      sub: "/month",
                      description: "Most popular for growing teams seeking reliable sourcing and advisory.",
                      desc: [
                        "3–5 day sourcing turnaround",
                        "Vendor access (full profiles)",
                        "Basic shipping/customs support",
                        "Bi-monthly advisor check-in",
                      ],
                      featured: true,
                    },
                    {
                      value: "advantage",
                      title: "Business Advantage",
                      price: "$3,500",
                      sub: "/month",
                      description: "Enhanced oversight and supplier assurance for high-value trade operations.",
                      desc: [
                        "All Business Builder features",
                        "Supplier screening and reports",
                        "1 pre-shipment inspection/order",
                        "Quarterly consulting",
                        "Freight advisory",
                      ],
                    },
                    {
                      value: "executive",
                      title: "Executive Advantage",
                      price: "$7,500",
                      sub: "/month",
                      description: "Strategic trade and compliance management for multinational operations.",
                      desc: [
                        "All Business Advantage features",
                        "Dedicated trade advisor",
                        "Advanced compliance & regulatory mapping",
                        "Multi-project sourcing management",
                        "Priority freight coordination",
                      ],
                    },
                    {
                      value: "elite",
                      title: "Almagharabia Elite",
                      price: "Custom Quote",
                      sub: "Contact Us",
                      description: "VIP trade concierge service for government entities and top-tier corporations.",
                      desc: [
                        "All Executive Advantage features",
                        "Bespoke trade & investment facilitation",
                        "On-ground representation in Maghreb & U.S.",
                        "Custom sourcing, procurement, and compliance solutions",
                        "Private investment & government deal flow access",
                      ],
                    },
                  ].map((plan) => {
                    const checked = formData.membership === plan.value
                    return (
                      <Card
                        key={plan.value}
                        className={`cursor-pointer hover:bg-gray-50 border-2 ${plan.featured ? "border-gray-900" : "border-transparent"}`}
                        onClick={() => setFormData({ ...formData, membership: plan.value })}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <input
                              type="radio"
                              name="membership"
                              value={plan.value}
                              className="mt-1"
                              checked={checked}
                              onChange={() => setFormData({ ...formData, membership: plan.value })}
                              aria-label={plan.title}
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{plan.title}</h3>
                                  <p className="text-sm text-gray-600">{plan.description}</p>
                                </div>
                                <div className="text-right">
                                  {plan.value === "access-pass" && (
                                    <>
                                      <div className="text-lg font-bold">{"Varies by service"}</div>
                                    </>
                                  )}

                                  {plan.value === "builder" && (
                                    <>
                                      <div className="text-lg font-bold">$1,500</div>
                                      <div className="text-sm text-gray-600">/month</div>
                                    </>
                                  )}

                                  {plan.value === "advantage" && (
                                    <>
                                      <div className="text-lg font-bold">$3,500</div>
                                      <div className="text-sm text-gray-600">/month</div>
                                    </>
                                  )}

                                  {plan.value === "executive" && (
                                    <>
                                      <div className="text-lg font-bold">$7,500</div>
                                      <div className="text-sm text-gray-600">/month</div>
                                    </>
                                  )}

                                  {plan.value === "elite" && (
                                    <>
                                      <div className="text-lg font-bold">$10,000</div>
                                      <div className="text-sm text-gray-600">/month</div>
                                    </>
                                  )}
                                </div>
                              </div>
                              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                                {plan.desc.map((d) => (
                                  <li key={d}>• {d}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Navigation (v1 previous/next) */}
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button
                  onClick={() => {
                    if (currentStep === 1) {
                      const v = validateStep1(formData)
                      setErrors(v)
                      if (Object.keys(v).length > 0) return
                    }
                    nextStep()
                  }}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <div className="flex flex-col gap-3 items-end">
                  <Button onClick={startCheckout} disabled={creating}>
                    {creating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Redirecting…
                      </>
                    ) : (
                      <>
                        Confirm & Pay
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                  {error && (
                    <Alert variant="destructive" className="w-full">
                      <AlertTitle>Payment error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
