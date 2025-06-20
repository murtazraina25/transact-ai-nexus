import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const OAuthMicrosoftCallback = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const description = searchParams.get('error_description');

  if (error) {
    console.error('OAuth Error:', error, description);
    return;
  }
  const codeVerifier = localStorage.getItem('pkce_code_verifier');

  const microsoftPayload = {
    provider: 'microsoft',
    codeVerifier: codeVerifier,
    code: code,
  }

  console.log('Microsoft OAuth Payload:', microsoftPayload);
}, [searchParams]);


  return (
    <div>
      <h2>Authenticating via Microsoft...</h2>
    </div>
  );
};

export default OAuthMicrosoftCallback;
