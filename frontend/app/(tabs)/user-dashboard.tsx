import React, { useEffect, useState } from 'react';
import { ScrollView, RefreshControl, Alert } from 'react-native';
import { router } from 'expo-router';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { useAuthStore } from '../../store/authStore';
import {
  Users,
  Bell,
  LogOut,
  User,
  Activity
} from 'lucide-react-native';

interface UserStats {
  teamMembers: number;
  notifications: number;
  activities: number;
}

export default function UserDashboard() {
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<UserStats>({
    teamMembers: 0,
    notifications: 0,
    activities: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check if user is not admin
  useEffect(() => {
    if (user?.role === 'admin') {
      router.replace('/(tabs)/admin-dashboard');
      return;
    }
    if (!user) {
      router.replace('/login');
      return;
    }
  }, [user]);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      // TODO: Implement API calls to get real data
      // For now, using mock data
      setStats({
        teamMembers: 12,
        notifications: 3,
        activities: 8
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đăng xuất', 
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = '#007AFF',
    subtitle 
  }: {
    title: string;
    value: number | string;
    icon: any;
    color?: string;
    subtitle?: string;
  }) => (
    <Card className="flex-1 p-4 bg-white border border-gray-200">
      <VStack space="sm">
        <HStack className="justify-between items-start">
          <VStack className="flex-1">
            <Text className="text-sm text-gray-600">{title}</Text>
            <Text className="text-2xl font-bold" style={{ color }}>
              {value}
            </Text>
            {subtitle && (
              <Text className="text-xs text-gray-500">{subtitle}</Text>
            )}
          </VStack>
          <Box className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
            <Icon size={24} color={color} />
          </Box>
        </HStack>
      </VStack>
    </Card>
  );

  const QuickActionCard = ({ 
    title, 
    description, 
    icon: Icon, 
    onPress,
    color = '#007AFF'
  }: {
    title: string;
    description: string;
    icon: any;
    onPress: () => void;
    color?: string;
  }) => (
    <Card className="p-4 bg-white border border-gray-200">
      <Button variant="ghost" onPress={onPress} className="p-0">
        <HStack space="md" className="items-center w-full">
          <Box className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
            <Icon size={20} color={color} />
          </Box>
          <VStack className="flex-1">
            <Text className="font-semibold text-left">{title}</Text>
            <Text className="text-sm text-gray-600 text-left">{description}</Text>
          </VStack>
        </HStack>
      </Button>
    </Card>
  );


  if (user?.role === 'admin' || !user) {
    return null;
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      <VStack space="lg" className="p-4">
        {/* Header */}
        <HStack className="justify-between items-center">
          <VStack>
            <Heading size="xl">Xin chào, {user?.fullname}</Heading>
            <Text className="text-gray-600">Chúc bạn một ngày làm việc hiệu quả!</Text>
          </VStack>
          <HStack space="sm">
            <Button variant="outline" size="sm" onPress={() => router.push('/(tabs)/profile')}>
              <User size={16} />
            </Button>
            <Button variant="outline" size="sm" onPress={handleLogout}>
              <LogOut size={16} />
            </Button>
          </HStack>
        </HStack>

        {/* Stats Overview */}
        <VStack space="md">
          <Heading size="lg">Thống kê cá nhân</Heading>
          
          <HStack space="sm">
            <StatCard
              title="Thành viên nhóm"
              value={stats.teamMembers}
              icon={Users}
              color="#007AFF"
              subtitle="Đồng nghiệp"
            />
            <StatCard
              title="Thông báo"
              value={stats.notifications}
              icon={Bell}
              color="#AF52DE"
              subtitle="Chưa đọc"
            />
            <StatCard
              title="Hoạt động"
              value={stats.activities}
              icon={Activity}
              color="#FF9500"
              subtitle="Hôm nay"
            />
          </HStack>
        </VStack>

        {/* Quick Actions */}
        <VStack space="md">
          <Heading size="lg">Thao tác nhanh</Heading>
          
          <VStack space="sm">
            <QuickActionCard
              title="Xem hồ sơ"
              description="Cập nhật thông tin cá nhân"
              icon={User}
              color="#007AFF"
              onPress={() => router.push('/(tabs)/profile')}
            />

            <QuickActionCard
              title="Cài đặt"
              description="Tùy chỉnh ứng dụng"
              icon={Bell}
              color="#AF52DE"
              onPress={() => router.push('/(tabs)/settings')}
            />
          </VStack>
        </VStack>


      </VStack>
    </ScrollView>
  );
}
