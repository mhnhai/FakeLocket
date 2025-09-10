import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Badge } from '@/components/ui/badge';
import { Input, InputField } from '@/components/ui/input';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Divider } from '@/components/ui/divider';
import { useAuthStore } from '../../store/authStore';
import { 
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Shield,
  Settings,
  LogOut
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullname: user?.fullname || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const handleSave = () => {
    // TODO: Implement API call to update profile
    Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      fullname: user?.fullname || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
    setIsEditing(false);
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

  const InfoRow = ({ 
    icon: Icon, 
    label, 
    value, 
    isEditable = false,
    field = ''
  }: {
    icon: any;
    label: string;
    value: string;
    isEditable?: boolean;
    field?: string;
  }) => (
    <HStack className="items-center py-3">
      <Box className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
        <Icon size={18} color="#666" />
      </Box>
      <VStack className="flex-1">
        <Text className="text-sm text-gray-500">{label}</Text>
        {isEditing && isEditable ? (
          <Input className="mt-1">
            <InputField
              value={editData[field as keyof typeof editData]}
              onChangeText={(text) => setEditData({ ...editData, [field]: text })}
              placeholder={`Nhập ${label.toLowerCase()}`}
            />
          </Input>
        ) : (
          <Text className="font-medium">{value || 'Chưa cập nhật'}</Text>
        )}
      </VStack>
    </HStack>
  );

  const StatCard = ({ 
    title, 
    value, 
    color = '#007AFF' 
  }: { 
    title: string; 
    value: string | number; 
    color?: string;
  }) => (
    <Card className="flex-1 p-3 bg-white border border-gray-200">
      <VStack className="items-center">
        <Text className="text-2xl font-bold" style={{ color }}>
          {value}
        </Text>
        <Text className="text-sm text-gray-600 text-center">{title}</Text>
      </VStack>
    </Card>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <VStack space="lg" className="p-4">
        {/* Header */}
        <HStack className="justify-between items-center">
          <Heading size="xl">Hồ sơ cá nhân</Heading>
          <HStack space="sm">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onPress={handleCancel}>
                  <X size={16} />
                </Button>
                <Button size="sm" onPress={handleSave}>
                  <Save size={16} />
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onPress={() => setIsEditing(true)}>
                <Edit size={16} />
              </Button>
            )}
          </HStack>
        </HStack>

        {/* Profile Card */}
        <Card className="p-6 bg-white border border-gray-200">
          <VStack space="lg" className="items-center">
            {/* Avatar */}
            <Box className="w-24 h-24 rounded-full bg-blue-500 items-center justify-center">
              <Text className="text-white text-2xl font-bold">
                {user?.fullname?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </Text>
            </Box>

            {/* Basic Info */}
            <VStack space="sm" className="items-center">
              <Text className="text-2xl font-bold">{user?.fullname}</Text>
              <HStack space="sm" className="items-center">
                <Badge variant={user?.role === 'admin' ? 'success' : 'outline'}>
                  <HStack space="xs" className="items-center">
                    {user?.role === 'admin' && <Shield size={12} />}
                    <Text className={user?.role === 'admin' ? 'text-green-700' : 'text-gray-700'}>
                      {user?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                    </Text>
                  </HStack>
                </Badge>
                <Badge variant="outline">
                  <Text className="text-gray-700">{user?.team_name || 'Chưa có nhóm'}</Text>
                </Badge>
              </HStack>
            </VStack>
          </VStack>
        </Card>

        {/* Stats */}
        <HStack space="sm">
          <StatCard 
            title="Công việc hoàn thành" 
            value={24}
            color="#34C759"
          />
          <StatCard 
            title="Dự án tham gia" 
            value={8}
            color="#007AFF"
          />
          <StatCard 
            title="Ngày làm việc" 
            value={156}
            color="#FF9500"
          />
        </HStack>

        {/* Personal Information */}
        <Card className="p-4 bg-white border border-gray-200">
          <VStack space="md">
            <HStack className="justify-between items-center">
              <Heading size="lg">Thông tin cá nhân</Heading>
              {isEditing && (
                <Text className="text-sm text-blue-600">Đang chỉnh sửa</Text>
              )}
            </HStack>

            <VStack space="sm">
              <InfoRow
                icon={User}
                label="Họ tên"
                value={editData.fullname}
                isEditable={true}
                field="fullname"
              />
              
              <Divider />
              
              <InfoRow
                icon={Mail}
                label="Email"
                value={user?.email || ''}
                isEditable={false}
              />
              
              <Divider />
              
              <InfoRow
                icon={Phone}
                label="Số điện thoại"
                value={editData.phone}
                isEditable={true}
                field="phone"
              />
              
              <Divider />
              
              <InfoRow
                icon={Building}
                label="Công ty"
                value={user?.tenant_name || 'Chưa có thông tin'}
                isEditable={false}
              />
              
              <Divider />
              
              <InfoRow
                icon={MapPin}
                label="Địa chỉ"
                value={editData.address}
                isEditable={true}
                field="address"
              />
              
              <Divider />
              
              <InfoRow
                icon={Calendar}
                label="Ngày tham gia"
                value={user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'Không rõ'}
                isEditable={false}
              />
            </VStack>
          </VStack>
        </Card>

        {/* Account Settings */}
        <Card className="p-4 bg-white border border-gray-200">
          <VStack space="md">
            <Heading size="lg">Cài đặt tài khoản</Heading>
            
            <VStack space="sm">
              <Button 
                variant="ghost" 
                className="justify-start p-3"
                onPress={() => Alert.alert('Thông báo', 'Tính năng đang được phát triển')}
              >
                <HStack space="md" className="items-center">
                  <Settings size={20} color="#666" />
                  <Text className="flex-1 text-left">Cài đặt chung</Text>
                </HStack>
              </Button>
              
              <Divider />
              
              <Button 
                variant="ghost" 
                className="justify-start p-3"
                onPress={() => Alert.alert('Thông báo', 'Tính năng đang được phát triển')}
              >
                <HStack space="md" className="items-center">
                  <Shield size={20} color="#666" />
                  <Text className="flex-1 text-left">Đổi mật khẩu</Text>
                </HStack>
              </Button>
              
              <Divider />
              
              <Button 
                variant="ghost" 
                className="justify-start p-3"
                onPress={handleLogout}
              >
                <HStack space="md" className="items-center">
                  <LogOut size={20} color="#FF3B30" />
                  <Text className="flex-1 text-left text-red-600">Đăng xuất</Text>
                </HStack>
              </Button>
            </VStack>
          </VStack>
        </Card>

        {/* App Info */}
        <Card className="p-4 bg-white border border-gray-200">
          <VStack space="md">
            <Heading size="lg">Thông tin ứng dụng</Heading>
            
            <VStack space="sm">
              <HStack className="justify-between">
                <Text className="text-gray-600">Phiên bản</Text>
                <Text className="font-medium">1.0.0</Text>
              </HStack>
              
              <HStack className="justify-between">
                <Text className="text-gray-600">Cập nhật lần cuối</Text>
                <Text className="font-medium">24/12/2024</Text>
              </HStack>
            </VStack>
          </VStack>
        </Card>
      </VStack>
    </ScrollView>
  );
}
