import * as React from 'react';
import { InputAdornment, TextField, TextFieldProps } from '@mui/material';

type ReplaceBoxProps = {
  replaceOptions: React.ReactNode;
} & TextFieldProps;

export function ReplaceBox({ replaceOptions, ...props }: ReplaceBoxProps) {
  return (
    <TextField
      label="Replace"
      size="small"
      margin={'dense'}
      maxRows={10}
      multiline
      {...props}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">{replaceOptions}</InputAdornment>
        ),
        sx: { overflow: 'hidden' },
      }}
    />
  );
}

export default ReplaceBox;
