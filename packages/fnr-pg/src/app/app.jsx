import { ThemeProvider } from '@mui/material/styles'
import { Box, Stack } from '@mui/material';
import { Navbar } from './navbar/navbar';
import { Sidebar } from './sidebar/sidebar';
import { Workspace } from './workspace/workspace';

function FindrApp() {
  return (
  <Box
    sx={{
      display: 'grid',
      gridTemplateRows: 'min-content auto',
      width: '100vw',
      minHeight: '100vh',
    }}
  >
    <Navbar />
    <Stack direction="row" spacing={2} justifyContent="space-between">
      <Sidebar />
      <Workspace />
    </Stack>
  </Box>
 )
}

export function App() {
  return <ThemeProvider theme={{}}>
    <FindrApp></FindrApp>
  </ThemeProvider>;
}

export default App;
