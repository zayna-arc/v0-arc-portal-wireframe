"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Send,
  MoreVertical,
  Paperclip,
  Phone,
  Video,
  Archive,
  Star,
  Trash2,
  MessageSquare,
  Package,
  Truck,
  FileText,
} from "lucide-react"
import { messagesStore } from "@/lib/messages/store"
import type { MessageConversation, Message } from "@/lib/messages/types"

const typeIcons = {
  request: Package,
  shipment: Truck,
  invoice: FileText,
  general: MessageSquare,
}

const typeColors = {
  request: "bg-blue-100 text-blue-800",
  shipment: "bg-green-100 text-green-800",
  invoice: "bg-yellow-100 text-yellow-800",
  general: "bg-gray-100 text-gray-800",
}

const priorityColors = {
  high: "border-l-red-500",
  medium: "border-l-yellow-500",
  low: "border-l-green-500",
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [newMessage, setNewMessage] = useState("")
  const [conversations, setConversations] = useState<MessageConversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    setConversations(messagesStore.getConversations())
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      setMessages(messagesStore.getMessages(selectedConversation))
    }
  }, [selectedConversation])

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === "all" || conv.type === activeTab || (activeTab === "unread" && conv.unreadCount > 0)

    return matchesSearch && matchesTab
  })

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    messagesStore.sendMessage(selectedConversation, newMessage)
    setMessages(messagesStore.getMessages(selectedConversation))
    setConversations(messagesStore.getConversations())
    setNewMessage("")
  }

  const handleMarkAsRead = (conversationId: string) => {
    messagesStore.markAsRead(conversationId)
    setConversations(messagesStore.getConversations())
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const selectedConv = conversations.find((c) => c.id === selectedConversation)

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Messages & Updates</h2>
          <p className="text-muted-foreground mt-1">Communicate with suppliers and track updates</p>
        </div>
        <Button variant="outline" onClick={() => messagesStore.markAllAsRead()}>
          Mark All Read
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-4 flex flex-col">
          <CardHeader className="pb-3">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1">
              <div className="px-4 pb-3">
                <TabsList className="grid w-full grid-cols-5 h-auto">
                  <TabsTrigger value="all" className="text-xs">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="text-xs">
                    <span className="hidden sm:inline">Unread</span>
                    <span className="sm:hidden">New</span>
                    {messagesStore.getTotalUnread() > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-1 text-xs h-4 w-4 p-0 flex items-center justify-center"
                      >
                        {messagesStore.getTotalUnread()}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="request" className="text-xs">
                    <span className="hidden sm:inline">Requests</span>
                    <Package className="h-3 w-3 sm:hidden" />
                  </TabsTrigger>
                  <TabsTrigger value="shipment" className="text-xs">
                    <span className="hidden sm:inline">Logistics</span>
                    <Truck className="h-3 w-3 sm:hidden" />
                  </TabsTrigger>
                  <TabsTrigger value="invoice" className="text-xs">
                    <span className="hidden sm:inline">Invoices</span>
                    <FileText className="h-3 w-3 sm:hidden" />
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value={activeTab} className="mt-0 flex-1">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2 px-4 pb-4">
                    {filteredConversations.map((conversation) => {
                      const TypeIcon = typeIcons[conversation.type]
                      return (
                        <div
                          key={conversation.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors border-l-4 ${
                            priorityColors[conversation.priority]
                          } ${selectedConversation === conversation.id ? "bg-accent" : "hover:bg-accent/50"}`}
                          onClick={() => {
                            setSelectedConversation(conversation.id)
                            if (conversation.unreadCount > 0) {
                              handleMarkAsRead(conversation.id)
                            }
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <TypeIcon className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-sm font-medium line-clamp-1">{conversation.title}</p>
                                  <span className="text-xs text-muted-foreground shrink-0">
                                    {formatTime(conversation.lastMessageTime)}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                                  {conversation.lastMessage}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  <Badge variant="secondary" className={`text-xs ${typeColors[conversation.type]}`}>
                                    {conversation.type}
                                  </Badge>
                                  {conversation.unreadCount > 0 && (
                                    <Badge variant="destructive" className="text-xs">
                                      {conversation.unreadCount}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Message View */}
        <Card className="lg:col-span-8 flex flex-col">
          {selectedConv ? (
            <>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-1">{selectedConv.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {selectedConv.participants.length} participants • {selectedConv.type}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Star className="mr-2 h-4 w-4" />
                          Star Conversation
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="p-0 flex-1 flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderRole === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] md:max-w-[75%] rounded-lg p-3 ${
                            message.senderRole === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          {message.senderRole !== "user" && (
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{message.senderName}</span>
                            </div>
                          )}
                          <p className="text-sm leading-relaxed break-words">{message.content}</p>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.attachments.map((attachment) => (
                                <div
                                  key={attachment.id}
                                  className="flex items-center gap-2 p-2 bg-background/10 rounded"
                                >
                                  <Paperclip className="h-3.5 w-3.5 shrink-0" />
                                  <span className="text-sm line-clamp-1">{attachment.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center justify-end mt-2">
                            <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Separator />
                <div className="p-4">
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        className="min-h-[80px] resize-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="ghost" size="sm" className="h-9 w-9">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="h-9 w-9" size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center flex-1">
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-muted-foreground text-sm">Choose a conversation from the list to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
