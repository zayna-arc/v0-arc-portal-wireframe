export type LinkedType = "request" | "shipment" | "invoice" | "general"

export interface Conversation {
  id: string // e.g., "SR-1023"
  subject: string // "3x Excavators"
  linkedType: LinkedType // request|shipment|invoice|general
  linkedId?: string // e.g., sourcing request id
  status?: string // Draft/In progress/Quoted/Closed/etc.
  lastActivityAt: string // ISO
  unreadCount: number
  participants: { id: string; name: string; role: "customer" | "advisor" }[]
}

export type ThreadItemType = "text" | "file" | "system"

export interface ThreadItem {
  id: string
  conversationId: string
  type: ThreadItemType
  author?: { id: string; name: string; role: "customer" | "advisor" } // undefined for system
  body?: string // markdown/plain for text
  file?: { name: string; sizeKB: number } // metadata only
  event?: {
    kind:
      | "status_changed"
      | "quote_posted"
      | "doc_uploaded"
      | "doc_approved"
      | "inspection_scheduled"
      | "freight_quote_ready"
      | "invoice_created"
      | "payment_succeeded"
      | "payment_failed"
      | "subscription_activated"
    data: Record<string, any>
  }
  createdAt: string // ISO
}

export interface LinkedObject {
  id: string
  type: LinkedType
  status?: string
  assignee?: string
  dueDate?: string
  value?: string
  details?: Record<string, any>
}

export interface ChecklistItem {
  id: string
  label: string
  completed: boolean
}
