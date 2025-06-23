import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"

interface EmailSyncDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account: any
}

const folders = [
  { id: "inbox", name: "Inbox", enabled: true },
  { id: "sent", name: "Sent", enabled: false },
  { id: "drafts", name: "Drafts", enabled: false },
  { id: "spam", name: "Spam", enabled: false },
]

const documentTypes = [
  { id: "invoice", name: "Invoice", enabled: true },
  { id: "po", name: "Purchase Order", enabled: true },
  { id: "receipt", name: "Receipt", enabled: false },
]

export function EmailSyncDialog({ open, onOpenChange, account }: EmailSyncDialogProps) {
  if (!account) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure Sync - {account.provider}</DialogTitle>
          <DialogDescription>{account.email}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Sync Settings</h3>

            <div className="flex items-center space-x-2">
              <Switch id="sync-enabled" defaultChecked />
              <Label htmlFor="sync-enabled">Enable automatic sync</Label>
            </div>

            <div className="space-y-2">
              <Label>Sync Interval</Label>
              <Select defaultValue="6h">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15m">Every 15 minutes</SelectItem>
                  <SelectItem value="30m">Every 30 minutes</SelectItem>
                  <SelectItem value="1h">Every hour</SelectItem>
                  <SelectItem value="6h">Every 6 hours</SelectItem>
                  <SelectItem value="12h">Every 12 hours</SelectItem>
                  <SelectItem value="24h">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Email Folders</h3>
            <div className="space-y-3">
              {folders.map((folder) => (
                <div key={folder.id} className="flex items-center space-x-3">
                  <Checkbox id={folder.id} defaultChecked={folder.enabled} />
                  <Label htmlFor={folder.id}>{folder.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Document Types</h3>
            <div className="space-y-3">
              {documentTypes.map((docType) => (
                <div key={docType.id} className="flex items-center space-x-3">
                  <Checkbox id={docType.id} defaultChecked={docType.enabled} />
                  <Label htmlFor={docType.id}>{docType.name}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Save Configuration</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
