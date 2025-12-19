import type { MessageConversation, MessageItem, MessageThread, Message, MessageFilters } from "./types"

class MessagesStore {
  private conversations: MessageConversation[] = [
    {
      id: "conv-1",
      title: "Argan Oil Sourcing - SR-1023",
      type: "request",
      participants: ["user-1", "supplier-atlas"],
      lastMessage: "We can provide the organic certified argan oil. Please find our quote attached.",
      lastMessageTime: "2024-01-20T14:30:00Z",
      unreadCount: 2,
      status: "active",
      priority: "high",
      linkedId: "SR-1023",
      linkedType: "request",
      messages: [
        {
          id: "msg-1",
          conversationId: "conv-1",
          senderId: "user-1",
          senderName: "Ahmed Hassan",
          senderRole: "user",
          content: "Hello, I'm looking for organic certified argan oil. Can you provide 1000L?",
          timestamp: "2024-01-20T10:00:00Z",
          type: "text",
          readBy: ["user-1", "supplier-atlas"],
        },
        {
          id: "msg-2",
          conversationId: "conv-1",
          senderId: "supplier-atlas",
          senderName: "Atlas Argan Co.",
          senderRole: "supplier",
          content: "Yes, we can provide organic certified argan oil. What's your timeline?",
          timestamp: "2024-01-20T12:15:00Z",
          type: "text",
          readBy: ["supplier-atlas"],
        },
        {
          id: "msg-3",
          conversationId: "conv-1",
          senderId: "user-1",
          senderName: "Ahmed Hassan",
          senderRole: "user",
          content: "We need it by end of February. Please send your best quote.",
          timestamp: "2024-01-20T13:00:00Z",
          type: "text",
          readBy: ["user-1"],
        },
        {
          id: "msg-4",
          conversationId: "conv-1",
          senderId: "supplier-atlas",
          senderName: "Atlas Argan Co.",
          senderRole: "supplier",
          content: "We can provide the organic certified argan oil. Please find our quote attached.",
          timestamp: "2024-01-20T14:30:00Z",
          type: "text",
          attachments: [
            {
              id: "att-1",
              name: "argan-oil-quote.pdf",
              size: 245760,
              type: "application/pdf",
              url: "/files/argan-oil-quote.pdf",
            },
          ],
          readBy: ["supplier-atlas"],
        },
      ],
    },
    {
      id: "conv-2",
      title: "Shipment Update - SH-2024-001",
      type: "shipment",
      participants: ["user-1", "logistics-partner"],
      lastMessage: "Your shipment has cleared customs and is now in transit to the final destination.",
      lastMessageTime: "2024-01-19T16:45:00Z",
      unreadCount: 1,
      status: "active",
      priority: "medium",
      linkedId: "SH-2024-001",
      linkedType: "shipment",
      messages: [
        {
          id: "msg-5",
          conversationId: "conv-2",
          senderId: "logistics-partner",
          senderName: "MENA Logistics",
          senderRole: "supplier",
          content: "Your shipment has arrived at the port and is going through customs clearance.",
          timestamp: "2024-01-19T14:00:00Z",
          type: "text",
          readBy: ["logistics-partner", "user-1"],
        },
        {
          id: "msg-6",
          conversationId: "conv-2",
          senderId: "logistics-partner",
          senderName: "MENA Logistics",
          senderRole: "supplier",
          content: "Your shipment has cleared customs and is now in transit to the final destination.",
          timestamp: "2024-01-19T16:45:00Z",
          type: "text",
          readBy: ["logistics-partner"],
        },
      ],
    },
    {
      id: "conv-3",
      title: "Invoice Payment - INV-2024-015",
      type: "invoice",
      participants: ["user-1", "finance-team"],
      lastMessage: "Payment has been processed successfully. Thank you for your business.",
      lastMessageTime: "2024-01-18T11:20:00Z",
      unreadCount: 0,
      status: "active",
      priority: "low",
      linkedId: "INV-2024-015",
      linkedType: "invoice",
      messages: [
        {
          id: "msg-7",
          conversationId: "conv-3",
          senderId: "user-1",
          senderName: "Ahmed Hassan",
          senderRole: "user",
          content: "I've initiated the payment for invoice INV-2024-015. Please confirm receipt.",
          timestamp: "2024-01-18T09:30:00Z",
          type: "text",
          readBy: ["user-1", "finance-team"],
        },
        {
          id: "msg-8",
          conversationId: "conv-3",
          senderId: "finance-team",
          senderName: "Finance Team",
          senderRole: "admin",
          content: "Payment has been processed successfully. Thank you for your business.",
          timestamp: "2024-01-18T11:20:00Z",
          type: "text",
          readBy: ["finance-team", "user-1"],
        },
      ],
    },
    {
      id: "conv-4",
      title: "General Support",
      type: "general",
      participants: ["user-1", "support-team"],
      lastMessage: "Is there anything else I can help you with today?",
      lastMessageTime: "2024-01-17T15:30:00Z",
      unreadCount: 0,
      status: "active",
      priority: "low",
      messages: [
        {
          id: "msg-9",
          conversationId: "conv-4",
          senderId: "user-1",
          senderName: "Ahmed Hassan",
          senderRole: "user",
          content: "I need help understanding the new compliance requirements.",
          timestamp: "2024-01-17T14:00:00Z",
          type: "text",
          readBy: ["user-1", "support-team"],
        },
        {
          id: "msg-10",
          conversationId: "conv-4",
          senderId: "support-team",
          senderName: "Support Team",
          senderRole: "admin",
          content:
            "I'd be happy to help! The new compliance requirements include updated documentation for customs clearance. I'll send you the detailed guide.",
          timestamp: "2024-01-17T14:15:00Z",
          type: "text",
          readBy: ["support-team", "user-1"],
        },
        {
          id: "msg-11",
          conversationId: "conv-4",
          senderId: "support-team",
          senderName: "Support Team",
          senderRole: "admin",
          content: "Is there anything else I can help you with today?",
          timestamp: "2024-01-17T15:30:00Z",
          type: "text",
          readBy: ["support-team", "user-1"],
        },
      ],
    },
  ]

  getConversations(): MessageConversation[] {
    return this.conversations
  }

  getThreads(): MessageThread[] {
    return this.conversations.map((conv) => ({
      id: conv.id,
      title: conv.title,
      type: conv.type,
      lastMessage: conv.lastMessage,
      lastMessageTime: conv.lastMessageTime,
      unreadCount: conv.unreadCount,
      priority: conv.priority,
      status: conv.status,
      participants: conv.participants,
    }))
  }

  getMessages(conversationId: string): Message[] {
    const conversation = this.conversations.find((c) => c.id === conversationId)
    if (!conversation) return []

    return conversation.messages.map((msg) => ({
      id: msg.id,
      senderId: msg.senderId,
      senderName: msg.senderName,
      senderRole: msg.senderRole,
      content: msg.content,
      timestamp: msg.timestamp,
      type: msg.type,
      attachments: msg.attachments,
      isRead: msg.readBy.includes("user-1"),
    }))
  }

  getTotalUnread(): number {
    return this.conversations.reduce((total, conv) => total + conv.unreadCount, 0)
  }

  markAsRead(conversationId: string, messageId?: string): void {
    const conversation = this.conversations.find((c) => c.id === conversationId)
    if (!conversation) return

    if (messageId) {
      const message = conversation.messages.find((m) => m.id === messageId)
      if (message && !message.readBy.includes("user-1")) {
        message.readBy.push("user-1")
        conversation.unreadCount = Math.max(0, conversation.unreadCount - 1)
      }
    } else {
      conversation.messages.forEach((message) => {
        if (!message.readBy.includes("user-1")) {
          message.readBy.push("user-1")
        }
      })
      conversation.unreadCount = 0
    }
  }

  markAllAsRead(): void {
    this.conversations.forEach((conversation) => {
      conversation.messages.forEach((message) => {
        if (!message.readBy.includes("user-1")) {
          message.readBy.push("user-1")
        }
      })
      conversation.unreadCount = 0
    })
  }

  sendMessage(conversationId: string, content: string): void {
    const conversation = this.conversations.find((c) => c.id === conversationId)
    if (!conversation) return

    const newMessage: MessageItem = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: "user-1",
      senderName: "Ahmed Hassan",
      senderRole: "user",
      content,
      timestamp: new Date().toISOString(),
      type: "text",
      readBy: ["user-1"],
    }

    conversation.messages.push(newMessage)
    conversation.lastMessage = content
    conversation.lastMessageTime = newMessage.timestamp
  }

  filterConversations(filters: MessageFilters): MessageConversation[] {
    return this.conversations.filter((conv) => {
      const matchesSearch =
        !filters.search ||
        conv.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(filters.search.toLowerCase())

      const matchesType = filters.type === "all" || conv.type === filters.type
      const matchesStatus = filters.status === "all" || conv.status === filters.status
      const matchesUnread = !filters.unreadOnly || conv.unreadCount > 0

      return matchesSearch && matchesType && matchesStatus && matchesUnread
    })
  }
}

export const messagesStore = new MessagesStore()
