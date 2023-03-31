import { Button, FormControl, ButtonProps } from '@mui/material';
import PropTypes from 'prop-types';

export function ReplaceButton({ children, ...props }: ButtonProps) {
  return (
    <FormControl margin={'dense'}>
      <Button {...props}>{children}</Button>
    </FormControl>
  );
}
ReplaceButton.propTypes = {
  children: PropTypes.node.isRequired,
};
