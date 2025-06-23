import { notifySuccess, notifyError } from '@/lib/utils';
import { oAuthSignIn } from '@/services/authentication/auth';
import { OAuthSignInData } from '@/types/models/auth';
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const OAuthGoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const description = searchParams.get('error_description');

    if (error) {
      window.opener?.postMessage({ type: 'oauth-error', error: description }, window.origin);
      window.close();
      return;
    }

    const googlePayload: OAuthSignInData = {
      provider: 'google',
      code: code!,
    };

    oAuthSignIn(googlePayload)
      .then(() => {
        window.opener?.postMessage({ type: 'oauth-success' }, window.origin);
        window.close(); // Close popup
      })
      .catch((err) => {
        window.opener?.postMessage({ type: 'oauth-error', error: err.message }, window.origin);
        window.close();
      });
  }, []);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#101322] text-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-6"></div>
      <p className="text-lg text-gray-300">Authenticating with Google...</p>
    </div>
  );
};

export default OAuthGoogleCallback;
