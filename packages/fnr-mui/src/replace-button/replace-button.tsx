import { Button, ButtonProps, FormControl } from '@mui/material';

/* eslint-disable-next-line */
export interface ReplaceButtonProps {}

export function ReplaceButton({ children, sx, ...props }: ButtonProps) {
  return (
    <FormControl margin={'dense'}>
      <Button sx={{ height: '100%', minWidth: ' 48px', ...sx }} {...props}>
        {children}
      </Button>
    </FormControl>
  );
}

export default ReplaceButton;
