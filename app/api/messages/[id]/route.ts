import { type NextRequest, NextResponse } from "next/server"
import { messagesStore } from "@/lib/messages/store"

// Mock message threads
const messageThreads: Record<string, any[]> = {
  "conv-req-001": [
    {
      id: "msg-1",
      type: "text",
      body: "I've received your request for the Toyota Hilux. Let me check with our suppliers and get back to you with options.",
      author: "advisor_ahmed",
      authorName: "Ahmed Hassan",
      authorAvatar: "AH",
      createdAt: new Date("2024-01-15T10:30:00Z").toISOString(),
      attachments: [],
    },
    {
      id: "msg-2",
      type: "text",
      body: "Thanks Ahmed. We're looking for 5 units, preferably 2023 model with 4WD. Timeline is flexible but would prefer delivery within 6 weeks.",
      author: "user_123",
      authorName: "You",
      authorAvatar: "YU",
      createdAt: new Date("2024-01-15T10:45:00Z").toISOString(),
      attachments: [],
    },
    {
      id: "msg-3",
      type: "system",
      body: "Quote received from Supplier A",
      systemType: "quote_received",
      linkedObjectId: "REQ-001",
      createdAt: new Date("2024-01-15T11:15:00Z").toISOString(),
      metadata: {
        supplierName: "Al-Futtaim Toyota",
        amount: "$225,000",
        currency: "USD",
        validUntil: "2024-01-30",
      },
      actions: [
        {
          label: "Review Quote",
          action: "navigate",
          url: "/dashboard/sourcing-requests/REQ-001#quotes",
        },
      ],
    },
    {
      id: "msg-4",
      type: "text",
      body: "Perfect. I have 3 suppliers who can meet those requirements. I'll send you detailed quotes by end of day with specifications and pricing.",
      author: "advisor_ahmed",
      authorName: "Ahmed Hassan",
      authorAvatar: "AH",
      createdAt: new Date("2024-01-15T11:15:00Z").toISOString(),
      attachments: [
        { name: "Toyota_Hilux_Quote_Supplier_A.pdf", size: "245 KB", type: "application/pdf" },
        { name: "Toyota_Hilux_Quote_Supplier_B.pdf", size: "198 KB", type: "application/pdf" },
      ],
    },
    {
      id: "msg-5",
      type: "system",
      body: "Document uploaded: Commercial Invoice",
      systemType: "document_uploaded",
      linkedObjectId: "REQ-001",
      createdAt: new Date("2024-01-15T14:20:00Z").toISOString(),
      metadata: {
        documentType: "Commercial Invoice",
        fileName: "Commercial_Invoice_REQ001.pdf",
        uploadedBy: "advisor_ahmed",
      },
      actions: [
        {
          label: "View Document",
          action: "navigate",
          url: "/dashboard/logistics-compliance#uploads",
        },
      ],
    },
    {
      id: "msg-6",
      type: "text",
      body: "Excellent, looking forward to reviewing the quotes. Also, do any of the suppliers offer extended warranty options?",
      author: "user_123",
      authorName: "You",
      authorAvatar: "YU",
      createdAt: new Date("2024-01-15T14:30:00Z").toISOString(),
      attachments: [],
    },
  ],
  "conv-req-002": [
    {
      id: "msg-7",
      type: "system",
      body: "Request status changed to Quoted",
      systemType: "status_change",
      linkedObjectId: "REQ-002",
      createdAt: new Date("2024-01-14T09:00:00Z").toISOString(),
      metadata: {
        previousStatus: "In Progress",
        newStatus: "Quoted",
        changedBy: "advisor_sarah",
      },
    },
    {
      id: "msg-8",
      type: "system",
      body: "Inspection scheduled for January 20th",
      systemType: "inspection_scheduled",
      linkedObjectId: "REQ-002",
      createdAt: new Date("2024-01-14T10:15:00Z").toISOString(),
      metadata: {
        inspectionDate: "2024-01-20",
        inspectionTime: "10:00 AM",
        location: "Supplier Facility - Dubai",
        inspector: "Quality Assurance Team",
      },
      actions: [
        {
          label: "View Details",
          action: "navigate",
          url: "/dashboard/logistics-compliance#inspection",
        },
      ],
    },
  ],
  "conv-inv-001": [
    {
      id: "msg-9",
      type: "system",
      body: "Invoice created",
      systemType: "invoice_created",
      linkedObjectId: "INV-2024-001",
      createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
      metadata: {
        invoiceNumber: "INV-2024-001",
        amount: "$1,500.00",
        dueDate: "2024-01-15",
        description: "Business Builder - January 2024",
      },
    },
    {
      id: "msg-10",
      type: "system",
      body: "Payment overdue - please pay immediately",
      systemType: "payment_overdue",
      linkedObjectId: "INV-2024-001",
      createdAt: new Date("2024-01-13T16:45:00Z").toISOString(),
      metadata: {
        invoiceNumber: "INV-2024-001",
        amount: "$1,500.00",
        daysPastDue: 3,
      },
      actions: [
        {
          label: "Pay Now",
          action: "external",
          url: "https://billing.stripe.com/p/login/test_invoice_123",
        },
      ],
    },
  ],
  "conv-global": [
    {
      id: "msg-11",
      type: "system",
      body: "Jebel Ali Port - Temporary delays expected",
      systemType: "port_advisory",
      linkedObjectId: null,
      createdAt: new Date("2024-01-12T09:00:00Z").toISOString(),
      metadata: {
        portName: "Jebel Ali Port",
        delayDuration: "2-3 days",
        reason: "High volume",
        affectedServices: ["Container processing", "Customs clearance"],
      },
    },
    {
      id: "msg-12",
      type: "system",
      body: "UAE National Day Holiday - December 2-3",
      systemType: "holiday_notice",
      linkedObjectId: null,
      createdAt: new Date("2024-01-10T08:00:00Z").toISOString(),
      metadata: {
        holidayName: "UAE National Day",
        dates: ["2024-12-02", "2024-12-03"],
        affectedServices: ["Government offices", "Some suppliers"],
      },
    },
  ],
}

// Mock linked objects data
const linkedObjects: Record<string, any> = {
  "REQ-001": {
    type: "sourcing_request",
    title: "Toyota Hilux 2023",
    status: "in_progress",
    assignee: "Ahmed Hassan",
    dueDate: "2024-02-15",
    totalValue: "$225,000",
    checklist: [
      { item: "Supplier quotes received", completed: true },
      { item: "Technical specifications reviewed", completed: true },
      { item: "Pricing negotiation", completed: false },
      { item: "Contract finalization", completed: false },
      { item: "Shipping arrangement", completed: false },
    ],
  },
  "REQ-002": {
    type: "sourcing_request",
    title: "Caterpillar 320D Excavator",
    status: "quoted",
    assignee: "Sarah Mitchell",
    dueDate: "2024-01-25",
    totalValue: "$180,000",
    checklist: [
      { item: "Supplier identification", completed: true },
      { item: "Quote received", completed: true },
      { item: "Inspection scheduled", completed: true },
      { item: "Final approval", completed: false },
    ],
  },
  "INV-2024-001": {
    type: "invoice",
    title: "Invoice INV-2024-001",
    status: "overdue",
    assignee: "Billing System",
    dueDate: "2024-01-15",
    totalValue: "$1,500.00",
    checklist: [
      { item: "Invoice generated", completed: true },
      { item: "Payment reminder sent", completed: true },
      { item: "Payment received", completed: false },
    ],
  },
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const thread = messagesStore.getThread(params.id)
    return NextResponse.json(thread)
  } catch (error) {
    console.error("Failed to fetch thread:", error)
    return NextResponse.json({ error: "Failed to fetch thread" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { text } = await request.json()
    const newItem = messagesStore.postMessage(params.id, text)
    return NextResponse.json({ item: newItem })
  } catch (error) {
    console.error("Failed to post message:", error)
    return NextResponse.json({ error: "Failed to post message" }, { status: 500 })
  }
}
