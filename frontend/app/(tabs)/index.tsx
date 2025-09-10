import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { VStack } from '@/components/ui/vstack';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { useAuthStore } from '../../store/authStore';

export default function TabsIndex() {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.replace('/login');
        return;
      }

      // Route based on user role
      if (user.role === 'admin') {
        router.replace('/(tabs)/admin-dashboard');
      } else {
        router.replace('/(tabs)/user-dashboard');
      }
    }
  }, [user, isAuthenticated, isLoading]);

  return (
    <Box className="flex-1 justify-center items-center bg-white">
      <VStack space="md" className="items-center">
        <Spinner size="large" />
        <Text>Đang điều hướng...</Text>
      </VStack>
    </Box>
  );
}
