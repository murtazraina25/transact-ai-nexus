import type React from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { connectCustomEmail } from "@/services/email-connect/customEmail"
import { notifyError, notifySuccess } from "@/lib/utils"
import { REGEX_PATTERNS } from "@/helpers/constants/regexPatterns"
import { AuthState } from "@/types/models/auth"
import { RootState, useAppSelector } from "@/state-management/store"

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
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ImapFormData>({
    defaultValues: {
      imap: { port: 993, use_ssl: true },
      smtp: { port: 465, use_ssl: true },
    },
  })

  const userDetails: AuthState = useAppSelector((state: RootState) => state.auth);

  const email = watch("email")

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
    }
  }

  const handleFormSubmit = async (data: ImapFormData) => {
  try {
    notifySuccess("Adding connections...");

    const response = await connectCustomEmail({
      email: data.email,
      password: data.password,
      imap: data.imap,
      smtp: data.smtp,
    });

    notifySuccess(`Successfully connected to ${data.email} (IMAP + SMTP)`);
    onSubmit(data);
  } catch (error: any) {
    notifyError({
      message:
        error?.message ||
        "Please check your credentials and server settings",
    });
  }
};

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Configure Email Connection</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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
                    value: REGEX_PATTERNS.EMAIL,
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
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {email &&
              (email.includes("@gmail.com") || email.includes("@outlook.com")) && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
                  💡 Tip: For{" "}
                  {email.includes("@gmail.com") ? "Gmail" : "Outlook"}, use OAuth for better security.
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
              {errors.imap?.host && (
                <p className="text-sm text-red-600">{errors.imap.host.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imap-port">Port</Label>
                <Input
                  id="imap-port"
                  type="number"
                  {...register("imap.port", {
                    required: "Port is required",
                    min: { value: 1, message: "Port must be > 0" },
                    max: { value: 65535, message: "Port must be < 65536" },
                  })}
                  placeholder="993"
                />
                {errors.imap?.port && (
                  <p className="text-sm text-red-600">{errors.imap.port.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="imap-ssl"
                  checked={getValues("imap.use_ssl")}
                  onCheckedChange={(val) => setValue("imap.use_ssl", val)}
                />
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
              {errors.smtp?.host && (
                <p className="text-sm text-red-600">{errors.smtp.host.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-port">Port</Label>
                <Input
                  id="smtp-port"
                  type="number"
                  {...register("smtp.port", {
                    required: "Port is required",
                    min: { value: 1, message: "Port must be > 0" },
                    max: { value: 65535, message: "Port must be < 65536" },
                  })}
                  placeholder="465"
                />
                {errors.smtp?.port && (
                  <p className="text-sm text-red-600">{errors.smtp.port.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="smtp-ssl"
                  checked={getValues("smtp.use_ssl")}
                  onCheckedChange={(val) => setValue("smtp.use_ssl", val)}
                />
                <Label htmlFor="smtp-ssl">Use SSL/TLS</Label>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border rounded-md p-3 text-sm text-gray-600">
            <strong>Common Ports:</strong><br />
            • IMAP: 993 (SSL), 143 (non-SSL)<br />
            • SMTP: 465 (SSL), 587 (TLS), 25 (non-SSL)
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Testing..." : "Connect Email"}
            </Button>
            { !isSubmitting &&
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            }
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
