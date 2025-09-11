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
import { Badge } from '@/components/ui/badge';
import { Input, InputField } from '@/components/ui/input';
import { useAuthStore } from '../../store/authStore';
import { 
  Search,
  UserPlus,
  MoreVertical,
  Mail,
  Phone,
  Shield,
  User
} from 'lucide-react-native';

export default function UsersScreen() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with API call
  const users = [
    {
      id: 1,
      fullname: 'Nguyễn Văn An',
      email: 'an.nguyen@company.com',
      role: 'user',
      team: 'Phát triển',
      status: 'active',
      phone: '0123456789'
    },
    {
      id: 2,
      fullname: 'Trần Thị Bình',
      email: 'binh.tran@company.com',
      role: 'admin',
      team: 'Quản lý',
      status: 'active',
      phone: '0987654321'
    },
    {
      id: 3,
      fullname: 'Lê Văn Cường',
      email: 'cuong.le@company.com',
      role: 'user',
      team: 'Marketing',
      status: 'inactive',
      phone: '0112233445'
    }
  ];

  const filteredUsers = users.filter(u => 
    u.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const UserCard = ({ user: userData }: { user: any }) => (
    <Card className="p-4 bg-white border border-gray-200 mb-3">
      <VStack space="md">
        <HStack className="justify-between items-start">
          <HStack space="md" className="items-center flex-1">
            <Box className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center">
              <Text className="text-white font-bold">
                {userData.fullname.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              </Text>
            </Box>
            <VStack className="flex-1">
              <Text className="font-bold text-lg">{userData.fullname}</Text>
              <HStack space="sm" className="items-center">
                <Mail size={14} color="#666" />
                <Text className="text-gray-600 text-sm">{userData.email}</Text>
              </HStack>
              {userData.phone && (
                <HStack space="sm" className="items-center">
                  <Phone size={14} color="#666" />
                  <Text className="text-gray-600 text-sm">{userData.phone}</Text>
                </HStack>
              )}
            </VStack>
          </HStack>
          <Button variant="ghost" size="sm">
            <MoreVertical size={16} />
          </Button>
        </HStack>

        <HStack className="justify-between items-center">
          <HStack space="sm">
            <Badge variant={userData.role === 'admin' ? 'success' : 'outline'}>
              <HStack space="xs" className="items-center">
                {userData.role === 'admin' && <Shield size={12} />}
                <Text className={userData.role === 'admin' ? 'text-green-700' : 'text-gray-700'}>
                  {userData.role === 'admin' ? 'Admin' : 'User'}
                </Text>
              </HStack>
            </Badge>
            
            <Badge variant="outline">
              <Text className="text-gray-700">{userData.team}</Text>
            </Badge>
          </HStack>

          <Badge variant={userData.status === 'active' ? 'success' : 'secondary'}>
            <Text className={userData.status === 'active' ? 'text-green-700' : 'text-gray-700'}>
              {userData.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
            </Text>
          </Badge>
        </HStack>
      </VStack>
    </Card>
  );

  if (user?.role !== 'admin') {
    return (
      <Box className="flex-1 justify-center items-center bg-gray-50 p-6">
        <VStack space="md" className="items-center">
          <User size={64} color="#666" />
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
    <Box className="flex-1 bg-gray-50">
      <VStack space="lg" className="p-4">
        {/* Header */}
        <HStack className="justify-between items-center">
          <Heading size="xl">Quản lý người dùng</Heading>
          <Button 
            size="sm"
            onPress={() => Alert.alert('Thông báo', 'Tính năng thêm người dùng đang được phát triển')}
          >
            <HStack space="xs" className="items-center">
              <UserPlus size={16} />
              <ButtonText>Thêm mới</ButtonText>
            </HStack>
          </Button>
        </HStack>

        {/* Search */}
        <Box className="relative">
          <Input>
            <InputField
              placeholder="Tìm kiếm người dùng..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Input>
          <Box className="absolute right-3 top-3">
            <Search size={20} color="#666" />
          </Box>
        </Box>

        {/* Stats */}
        <HStack space="sm">
          <Card className="flex-1 p-3 bg-white border border-gray-200">
            <VStack className="items-center">
              <Text className="text-2xl font-bold text-blue-600">{users.length}</Text>
              <Text className="text-sm text-gray-600">Tổng số</Text>
            </VStack>
          </Card>
          <Card className="flex-1 p-3 bg-white border border-gray-200">
            <VStack className="items-center">
              <Text className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === 'active').length}
              </Text>
              <Text className="text-sm text-gray-600">Hoạt động</Text>
            </VStack>
          </Card>
          <Card className="flex-1 p-3 bg-white border border-gray-200">
            <VStack className="items-center">
              <Text className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.role === 'admin').length}
              </Text>
              <Text className="text-sm text-gray-600">Admin</Text>
            </VStack>
          </Card>
        </HStack>

        {/* Users List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space="sm">
            {filteredUsers.map((userData) => (
              <UserCard key={userData.id} user={userData} />
            ))}
          </VStack>
        </ScrollView>
      </VStack>
    </Box>
  );
}
