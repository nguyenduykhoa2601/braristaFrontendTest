import React, { useState } from 'react';
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { ChatWindow } from './components/Chat/ChatWindow';

const App: React.FC = () => {
  const [page, setPage] = useState(1);

  return (
    <Box>
      <Stack direction="row" spacing={4} mb={4} mt={4} justify="center">
        <Button size="lg" colorScheme={page === 1 ? "teal" : "gray"} onClick={() => setPage(1)}>Page 1</Button>
        <Button size="lg" colorScheme={page === 2 ? "teal" : "gray"} onClick={() => setPage(2)}>Page 2</Button>
        <Button size="lg" colorScheme={page === 3 ? "teal" : "gray"} onClick={() => setPage(3)}>Page 3</Button>
        <Button size="lg" colorScheme={page === 4 ? "teal" : "gray"} onClick={() => setPage(4)}>Page 4</Button>
      </Stack>

      <Text fontWeight="bold" mb={2} textAlign="center">Current Page: {page}</Text>

      <ChatWindow page={page} />
    </Box>
  );
};

export default App;