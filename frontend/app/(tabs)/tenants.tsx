import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, RefreshControl } from 'react-native';
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
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { useAuthStore } from '../../store/authStore';
import {
  Search,
  Plus,
  Building,
  Users,
  Edit,
  Trash2,
  RefreshCw,
  Copy,
  CheckIcon
} from 'lucide-react-native';

interface Tenant {
  id: number;
  name: string;
  otp: string;
  created_at: string;
}

export default function TenantsScreen() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal states
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    otp: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.otp.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load tenants data
  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/api/tenants');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTenants(data.data);
        }
      }
    } catch (error) {
      console.error('Error loading tenants:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu công ty');
    } finally {
      setIsLoading(false);
    }
  };

  // Create new tenant
  const handleCreateTenant = async () => {
    if (!formData.name.trim()) {
      setFormErrors({ name: 'Tên công ty là bắt buộc' });
      return;
    }
    if (!formData.otp.trim()) {
      setFormErrors({ otp: 'OTP là bắt buộc' });
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/tenants/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          otp: formData.otp
        }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('Thành công', 'Tạo công ty thành công');
        setCreateModalVisible(false);
        resetForm();
        loadData();
      } else {
        Alert.alert('Lỗi', data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error creating tenant:', error);
      Alert.alert('Lỗi', 'Không thể tạo công ty');
    }
  };

  // Update tenant
  const handleUpdateTenant = async () => {
    if (!formData.name.trim()) {
      setFormErrors({ name: 'Tên công ty là bắt buộc' });
      return;
    }

    if (!selectedTenant) return;

    try {
      const response = await fetch(`http://localhost:3000/api/tenants/${selectedTenant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name
        }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('Thành công', 'Cập nhật công ty thành công');
        setEditModalVisible(false);
        resetForm();
        loadData();
      } else {
        Alert.alert('Lỗi', data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error updating tenant:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật công ty');
    }
  };

  // Delete tenant
  const handleDeleteTenant = async (tenantId: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa công ty này? Tất cả phòng ban và người dùng liên quan sẽ bị ảnh hưởng.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`http://localhost:3000/api/tenants/${tenantId}`, {
                method: 'DELETE',
              });

              const data = await response.json();
              if (data.success) {
                Alert.alert('Thành công', 'Xóa công ty thành công');
                loadData();
              } else {
                Alert.alert('Lỗi', data.message || 'Có lỗi xảy ra');
              }
            } catch (error) {
              console.error('Error deleting tenant:', error);
              Alert.alert('Lỗi', 'Không thể xóa công ty');
            }
          }
        }
      ]
    );
  };

  // Regenerate OTP
  const handleRegenerateOtp = async (tenantId: number) => {
    Alert.alert(
      'Tạo OTP mới',
      'Bạn có chắc chắn muốn tạo OTP mới? OTP cũ sẽ không còn sử dụng được.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Tạo mới',
          onPress: async () => {
            try {
              const response = await fetch(`http://localhost:3000/api/tenants/${tenantId}/regenerate-otp`, {
                method: 'POST',
              });

              const data = await response.json();
              if (data.success) {
                Alert.alert('Thành công', `OTP mới: ${data.data.otp}`);
                loadData();
              } else {
                Alert.alert('Lỗi', data.message || 'Có lỗi xảy ra');
              }
            } catch (error) {
              console.error('Error regenerating OTP:', error);
              Alert.alert('Lỗi', 'Không thể tạo OTP mới');
            }
          }
        }
      ]
    );
  };

  // Copy OTP to clipboard
  const copyOtp = (otp: string) => {
    // For React Native, we'd use Clipboard from expo-clipboard
    Alert.alert('OTP', `Mã OTP: ${otp}`, [
      { text: 'Đóng', style: 'cancel' }
    ]);
  };

  // Open edit modal
  const openEditModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setFormData({
      name: tenant.name,
      otp: tenant.otp
    });
    setEditModalVisible(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', otp: '' });
    setFormErrors({});
    setSelectedTenant(null);
  };

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const TenantCard = ({ tenant }: { tenant: Tenant }) => (
    <Card className="p-4 bg-white border border-gray-200 mb-3">
      <VStack space="md">
        <HStack className="justify-between items-start">
          <VStack className="flex-1">
            <HStack className="justify-between items-center w-full">
              <Text className="font-bold text-lg">{tenant.name}</Text>
              <HStack space="xs">
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => copyOtp(tenant.otp)}
                >
                  <Copy size={16} color="#007AFF" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => handleRegenerateOtp(tenant.id)}
                >
                  <RefreshCw size={16} color="#FF9500" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => openEditModal(tenant)}
                >
                  <Edit size={16} color="#007AFF" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => handleDeleteTenant(tenant.id)}
                >
                  <Trash2 size={16} color="#FF3B30" />
                </Button>
              </HStack>
            </HStack>
            <HStack className="items-center mt-2">
              <Text className="text-gray-600 text-sm">OTP: </Text>
              <Badge variant="secondary" className="ml-1">
                <Text className="text-gray-700 font-mono">{tenant.otp}</Text>
              </Badge>
            </HStack>
          </VStack>
        </HStack>

        <HStack className="justify-between items-center">
          <HStack space="md">
            <HStack space="xs" className="items-center">
              <Building size={14} color="#666" />
              <Text className="text-sm text-gray-600">ID: {tenant.id}</Text>
            </HStack>
          </HStack>

          <Badge variant="success">
            <Text className="text-green-700">Hoạt động</Text>
          </Badge>
        </HStack>

        <Text className="text-xs text-gray-400">
          Tạo lúc: {new Date(tenant.created_at).toLocaleDateString('vi-VN')}
        </Text>
      </VStack>
    </Card>
  );

  if (user?.role !== 'admin') {
    return (
      <Box className="flex-1 justify-center items-center bg-gray-50 p-6">
        <VStack space="md" className="items-center">
          <Building size={64} color="#666" />
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
          <Heading size="xl">Quản lý công ty</Heading>
          <Button
            size="sm"
            onPress={() => setCreateModalVisible(true)}
          >
            <HStack space="xs" className="items-center">
              <Plus size={16} />
              <ButtonText>Thêm mới</ButtonText>
            </HStack>
          </Button>
        </HStack>

        {/* Search */}
        <Box className="relative">
          <Input>
            <InputField
              placeholder="Tìm kiếm công ty..."
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
              <Text className="text-2xl font-bold text-blue-600">{tenants.length}</Text>
              <Text className="text-sm text-gray-600">Tổng số</Text>
            </VStack>
          </Card>
          <Card className="flex-1 p-3 bg-white border border-gray-200">
            <VStack className="items-center">
              <Text className="text-2xl font-bold text-green-600">{tenants.length}</Text>
              <Text className="text-sm text-gray-600">Hoạt động</Text>
            </VStack>
          </Card>
          <Card className="flex-1 p-3 bg-white border border-gray-200">
            <VStack className="items-center">
              <Text className="text-2xl font-bold text-purple-600">
                {tenants.reduce((sum, t) => sum + t.otp.length, 0)}
              </Text>
              <Text className="text-sm text-gray-600">OTP</Text>
            </VStack>
          </Card>
        </HStack>

        {/* Tenants List */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
        >
          <VStack space="sm">
            {filteredTenants.map((tenant) => (
              <TenantCard key={tenant.id} tenant={tenant} />
            ))}
          </VStack>
        </ScrollView>

        {/* Create Tenant Modal */}
        <Modal
          isOpen={createModalVisible}
          onClose={() => {
            setCreateModalVisible(false);
            resetForm();
          }}
        >
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <Heading size="md">Tạo công ty mới</Heading>
              <ModalCloseButton>
                <Text>✕</Text>
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <VStack space="md">
                <FormControl isInvalid={!!formErrors.name}>
                  <FormControlLabel>
                    <FormControlLabelText>Tên công ty</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="Nhập tên công ty"
                      value={formData.name}
                      onChangeText={(text) => setFormData({ ...formData, name: text })}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorText>{formErrors.name}</FormControlErrorText>
                  </FormControlError>
                </FormControl>

                <FormControl isInvalid={!!formErrors.otp}>
                  <FormControlLabel>
                    <FormControlLabelText>Mã OTP</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="Nhập mã OTP (6-10 ký tự)"
                      value={formData.otp}
                      onChangeText={(text) => setFormData({ ...formData, otp: text })}
                      maxLength={10}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorText>{formErrors.otp}</FormControlErrorText>
                  </FormControlError>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                onPress={() => {
                  setCreateModalVisible(false);
                  resetForm();
                }}
              >
                <ButtonText>Hủy</ButtonText>
              </Button>
              <Button onPress={handleCreateTenant}>
                <ButtonText>Tạo công ty</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Edit Tenant Modal */}
        <Modal
          isOpen={editModalVisible}
          onClose={() => {
            setEditModalVisible(false);
            resetForm();
          }}
        >
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <Heading size="md">Chỉnh sửa công ty</Heading>
              <ModalCloseButton>
                <Text>✕</Text>
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <VStack space="md">
                <FormControl isInvalid={!!formErrors.name}>
                  <FormControlLabel>
                    <FormControlLabelText>Tên công ty</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="Nhập tên công ty"
                      value={formData.name}
                      onChangeText={(text) => setFormData({ ...formData, name: text })}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorText>{formErrors.name}</FormControlErrorText>
                  </FormControlError>
                </FormControl>

                <Text className="text-sm text-gray-600">
                  OTP hiện tại: <Text className="font-mono font-semibold">{formData.otp}</Text>
                </Text>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                onPress={() => {
                  setEditModalVisible(false);
                  resetForm();
                }}
              >
                <ButtonText>Hủy</ButtonText>
              </Button>
              <Button onPress={handleUpdateTenant}>
                <ButtonText>Cập nhật</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}
