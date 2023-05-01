import { Box, Stack } from '@mui/material';
import { Navbar } from './navbar/navbar';
import { Sidebar } from './sidebar/sidebar';
import { Workspace } from './workspace/workspace';
import { FnrProvider } from '../../../fnr-ui/src';

export function App() {
  return (
    <FnrProvider onSearch={() => []} onReplace={() => []}>
      <Box
        bgcolor={'background.default'}
        sx={{
          display: 'grid',
          gridTemplateRows: 'min-content auto',
          width: '100vw',
          minHeight: '100vh',
        }}
        color={'text.primary'}
      >
        <Navbar />
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Sidebar />
          <Workspace />
        </Stack>
      </Box>
    </FnrProvider>
  );
}

export default App;
