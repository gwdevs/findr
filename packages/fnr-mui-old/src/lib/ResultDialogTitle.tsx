import { Box, DialogTitle, IconButton, DialogTitleProps } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import { VscReplace, VscClose } from 'react-icons/vsc';

type ResultDialogTitleProps = {
  onClose?: () => void;
  onReplace?: () => void;
} & DialogTitleProps;

export function ResultDialogTitle(props: ResultDialogTitleProps) {
  const { children, onClose, onReplace, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2, display: 'flex' }} {...other}>
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
      <Box>
        <IconButton
          aria-label="Replace Result"
          title="Replace Result"
          size="small"
          onClick={onReplace}
        >
          <VscReplace fontSize="inherit" />
        </IconButton>
        {onClose ? (
          <IconButton
            aria-label="close"
            title="Close"
            size="small"
            onClick={onClose}
          >
            <VscClose />
          </IconButton>
        ) : null}
      </Box>
    </DialogTitle>
  );
}

ResultDialogTitle.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  onReplace: PropTypes.func,
};
