import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import { Routes, Route, Navigate } from "react-router-dom"
import { Loader } from "lucide-react"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from "./store/useThemeStore"

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()
  const { theme } = useThemeStore()

  // useffect to check if the user is authenticated when the app loads
  useEffect(() => {
    checkAuth()
  }, [checkAuth]);

  console.log("authUser", authUser)

  // If the app is checking the authentication status, show a loading spinner
  if (isCheckingAuth && !authUser) {
    return <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  }
  return (
    <div data-theme={theme}>

      <Navbar />
      <Routes>
        {/* If the user is authenticated, show the HomePage, otherwise redirect to the login page */}
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster></Toaster>

    </div>
  );
};

export default App