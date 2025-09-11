import React, { useState, useEffect, useCallback } from 'react';
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
  getTenantById,
  updateTenant,
  regenerateTenantOtp
} from '../../services/tenant';
import { Tenant } from '../../services/types';
import {
  Building,
  Edit,
  RefreshCw,
  Copy
} from 'lucide-react-native';


export default function TenantsScreen() {
  const { user } = useAuthStore();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal states
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    otp: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // No filtering needed for single tenant

  // Load tenant data
  const loadData = useCallback(async () => {
    if (!user?.tenant_id) {
      Alert.alert('Lỗi', 'Không thể xác định công ty của bạn');
      return;
    }

    try {
      const response = await getTenantById(user.tenant_id);
      if (response.success) {
        setTenant(response.data || null);
      }
    } catch (error) {
      console.error('Error loading tenant:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu công ty');
    }
  }, [user?.tenant_id]);


  // Update tenant
  const handleUpdateTenant = async () => {
    if (!formData.name.trim()) {
      setFormErrors({ name: 'Tên công ty là bắt buộc' });
      return;
    }

    if (!tenant) return;

    try {
      const response = await updateTenant(tenant.id, {
        name: formData.name
      });

      if (response.success) {
        Alert.alert('Thành công', 'Cập nhật công ty thành công');
        setEditModalVisible(false);
        resetForm();
        loadData();
      } else {
        Alert.alert('Lỗi', response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error updating tenant:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật công ty');
    }
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
              const response = await regenerateTenantOtp(tenantId);

              if (response.success) {
                Alert.alert('Thành công', `OTP mới: ${response.data?.otp || 'N/A'}`);
                loadData();
              } else {
                Alert.alert('Lỗi', response.message || 'Có lỗi xảy ra');
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
  const openEditModal = () => {
    if (!tenant) return;
    setFormData({
      name: tenant.name,
      otp: tenant.otp || ''
    });
    setEditModalVisible(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', otp: '' });
    setFormErrors({});
  };

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

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
                  onPress={() => copyOtp(tenant.otp || 'N/A')}
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
                  onPress={() => openEditModal()}
                >
                  <Edit size={16} color="#007AFF" />
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
          <Heading size="xl">Thông tin công ty</Heading>
        </HStack>

        {/* Tenant Info */}
        {tenant ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
            }
          >
            <VStack space="sm">
              <TenantCard tenant={tenant} />
            </VStack>
          </ScrollView>
        ) : (
          <Box className="flex-1 justify-center items-center py-12">
            <VStack space="md" className="items-center">
              <Building size={64} color="#666" />
              <Text className="text-lg font-semibold text-center">Không tìm thấy thông tin công ty</Text>
              <Text className="text-gray-600 text-center">
                Không thể tải thông tin công ty của bạn
              </Text>
            </VStack>
          </Box>
        )}


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
