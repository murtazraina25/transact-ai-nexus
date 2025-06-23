// import type React from "react"

// import { useForm } from "react-hook-form"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { useToast } from "@/hooks/use-toast"

// interface ImapFormData {
//   email: string
//   password: string
//   server: string
//   port: number
//   ssl: boolean
// }

// interface ImapFormProps {
//   onSubmit: (data: ImapFormData) => void
//   onCancel: () => void
// }

// export function ImapForm({ onSubmit, onCancel }: ImapFormProps) {
//   const { toast } = useToast()
//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors, isSubmitting },
//   } = useForm<ImapFormData>({
//     defaultValues: {
//       port: 993,
//       ssl: true,
//     },
//   })

//   const email = watch("email")

//   const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const emailValue = e.target.value
//     setValue("email", emailValue)

//     if (emailValue.includes("@gmail.com")) {
//       setValue("server", "imap.gmail.com")
//       setValue("port", 993)
//       setValue("ssl", true)
//     } else if (emailValue.includes("@outlook.com") || emailValue.includes("@hotmail.com")) {
//       setValue("server", "outlook.office365.com")
//       setValue("port", 993)
//       setValue("ssl", true)
//     } else if (emailValue.includes("@yahoo.com")) {
//       setValue("server", "imap.mail.yahoo.com")
//       setValue("port", 993)
//       setValue("ssl", true)
//     }
//   }

//   const handleFormSubmit = async (data: ImapFormData) => {
//     try {
//       // Simulate connection test
//       await new Promise((resolve) => setTimeout(resolve, 1500))

//       toast({
//         title: "Connection Successful",
//         description: `Successfully connected to ${data.email}`,
//       })

//       onSubmit(data)
//     } catch (error) {
//       toast({
//         title: "Connection Failed",
//         description: "Please check your credentials and try again",
//         variant: "destructive",
//       })
//     }
//   }

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader>
//         <CardTitle>Configure IMAP Connection</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="email">Email Address</Label>
//             <Input
//               id="email"
//               type="email"
//               {...register("email", {
//                 required: "Email is required",
//                 pattern: {
//                   value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                   message: "Invalid email address",
//                 },
//               })}
//               onChange={handleEmailChange}
//               placeholder="your.email@example.com"
//             />
//             {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
//           </div>

//           {email &&
//             (email.includes("@gmail.com") || email.includes("@outlook.com") || email.includes("@yahoo.com")) && (
//               <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
//                 💡 Tip: For{" "}
//                 {email.includes("@gmail.com") ? "Gmail" : email.includes("@outlook.com") ? "Outlook" : "Yahoo"}, we
//                 recommend using the OAuth connection method for better security.
//               </div>
//             )}

//           <div className="space-y-2">
//             <Label htmlFor="password">Password / App Password</Label>
//             <Input
//               id="password"
//               type="password"
//               {...register("password", { required: "Password is required" })}
//               placeholder="Your email password"
//             />
//             {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="server">IMAP Server</Label>
//             <Input
//               id="server"
//               {...register("server", { required: "IMAP server is required" })}
//               placeholder="imap.example.com"
//             />
//             {errors.server && <p className="text-sm text-red-600">{errors.server.message}</p>}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="port">Port</Label>
//             <Input
//               id="port"
//               type="number"
//               {...register("port", {
//                 required: "Port is required",
//                 min: { value: 1, message: "Port must be greater than 0" },
//                 max: { value: 65535, message: "Port must be less than 65536" },
//               })}
//               placeholder="993"
//             />
//             {errors.port && <p className="text-sm text-red-600">{errors.port.message}</p>}
//           </div>

//           <div className="flex items-center space-x-2">
//             <Switch id="ssl" {...register("ssl")} />
//             <Label htmlFor="ssl">Use SSL/TLS</Label>
//           </div>

//           <div className="flex space-x-2 pt-4">
//             <Button type="submit" disabled={isSubmitting} className="flex-1">
//               {isSubmitting ? "Testing Connection..." : "Connect"}
//             </Button>
//             <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }


"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

interface ImapFormData {
  email: string
  password: string
  imap: {
    host: string
    port: number
    use_ssl: boolean
  }
  smtp: {
    host: string
    port: number
    use_ssl: boolean
  }
}

interface ImapFormProps {
  onSubmit: (data: ImapFormData) => void
  onCancel: () => void
}

export function ImapForm({ onSubmit, onCancel }: ImapFormProps) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ImapFormData>({
    defaultValues: {
      imap: {
        port: 993,
        use_ssl: true,
      },
      smtp: {
        port: 465,
        use_ssl: true,
      },
    },
  })

  const email = watch("email")

  // Auto-populate server settings based on common providers
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value
    setValue("email", emailValue)

    if (emailValue.includes("@gmail.com")) {
      setValue("imap.host", "imap.gmail.com")
      setValue("imap.port", 993)
      setValue("imap.use_ssl", true)
      setValue("smtp.host", "smtp.gmail.com")
      setValue("smtp.port", 465)
      setValue("smtp.use_ssl", true)
    } else if (emailValue.includes("@outlook.com") || emailValue.includes("@hotmail.com")) {
      setValue("imap.host", "outlook.office365.com")
      setValue("imap.port", 993)
      setValue("imap.use_ssl", true)
      setValue("smtp.host", "smtp.office365.com")
      setValue("smtp.port", 587)
      setValue("smtp.use_ssl", true)
    } else if (emailValue.includes("@yahoo.com")) {
      setValue("imap.host", "imap.mail.yahoo.com")
      setValue("imap.port", 993)
      setValue("imap.use_ssl", true)
      setValue("smtp.host", "smtp.mail.yahoo.com")
      setValue("smtp.port", 465)
      setValue("smtp.use_ssl", true)
    }
  }

  const handleFormSubmit = async (data: ImapFormData) => {
    try {
      // Simulate connection test for both IMAP and SMTP
      toast({
        title: "Testing Connections...",
        description: "Testing both IMAP and SMTP connections",
      })

      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Connection Successful",
        description: `Successfully connected to ${data.email} (IMAP + SMTP)`,
      })

      onSubmit(data)
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please check your credentials and server settings",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Configure Email Connection</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Account Credentials */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Account Credentials</h3>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                onChange={handleEmailChange}
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password / App Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", { required: "Password is required" })}
                placeholder="Your email password"
              />
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            {email &&
              (email.includes("@gmail.com") || email.includes("@outlook.com") || email.includes("@yahoo.com")) && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
                  💡 Tip: For{" "}
                  {email.includes("@gmail.com") ? "Gmail" : email.includes("@outlook.com") ? "Outlook" : "Yahoo"}, we
                  recommend using the OAuth connection method for better security.
                </div>
              )}
          </div>

          <Separator />

          {/* IMAP Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">IMAP Settings (Incoming Mail)</h3>

            <div className="space-y-2">
              <Label htmlFor="imap-host">IMAP Server</Label>
              <Input
                id="imap-host"
                {...register("imap.host", { required: "IMAP server is required" })}
                placeholder="imap.example.com"
              />
              {errors.imap?.host && <p className="text-sm text-red-600">{errors.imap.host.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imap-port">Port</Label>
                <Input
                  id="imap-port"
                  type="number"
                  {...register("imap.port", {
                    required: "Port is required",
                    min: { value: 1, message: "Port must be greater than 0" },
                    max: { value: 65535, message: "Port must be less than 65536" },
                  })}
                  placeholder="993"
                />
                {errors.imap?.port && <p className="text-sm text-red-600">{errors.imap.port.message}</p>}
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Switch id="imap-ssl" {...register("imap.use_ssl")} />
                <Label htmlFor="imap-ssl">Use SSL/TLS</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* SMTP Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">SMTP Settings (Outgoing Mail)</h3>

            <div className="space-y-2">
              <Label htmlFor="smtp-host">SMTP Server</Label>
              <Input
                id="smtp-host"
                {...register("smtp.host", { required: "SMTP server is required" })}
                placeholder="smtp.example.com"
              />
              {errors.smtp?.host && <p className="text-sm text-red-600">{errors.smtp.host.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-port">Port</Label>
                <Input
                  id="smtp-port"
                  type="number"
                  {...register("smtp.port", {
                    required: "Port is required",
                    min: { value: 1, message: "Port must be greater than 0" },
                    max: { value: 65535, message: "Port must be less than 65536" },
                  })}
                  placeholder="465"
                />
                {errors.smtp?.port && <p className="text-sm text-red-600">{errors.smtp.port.message}</p>}
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Switch id="smtp-ssl" {...register("smtp.use_ssl")} />
                <Label htmlFor="smtp-ssl">Use SSL/TLS</Label>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border rounded-md p-3 text-sm text-gray-600">
            <strong>Common Ports:</strong>
            <br />• IMAP: 993 (SSL), 143 (non-SSL)
            <br />• SMTP: 465 (SSL), 587 (TLS), 25 (non-SSL)
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Testing Connections..." : "Connect Email"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
