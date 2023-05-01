import Sidebar from './components/Sidebar';
import Workspace from './components/Workspace';
import { Box, createTheme, Stack, ThemeProvider } from '@mui/material';
import Navbar from './components/Navbar';
import { useState } from 'react';
import { FnrProvider } from '../../fnr-ui/src';

function App() {
  return (
    <FnrProvider onSearch={() => undefined} onReplace={() => undefined}>
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
