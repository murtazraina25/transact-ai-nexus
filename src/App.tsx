
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useNavigate } from "react-router-dom";
import { navItems } from "./nav-items";
// import GoogleAuthCallback from "./components/auth/GoogleAuthCallback";
// import OAuthCallback from "./components/auth/OAuthGoogleCallback";
import { globalRouter } from "./lib/utils";
import OAuthGoogleCallback from "./components/auth/OAuthGoogleCallback";
import OAuthGithubCallback from "./components/auth/OAuthGithubCallback";
import OAuthMicrosoftCallback from "./components/auth/OAuthMicrosoftCallback";
import AuthGuard from "./guards/AuthGuard";
import RoleGuard from "./guards/RoleGuard";
// import OAuthCallback from "./components/oauth/OAuthCallback";

const queryClient = new QueryClient();


const App = () => {
  const navigate = useNavigate();
  globalRouter.navigate = navigate;
  
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
        <Routes>
          {/* {navItems.map(({ to, page }) => (
            <Route key={to} path={to} element={page} />
          ))} */}

          {navItems.map(({ to, page, auth, roles }) => {
            let wrapped = page;
            wrapped = <AuthGuard authenticate={auth}>{wrapped}</AuthGuard>;
            if (roles) {
              wrapped = <RoleGuard allowedUserRoles={roles}>{wrapped}</RoleGuard>;
            }
            return <Route key={to} path={to} element={wrapped} />;
          })}
          
          {/* OAuth callback routes */}
          {/* <Route path="/oauth/callback" element={<OAuthCallback />} /> */}
          {/* <Route path="/auth/google/callback" element={<GoogleAuthCallback />} /> */}
          {/* <Route path="/oauth/google/callback" element={<OAuthGoogleCallback />} />
          <Route path="/oauth/github/callback" element={<OAuthGithubCallback />} />
          <Route path="/oauth/microsoft/callback" element={<OAuthMicrosoftCallback />} /> */}
        </Routes>
    </TooltipProvider>
  </QueryClientProvider>
)};

export default App;
