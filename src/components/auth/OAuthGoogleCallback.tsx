import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const OAuthGoogleCallback = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const description = searchParams.get('error_description');

  if (error) {
    console.error('OAuth Error:', error, description);
    return;
  }

  const googlePayload = {
    provider: 'google',
    code: code,
  }
  console.log('Google OAuth Payload:', googlePayload);
}, [searchParams]);


  return (
    <div>
      <h2>Authenticating via Google...</h2>
    </div>
  );
};

export default OAuthGoogleCallback;
