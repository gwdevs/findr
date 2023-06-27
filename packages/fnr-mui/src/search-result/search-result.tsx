import * as React from 'react';
import { Box, TypographyProps } from '@mui/material';
interface MarkProps {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}

export function Mark(props: MarkProps) {
  const { children, color, style, ..._props } = props;
  const defaultColor = 'rgba(0, 18, 255, 0.2)';
  const _style = {
    backgroundColor: color ?? defaultColor,
    padding: '0.1em 0.2em',
    borderRadius: '0.3em',
    border: `0.1em solid ${color ?? defaultColor}`,
    color: '#141414',
  };
  return (
    <mark style={{ ..._style, ...style }} {..._props}>
      {children}
    </mark>
  );
}

interface MatchProps {
  children: React.ReactNode;
  replaced?: boolean;
}

function Match(props: MatchProps) {
  const { children, replaced } = props;
  const { style, color }: {
    style?: React.CSSProperties;
    color?: string
  } =
    replaced
      ? {
          color: 'rgba(218, 54, 51, 0.3)',
          style: { textDecoration: 'line-through' },
        }
      : {};
  return (
    <Mark style={style} color={color}>
      {children}
    </Mark>
  );
}

function Replacement(props: { children: React.ReactNode }) {
  const { children } = props;
  const color = 'rgba(35, 134, 54, 0.3)';
  return <Mark color={color}>{children}</Mark>;
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

  const clippedBefore = React.useMemo(() => {
    const ctxArr = before.split(' ');
    const wordsCount = ctxArr.length;
    const selectedWordsCount = wordsCount - 1;
    const selectedCtxArr = ctxArr.slice(-selectedWordsCount);
    const wordsLimit = -minCtxWords;
    const slicedCtxArr = selectedCtxArr.slice(wordsLimit);
    const newCtxString = slicedCtxArr.join(' ');
    return newCtxString;
  }, [before, minCtxWords]);

  const clippedAfter = React.useMemo(() => {
    const ctxArr = after.split(' ');
    const wordsCount = ctxArr.length;
    const selectedWordsCount = wordsCount - 1;
    const selectedCtxArr = ctxArr.slice(0, selectedWordsCount);
    const wordsLimit = minCtxWords;
    const slicedCtxArr = selectedCtxArr.slice(0, wordsLimit);
    const newCtxString = slicedCtxArr.join(' ');
    return newCtxString;
  }, [after, minCtxWords]);

  return (
    <Box component={'span'} width={'100%'} variant={'body1'} {...other}>
      {ellipsis}
      {clippedBefore}
      <Match replaced={!!replacement}>{match}</Match>
      {!replacement ? null : <Replacement>{replacement}</Replacement>}
      {clippedAfter}
      {ellipsis}
    </Box>
  );
}

export default SearchResult;
