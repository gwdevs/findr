import {
  AppBar,
  styled,
  Toolbar,
  Typography,
  Box,
} from '@mui/material';


const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const Search = styled('div')(({ theme }) => ({
  backgroundColor: 'white',
  padding: '0 10px',
  borderRadius: theme.shape.borderRadius,
  width: '40%',
}));
export const Navbar = () => {
  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'block' } }}>
          sonar
        </Typography>
        <Search></Search>
      </StyledToolbar>
    </AppBar>
  );
};

export default Navbar;
