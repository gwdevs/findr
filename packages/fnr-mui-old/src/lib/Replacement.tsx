import React from 'react';
import PropTypes from 'prop-types';

export function Replacement(props: { children: React.ReactNode }) {
  const { children } = props;
  const style = {
    backgroundColor: '#e3ffe5',
  };
  return <mark style={style}>{children}</mark>;
}
Replacement.propTypes = {
  children: PropTypes.node.isRequired,
};
