import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoadingScreen from "./components/common/LoadingScreen";
import ToastContainer from "./components/common/ToastContainer";
import AppRoutes from "./routes/index";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
        <ToastContainer />
        <LoadingScreen />
      </Router>
    </QueryClientProvider>
  );
}
