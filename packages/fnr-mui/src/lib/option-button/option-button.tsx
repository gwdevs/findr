import { ToggleButton, ToggleButtonProps } from '@mui/material';

export function OptionButton({ sx, title, ...props }: ToggleButtonProps) {
  return (
    <ToggleButton
      sx={{ padding: '0.3em', ...sx }}
      title={title}
      aria-label={title}
      {...props}
    />
  );
}

export default OptionButton
