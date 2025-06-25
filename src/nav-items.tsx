
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import EmailConnector from "./pages/EmailConnector";
import Upload from "./pages/Upload";
import Database from "./pages/Database";
import Actions from "./pages/Actions";
import ClientRecommendations from "./pages/ClientRecommendations";
import FinancialAnalysis from "./pages/FinancialAnalysis";
import TaskAutomation from "./pages/TaskAutomation";
import ComplianceMonitoring from "./pages/ComplianceMonitoring";
import Settings from "./pages/Settings";
import Assistant from "./pages/Assistant";
import SapData from "./pages/SapData";
import NotFound from "./pages/NotFound";
import OAuthGoogleCallback from "./components/auth/OAuthGoogleCallback";
import OAuthGithubCallback from "./components/auth/OAuthGithubCallback";
import OAuthMicrosoftCallback from "./components/auth/OAuthMicrosoftCallback";
import LoginForm from "./components/auth/LoginForm";
import Login from "./components/auth/Login";
import OAuthGmailCallback from "./components/ingestion/email/OAuthGmailCallback";

export const navItems = [
  {
    to: "/",
    page: <Login />,
    // <LoginForm />,
    auth: false
  },
  {
    to: "/dashboard",
    page: <Dashboard />,
    auth: true,
    roles: ['user']
  },
  {
    to: "/documents", 
    page: <Documents />,
    auth: true,
    roles: ['user']
  },
  {
    to: "/email-connector",
    page: <EmailConnector />,
    auth: true,
    roles: ['user']
  },
  {
    to: "/upload",
    page: <Upload />,
    auth: true,
    roles: ['user']
  },
  {
    to: "/database",
    page: <Database />,
    auth: true,
    roles: ['user']
  },
  {
    to: "/actions",
    page: <Actions />,
    auth: true,
    roles: ['user']
  },
  {
    to: "/client-recommendations",
    page: <ClientRecommendations />,
    auth: true,
    roles: ['user']
  },
  {
    to: "/financial-analysis", 
    page: <FinancialAnalysis />,
    auth: true,
    roles: ['user']
  },
  {
    to: "/task-automation",
    page: <TaskAutomation />,
    auth: true,
    roles: ['user']
  },
  {
    to: "/compliance-monitoring",
    page: <ComplianceMonitoring />,
    auth: true,
    roles: ['user']
  },
  {
    to: "/settings",
    page: <Settings />,
    auth: true,
    roles: ['user']
  },
  {
    to: "/assistant",
    page: <Assistant />,
    auth: true,
    roles: ['user']
  },
  {
    to: "/sap-data",
    page: <SapData />,
    auth: true,
    roles: ['user']
  },
{
    to: "/oauth/google/callback",
    page: <OAuthGoogleCallback />,
    auth: false
  },
  // {
  //   to: "/oauth/github/callback",
  //   page: <OAuthGithubCallback/>,
  //   auth: false
  // },
  {
    to: "/oauth/microsoft/callback",
    page: <OAuthMicrosoftCallback />,
    auth: false
  },
  {
    to: "/oauth/gmail/callback",
    page: <OAuthGmailCallback/>,
    auth: true
  },
  {
    to: "*",
    page: <NotFound />,
  },
];
