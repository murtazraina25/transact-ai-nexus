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
