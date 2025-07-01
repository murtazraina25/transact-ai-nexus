import { connectOAuthEmail } from "@/services/email-connect/oauthEmail";
import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const OAuthOutlookCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const hasHandled = useRef(false);

useEffect(() => {
  if (hasHandled.current) return;
  hasHandled.current = true;

  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const description = searchParams.get("error_description");

  if (error) {
    window.opener?.postMessage(
      { type: "oauth-error", error: description },
      window.origin
    );
    window.close();
    return;
  }

  const outlookPayload = {
    provider: "outlook",
    code: code!,
  };

  connectOAuthEmail(outlookPayload)
    .then(() => {
      window.opener?.postMessage({ type: "oauth-success" }, window.origin);
      window.close();
    })
    .catch((err) => {
      window.opener?.postMessage(
        { type: "oauth-error", error: err?.message?.message },
        window.origin
      );
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

export default OAuthOutlookCallback;
