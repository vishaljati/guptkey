import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AuthLayout from "./components/layout/Authlayout";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthLayout authentication={false}>
              <Landing />
            </AuthLayout>
          }
        />

        <Route
          path="/signup"
          element={
            <AuthLayout authentication={false}>
              <SignupPage />
            </AuthLayout>
          }
        />

        <Route
          path="/login"
          element={
            <AuthLayout authentication={false}>
              <LoginPage />
            </AuthLayout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <AuthLayout authentication={true}>
              <Dashboard />
            </AuthLayout>
          }
        />

        <Route
          path="/dashboard/*"
          element={
            <AuthLayout authentication={true}>
              <Dashboard />
            </AuthLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <AuthLayout authentication={true}>
              <SettingsPage />
            </AuthLayout>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
