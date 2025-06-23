import { GOOGLE_CLIENT_ID, MICROSOFT_CLIENT_ID } from "@/environments/environments"
import { generatePKCECodes } from "@/utils/pkce"

export interface OAuthProvider {
  name: string
  clientId: string
  authUrl: string
  scope: string
  redirectUri: string
}

const getRedirectUri = (provider: string) => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/oauth/${provider}/callback`
  }
  return `http://localhost:8080/oauth/${provider}/callback`
}

export const oauthProviders: Record<string, OAuthProvider> = {
  gmail: {
    name: "GMAIL",
    clientId: GOOGLE_CLIENT_ID,
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scope: "https://www.googleapis.com/auth/gmail.readonly",
    redirectUri: getRedirectUri("gmail"),
  },
  outlook: {
    name: "OUTLOOK",
    clientId: MICROSOFT_CLIENT_ID,
    authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    scope: "https://graph.microsoft.com/Mail.Read",
    redirectUri: getRedirectUri("outlook"),
  }
}

export async function generateOAuthUrl(provider: string): Promise<string> {
  const config = oauthProviders[provider]
  if (!config) {
    throw new Error(`Unknown OAuth provider: ${provider}`)
  }

   let url = `${config.authUrl}?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&response_type=code&scope=${config.scope}`;

    if (provider === 'microsoft') {
      const { codeVerifier, codeChallenge } = await generatePKCECodes();
      localStorage.setItem('pkce_code_verifier', codeVerifier);

      url += `&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    }

    return url;
}

function generateState(provider: string): string {
  const state = {
    provider,
    timestamp: Date.now(),
    random: Math.random().toString(36).substring(2),
  }
  return btoa(JSON.stringify(state))
}

export function parseState(state: string): { provider: string; timestamp: number; random: string } | null {
  try {
    return JSON.parse(atob(state))
  } catch {
    return null
  }
}
