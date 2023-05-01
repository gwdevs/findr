import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  Stack,
  Skeleton,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import { FnrMUI } from '../../../../fnr-mui/src';
import { FnrProvider, useFnrContext } from '../../../../fnr-ui/src';

export const Post = ({ id = 1 }) => {
  const {
    state: { groups, target, replacement },
  } = useFnrContext();

  useEffect(() => {}, []);

  console.log({ groups, target, replacement });
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState({});

  useEffect(() => {
    setLoading(true);
    fetch(`https://dummyjson.com/posts/${id}`)
      .then((res) => {
        console.log('fetch called');
        return res.json();
      })
      .then((json) => {
        setLoading(false);
        setPost(json);
      });
  }, [id]);

  const onSearch = (params) => {
    console.log(params);
    return [];
  };

  const onReplace = (params) => {
    console.log(params);
    return [];
  };

  return loading ? (
    <Stack spacing={1}>
      <Skeleton variant="text" height={100} />
      <Skeleton variant="text" height={20} />
      <Skeleton variant="text" height={20} />
      <Skeleton variant="rectangular" height={300} />
    </Stack>
  ) : (
    <Card sx={{ margin: 5, position: 'relative' }}>
      <FnrProvider onSearch={{ onSearch }} onReplace={{ onReplace }}>
        <FnrMUI sx={{ padding: '0.5em', margin: '0em 0.5em' }} />
      </FnrProvider>
      <CardHeader
        action={
          <Box>
            <IconButton aria-label="settings">
              <SearchIcon />
            </IconButton>
          </Box>
        }
        title={post?.title}
        subheader="September 14, 2022"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post?.body}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Post;
