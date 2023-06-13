import Post from '../post/post';
import { Box } from '@mui/material';

export const Workspace = ({ limit = 4 }) => {
  const postIds = Array.from(Array(limit), (_, i) => i + 1);
  console.log({ postIds });
  return (
    <Box
      p={{ xs: 0, md: 2 }}
      sx={{ flexGrow: 1, display: 'grid', gridTemplateColumns: 'auto auto' }}
    >
      {postIds.map((id) => (
        <Post id={id} key={`post-${id}`} />
      ))}
    </Box>
  );
};

export default Workspace;
