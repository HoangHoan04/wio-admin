import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import LoadingScreen from "./components/common/LoadingScreen";
import ToastContainer from "./components/common/ToastContainer";
import AppRoutes from "./routes/index";
import { useAuthStore } from "./store/authStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

function AuthSessionListener() {
  useEffect(() => {
    const onExpired = () => {
      useAuthStore.getState().clearSession();
      queryClient.cancelQueries();
      queryClient.clear();
    };
    const onRefreshed = (event: Event) => {
      const detail = (event as CustomEvent<{
        accessToken?: string;
        refreshToken?: string;
      }>).detail;
      if (!detail?.accessToken) return;
      useAuthStore.setState({
        accessToken: detail.accessToken,
        refreshToken:
          detail.refreshToken ?? useAuthStore.getState().refreshToken,
      });
    };

    window.addEventListener("unauthorized-event", onExpired);
    window.addEventListener("token-refreshed", onRefreshed);
    return () => {
      window.removeEventListener("unauthorized-event", onExpired);
      window.removeEventListener("token-refreshed", onRefreshed);
    };
  }, []);

  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthSessionListener />
        <AppRoutes />
        <ToastContainer />
        <LoadingScreen />
      </Router>
    </QueryClientProvider>
  );
}
