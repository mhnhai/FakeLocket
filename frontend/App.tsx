import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import "@/global.css";

const queryClient = new QueryClient();

export default function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider>
        {/* App content will be handled by expo-router */}
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}