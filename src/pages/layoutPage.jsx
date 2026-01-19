/*
  layoutPage.jsx
  - Main application layout that composes `SideBar` and the three primary flows:
    - Chat prompt
    - Generate Invoice
    - Reconcile PO & Invoice
*/
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { MessageCircle, FileText, FileCheck } from "lucide-react"
import InvoiceGeneration from "../components/invoiceGeneration"
import ReconcilePO from "../components/reconcilePo"
import ChatInterface from "../components/chatInterface"
import Sidebar from "../globalComponents/SideBar"

export default function Home() {
  const [activeTab, setActiveTab] = useState("chat")
  const [message, setMessage] = useState("")

  return (
    <div className="flex h-[calc(100vh-3.9rem)] bg-slate-50 dark:bg-slate-900">
      <div className="mix-w-200 border-r bg-white dark:bg-slate-800 flex flex-col">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab}  />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b bg-white dark:bg-slate-800 px-6 py-3">
          <h1 className="text-xl font-semibold">
            {activeTab === "chat" && "New Prompt"}
            {activeTab === "generate" && "Generate Invoice from PO"}
            {activeTab === "reconcile" && "Reconcile PO & Invoice"}
          </h1>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="chat" className="mt-0">
              <ChatInterface />
            </TabsContent>
            <TabsContent value="generate" className="mt-0">
              <InvoiceGeneration />
            </TabsContent>
            <TabsContent value="reconcile" className="mt-0">
              <ReconcilePO />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}