import { Dialog, DialogContent, DialogProps } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import { ResultDialogTitle } from './ResultDialogTitle';
import { SearchResult } from './SearchResult';

type ResultDialogProps<T> = {
  result: {
    extContext?: {
      before: string;
      after: string;
    };
    match?: string;
    replacement?: string;
    metadata?: T;
  };
  title: string;
  onReplace?: () => void;
  onClose?: () => void;
} & DialogProps;

export function ResultDialog<T>(props: ResultDialogProps<T>) {
  const { result, onReplace, onClose, title, ...other } = props;

  const { extContext, match, replacement } = result;

  return result ? (
    <div>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        {...other}
      >
        <ResultDialogTitle
          id="customized-dialog-title"
          onClose={onClose}
          onReplace={onReplace}
        >
          {title}
        </ResultDialogTitle>
        <DialogContent dividers>
          <SearchResult
            context={extContext}
            match={match}
            replacement={replacement}
          />
        </DialogContent>
      </Dialog>
    </div>
  ) : null;
}

ResultDialog.propTypes = {
  result: PropTypes.object,
  onReplace: PropTypes.func,
  onClose: PropTypes.func,
};
