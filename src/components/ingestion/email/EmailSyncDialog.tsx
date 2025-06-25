// import { useForm, Controller } from "react-hook-form"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Switch } from "@/components/ui/switch"
// import { useEffect } from "react"
// import { configureEmailSync } from "@/services/email-connect/customEmail"
// import { notifyError, notifySuccess } from "@/lib/utils"

// interface EmailSyncDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   account: any
// }

// const folders = [
//   { id: "inbox", name: "Inbox" },
//   { id: "sent", name: "Sent" },
//   { id: "drafts", name: "Drafts" },
//   { id: "spam", name: "Spam" },
// ] as const;

// const documentTypes = [
//   { id: "invoice", name: "Invoice" },
//   { id: "po", name: "Purchase Order" },
//   { id: "receipt", name: "Receipt" },
// ] as const;

// type FolderId = typeof folders[number]["id"];
// type DocTypeId = typeof documentTypes[number]["id"];

// type FormValues = {
//   autoSync: boolean;
//   syncInterval: number;
//   folders: Record<FolderId, boolean>;
//   documentTypes: Record<DocTypeId, boolean>;
// };


// export function EmailSyncDialog({
//   open,
//   onOpenChange,
//   account,
// }: EmailSyncDialogProps) {
//   const {
//     control,
//     handleSubmit,
//     reset,
//     register,
//     formState: { isSubmitting },
//     watch,
//   } = useForm<FormValues>({
//     defaultValues: {
//       autoSync: true,
//       syncInterval: 6,
//       folders: {
//         inbox: true,
//         sent: false,
//         drafts: false,
//         spam: false,
//       },
//       documentTypes: {
//         invoice: true,
//         po: true,
//         receipt: false,
//       },
//     },
//   })

//   // Reset on open/close
//   useEffect(() => {
//     if (!open) reset()
//   }, [open, reset])

//   const onSubmit = async (data: any) => {
//     const selectedFolders = Object.entries(data.folders)
//       .filter(([_, v]) => v)
//       .map(([k]) => k)

//     const selectedDocs = Object.entries(data.documentTypes)
//       .filter(([_, v]) => v)
//       .map(([k]) => k)

//     const finalPayload = {
//       email_id: account.email,
//       auto_sync: data.autoSync,
//       sync_interval: parseInt(data.syncInterval, 10),
//       email_folders: selectedFolders,
//       email_documents: selectedDocs,
//     }

//     console.log("Final sync payload:", finalPayload)

//     try{
//     await configureEmailSync(finalPayload)
//     notifySuccess("Sync configuration saved successfully!")
//     onOpenChange(false)
//     }
//     catch (error:any) {
//       notifyError({
//             message:
//               error?.message ||
//               "Please check your credentials and server settings",
//           });
//     }

//   }

//   if (!account) return null

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="
//         w-full 
//         max-w-[90vw] 
//         sm:max-w-2xl 
//         max-h-[90vh] 
//         overflow-y-auto 
//         scrollbar 
//         px-4 
//         py-6
//         mx-auto
//       ">
//         <DialogHeader>
//           <DialogTitle>Configure Sync - {account.provider}</DialogTitle>
//           <DialogDescription>{account.email}</DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
//           <div className="space-y-4">
//             <h3 className="text-lg font-medium">Sync Settings</h3>

//             <div className="flex items-center space-x-2">
//               <Controller
//                 control={control}
//                 name="autoSync"
//                 render={({ field }) => (
//                   <>
//                     <Switch id="sync-enabled" checked={field.value} onCheckedChange={field.onChange} />
//                     <Label htmlFor="sync-enabled">Enable automatic sync</Label>
//                   </>
//                 )}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Sync Interval</Label>
//               <Controller
//                 control={control}
//                 name="syncInterval"
//                 render={({ field }) => (
//                   <Select value={field.value.toString()} onValueChange={field.onChange}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="15">Every 15 minutes</SelectItem>
//                       <SelectItem value="30">Every 30 minutes</SelectItem>
//                       <SelectItem value="1">Every hour</SelectItem>
//                       <SelectItem value="6">Every 6 hours</SelectItem>
//                       <SelectItem value="12">Every 12 hours</SelectItem>
//                       <SelectItem value="24">Daily</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 )}
//               />
//             </div>
//           </div>

//           <div className="space-y-4">
//             <h3 className="text-lg font-medium">Email Folders</h3>
//             <div className="space-y-3">
//               {folders.map((folder) => (
//                 <div key={folder.id} className="flex items-center space-x-3">
//                   <input type="checkbox" className="hidden" {...register(`folders.${folder.id}`)} />
//                   <Controller
//                     control={control}
//                     name={`folders.${folder.id}`}
//                     render={({ field }) => (
//                       <>
//                         <Checkbox id={folder.id} checked={field.value} onCheckedChange={field.onChange} />
//                         <Label htmlFor={folder.id}>{folder.name}</Label>
//                       </>
//                     )}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="space-y-4">
//             <h3 className="text-lg font-medium">Document Types</h3>
//             <div className="space-y-3">
//               {documentTypes.map((docType) => (
//                 <div key={docType.id} className="flex items-center space-x-3">
//                   <input type="checkbox" className="hidden" {...register(`documentTypes.${docType.id}`)} />
//                   <Controller
//                     control={control}
//                     name={`documentTypes.${docType.id}`}
//                     render={({ field }) => (
//                       <>
//                         <Checkbox id={docType.id} checked={field.value} onCheckedChange={field.onChange} />
//                         <Label htmlFor={docType.id}>{docType.name}</Label>
//                       </>
//                     )}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex justify-end space-x-2">
//              { !isSubmitting &&
//                 <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
//                   Cancel
//                 </Button>
//              }
            
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? "Saving..." : "Save Configuration"}</Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }


import { useForm, Controller } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { useEffect } from "react"
import { configureEmailSync } from "@/services/email-connect/customEmail"
import { notifyError, notifySuccess } from "@/lib/utils"

interface EmailSyncDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account: any
}

const folders = [
  { id: "inbox", name: "Inbox" },
  { id: "sent", name: "Sent" },
  { id: "drafts", name: "Drafts" },
  { id: "spam", name: "Spam" },
] as const

const documentTypes = [
  { id: "invoice", name: "Invoice" },
  { id: "po", name: "Purchase Order" },
  { id: "receipt", name: "Receipt" },
] as const

type FolderId = typeof folders[number]["id"]
type DocTypeId = typeof documentTypes[number]["id"]

type FormValues = {
  autoSync: boolean
  syncInterval: number
  folders: Record<FolderId, boolean>
  documentTypes: Record<DocTypeId, boolean>
}

export function EmailSyncDialog({
  open,
  onOpenChange,
  account,
}: EmailSyncDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      autoSync: true,
      syncInterval: 6,
      folders: {
        inbox: true,
        sent: false,
        drafts: false,
        spam: false,
      },
      documentTypes: {
        invoice: true,
        po: true,
        receipt: false,
      },
    },
  })

  useEffect(() => {
    if (!open || !account) return

    const folderDefaults: Record<FolderId, boolean> = {
      inbox: false,
      sent: false,
      drafts: false,
      spam: false,
    }

    account.enabledFolders?.forEach((f: string) => {
      if (f in folderDefaults) folderDefaults[f as FolderId] = true
    })

    const docDefaults: Record<DocTypeId, boolean> = {
      invoice: false,
      po: false,
      receipt: false,
    }

    account.enabledDocuments?.forEach((d: string) => {
      if (d in docDefaults) docDefaults[d as DocTypeId] = true
    })

    reset({
      autoSync: account.autoSync ?? true,
      syncInterval: account.syncInterval ?? 6,
      folders: folderDefaults,
      documentTypes: docDefaults,
    })
  }, [open, account, reset])

  const onSubmit = async (data: FormValues) => {
    const selectedFolders = Object.entries(data.folders)
      .filter(([_, v]) => v)
      .map(([k]) => k)

    const selectedDocs = Object.entries(data.documentTypes)
      .filter(([_, v]) => v)
      .map(([k]) => k)

    const finalPayload = {
      email_id: account.email,
      auto_sync: data.autoSync,
      sync_interval: parseInt(data.syncInterval.toString(), 10),
      email_folders: selectedFolders,
      email_documents: selectedDocs,
    }

    try {
      await configureEmailSync(finalPayload)
      notifySuccess("Sync configuration saved successfully!")
      onOpenChange(false)
    } catch (error: any) {
      notifyError({
        message:
          error?.message ||
          "Please check your credentials and server settings",
      })
    }
  }

  if (!account) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full max-w-[90vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto scrollbar px-4 py-6 mx-auto"
      >
        <DialogHeader>
          <DialogTitle>Configure Sync - {account.provider}</DialogTitle>
          <DialogDescription>{account.email}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Sync Settings</h3>

            <div className="flex items-center space-x-2">
              <Controller
                control={control}
                name="autoSync"
                render={({ field }) => (
                  <>
                    <Switch
                      id="sync-enabled"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="sync-enabled">Enable automatic sync</Label>
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Sync Interval</Label>
              <Controller
                control={control}
                name="syncInterval"
                render={({ field }) => (
                  <Select
                    value={field.value.toString()}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">Every 15 minutes</SelectItem>
                      <SelectItem value="30">Every 30 minutes</SelectItem>
                      <SelectItem value="1">Every hour</SelectItem>
                      <SelectItem value="6">Every 6 hours</SelectItem>
                      <SelectItem value="12">Every 12 hours</SelectItem>
                      <SelectItem value="24">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Email Folders</h3>
            <div className="space-y-3">
              {folders.map((folder) => (
                <div key={folder.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="hidden"
                    {...register(`folders.${folder.id}`)}
                  />
                  <Controller
                    control={control}
                    name={`folders.${folder.id}`}
                    render={({ field }) => (
                      <>
                        <Checkbox
                          id={folder.id}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor={folder.id}>{folder.name}</Label>
                      </>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Document Types</h3>
            <div className="space-y-3">
              {documentTypes.map((docType) => (
                <div
                  key={docType.id}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    {...register(`documentTypes.${docType.id}`)}
                  />
                  <Controller
                    control={control}
                    name={`documentTypes.${docType.id}`}
                    render={({ field }) => (
                      <>
                        <Checkbox
                          id={docType.id}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor={docType.id}>{docType.name}</Label>
                      </>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            {!isSubmitting && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
