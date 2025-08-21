// lib/prices.ts
export const PRICES = {
  BUSINESS_BUILDER: "price_1Rv51rKH3Ix1hRdV0fkwyNvo", // $1,500 / month
  BUSINESS_ADVANTAGE: "price_1Rv53IKH3Ix1hRdVawHUop0F", // $3,500 / month
  EXECUTIVE_ADVANTAGE: "price_1Rv58SKH3Ix1hRdVXGY3IlQI", // $7,500 / quarter
  ALMAGHARABIA_ELITE: "price_1Rv59UKH3Ix1hRdVlqS9jgRU", // $10,000 / quarter
} as const

export type Tier = keyof typeof PRICES
export type TierValue = "builder" | "advantage" | "executive" | "elite"

type TierInfo = {
  value: TierValue
  name: string
  priceId: string
  priceLabel: string
  billingNote?: string
  features: string[]
}

export function getTierInfo(value: TierValue): TierInfo {
  switch (value) {
    case "builder":
      return {
        value,
        name: "Business Builder",
        priceId: PRICES.BUSINESS_BUILDER,
        priceLabel: "$1,500 / month",
        features: [
          "3–5 day sourcing turnaround",
          "Vendor access (full profiles)",
          "Basic shipping/customs support",
          "Bi-monthly advisor check-in",
        ],
      }
    case "advantage":
      return {
        value,
        name: "Business Advantage",
        priceId: PRICES.BUSINESS_ADVANTAGE,
        priceLabel: "$3,500 / month",
        features: [
          "All Business Builder features",
          "Supplier screening and reports",
          "1 pre-shipment inspection/order",
          "Quarterly consulting",
          "Freight advisory",
        ],
      }
    case "executive":
      return {
        value,
        name: "Executive Advantage",
        priceId: PRICES.EXECUTIVE_ADVANTAGE,
        priceLabel: "$7,500 / quarter",
        billingNote: "Billed every 3 months",
        features: [
          "All Business Advantage features",
          "Dedicated trade advisor",
          "Advanced compliance & regulatory mapping",
          "Multi-project sourcing management",
          "Priority freight coordination",
        ],
      }
    case "elite":
    default:
      return {
        value: "elite",
        name: "Almagharabia Elite",
        priceId: PRICES.ALMAGHARABIA_ELITE,
        priceLabel: "$10,000 / quarter",
        billingNote: "Billed every 3 months",
        features: [
          "All Executive Advantage features",
          "Bespoke trade & investment facilitation",
          "On-ground representation in Maghreb & U.S.",
          "Custom sourcing, procurement, and compliance solutions",
          "Private investment & government deal flow access",
        ],
      }
  }
}
