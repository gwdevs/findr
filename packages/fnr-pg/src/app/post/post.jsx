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
import { useEffect, useMemo, useState } from 'react';
import fnr from '@findr/text';
import { useFindr } from '@findr/react';
import { FnrMUI } from '@findr/mui';

const SearchAndReplace = ({post,setPost,sourceKey}) => {
  const onSearch = (params) => {
    const { options, target, replacement } = params;
    const response = fnr({
      source: post?.body || '',
      target,
      replacement,
      config: { ...options, ctxLen: 50 },
    });
    console.log({searchResponse: response});
    return Object.values(response?.results).map((result) => ({
      ...result,
      sourceKey,
    }));
  };

  const onReplace = (params) => {
    console.log({ params });
    const { options, target, replacement, resultsKeys } = params;
    const response = fnr({
      source: post?.body || '',
      target,
      replacement,
      replacementKeys: resultsKeys,
      config: { ...options, ctxLen: 50 },
    });
    console.log({ replaceResponse: response });
    setPost((json) => ({ ...json, body: response?.replaced }));
    return Object.values(response?.results).map((result) => ({
      ...result,
      sourceKey,
    }));
  };

 const {
   actions: fnrActions,
   state: fnrState,
   events: fnrEvents,
 } = useFindr({sourcesKeys:[sourceKey],onSearch,onReplace});

 const { setOptions, setGroups } = fnrActions ?? {};
 const { target, replacement, groups, options } = fnrState ?? {};
 const {
   onChangeTarget,
   onChangeReplacement,
   onReplaceGroup,
   onReplaceResult,
   onReplaceAll
 } = fnrEvents ?? {};

 const fnrProps = {
   onChangeTarget,
   onChangeReplacement,
   onReplaceGroup,
   onReplaceResult,
   onReplaceAll,
   onChangeOptions: setOptions,
   setGroups,
   options,
   target,
   replacement,
   groups,
 };
  return (
    <FnrMUI sx={{ padding: '0.5em', margin: '0em 0.5em' }} {...fnrProps} />
  );
}

export const Post = ({ id = 1 }) => {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState({});
  const sourceKey = useMemo(() => `post ${id}: ${post.title}`, [id,post.title]);

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
    <Card sx={{ margin: 5, position: 'relative' }}>
      <SearchAndReplace post={post} setPost={setPost} sourceKey={sourceKey} />
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
