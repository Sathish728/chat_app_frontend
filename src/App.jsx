import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import HomePage from "./pages/HomePage";
import Signup from "./pages/SignupPage";
import Login from "./pages/LoginPage";
import Notifications from "./pages/NotificationsPage";
import Call from "./pages/CallPage";
import Chat from "./pages/ChatPage";
import Onboarding from "./pages/OnboardingPage";
import { ToastContainer } from 'react-toastify';
import { useEffect } from "react";
import { getCurrentUser } from "./slice/authSlice";
import Dashboard from "./pages/Dashboard";
import LoaderPage from "./components/LoaderPage";
import Layout from "./components/Layout";

const App = () => {
  const dispatch = useDispatch();
  const { user, globalLoading } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  // Wait until loading completes
  if (globalLoading) {
    return <LoaderPage />;
  }

  const isAuthenticated = Boolean(user);
  const isOnboarded = user?.isOnBoarded;

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              isOnboarded ? (
                <Layout showSidebar={true}>
                  <HomePage />
                </Layout>
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <Signup />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} replace />
            )
          }
        />

        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <Notifications />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} replace />
            )
          }
        />

        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Call />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} replace />
            )
          }
        />

        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <Chat />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} replace />
            )
          }
        />

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <Onboarding />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default App;
