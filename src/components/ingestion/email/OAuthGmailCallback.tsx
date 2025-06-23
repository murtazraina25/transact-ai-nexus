import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const OAuthGmailCallback = () => {
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
 
     const gmailPayload= {
       provider: 'google',
       code: code!,
     };
 
    window.opener?.postMessage({ type: 'oauth-success' }, window.origin);
    window.close(); // Close popup
       
   }, []);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#101322] text-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-6"></div>
      <p className="text-lg text-gray-300">Authenticating with Google...</p>
    </div>
  );
};

export default OAuthGmailCallback;
