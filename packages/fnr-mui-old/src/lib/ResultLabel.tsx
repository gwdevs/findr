import React from 'react';
import PropTypes from 'prop-types';

export type ResultLabel = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export function ResultLabel({ children, ...props }: ResultLabel) {
  return (
    <div style={{ width: 'auto' }} {...props}>
      {children}
    </div>
  );
}
ResultLabel.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};
