import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  Stack,
  Skeleton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';

const Post = ({ id = 1 }) => {
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

  return loading ? (
    <Stack spacing={1}>
      <Skeleton variant="text" height={100} />
      <Skeleton variant="text" height={20} />
      <Skeleton variant="text" height={20} />
      <Skeleton variant="rectangular" height={300} />
    </Stack>
  ) : (
    <Card sx={{ margin: 5 }}>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <SearchIcon />
          </IconButton>
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
