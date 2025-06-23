import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import { ImapForm } from "./IMAPForm"
import { generateOAuthUrl } from "@/lib/oauth-config"
import { useToast } from "@/hooks/use-toast"

interface AddEmailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const emailProviders = [
  { id: "gmail", name: "Gmail", icon: "📧", requiresOAuth: true },
  { id: "outlook", name: "Outlook", icon: "📮", requiresOAuth: true },
  { id: "custom", name: "Custom IMAP", icon: "✉️", requiresOAuth: false },
]

export function AddEmailDialog({ open, onOpenChange }: AddEmailDialogProps) {
  const [showImapForm, setShowImapForm] = useState(false)
  const { toast } = useToast()

  const handleOAuthConnect = async (providerId: string) => {
      const oauthUrl = await generateOAuthUrl(providerId);
      const popup = window.open(
          oauthUrl,
          'OAuthLogin',
          'width=500,height=600'
        );
      
        const timer = setInterval(() => {
          if (popup?.closed) {
            clearInterval(timer);
          }
        }, 1000);
  }

  const handleConnect = (provider: any) => {
    if (provider.requiresOAuth) {
      handleOAuthConnect(provider.id)
    } else {
      setShowImapForm(true)
    }
  }

  const handleImapSubmit = (data: any) => {
    toast({
      title: "IMAP Account Added",
      description: `Successfully configured ${data.email}`,
    })
    setShowImapForm(false)
    onOpenChange(false)
  }

  const handleImapCancel = () => {
    setShowImapForm(false)
  }

  const handleBack = () => {
    setShowImapForm(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
       className="
          sm:max-w-2xl
          max-h-[85vh]
          overflow-y-auto
          scrollbar             /* Enables custom styling */
          scrollbar-thumb-gray-400 /* Color of the scrollbar thumb */
          scrollbar-track-gray-200 /* Color of the scrollbar track */
          scrollbar-thin          /* Makes the scrollbar thinner */
          dark:scrollbar-thumb-gray-600 /* Dark mode thumb color */
          dark:scrollbar-track-gray-800 /* Dark mode track color */
        "
      >
        <DialogHeader>
          <DialogTitle>{showImapForm ? "Configure IMAP Connection" : "Add Email Account"}</DialogTitle>
          <DialogDescription>
            {showImapForm
              ? "Enter your email server details"
              : "Choose an email provider to connect for document processing"}
          </DialogDescription>
        </DialogHeader>

        {showImapForm ? (
          <div className="space-y-4">
            <Button variant="outline" onClick={handleBack} className="w-fit">
              ← Back to Providers
            </Button>
            <ImapForm onSubmit={handleImapSubmit} onCancel={handleImapCancel} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {emailProviders.map((provider) => (
              <Card key={provider.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{provider.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                      <CardDescription>{provider.requiresOAuth ? "OAuth" : "IMAP"} connection</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => handleConnect(provider)} className="w-full">
                    {provider.requiresOAuth && <ExternalLink className="mr-2 h-4 w-4" />}
                    Connect {provider.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
