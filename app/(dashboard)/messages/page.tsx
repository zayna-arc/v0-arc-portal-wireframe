"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Filter, MessageSquare, Bell, AlertCircle, CheckCircle, Clock, Star, Archive } from "lucide-react"
import { messagesStore } from "@/lib/messages/store"
import type { Message, MessageThread } from "@/lib/messages/types"

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedThread, setSelectedThread] = useState<string | null>(null)
  const [threads, setThreads] = useState<MessageThread[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    // Load threads and messages
    setThreads(messagesStore.getThreads())
    setMessages(messagesStore.getMessages())
  }, [])

  const filteredThreads = threads.filter((thread) => {
    const matchesSearch =
      thread.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.participants.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    if (activeTab === "unread") return matchesSearch && thread.unreadCount > 0
    if (activeTab === "important") return matchesSearch && thread.priority === "high"
    if (activeTab === "archived") return matchesSearch && thread.status === "archived"

    return matchesSearch
  })

  const selectedThreadData = selectedThread ? threads.find((t) => t.id === selectedThread) : null
  const threadMessages = selectedThread ? messages.filter((m) => m.threadId === selectedThread) : []

  const handleMarkAsRead = async (threadId: string) => {
    try {
      await fetch(`/api/messages/${threadId}/read`, { method: "POST" })
      setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t)))
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("/api/messages/read-all", { method: "POST" })
      setThreads((prev) => prev.map((t) => ({ ...t, unreadCount: 0 })))
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "quote":
        return "bg-blue-100 text-blue-800"
      case "shipment":
        return "bg-green-100 text-green-800"
      case "invoice":
        return "bg-orange-100 text-orange-800"
      case "system":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-purple-100 text-purple-800"
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Messages & Updates</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
            <p className="text-xs text-muted-foreground">Across all threads</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{threads.reduce((sum, t) => sum + t.unreadCount, 0)}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{threads.filter((t) => t.priority === "high").length}</div>
            <p className="text-xs text-muted-foreground">Urgent items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threads</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{threads.filter((t) => t.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Ongoing conversations</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Thread List */}
        <div className="lg:col-span-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="important">Important</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {filteredThreads.map((thread) => (
                    <Card
                      key={thread.id}
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedThread === thread.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setSelectedThread(thread.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between space-x-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              {getPriorityIcon(thread.priority)}
                              <Badge className={getTypeColor(thread.type)} variant="outline">
                                {thread.type}
                              </Badge>
                              {thread.unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {thread.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <h4 className="font-medium truncate" title={thread.subject}>
                              {thread.subject}
                            </h4>
                            <p className="text-sm text-muted-foreground truncate">{thread.lastMessage}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">{thread.participants.join(", ")}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(thread.lastActivity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Message View */}
        <div className="lg:col-span-2">
          {selectedThreadData ? (
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      {getPriorityIcon(selectedThreadData.priority)}
                      <span>{selectedThreadData.subject}</span>
                    </CardTitle>
                    <CardDescription>{selectedThreadData.participants.join(", ")}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getTypeColor(selectedThreadData.type)}>{selectedThreadData.type}</Badge>
                    <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(selectedThreadData.id)}>
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {threadMessages.map((message) => (
                    <div key={message.id} className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {message.sender
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{message.sender}</span>
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(message.timestamp)}</span>
                          {!message.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                        </div>
                        <div className="text-sm">{message.content}</div>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {message.attachments.map((attachment, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {attachment}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <div className="text-center space-y-2">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-medium">Select a conversation</h3>
                <p className="text-sm text-muted-foreground">Choose a thread from the list to view messages</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
