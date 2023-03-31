import * as React from 'react';
import { InputAdornment, TextField, TextFieldProps } from '@mui/material';

type SearchBoxProps = {
  searchOptions: React.ReactNode;
} & TextFieldProps;

export function SearchBox({ searchOptions, ...props }: SearchBoxProps) {
  return (
    <TextField
      label="Search"
      size="small"
      margin={'dense'}
      maxRows={10}
      multiline
      {...props}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">{searchOptions}</InputAdornment>
        ),
        sx: { overflow: 'hidden' },
      }}
    />
  );
}
