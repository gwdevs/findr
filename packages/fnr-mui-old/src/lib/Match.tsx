import React from 'react';
import PropTypes from 'prop-types';

interface MatchProps {
  children: React.ReactNode;
  replaced?: boolean;
}
export function Match(props: MatchProps) {
  const { children, replaced } = props;
  const style = replaced
    ? {
        backgroundColor: '#ffe3e3',
        textDecoration: 'line-through',
        textDecorationColor: '#eea9a9',
      }
    : {
        backgroundColor: '#e3e5ff',
      };
  return <mark style={style}>{children}</mark>;
}
Match.propTypes = {
  children: PropTypes.node.isRequired,
  replaced: PropTypes.bool,
};
