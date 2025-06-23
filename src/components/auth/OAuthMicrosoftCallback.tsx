// import { useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';

// const OAuthMicrosoftCallback = () => {
//   const [searchParams] = useSearchParams();

//   useEffect(() => {
//   const code = searchParams.get('code');
//   const error = searchParams.get('error');
//   const description = searchParams.get('error_description');

//   if (error) {
//     console.error('OAuth Error:', error, description);
//     return;
//   }
//   const codeVerifier = localStorage.getItem('pkce_code_verifier');

//   const microsoftPayload = {
//     provider: 'microsoft',
//     codeVerifier: codeVerifier,
//     code: code,
//   }

//   console.log('Microsoft OAuth Payload:', microsoftPayload);
// }, [searchParams]);


//   return (
//     <div>
//       <h2>Authenticating via Microsoft...</h2>
//     </div>
//   );
// };

// export default OAuthMicrosoftCallback;


import { oAuthSignIn } from '@/services/authentication/auth';
import { OAuthSignInData } from '@/types/models/auth';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const OAuthMicrosoftCallback = () => {
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const description = searchParams.get('error_description');

    if (error) {
      window.opener?.postMessage({ type: 'oauth-error', error: description }, window.origin);
      window.close();
      return;
    }

    const microsoftPayload: OAuthSignInData = {
      provider: 'microsoft',
      code: code!,
    };

    oAuthSignIn(microsoftPayload)
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
      <p className="text-lg text-gray-300">Authenticating with Microsoft...</p>
    </div>
  );
};

export default OAuthMicrosoftCallback;