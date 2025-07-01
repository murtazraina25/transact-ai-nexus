import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Settings } from "lucide-react"
import { AddEmailDialog } from "./AddEmailDialog"
import { EmailSyncDialog } from "./EmailSyncDialog"
import { notifyError, notifySuccess } from "@/lib/utils"
import { getConnectedEmails } from "@/services/email-connect/email"
import { RootState, useAppSelector } from "@/state-management/store"
import { AuthState } from "@/types/models/auth"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"

interface EmailAccount {
  id: string
  provider: string
  email: string
  status: "connected" | "error" | "syncing"
  lastSync?: Date
  syncInterval: number
  enabledFolders: string[]
  enabledDocuments: string[]
  autoSync: boolean
}

const mockAccounts: EmailAccount[] = [
      {
        id: "mock-1",
        provider: "custom",
        email: "mockuser@example.com",
        status: "connected",
        lastSync: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        syncInterval: 15,
        enabledFolders: ["inbox", "sent"],
        enabledDocuments: ["invoice", "receipt"],
        autoSync: true,
      },
      {
        id: "mock-2",
        provider: "gmail",
        email: "demo@gmail.com",
        status: "syncing",
        lastSync: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        syncInterval: 1,
        enabledFolders: ["inbox"],
        enabledDocuments: ["po"],
        autoSync: false,
      },
    ];

export default function EmailConnector() {
  // const [accounts, setAccounts] = useState<EmailAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState<EmailAccount | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showSyncDialog, setShowSyncDialog] = useState(false)
  const userDetails: AuthState = useAppSelector((state: RootState) => state.auth)
  const { email } = userDetails

  const {
    data: accounts=[],
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery<EmailAccount[], Error>({
    queryKey: ["connectedEmails"],
    queryFn: async (): Promise<EmailAccount[]> => {
      const response = await getConnectedEmails();
      return response.data.map((item: any) => ({
        id: item.email_id,
        provider: item.provider,
        email: item.email,
        status: item.status,
        lastSync: item.lastSync ? new Date(item.lastSync) : undefined,
        syncInterval: item.syncInterval,
        enabledFolders: item.enabledFolders || [],
        enabledDocuments: item.enabledDocuments || [],
        autoSync: item.autoSync ?? true,
      }));
    },
  });

  useEffect(() => {
    if (isSuccess && accounts) {
      console.log("Fetched connected emails:", accounts);
      setSelectedAccount(accounts[0] || null);
    }
  }, [isSuccess, accounts, setSelectedAccount]);

  useEffect(() => {
    if (isError && error) {
      notifyError({ message: error.message || "Failed to fetch connected emails" });
    }
  }, [isError, error]);


  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.origin !== window.origin) return
      if (event.data?.type === "oauth-success") {
        notifySuccess("Login successful")
        window.location.href = "/email-connector"
      } else if (event.data?.type === "oauth-error") {
        notifyError({ message: event.data.error || "OAuth failed" })
      }
    }
    window.addEventListener("message", handleOAuthMessage)
    return () => window.removeEventListener("message", handleOAuthMessage)
  }, [])

  // useEffect(() => {
  //   fetchConnectedEmails()
  // }, [])

  // const fetchConnectedEmails = async () => {
  //   try {
  //     const response = await getConnectedEmails()
  //     const data: EmailAccount[] = response.data.map((item: any) => ({
  //       id: item.email_id,
  //       provider: item.provider,
  //       email: item.email,
  //       status: item.status,
  //       lastSync: item.lastSync ? new Date(item.lastSync) : undefined,
  //       syncInterval: item.syncInterval,
  //       enabledFolders: item.enabledFolders || [],
  //       enabledDocuments: item.enabledDocuments || [],
  //       autoSync: item.autoSync ?? true,
  //     }))
  //     setAccounts(data)
  //     setSelectedAccount(data[0] || null)
  //     // setAccounts(mockAccounts) // Fallback to mock data
  //     // setSelectedAccount(mockAccounts[0] || null)
  //   } catch (error: any) {
  //     setAccounts(mockAccounts) // Fallback to mock data
  //     setSelectedAccount(mockAccounts[0] || null)
  //     notifyError({
  //       message: error?.message?.message || "Failed to fetch connected emails",
  //     })
  //   }
  // }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "text-green-600"
      case "syncing":
        return "text-blue-600"
      case "error":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const formatInterval = (minutes: number)=> {
    if (minutes === 1440) return "Daily";
    if (minutes === 720) return "Every 12 hours";
    if (minutes === 360) return "Every 6 hours";
    if (minutes === 60) return "Every hour";
    if (minutes === 30) return "Every 30 minutes";
    if (minutes === 15) return "Every 15 minutes";
    if (minutes === null || minutes === 0) return "Not set";
    return `${minutes} min`;
  }


  // const handleRemoveAccount = (id: string) => {
  //   setAccounts(accounts.filter((acc) => acc.id !== id))
  //   if (selectedAccount?.id === id) {
  //     setSelectedAccount(null)
  //   }
  // }

  const handleRemoveAccount = (id: string) => {
    // Local-only delete for now
    const updated = accounts.filter((acc) => acc.id !== id);
    setSelectedAccount(updated[0] || null);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] gap-4">
      {/* Sidebar */}
      <div className="md:w-1/3 lg:w-1/4 border rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-xl font-semibold">Email Accounts</h2>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        <ScrollArea className="h-full">
          <div className="flex flex-col divide-y">
            {accounts.map((account) => (
              <button
                key={account.id}
                className={`text-left px-4 py-3 hover:bg-muted/40 focus:outline-none ${
                  selectedAccount?.id === account.id ? "bg-muted" : ""
                }`}
                onClick={() => setSelectedAccount(account)}
              >
                <div className="font-medium">{account.email}</div>
                <div className={`text-xs ${getStatusColor(account.status)}`}>
                  {account.status}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Detail Panel */}
      <div className="flex-1 border rounded-md p-4 overflow-auto">
        {selectedAccount ? (
          <div className="space-y-4">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <h2 className="text-2xl font-bold">{selectedAccount.email}</h2>
                <p className="text-muted-foreground">
                  Provider: {selectedAccount.provider}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setShowSyncDialog(true)}>
                  <Settings className="h-4 w-4 mr-1" /> Configure
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveAccount(selectedAccount.id)}
                  className="text-red-600 border-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sync Interval</CardTitle>
                </CardHeader>
                <CardContent>{formatInterval(selectedAccount.syncInterval)}</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Enabled Folders</CardTitle>
                </CardHeader>
                <CardContent>{selectedAccount.enabledFolders.join(", ")}</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Last Sync</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedAccount.lastSync?.toLocaleString() || "Never"}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Fetched Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No documents fetched yet.</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p>Select an account to view details</p>
          </div>
        )}
      </div>

      <AddEmailDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      <EmailSyncDialog
        open={showSyncDialog}
        onOpenChange={setShowSyncDialog}
        account={selectedAccount}
      />
    </div>
  )
}
