export interface Participant {
  id: string
  name: string
  role: "customer" | "advisor" | "supplier" | "logistics" | "finance"
}

export interface Conversation {
  id: string
  subject: string
  linkedType: "request" | "invoice" | "shipment" | "general"
  linkedId: string
  status: string
  lastActivityAt: string
  unreadCount: number
  participants: Participant[]
}

export interface ThreadItem {
  id: string
  conversationId: string
  type: "text" | "system"
  author?: Participant
  body?: string
  event?: {
    kind: string
    data: Record<string, any>
  }
  file?: {
    name: string
    size: number
    type: string
  }
  createdAt: string
}

export interface LinkedObject {
  id: string
  type: "request" | "invoice" | "shipment"
  status: string
  assignee?: string
  dueDate?: string
  value?: string
  details: Record<string, any>
}

export interface ChecklistItem {
  id: string
  label: string
  completed: boolean
}

export interface MessageThread {
  id: string
  title: string
  type: "request" | "shipment" | "invoice" | "general"
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  priority: "low" | "medium" | "high"
  status: "active" | "archived"
  participants: string[]
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: "user" | "supplier" | "admin" | "system"
  content: string
  timestamp: string
  type: "text" | "file" | "system"
  attachments?: MessageAttachment[]
  isRead: boolean
}

export interface MessageConversation {
  id: string
  title: string
  type: "request" | "shipment" | "invoice" | "general"
  participants: string[]
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  status: "active" | "archived"
  priority: "low" | "medium" | "high"
  linkedId?: string
  linkedType?: "request" | "shipment" | "invoice"
  messages: MessageItem[]
}

export interface MessageItem {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderRole: "user" | "supplier" | "admin" | "system"
  content: string
  timestamp: string
  type: "text" | "file" | "system"
  attachments?: MessageAttachment[]
  readBy: string[]
}

export interface MessageAttachment {
  id: string
  name: string
  size: number
  type: string
  url: string
}

export interface MessageFilters {
  search: string
  type: "all" | "request" | "shipment" | "invoice" | "general"
  status: "all" | "active" | "archived"
  unreadOnly: boolean
}

export type Priority = "high" | "medium" | "low"
