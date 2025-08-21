import type { Conversation, ThreadItem, LinkedObject, ChecklistItem } from "./types"

// Seed data
const seedConversations: Conversation[] = [
  {
    id: "SR-1023",
    subject: "3x Excavators",
    linkedType: "request",
    linkedId: "SR-1023",
    status: "In Progress",
    lastActivityAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3h ago
    unreadCount: 2,
    participants: [
      { id: "user1", name: "John Smith", role: "customer" },
      { id: "advisor1", name: "Sarah Johnson", role: "advisor" },
    ],
  },
  {
    id: "INV-7719",
    subject: "Invoice #7719",
    linkedType: "invoice",
    linkedId: "INV-7719",
    status: "Paid",
    lastActivityAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1d ago
    unreadCount: 0,
    participants: [
      { id: "user1", name: "John Smith", role: "customer" },
      { id: "advisor2", name: "Mike Chen", role: "advisor" },
    ],
  },
  {
    id: "SHIP-4401",
    subject: "Container Shipment",
    linkedType: "shipment",
    linkedId: "SHIP-4401",
    status: "In Transit",
    lastActivityAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6h ago
    unreadCount: 1,
    participants: [
      { id: "user1", name: "John Smith", role: "customer" },
      { id: "advisor3", name: "Lisa Wang", role: "advisor" },
    ],
  },
]

const seedThreads: Record<string, ThreadItem[]> = {
  "SR-1023": [
    {
      id: "t1",
      conversationId: "SR-1023",
      type: "text",
      author: { id: "user1", name: "John Smith", role: "customer" },
      body: "Hi, I need to source 3 excavators for our construction project in Morocco. Can you help?",
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "t2",
      conversationId: "SR-1023",
      type: "system",
      event: {
        kind: "status_changed",
        data: { from: "Draft", to: "In Progress", assignee: "Sarah Johnson" },
      },
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "t3",
      conversationId: "SR-1023",
      type: "text",
      author: { id: "advisor1", name: "Sarah Johnson", role: "advisor" },
      body: "I've started working on your request. I'll reach out to our suppliers in the region.",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "t4",
      conversationId: "SR-1023",
      type: "system",
      event: {
        kind: "quote_posted",
        data: {
          supplier: "Atlas Heavy Machinery",
          unitPrice: "$1,480",
          leadTime: "45 days",
          totalValue: "$4,440",
        },
      },
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
  ],
  "INV-7719": [
    {
      id: "t5",
      conversationId: "INV-7719",
      type: "system",
      event: {
        kind: "invoice_created",
        data: {
          amount: "$4,440",
          dueDate: "2024-02-15",
          hostedInvoiceUrl: "https://invoice.stripe.com/i/acct_test_123/test_invoice_456",
        },
      },
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "t6",
      conversationId: "INV-7719",
      type: "system",
      event: {
        kind: "payment_succeeded",
        data: { amount: "$4,440", method: "Bank Transfer" },
      },
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  "SHIP-4401": [
    {
      id: "t7",
      conversationId: "SHIP-4401",
      type: "system",
      event: {
        kind: "inspection_scheduled",
        data: {
          date: "2024-01-20",
          time: "10:00 AM",
          vendor: "SGS Inspection Services",
          location: "Port of Casablanca",
        },
      },
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "t8",
      conversationId: "SHIP-4401",
      type: "system",
      event: {
        kind: "freight_quote_ready",
        data: {
          carrier: "Maersk Line",
          cost: "$2,850",
          transitTime: "18 days",
          route: "Casablanca → New York",
        },
      },
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
  ],
}

const seedLinkedObjects: Record<string, LinkedObject> = {
  "SR-1023": {
    id: "SR-1023",
    type: "request",
    status: "In Progress",
    assignee: "Sarah Johnson",
    dueDate: "2024-02-01",
    value: "$4,440",
    details: { country: "Morocco", quantity: "3 units", targetPrice: "$1,500/unit" },
  },
  "INV-7719": {
    id: "INV-7719",
    type: "invoice",
    status: "Paid",
    value: "$4,440",
    dueDate: "2024-02-15",
    details: { hostedInvoiceUrl: "https://invoice.stripe.com/i/acct_test_123/test_invoice_456" },
  },
  "SHIP-4401": {
    id: "SHIP-4401",
    type: "shipment",
    status: "In Transit",
    value: "$2,850",
    details: {
      origin: "Casablanca",
      destination: "New York",
      etd: "2024-01-15",
      eta: "2024-02-02",
      carrier: "Maersk Line",
    },
  },
}

const seedChecklists: Record<string, ChecklistItem[]> = {
  "SR-1023": [
    { id: "c1", label: "Review supplier quotes", completed: true },
    { id: "c2", label: "Confirm specifications", completed: false },
    { id: "c3", label: "Approve final quote", completed: false },
  ],
  "INV-7719": [
    { id: "c4", label: "Process payment", completed: true },
    { id: "c5", label: "Update accounting", completed: true },
  ],
  "SHIP-4401": [
    { id: "c6", label: "Upload packing list", completed: false },
    { id: "c7", label: "Confirm HS code", completed: false },
    { id: "c8", label: "Schedule inspection", completed: true },
  ],
}

class MessagesStore {
  private conversations: Conversation[] = []
  private threads: Record<string, ThreadItem[]> = {}
  private linkedObjects: Record<string, LinkedObject> = {}
  private checklists: Record<string, ChecklistItem[]> = {}

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    if (typeof window === "undefined") {
      // SSR fallback
      this.conversations = [...seedConversations]
      this.threads = { ...seedThreads }
      this.linkedObjects = { ...seedLinkedObjects }
      this.checklists = { ...seedChecklists }
      return
    }

    try {
      const stored = localStorage.getItem("arc-messages")
      if (stored) {
        const data = JSON.parse(stored)
        this.conversations = data.conversations || [...seedConversations]
        this.threads = data.threads || { ...seedThreads }
        this.linkedObjects = data.linkedObjects || { ...seedLinkedObjects }
        this.checklists = data.checklists || { ...seedChecklists }
      } else {
        this.conversations = [...seedConversations]
        this.threads = { ...seedThreads }
        this.linkedObjects = { ...seedLinkedObjects }
        this.checklists = { ...seedChecklists }
        this.saveToStorage()
      }
    } catch (error) {
      console.error("Failed to load messages from storage:", error)
      this.conversations = [...seedConversations]
      this.threads = { ...seedThreads }
      this.linkedObjects = { ...seedLinkedObjects }
      this.checklists = { ...seedChecklists }
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(
        "arc-messages",
        JSON.stringify({
          conversations: this.conversations,
          threads: this.threads,
          linkedObjects: this.linkedObjects,
          checklists: this.checklists,
        }),
      )
    } catch (error) {
      console.error("Failed to save messages to storage:", error)
    }
  }

  listConversations({ q, filter }: { q?: string; filter?: string } = {}) {
    let filtered = [...this.conversations]

    if (q) {
      const query = q.toLowerCase()
      filtered = filtered.filter(
        (conv) => conv.subject.toLowerCase().includes(query) || conv.id.toLowerCase().includes(query),
      )
    }

    if (filter && filter !== "All") {
      switch (filter) {
        case "Unread":
          filtered = filtered.filter((conv) => conv.unreadCount > 0)
          break
        case "Mine":
          filtered = filtered.filter((conv) => conv.participants.some((p) => p.id === "user1"))
          break
        case "Request":
          filtered = filtered.filter((conv) => conv.linkedType === "request")
          break
        case "Logistics":
          filtered = filtered.filter((conv) => conv.linkedType === "shipment")
          break
        case "Invoices":
          filtered = filtered.filter((conv) => conv.linkedType === "invoice")
          break
        case "General":
          filtered = filtered.filter((conv) => conv.linkedType === "general")
          break
      }
    }

    return filtered.sort((a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime())
  }

  getThread(conversationId: string) {
    return {
      items: this.threads[conversationId] || [],
      linkedObject: this.linkedObjects[conversationId],
      checklist: this.checklists[conversationId] || [],
    }
  }

  postMessage(conversationId: string, text: string, files?: File[]) {
    const newItem: ThreadItem = {
      id: `msg_${Date.now()}`,
      conversationId,
      type: "text",
      author: { id: "user1", name: "John Smith", role: "customer" },
      body: text,
      createdAt: new Date().toISOString(),
    }

    if (!this.threads[conversationId]) {
      this.threads[conversationId] = []
    }

    this.threads[conversationId].push(newItem)

    // Update conversation last activity
    const conv = this.conversations.find((c) => c.id === conversationId)
    if (conv) {
      conv.lastActivityAt = new Date().toISOString()
    }

    this.saveToStorage()
    return newItem
  }

  markRead(conversationId: string) {
    const conv = this.conversations.find((c) => c.id === conversationId)
    if (conv) {
      conv.unreadCount = 0
      this.saveToStorage()
    }
  }

  markAllRead() {
    this.conversations.forEach((conv) => {
      conv.unreadCount = 0
    })
    this.saveToStorage()
  }

  getTotalUnread() {
    return this.conversations.reduce((total, conv) => total + conv.unreadCount, 0)
  }

  toggleChecklistItem(conversationId: string, itemId: string) {
    const checklist = this.checklists[conversationId]
    if (checklist) {
      const item = checklist.find((i) => i.id === itemId)
      if (item) {
        item.completed = !item.completed
        this.saveToStorage()
      }
    }
  }
}

export const messagesStore = new MessagesStore()
