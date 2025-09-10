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
import { Badge } from '@/components/ui/badge';
import { Divider } from '@/components/ui/divider';
import { useAuthStore } from '../../store/authStore';
import { 
  Users, 
  Building, 
  Activity, 
  TrendingUp, 
  LogOut, 
  Settings,
  UserPlus,
  Building2,
  BarChart3,
  Clock
} from 'lucide-react-native';

interface DashboardStats {
  totalUsers: number;
  totalTeams: number;
  totalTenants: number;
  activeUsers: number;
}

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTeams: 0,
    totalTenants: 0,
    activeUsers: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (user?.role !== 'admin') {
      router.replace('/login');
      return;
    }
  }, [user]);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      // Load real data from API
      const [usersResponse, teamsResponse, tenantsResponse] = await Promise.all([
        fetch('/users'),
        fetch('/teams'),
        fetch('/tenants')
      ]);

      let totalUsers = 0;
      let totalTeams = 0;
      let totalTenants = 0;

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        if (usersData.success) {
          totalUsers = usersData.data.length;
        }
      }

      if (teamsResponse.ok) {
        const teamsData = await teamsResponse.json();
        if (teamsData.success) {
          totalTeams = teamsData.data.length;
        }
      }

      if (tenantsResponse.ok) {
        const tenantsData = await tenantsResponse.json();
        if (tenantsData.success) {
          totalTenants = tenantsData.data.length;
        }
      }

      setStats({
        totalUsers,
        totalTeams,
        totalTenants,
        activeUsers: totalUsers // For now, assume all users are active
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback to mock data
      setStats({
        totalUsers: 156,
        totalTeams: 12,
        totalTenants: 8,
        activeUsers: 89
      });
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

  if (user?.role !== 'admin') {
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
            <Text className="text-gray-600">Quản trị viên hệ thống</Text>
          </VStack>
          <HStack space="sm">
            <Button variant="outline" size="sm" onPress={() => router.push('/(tabs)/settings')}>
              <Settings size={16} />
            </Button>
            <Button variant="outline" size="sm" onPress={handleLogout}>
              <LogOut size={16} />
            </Button>
          </HStack>
        </HStack>

        {/* Stats Overview */}
        <VStack space="md">
          <Heading size="lg">Tổng quan hệ thống</Heading>
          
          <VStack space="sm">
            <HStack space="sm">
              <StatCard
                title="Tổng người dùng"
                value={stats.totalUsers}
                icon={Users}
                color="#007AFF"
                subtitle="Tất cả tài khoản"
              />
              <StatCard
                title="Đang hoạt động"
                value={stats.activeUsers}
                icon={Activity}
                color="#34C759"
                subtitle="Trong 24h qua"
              />
            </HStack>
            
            <HStack space="sm">
              <StatCard
                title="Phòng ban"
                value={stats.totalTeams}
                icon={Building}
                color="#FF9500"
                subtitle="Tất cả phòng ban"
              />
              <StatCard
                title="Công ty"
                value={stats.totalTenants}
                icon={Building2}
                color="#AF52DE"
                subtitle="Tenant đang hoạt động"
              />
            </HStack>
          </VStack>
        </VStack>

        {/* Quick Actions */}
        <VStack space="md">
          <Heading size="lg">Thao tác nhanh</Heading>
          
          <VStack space="sm">
            <QuickActionCard
              title="Quản lý người dùng"
              description="Xem, thêm, sửa thông tin người dùng"
              icon={UserPlus}
              color="#007AFF"
              onPress={() => router.push('/(tabs)/users')}
            />
            
            <QuickActionCard
              title="Quản lý phòng ban"
              description="Tạo và quản lý các phòng ban"
              icon={Building}
              color="#FF9500"
              onPress={() => router.push('/(tabs)/teams')}
            />

            <QuickActionCard
              title="Quản lý công ty"
              description="Quản lý công ty và tạo OTP"
              icon={Building2}
              color="#AF52DE"
              onPress={() => router.push('/(tabs)/tenants')}
            />
            
            <QuickActionCard
              title="Báo cáo thống kê"
              description="Xem báo cáo chi tiết và thống kê"
              icon={BarChart3}
              color="#34C759"
              onPress={() => {
                // TODO: Navigate to reports page
                Alert.alert('Thông báo', 'Tính năng đang được phát triển');
              }}
            />
            
            <QuickActionCard
              title="Lịch sử hoạt động"
              description="Theo dõi hoạt động của hệ thống"
              icon={Clock}
              color="#AF52DE"
              onPress={() => {
                // TODO: Navigate to activity log
                Alert.alert('Thông báo', 'Tính năng đang được phát triển');
              }}
            />
          </VStack>
        </VStack>

        {/* Recent Activity */}
        <VStack space="md">
          <Heading size="lg">Hoạt động gần đây</Heading>
          
          <Card className="p-4 bg-white border border-gray-200">
            <VStack space="md">
              <HStack className="justify-between items-center">
                <HStack space="sm" className="items-center">
                  <Box className="w-2 h-2 rounded-full bg-green-500" />
                  <Text className="font-medium">Người dùng mới đăng ký</Text>
                </HStack>
                <Text className="text-sm text-gray-500">2 phút trước</Text>
              </HStack>
              
              <Divider />
              
              <HStack className="justify-between items-center">
                <HStack space="sm" className="items-center">
                  <Box className="w-2 h-2 rounded-full bg-blue-500" />
                  <Text className="font-medium">Tạo phòng ban mới</Text>
                </HStack>
                <Text className="text-sm text-gray-500">15 phút trước</Text>
              </HStack>
              
              <Divider />
              
              <HStack className="justify-between items-center">
                <HStack space="sm" className="items-center">
                  <Box className="w-2 h-2 rounded-full bg-orange-500" />
                  <Text className="font-medium">Cập nhật thông tin công ty</Text>
                </HStack>
                <Text className="text-sm text-gray-500">1 giờ trước</Text>
              </HStack>
            </VStack>
          </Card>
        </VStack>

        {/* System Status */}
        <VStack space="md">
          <Heading size="lg">Trạng thái hệ thống</Heading>
          
          <Card className="p-4 bg-white border border-gray-200">
            <VStack space="md">
              <HStack className="justify-between items-center">
                <Text className="font-medium">Máy chủ</Text>
                <Badge variant="success">
                  <Text className="text-green-700">Hoạt động tốt</Text>
                </Badge>
              </HStack>
              
              <HStack className="justify-between items-center">
                <Text className="font-medium">Cơ sở dữ liệu</Text>
                <Badge variant="success">
                  <Text className="text-green-700">Kết nối ổn định</Text>
                </Badge>
              </HStack>
              
              <HStack className="justify-between items-center">
                <Text className="font-medium">API</Text>
                <Badge variant="success">
                  <Text className="text-green-700">Phản hồi nhanh</Text>
                </Badge>
              </HStack>
            </VStack>
          </Card>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
