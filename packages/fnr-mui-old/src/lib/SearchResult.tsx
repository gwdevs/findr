import { Typography, TypographyProps } from '@mui/material';
import React from 'react';
import { Match } from './Match';
import { Replacement } from './Replacement';
import PropTypes from 'prop-types';

type SearchResultProps = {
  context?: { before: string; after: string };
  match?: string;
  replacement?: string;
  ellipsis?: string;
} & TypographyProps;

export function SearchResult(props: SearchResultProps) {
  const {
    context = { before: '', after: '' },
    match,
    replacement = '',
    ellipsis = '',
    ...other
  } = props;
  return (
    <Typography width={'100%'} variant={'body1'} {...other}>
      {ellipsis}
      {context.before}
      <Match replaced={!!replacement}>{match}</Match>
      <Replacement>{replacement}</Replacement>
      {context.after}
      {ellipsis}
    </Typography>
  );
}

SearchResult.propTypes = {
  context: PropTypes.object,
  match: PropTypes.string,
  replacement: PropTypes.string,
  ellipsis: PropTypes.string,
};
