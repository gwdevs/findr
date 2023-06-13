import { Button, ButtonProps, FormControl } from '@mui/material';

/* eslint-disable-next-line */
export interface ReplaceButtonProps {}

export function ReplaceButton({ children, ...props }: ButtonProps) {
  return (
    <FormControl margin={'dense'}>
      <Button {...props}>{children}</Button>
    </FormControl>
  );
}

export default ReplaceButton;
