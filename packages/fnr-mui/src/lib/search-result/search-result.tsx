import { Box, Typography, TypographyProps } from '@mui/material';
import { useMemo } from 'react';

interface MatchProps {
  children: React.ReactNode;
  replaced?: boolean;
}

function Match(props: MatchProps) {
  const { children, replaced } = props;
  const style = replaced
    ? {
        backgroundColor: '#ffe3e3',
        textDecoration: 'line-through',
        textDecorationColor: '#eea9a9',
      }
    : {
        backgroundColor: '#e3e5ff',
      };
  return <mark style={style}>{children}</mark>;
}

function Replacement(props: { children: React.ReactNode }) {
  const { children } = props;
  const style = {
    backgroundColor: '#e3ffe5',
  };
  return <mark style={style}>{children}</mark>;
}

type SearchResultProps = {
  context?: { before: string; after: string };
  match?: string;
  replacement?: string;
  ellipsis?: string;
  minCtxWords?: number;
} & TypographyProps;

export function SearchResult(props: SearchResultProps) {
  const {
    context = { before: '', after: '' },
    match,
    replacement = '',
    ellipsis = '',
    minCtxWords = 5,
    ...other
  } = props;
  const { before, after } = context;
  
  const clippedBefore = useMemo(() => {
    const ctxArr = before.split(' ');
    const wordsCount = ctxArr.length;
    const selectedWordsCount = wordsCount - 1;
    const selectedCtxArr = ctxArr.slice(-selectedWordsCount);
    const wordsLimit = -minCtxWords;
    const slicedCtxArr = selectedCtxArr.slice(wordsLimit);
    const newCtxString = slicedCtxArr.join(' ');
    return newCtxString;
  }, [before, minCtxWords]);

  const clippedAfter = useMemo(() => {
    const ctxArr = after.split(' ');
    const wordsCount = ctxArr.length;
    const selectedWordsCount = wordsCount - 1;
    const selectedCtxArr = ctxArr.slice(0, selectedWordsCount);
    console.log({ ctxArr,selectedCtxArr });
    const wordsLimit = minCtxWords;
    const slicedCtxArr = selectedCtxArr.slice(0,wordsLimit);
    const newCtxString = slicedCtxArr.join(' ');
    return newCtxString;
  }, [after, minCtxWords]);

  return (
    <Box component={'span'}  width={'100%'} variant={'body1'} {...other}>
      {ellipsis}
      {clippedBefore}
      <Match replaced={!!replacement}>{match}</Match>
      <Replacement>{replacement}</Replacement>
      {clippedAfter}
      {ellipsis}
    </Box>
  );
}

export default SearchResult;
