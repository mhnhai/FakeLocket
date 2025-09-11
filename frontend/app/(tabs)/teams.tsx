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
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectItem } from '@/components/ui/select';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { useAuthStore } from '../../store/authStore';
import { createTeam, deleteTeam, getAllTeams, updateTeam } from '../../services/team';
import { getAllTenants } from '../../services/tenant';
import { Team, Tenant } from '../../services/types';
import {
  Search,
  Plus,
  Building,
  Edit,
  Trash2,
  ChevronDown
} from 'lucide-react-native';

export default function TeamsScreen() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal states
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    tenant_id: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load teams and tenants data
  const loadData = async () => {
    try {
      setIsLoading(true);

      // Load teams
      const teamsResponse = await getAllTeams();
      if (teamsResponse.success) {
        setTeams(teamsResponse.data || []);
      }

      // Load tenants
      const tenantsResponse = await getAllTenants();
      if (tenantsResponse.success) {
        setTenants(tenantsResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  // Create new team
  const handleCreateTeam = async () => {
    if (!formData.name.trim()) {
      setFormErrors({ name: 'Tên phòng ban là bắt buộc' });
      return;
    }
    if (!formData.tenant_id) {
      setFormErrors({ tenant_id: 'Vui lòng chọn công ty' });
      return;
    }

    try {
      const response = await createTeam({
        name: formData.name,
        tenant_id: parseInt(formData.tenant_id)
      });

      if (response.success) {
        Alert.alert('Thành công', 'Tạo phòng ban thành công');
        setCreateModalVisible(false);
        resetForm();
        loadData();
      } else {
        Alert.alert('Lỗi', response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error creating team:', error);
      Alert.alert('Lỗi', 'Không thể tạo phòng ban');
    }
  };

  // Update team
  const handleUpdateTeam = async () => {
    if (!formData.name.trim()) {
      setFormErrors({ name: 'Tên phòng ban là bắt buộc' });
      return;
    }

    if (!selectedTeam) return;

    try {
      const response = await updateTeam(selectedTeam.id, {
        name: formData.name
      });

      if (response.success) {
        Alert.alert('Thành công', 'Cập nhật phòng ban thành công');
        setEditModalVisible(false);
        resetForm();
        loadData();
      } else {
        Alert.alert('Lỗi', response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error updating team:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật phòng ban');
    }
  };

  // Delete team
  const handleDeleteTeam = async (teamId: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa phòng ban này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await deleteTeam(teamId);

              if (response.success) {
                Alert.alert('Thành công', 'Xóa phòng ban thành công');
                loadData();
              } else {
                Alert.alert('Lỗi', response.message || 'Có lỗi xảy ra');
              }
            } catch (error) {
              console.error('Error deleting team:', error);
              Alert.alert('Lỗi', 'Không thể xóa phòng ban');
            }
          }
        }
      ]
    );
  };

  // Open edit modal
  const openEditModal = (team: Team) => {
    setSelectedTeam(team);
    setFormData({
      name: team.name,
      tenant_id: team.tenant_id.toString()
    });
    setEditModalVisible(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', tenant_id: '' });
    setFormErrors({});
    setSelectedTeam(null);
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
// TeamCard 
  const TeamCard = ({ team }: { team: Team }) => {
    const tenant = tenants.find(t => t.id === team.tenant_id);
    return (
      <Card className="p-4 bg-white border border-gray-200 mb-3">
        <VStack space="md">
          <HStack className="justify-between items-start">
            <VStack className="flex-1">
              <HStack className="justify-between items-center w-full">
                <Text className="font-bold text-lg">{team.name}</Text>
                <HStack space="xs">
                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={() => openEditModal(team)}
                  >
                    <Edit size={16} color="#007AFF" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={() => handleDeleteTeam(team.id)}
                  >
                    <Trash2 size={16} color="#FF3B30" />
                  </Button>
                </HStack>
              </HStack>
              <Text className="text-gray-600 text-sm">
                Công ty: {tenant?.name || 'N/A'}
              </Text>
            </VStack>
          </HStack>

          <HStack className="justify-between items-center">
            <HStack space="md">
              <HStack space="xs" className="items-center">
                <Building size={14} color="#666" />
                <Text className="text-sm text-gray-600">Tenant ID: {team.tenant_id}</Text>
              </HStack>
            </HStack>

            <Badge variant="success">
              <Text className="text-green-700">Hoạt động</Text>
            </Badge>
          </HStack>

          <Text className="text-xs text-gray-400">
            Tạo lúc: {new Date(team.created_at).toLocaleDateString('vi-VN')}
          </Text>
        </VStack>
      </Card>
    );
  };

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
          <Heading size="xl">Quản lý phòng ban</Heading>
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
              placeholder="Tìm kiếm phòng ban..."
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
              <Text className="text-2xl font-bold text-blue-600">{teams.length}</Text>
              <Text className="text-sm text-gray-600">Tổng số</Text>
            </VStack>
          </Card>
          <Card className="flex-1 p-3 bg-white border border-gray-200">
            <VStack className="items-center">
              <Text className="text-2xl font-bold text-green-600">{teams.length}</Text>
              <Text className="text-sm text-gray-600">Hoạt động</Text>
            </VStack>
          </Card>
          <Card className="flex-1 p-3 bg-white border border-gray-200">
            <VStack className="items-center">
              <Text className="text-2xl font-bold text-purple-600">{tenants.length}</Text>
              <Text className="text-sm text-gray-600">Công ty</Text>
            </VStack>
          </Card>
        </HStack>

        {/* Teams List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
        >
          <VStack space="sm">
            {filteredTeams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </VStack>
        </ScrollView>

        {/* Create Team Modal */}
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
              <Heading size="md">Tạo phòng ban mới</Heading>
              <ModalCloseButton>
                <Text>✕</Text>
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <VStack space="md">
                <FormControl isInvalid={!!formErrors.name}>
                  <FormControlLabel>
                    <FormControlLabelText>Tên phòng ban</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="Nhập tên phòng ban"
                      value={formData.name}
                      onChangeText={(text) => setFormData({ ...formData, name: text })}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorText>{formErrors.name}</FormControlErrorText>
                  </FormControlError>
                </FormControl>

                <FormControl isInvalid={!!formErrors.tenant_id}>
                  <FormControlLabel>
                    <FormControlLabelText>Chọn công ty</FormControlLabelText>
                  </FormControlLabel>
                  <Select
                    selectedValue={formData.tenant_id}
                    onValueChange={(value) => setFormData({ ...formData, tenant_id: value })}
                  >
                    <SelectTrigger>
                      <SelectInput placeholder="Chọn công ty" />
                      <SelectIcon as={ChevronDown} />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        {tenants.map((tenant) => (
                          <SelectItem key={tenant.id} label={tenant.name} value={tenant.id.toString()} />
                        ))}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                  <FormControlError>
                    <FormControlErrorText>{formErrors.tenant_id}</FormControlErrorText>
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
              <Button onPress={handleCreateTeam}>
                <ButtonText>Tạo phòng ban</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Edit Team Modal */}
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
              <Heading size="md">Chỉnh sửa phòng ban</Heading>
              <ModalCloseButton>
                <Text>✕</Text>
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <VStack space="md">
                <FormControl isInvalid={!!formErrors.name}>
                  <FormControlLabel>
                    <FormControlLabelText>Tên phòng ban</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="Nhập tên phòng ban"
                      value={formData.name}
                      onChangeText={(text) => setFormData({ ...formData, name: text })}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorText>{formErrors.name}</FormControlErrorText>
                  </FormControlError>
                </FormControl>

                <Text className="text-sm text-gray-600">
                  Công ty: {tenants.find(t => t.id.toString() === formData.tenant_id)?.name || 'N/A'}
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
              <Button onPress={handleUpdateTeam}>
                <ButtonText>Cập nhật</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}
