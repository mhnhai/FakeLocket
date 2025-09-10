import { Tabs } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { Home, Users, Building, Settings, User } from 'lucide-react-native';

export default function TabLayout() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  if (isAdmin) {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E5EA',
          },
        }}
      >
        <Tabs.Screen
          name="admin-dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="users"
          options={{
            title: 'Người dùng',
            tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="teams"
          options={{
            title: 'Phòng ban',
            tabBarIcon: ({ color, size }) => <Building color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="tenants"
          options={{
            title: 'Công ty',
            tabBarIcon: ({ color, size }) => <Building color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Cài đặt',
            tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="user-dashboard"
          options={{
            href: null, // Hide from tabs
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            href: null, // Hide from tabs
          }}
        />
      </Tabs>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
        },
      }}
    >
      <Tabs.Screen
        name="user-dashboard"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Hồ sơ',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="admin-dashboard"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="teams"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="tenants"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Hide from tabs
        }}
      />
    </Tabs>
  );
}
