import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const OAuthGithubCallback = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const description = searchParams.get('error_description');

  if (error) {
    console.error('OAuth Error:', error, description);
    return;
  }

  const githubPayload = {
    provider: 'github',
    code: code,
  }
  console.log('GitHub OAuth Payload:', githubPayload);
}, [searchParams]);


  return (
    <div>
      <h2>Authenticating via Github...</h2>
    </div>
  );
};

export default OAuthGithubCallback;
