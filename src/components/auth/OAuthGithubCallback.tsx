// import { useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';

// const OAuthGithubCallback = () => {
//   const [searchParams] = useSearchParams();

//   useEffect(() => {
//   const code = searchParams.get('code');
//   const error = searchParams.get('error');
//   const description = searchParams.get('error_description');

//   if (error) {
//     console.error('OAuth Error:', error, description);
//     return;
//   }

//   const githubPayload = {
//     provider: 'github',
//     code: code,
//   }
//   console.log('GitHub OAuth Payload:', githubPayload);
// }, [searchParams]);


//   return (
//     <div>
//       <h2>Authenticating via Github...</h2>
//     </div>
//   );
// };

// export default OAuthGithubCallback;

import { oAuthSignIn } from '@/services/authentication/auth';
import { OAuthSignInData } from '@/types/models/auth';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const OAuthGithubCallback = () => {
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

    const githubPayload: OAuthSignInData = {
      provider: 'github',
      code: code!,
    };

    oAuthSignIn(githubPayload)
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
      <p className="text-lg text-gray-300">Authenticating with Github...</p>
    </div>
  );
};

export default OAuthGithubCallback;
