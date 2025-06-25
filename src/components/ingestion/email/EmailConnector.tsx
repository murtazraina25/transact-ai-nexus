// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Plus, Settings, Trash2 } from "lucide-react"
// import { AddEmailDialog } from "./AddEmailDialog"
// import { EmailSyncDialog } from "./EmailSyncDialog"
// import { notifyError, notifySuccess } from "@/lib/utils"

// interface EmailAccount {
//   id: string
//   provider: string
//   email: string
//   status: "connected" | "error" | "syncing"
//   lastSync?: Date
//   syncInterval: string
//   enabledFolders: number
// }

// const mockEmailAccounts: EmailAccount[] = [
//   {
//     id: "1",
//     provider: "Gmail",
//     email: "john.doe@gmail.com",
//     status: "connected",
//     lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
//     syncInterval: "6h",
//     enabledFolders: 2,
//   },
//   {
//     id: "2",
//     provider: "Outlook",
//     email: "john.doe@company.com",
//     status: "syncing",
//     lastSync: new Date(Date.now() - 30 * 60 * 1000),
//     syncInterval: "12h",
//     enabledFolders: 3,
//   },
// ]

// export default function EmailConnector() {
//   const [accounts, setAccounts] = useState<EmailAccount[]>(mockEmailAccounts)
//   const [showAddDialog, setShowAddDialog] = useState(false)
//   const [selectedAccount, setSelectedAccount] = useState<EmailAccount | null>(null)
//   const [showSyncDialog, setShowSyncDialog] = useState(false)


//   useEffect(() => {
//       const handleOAuthMessage = (event: MessageEvent) => {
//         if (event.origin !== window.origin) return;
  
//         if (event.data?.type === 'oauth-success') {
//           notifySuccess("Login successful");
//           window.location.href = "/email-connector";
//         } else if (event.data?.type === 'oauth-error') {
//           notifyError({ message: event.data.error || "OAuth failed" });
//         }
//       };
  
//       window.addEventListener('message', handleOAuthMessage);
//       return () => window.removeEventListener('message', handleOAuthMessage);
//     }, []);

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "connected":
//         return <Badge className="bg-green-100 text-green-800">Connected</Badge>
//       case "syncing":
//         return <Badge className="bg-blue-100 text-blue-800">Syncing</Badge>
//       case "error":
//         return <Badge variant="destructive">Error</Badge>
//       default:
//         return <Badge variant="secondary">Unknown</Badge>
//     }
//   }

//   const formatLastSync = (date: Date) => {
//     const now = new Date()
//     const diffMs = now.getTime() - date.getTime()
//     const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
//     const diffMinutes = Math.floor(diffMs / (1000 * 60))

//     if (diffHours > 0) {
//       return `${diffHours}h ago`
//     } else if (diffMinutes > 0) {
//       return `${diffMinutes}m ago`
//     } else {
//       return "Just now"
//     }
//   }

//   const handleRemoveAccount = (accountId: string) => {
//     setAccounts(accounts.filter((acc) => acc.id !== accountId))
//   }

//   const handleConfigureSync = (account: EmailAccount) => {
//     setSelectedAccount(account)
//     setShowSyncDialog(true)
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">Email Accounts</h1>
//           <p className="text-muted-foreground">Manage your email connections for document processing</p>
//         </div>
//         <Button onClick={() => setShowAddDialog(true)}>
//           <Plus className="h-4 w-4 mr-2" />
//           Add Email Account
//         </Button>
//       </div>

//       {accounts.length === 0 ? (
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center py-12">
//             <div className="text-6xl mb-4">📧</div>
//             <h3 className="text-lg font-semibold mb-2">No Email Accounts</h3>
//             <p className="text-muted-foreground text-center mb-4">
//               Connect your first email account to start processing documents
//             </p>
//             <Button onClick={() => setShowAddDialog(true)}>
//               <Plus className="h-4 w-4 mr-2" />
//               Add Your First Account
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {accounts.map((account) => (
//             <Card key={account.id} className="hover:shadow-md transition-shadow">
//               <CardHeader className="pb-3">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <CardTitle className="text-lg">{account.provider}</CardTitle>
//                     <CardDescription className="text-sm">{account.email}</CardDescription>
//                   </div>
//                   {getStatusBadge(account.status)}
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="text-sm space-y-1">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Sync Interval:</span>
//                     <span className="font-medium">{account.syncInterval}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Folders:</span>
//                     <span className="font-medium">{account.enabledFolders} enabled</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Last Sync:</span>
//                     <span className="font-medium">{account.lastSync ? formatLastSync(account.lastSync) : "Never"}</span>
//                   </div>
//                 </div>

//                 <div className="flex space-x-2">
//                   <Button size="sm" variant="outline" onClick={() => handleConfigureSync(account)} className="flex-1">
//                     <Settings className="h-4 w-4 mr-1" />
//                     Configure
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => handleRemoveAccount(account.id)}
//                     className="text-red-600 hover:text-red-700"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       <AddEmailDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
//       <EmailSyncDialog open={showSyncDialog} onOpenChange={setShowSyncDialog} account={selectedAccount} />
//     </div>
//   )
// }


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

interface EmailAccount {
  id: string
  provider: string
  email: string
  status: "connected" | "error" | "syncing"
  lastSync?: Date
  syncInterval: string
  enabledFolders: number
}

const mockEmailAccounts: EmailAccount[] = [
  {
    id: "1",
    provider: "Gmail",
    email: "john.doe@gmail.com",
    status: "connected",
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
    syncInterval: "6h",
    enabledFolders: 2,
  },
  {
    id: "2",
    provider: "Outlook",
    email: "john.doe@company.com",
    status: "syncing",
    lastSync: new Date(Date.now() - 30 * 60 * 1000),
    syncInterval: "12h",
    enabledFolders: 3,
  },
]

export default function EmailConnector() {
  const [accounts, setAccounts] = useState<EmailAccount[]>(mockEmailAccounts)
  const [selectedAccount, setSelectedAccount] = useState<EmailAccount | null>(accounts[0] || null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showSyncDialog, setShowSyncDialog] = useState(false)
  const userDetails: AuthState = useAppSelector((state: RootState) => state.auth);
  const { email } = userDetails;

  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.origin !== window.origin) return;

      if (event.data?.type === 'oauth-success') {
        notifySuccess("Login successful");
        window.location.href = "/email-connector";
      } else if (event.data?.type === 'oauth-error') {
        notifyError({ message: event.data.error || "OAuth failed" });
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);

  useEffect(() => {
    fetchConnectedEmails()
  },[])

  const fetchConnectedEmails = async () => {
    try {
      const response = await getConnectedEmails(email)
      console.log("Fetched connected emails:", response)
    }
    catch (error: any) {
      notifyError({
        message: error?.message || "Failed to fetch connected emails",
      });
    }
  }

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

  const handleRemoveAccount = (id: string) => {
    setAccounts(accounts.filter((acc) => acc.id !== id))
    if (selectedAccount?.id === id) {
      setSelectedAccount(null)
    }
  }

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
                <div className={`text-xs ${getStatusColor(account.status)}`}>{account.status}</div>
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
                <p className="text-muted-foreground">Provider: {selectedAccount.provider}</p>
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
                <CardContent>{selectedAccount.syncInterval}</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Enabled Folders</CardTitle>
                </CardHeader>
                <CardContent>{selectedAccount.enabledFolders}</CardContent>
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
                {/* Placeholder for future table */}
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
