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
  // user_id: string;
  email: string;
  password: string;
  imap: ImapSettings;
  smtp: SmtpSettings;
}

export interface SyncSettingsPayload {
  email_id: string;
  auto_sync: boolean;
  email_folders: string[];
  email_documents: string[];
  sync_interval: number;
}
