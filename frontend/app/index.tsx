import { VStack } from '@/components/ui/vstack';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';

export default function HomeScreen() {
  // This component serves as the initial loading screen
  // Navigation logic is now handled in the root layout
  return (
    <Box className="flex-1 justify-center items-center bg-white">
      <VStack space="md" className="items-center">
        <Spinner size="large" />
        <Text>Đang tải...</Text>
      </VStack>
    </Box>
  );
}