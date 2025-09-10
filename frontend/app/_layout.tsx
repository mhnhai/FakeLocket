import { Stack, router } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import "@/global.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { checkAuth, isAuthenticated, isLoading, user } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      setIsInitialized(true);
    };
    
    initializeAuth();
  }, []);

  useEffect(() => {
    if (isInitialized && !isLoading) {
      // Only navigate after the router is mounted and auth check is complete
      if (isAuthenticated && user) {
        // Route based on user role
        if (user.role === 'admin') {
          router.replace('/(tabs)/admin-dashboard' as any);
        } else {
          router.replace('/(tabs)/user-dashboard' as any);
        }
      } else if (!isAuthenticated) {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, isInitialized, user]);

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="login" 
            options={{ 
              headerShown: false,
              presentation: 'modal'
            }} 
          />
          <Stack.Screen 
            name="register" 
            options={{ 
              headerShown: false,
              presentation: 'modal'
            }} 
          />
        </Stack>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}