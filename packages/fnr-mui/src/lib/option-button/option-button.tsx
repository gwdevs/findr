import * as React from 'react';
import { ToggleButton, ToggleButtonProps } from '@mui/material';

export function OptionButton({ sx, ...props }: ToggleButtonProps) {
  return <ToggleButton sx={{ padding: '0.3em', ...sx }} {...props} />;
}
