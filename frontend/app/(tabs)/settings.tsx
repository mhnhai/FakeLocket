import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Switch } from '@/components/ui/switch';
import { Divider } from '@/components/ui/divider';
import { useAuthStore } from '../../store/authStore';
import { 
  Settings as SettingsIcon,
  Bell,
  Shield,
  Database,
  Users,
  Building,
  Palette,
  Globe,
  HelpCircle,
  Info,
  ChevronRight,
  User
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    description, 
    onPress,
    showToggle = false,
    toggleValue,
    onToggle,
    showArrow = true
  }: {
    icon: any;
    title: string;
    description?: string;
    onPress?: () => void;
    showToggle?: boolean;
    toggleValue?: boolean;
    onToggle?: (value: boolean) => void;
    showArrow?: boolean;
  }) => (
    <Button 
      variant="ghost" 
      className="justify-start p-0"
      onPress={onPress}
      disabled={showToggle}
    >
      <HStack className="items-center py-4 w-full">
        <Box className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
          <Icon size={20} color="#666" />
        </Box>
        <VStack className="flex-1">
          <Text className="font-medium text-left">{title}</Text>
          {description && (
            <Text className="text-sm text-gray-600 text-left">{description}</Text>
          )}
        </VStack>
        {showToggle && toggleValue !== undefined && onToggle ? (
          <Switch value={toggleValue} onValueChange={onToggle} />
        ) : showArrow ? (
          <ChevronRight size={20} color="#666" />
        ) : null}
      </HStack>
    </Button>
  );

  const SectionCard = ({ 
    title, 
    children 
  }: { 
    title: string; 
    children: React.ReactNode;
  }) => (
    <Card className="p-4 bg-white border border-gray-200">
      <VStack space="md">
        <Heading size="lg">{title}</Heading>
        <VStack space="sm">
          {children}
        </VStack>
      </VStack>
    </Card>
  );

  if (user?.role !== 'admin') {
    return (
      <Box className="flex-1 justify-center items-center bg-gray-50 p-6">
        <VStack space="md" className="items-center">
          <SettingsIcon size={64} color="#666" />
          <Text className="text-lg font-semibold text-center">Không có quyền truy cập</Text>
          <Text className="text-gray-600 text-center">
            Bạn cần quyền admin để xem trang này
          </Text>
          <Button onPress={() => router.back()}>
            <ButtonText>Quay lại</ButtonText>
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <VStack space="lg" className="p-4">
        {/* Header */}
        <HStack className="justify-between items-center">
          <Heading size="xl">Cài đặt hệ thống</Heading>
        </HStack>

        {/* System Settings */}
        <SectionCard title="Cài đặt hệ thống">
          <SettingItem
            icon={Database}
            title="Quản lý cơ sở dữ liệu"
            description="Sao lưu và khôi phục dữ liệu"
            onPress={() => Alert.alert('Thông báo', 'Tính năng đang được phát triển')}
          />
          
          <Divider />
          
          <SettingItem
            icon={Shield}
            title="Bảo mật"
            description="Cài đặt bảo mật và quyền truy cập"
            onPress={() => Alert.alert('Thông báo', 'Tính năng đang được phát triển')}
          />
          
          <Divider />
          
          <SettingItem
            icon={Users}
            title="Quản lý người dùng"
            description="Cài đặt quyền và vai trò người dùng"
            onPress={() => router.push('/(tabs)/users')}
          />
          
          <Divider />
          
          <SettingItem
            icon={Building}
            title="Quản lý tổ chức"
            description="Cài đặt công ty và phòng ban"
            onPress={() => router.push('/(tabs)/teams')}
          />
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Thông báo">
          <SettingItem
            icon={Bell}
            title="Thông báo push"
            description="Nhận thông báo trên thiết bị"
            showToggle={true}
            toggleValue={notifications}
            onToggle={setNotifications}
            showArrow={false}
          />
          
          <Divider />
          
          <SettingItem
            icon={Database}
            title="Đồng bộ tự động"
            description="Tự động đồng bộ dữ liệu"
            showToggle={true}
            toggleValue={autoSync}
            onToggle={setAutoSync}
            showArrow={false}
          />
        </SectionCard>

        {/* Appearance */}
        <SectionCard title="Giao diện">
          <SettingItem
            icon={Palette}
            title="Chế độ tối"
            description="Sử dụng giao diện tối"
            showToggle={true}
            toggleValue={darkMode}
            onToggle={setDarkMode}
            showArrow={false}
          />
          
          <Divider />
          
          <SettingItem
            icon={Globe}
            title="Ngôn ngữ"
            description="Tiếng Việt"
            onPress={() => Alert.alert('Thông báo', 'Tính năng đang được phát triển')}
          />
        </SectionCard>

        {/* System Information */}
        <SectionCard title="Thông tin hệ thống">
          <VStack space="md">
            <HStack className="justify-between">
              <Text className="text-gray-600">Phiên bản ứng dụng</Text>
              <Text className="font-medium">1.0.0</Text>
            </HStack>
            
            <HStack className="justify-between">
              <Text className="text-gray-600">Cập nhật lần cuối</Text>
              <Text className="font-medium">24/12/2024</Text>
            </HStack>
            
            <HStack className="justify-between">
              <Text className="text-gray-600">Tổng số người dùng</Text>
              <Text className="font-medium">156</Text>
            </HStack>
            
            <HStack className="justify-between">
              <Text className="text-gray-600">Tổng số phòng ban</Text>
              <Text className="font-medium">12</Text>
            </HStack>
            
            <HStack className="justify-between">
              <Text className="text-gray-600">Dung lượng sử dụng</Text>
              <Text className="font-medium">2.4 GB</Text>
            </HStack>
          </VStack>
        </SectionCard>

        {/* Support */}
        <SectionCard title="Hỗ trợ">
          <SettingItem
            icon={HelpCircle}
            title="Trung tâm trợ giúp"
            description="FAQ và hướng dẫn sử dụng"
            onPress={() => Alert.alert('Thông báo', 'Tính năng đang được phát triển')}
          />
          
          <Divider />
          
          <SettingItem
            icon={Info}
            title="Về ứng dụng"
            description="Thông tin chi tiết về ứng dụng"
            onPress={() => Alert.alert(
              'Về ứng dụng',
              'FakeLocket v1.0.0\n\nỨng dụng quản lý công việc và nhóm\nPhát triển bởi Team Development\n\n© 2024 FakeLocket'
            )}
          />
        </SectionCard>

        {/* Danger Zone */}
        <Card className="p-4 bg-red-50 border border-red-200">
          <VStack space="md">
            <Heading size="lg" className="text-red-700">Vùng nguy hiểm</Heading>
            
            <VStack space="sm">
              <Button 
                variant="outline" 
                className="border-red-300"
                onPress={() => Alert.alert(
                  'Xác nhận',
                  'Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác.',
                  [
                    { text: 'Hủy', style: 'cancel' },
                    { text: 'Xóa', style: 'destructive' }
                  ]
                )}
              >
                <ButtonText className="text-red-700">Xóa tất cả dữ liệu</ButtonText>
              </Button>
              
              <Button 
                variant="outline" 
                className="border-red-300"
                onPress={() => Alert.alert(
                  'Khôi phục cài đặt',
                  'Bạn có muốn khôi phục tất cả cài đặt về mặc định?',
                  [
                    { text: 'Hủy', style: 'cancel' },
                    { text: 'Khôi phục', style: 'destructive' }
                  ]
                )}
              >
                <ButtonText className="text-red-700">Khôi phục cài đặt mặc định</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </Card>
      </VStack>
    </ScrollView>
  );
}
