import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { StrictMode } from 'react';

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FoodList from "./pages/FoodList";
import FoodDetails from "./pages/FoodDetails";
import MyDonations from "./pages/MyDonations";
import NewDonation from "./pages/NewDonation";
import VolunteerTasks from "./pages/VolunteerTasks";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="h-12 w-12 rounded-full bg-primary-green/30"></div>
      <div className="h-4 w-24 rounded bg-primary-green/30"></div>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/food",
    element: <FoodList />,
  },
  {
    path: "/food/:id",
    element: <FoodDetails />,
  },
  {
    path: "/donations",
    element: <MyDonations />,
  },
  {
    path: "/donations/new",
    element: <NewDonation />,
  },
  {
    path: "/tasks",
    element: <VolunteerTasks />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <TooltipProvider>
                <div className="min-h-screen bg-background text-foreground">
                  <Toaster />
                  <Sonner />
                  <RouterProvider 
                    router={router}
                    fallbackElement={<LoadingSpinner />}
                  />
                </div>
              </TooltipProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;
