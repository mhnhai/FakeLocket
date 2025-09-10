import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '@/components/ui/radio';
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem } from '@/components/ui/select';
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { ChevronDownIcon, CheckIcon, Building, Users, CheckCircle } from 'lucide-react-native';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth';

export default function RegisterScreen() {
  const { register, isLoading, error, clearError } = useAuthStore();
  
  // Registration flow type
  type RegistrationFlow = 'create_tenant' | 'join_tenant';

  const [registrationFlow, setRegistrationFlow] = useState<RegistrationFlow>('create_tenant');

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
    team_id: '',
    tenant_name: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tenantVerified, setTenantVerified] = useState(false);
  const [tenantData, setTenantData] = useState<{ tenant_id: number; tenant_name: string } | null>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Họ tên là bắt buộc';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (registrationFlow === 'create_tenant') {
      // Tạo tenant mới - chỉ cần tên công ty
      if (!formData.tenant_name.trim()) {
        newErrors.tenant_name = 'Tên công ty là bắt buộc';
      }
      // OTP có thể được tạo tự động hoặc để trống
    } else {
      // Tham gia tenant có sẵn - cần OTP và verify
      if (!formData.otp.trim()) {
        newErrors.otp = 'OTP công ty là bắt buộc';
      }
      if (!tenantVerified) {
        newErrors.otp = 'Vui lòng xác thực OTP trước';
      }
      if (!formData.team_id) {
        newErrors.team_id = 'Vui lòng chọn phòng ban';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp.trim()) {
      setErrors({ ...errors, otp: 'Vui lòng nhập OTP' });
      return;
    }

    setVerifyingOtp(true);
    try {
      const result = await authService.verifyTenantOtp(formData.otp);

      if (result.success && result.data) {
        setTenantVerified(true);
        setTenantData(result.data);

        // Lấy danh sách teams của tenant
        const teamsResult = await authService.getTeamsByTenant(result.data.tenant_id);
        if (teamsResult.success && teamsResult.data) {
          setTeams(teamsResult.data);
        }

        setErrors({ ...errors, otp: '' });
      } else {
        setErrors({ ...errors, otp: 'OTP không hợp lệ' });
      }
    } catch (error) {
      setErrors({ ...errors, otp: 'Lỗi xác thực OTP' });
    }
    setVerifyingOtp(false);
  };

  const handleRegister = async () => {
    clearError();

    if (!validateForm()) {
      return;
    }

    const registerData = {
      fullname: formData.fullname,
      email: formData.email,
      password: formData.password,
      ...(registrationFlow === 'create_tenant'
        ? {
            create_tenant: true,
            tenant_name: formData.tenant_name,
            // Không cần OTP khi tạo tenant mới - backend sẽ tự động tạo
          }
        : {
            otp: formData.otp,
            team_id: parseInt(formData.team_id),
          }),
    };

    try {
      await register(registerData);
      if (!error) {
        const successMessage = registrationFlow === 'create_tenant'
          ? 'Đăng ký thành công! Bạn là Admin của công ty mới.'
          : 'Đăng ký thành công! Chào mừng bạn đến với công ty.';

        Alert.alert('Thành công', successMessage, [
          { text: 'OK', onPress: () => router.replace('/(tabs)') }
        ]);
      }
    } catch (err) {
      console.error('Register error:', err);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <Box className="flex-1 px-6 py-8">
        <VStack space="lg" className="max-w-md mx-auto w-full">
          <VStack space="md" className="items-center">
            <Heading size="2xl" className="text-center">Đăng ký tài khoản</Heading>
            <Text className="text-center text-gray-600">
              Chọn cách thức đăng ký phù hợp với bạn
            </Text>
          </VStack>

          {/* Registration Flow Selection */}
          <Card className="p-4 bg-gray-50 border border-gray-200">
            <VStack space="md">
              <Heading size="md" className="text-center">Chọn loại đăng ký</Heading>

              <RadioGroup
                value={registrationFlow}
                onChange={(value) => {
                  setRegistrationFlow(value);
                  // Reset form data when switching flows
                  setFormData({
                    ...formData,
                    otp: '',
                    team_id: '',
                    tenant_name: '',
                  });
                  setTenantVerified(false);
                  setTenantData(null);
                  setTeams([]);
                  setErrors({});
                }}
              >
                <VStack space="md">
                  <Card className={`p-4 border-2 ${registrationFlow === 'create_tenant' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                    <Radio value="create_tenant">
                      <HStack space="md" className="items-center">
                        <RadioIndicator>
                          <RadioIcon as={CheckIcon} />
                        </RadioIndicator>
                        <VStack className="flex-1">
                          <RadioLabel className="font-semibold">Tạo công ty mới</RadioLabel>
                          <Text className="text-sm text-gray-600">
                            Bạn sẽ là Admin của công ty mới
                          </Text>
                        </VStack>
                        <Building size={24} color="#007AFF" />
                      </HStack>
                    </Radio>
                  </Card>

                  <Card className={`p-4 border-2 ${registrationFlow === 'join_tenant' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                    <Radio value="join_tenant">
                      <HStack space="md" className="items-center">
                        <RadioIndicator>
                          <RadioIcon as={CheckIcon} />
                        </RadioIndicator>
                        <VStack className="flex-1">
                          <RadioLabel className="font-semibold">Tham gia công ty có sẵn</RadioLabel>
                          <Text className="text-sm text-gray-600">
                            Bạn sẽ là thành viên của công ty
                          </Text>
                        </VStack>
                        <Users size={24} color="#34C759" />
                      </HStack>
                    </Radio>
                  </Card>
                </VStack>
              </RadioGroup>
            </VStack>
          </Card>

          {/* User Information Form */}
          <Card className="p-4 bg-white border border-gray-200">
            <VStack space="md">
              <Heading size="md">Thông tin cá nhân</Heading>

              <FormControl isInvalid={!!errors.fullname}>
                <FormControlLabel>
                  <FormControlLabelText>Họ tên</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="Nhập họ tên của bạn"
                    value={formData.fullname}
                    onChangeText={(text) => setFormData({ ...formData, fullname: text })}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorText>{errors.fullname}</FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormControlLabel>
                  <FormControlLabelText>Email</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="Nhập email của bạn"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorText>{errors.email}</FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormControlLabel>
                  <FormControlLabelText>Mật khẩu</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                    value={formData.password}
                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                    secureTextEntry
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorText>{errors.password}</FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormControlLabel>
                  <FormControlLabelText>Xác nhận mật khẩu</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                    secureTextEntry
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorText>{errors.confirmPassword}</FormControlErrorText>
                </FormControlError>
              </FormControl>
            </VStack>
          </Card>

          {/* Company Information */}
          <Card className="p-4 bg-white border border-gray-200">
            <VStack space="md">
              <Heading size="md">
                {registrationFlow === 'create_tenant' ? 'Thông tin công ty mới' : 'Tham gia công ty'}
              </Heading>

              {registrationFlow === 'create_tenant' && (
                <FormControl isInvalid={!!errors.tenant_name}>
                  <FormControlLabel>
                    <FormControlLabelText>Tên công ty</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="Nhập tên công ty mới"
                      value={formData.tenant_name}
                      onChangeText={(text) => setFormData({ ...formData, tenant_name: text })}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorText>{errors.tenant_name}</FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}

              {registrationFlow === 'join_tenant' && (
                <FormControl isInvalid={!!errors.otp}>
                  <FormControlLabel>
                    <FormControlLabelText>OTP công ty</FormControlLabelText>
                  </FormControlLabel>
                  <HStack space="sm">
                    <Box className="flex-1">
                      <Input>
                        <InputField
                          placeholder="Nhập OTP công ty để tham gia"
                          value={formData.otp}
                          onChangeText={(text) => {
                            setFormData({ ...formData, otp: text });
                            setTenantVerified(false);
                            setTenantData(null);
                            setTeams([]);
                          }}
                        />
                      </Input>
                    </Box>
                    <Button
                      variant="outline"
                      size="sm"
                      onPress={handleVerifyOtp}
                      isDisabled={verifyingOtp || !formData.otp.trim()}
                    >
                      <ButtonText>{verifyingOtp ? 'Đang xác thực...' : 'Xác thực'}</ButtonText>
                    </Button>
                  </HStack>
                  <FormControlError>
                    <FormControlErrorText>{errors.otp}</FormControlErrorText>
                  </FormControlError>
                  {tenantVerified && tenantData && (
                    <HStack className="items-center mt-2">
                      <CheckCircle size={16} color="#34C759" />
                      <Text className="text-green-600 text-sm ml-2">
                        Đã xác thực: {tenantData.tenant_name}
                      </Text>
                    </HStack>
                  )}
                </FormControl>
              )}

              {registrationFlow === 'create_tenant' && (
                <Card className="p-3 bg-blue-50 border border-blue-200">
                  <VStack space="sm">
                    <HStack space="sm" className="items-center">
                      <Building size={16} color="#007AFF" />
                      <Text className="text-blue-700 font-medium">Tạo công ty mới</Text>
                    </HStack>
                    <Text className="text-blue-600 text-sm">
                      Bạn sẽ trở thành Admin của công ty này. OTP sẽ được tạo tự động.
                    </Text>
                  </VStack>
                </Card>
              )}

              {registrationFlow === 'join_tenant' && tenantVerified && teams.length > 0 && (
                <FormControl isInvalid={!!errors.team_id}>
                  <FormControlLabel>
                    <FormControlLabelText>Chọn phòng ban</FormControlLabelText>
                  </FormControlLabel>
                  <Select
                    selectedValue={formData.team_id}
                    onValueChange={(value) => setFormData({ ...formData, team_id: value })}
                  >
                    <SelectTrigger>
                      <SelectInput placeholder="Chọn phòng ban của bạn" />
                      <SelectIcon as={ChevronDownIcon} />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        {teams.map((team) => (
                          <SelectItem key={team.id} label={team.name} value={team.id.toString()} />
                        ))}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                  <FormControlError>
                    <FormControlErrorText>{errors.team_id}</FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )}
            </VStack>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="p-4 bg-red-50 border border-red-200">
              <Text className="text-red-600 text-sm text-center">{error}</Text>
            </Card>
          )}

          {/* Action Buttons */}
          <VStack space="md">
            <Button
              onPress={handleRegister}
              isDisabled={isLoading}
              className="w-full"
              size="lg"
            >
              <ButtonText>
                {isLoading ? 'Đang đăng ký...' :
                 registrationFlow === 'create_tenant' ? 'Tạo công ty & Đăng ký' : 'Tham gia công ty'}
              </ButtonText>
            </Button>

            <HStack className="justify-center items-center">
              <Text>Đã có tài khoản? </Text>
              <Button
                variant="link"
                size="sm"
                onPress={() => router.push('/login')}
              >
                <ButtonText>Đăng nhập ngay</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </ScrollView>
  );
}
