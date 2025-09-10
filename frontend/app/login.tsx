import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui/box';
import { useAuthStore } from '../store/authStore';

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    console.log('🚀 Login button pressed');
    clearError();
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    try {
      console.log('📝 Attempting login with:', { email: formData.email });
      await login(formData.email, formData.password);
      
      // Check if login was successful by checking the store state
      const { error: loginError, isAuthenticated, user } = useAuthStore.getState();
      
      console.log('🔍 Login result:', { loginError, isAuthenticated, user });
      
      if (!loginError && isAuthenticated) {
        console.log('✅ Login successful, navigating...');
        Alert.alert('Thành công', 'Đăng nhập thành công!', [
          { text: 'OK', onPress: () => {
            // Let the root layout handle navigation based on role
            router.replace('/');
          }}
        ]);
      }
    } catch (err) {
      console.error('🚨 Login error in component:', err);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <Box className="flex-1 px-6 py-8 justify-center min-h-screen">
        <VStack space="xl" className="max-w-md mx-auto w-full">
          <VStack space="md" className="items-center">
            <Heading size="3xl" className="text-center">Chào mừng trở lại</Heading>
            <Text className="text-center text-gray-600">
              Đăng nhập để tiếp tục sử dụng ứng dụng
            </Text>
          </VStack>

          <VStack space="lg">
            <VStack space="md">
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
                    autoComplete="email"
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
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                    secureTextEntry
                    autoComplete="password"
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorText>{errors.password}</FormControlErrorText>
                </FormControlError>
              </FormControl>
            </VStack>

            {error && (
              <Text className="text-red-600 text-sm text-center">{error}</Text>
            )}

            <VStack space="md">
              <Button
                onPress={handleLogin}
                isDisabled={isLoading}
                className="w-full"
                size="lg"
              >
                <ButtonText>{isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}</ButtonText>
              </Button>

              <HStack className="justify-center items-center">
                <Text>Chưa có tài khoản? </Text>
                <Button
                  variant="link"
                  size="sm"
                  onPress={() => router.push('/register')}
                >
                  <ButtonText>Đăng ký ngay</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </VStack>

    

          <VStack space="sm" className="items-center mt-8">
            <Text className="text-xs text-gray-500 text-center">
              Bằng cách đăng nhập, bạn đồng ý với
            </Text>
            <HStack space="xs" className="items-center">
              <Button variant="link" size="xs">
                <ButtonText className="text-xs">Điều khoản dịch vụ</ButtonText>
              </Button>
              <Text className="text-xs text-gray-500">và</Text>
              <Button variant="link" size="xs">
                <ButtonText className="text-xs">Chính sách bảo mật</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </ScrollView>
  );
}
