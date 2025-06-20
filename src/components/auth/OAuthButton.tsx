import { FaGithub, FaGoogle, FaMicrosoft  } from 'react-icons/fa';
import { GITHUB_CLIENT_ID, GOOGLE_CLIENT_ID, MICROSOFT_CLIENT_ID } from "@/environments/environments";
import { generatePKCECodes } from "@/utils/pkce";

const OAuthButton = ({ provider }: { provider: 'google' | 'github' | 'microsoft' }) => {
  const getOAuthUrl = async () => {
    const base = {
      google: 'https://accounts.google.com/o/oauth2/v2/auth',
      github: 'https://github.com/login/oauth/authorize',
      microsoft: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    };

    const clientId = {
      google: GOOGLE_CLIENT_ID,
      github: GITHUB_CLIENT_ID,
      microsoft: MICROSOFT_CLIENT_ID,
    };

    const redirectUri = encodeURIComponent(`${window.location.origin}/oauth/${provider}/callback`);

    const scopes = {
      google: 'openid email profile',
      github: 'read:user user:email',
      microsoft: 'openid profile offline_access Files.ReadWrite',
    };

    let url = `${base[provider]}?client_id=${clientId[provider]}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent(scopes[provider])}`;

    if (provider === 'microsoft') {
      const { codeVerifier, codeChallenge } = await generatePKCECodes();
      localStorage.setItem('pkce_code_verifier', codeVerifier);

      url += `&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    }

    return url;
  };

  const handleClick = async () => {
    const url = await getOAuthUrl();
    window.location.href = url;
  };

  const icons = {
    google: <FaGoogle />,
    github: <FaGithub />,
    microsoft: <FaMicrosoft />,
  };

  const label = {
    google: 'Google',
    github: 'GitHub',
    microsoft: 'Microsoft',
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-md text-white bg-[#1c2136] hover:bg-[#2a3149] transition-all text-sm"
    >
      {icons[provider]}
      <span className="hidden sm:inline">{label[provider]}</span>
    </button>
  );
};

export default OAuthButton;