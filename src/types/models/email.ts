export interface ImapSettings {
  host: string;
  port: number;
  use_ssl: boolean;
}

export interface SmtpSettings {
  host: string;
  port: number;
  use_ssl: boolean;
}

export interface CustomEmailPayload {
  email: string;
  password: string;
  imap: ImapSettings;
  smtp: SmtpSettings;
}

export interface SyncSettingsPayload {
  email: string;
  auto_sync: boolean;
  email_folders: string[];
  email_documents: string[];
  sync_interval: number;
}

export interface OAuthEmailPayload {
  provider: string;
  code: string;
  code_verifier?: string;
}

export interface EmailRecord {
  email_uid: string;
  file_name: string;
  file_path: string;
  sender_id_name: string;
  received_date_time: string;
  subject: string;
  doc_type: string;
}

export interface EmailAccount {
  id: string
  provider: string
  email: string
  email_id:string
  status: "connected" | "error" | "syncing"
  lastSync?: Date
  syncInterval: number
  enabledFolders: string[]
  enabledDocuments: string[]
  autoSync: boolean
  records: EmailRecord[];
}