import { Box, Stack } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Navbar } from './navbar/navbar';
import { Sidebar } from './sidebar/sidebar';
import { Workspace } from './workspace/workspace';

export function App() {
  return (
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
      <CssBaseline />
      <Navbar />
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Sidebar />
        <Workspace />
      </Stack>
    </Box>
  );
}

export default App;
