import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface FindAndReplaceProps {}

const StyledFindAndReplace = styled.div`
  color: pink;
`;

export function FindAndReplace(props: FindAndReplaceProps) {
  return (
    <StyledFindAndReplace>
      <h1>Welcome to FindAndReplace!</h1>
    </StyledFindAndReplace>
  );
}

export default FindAndReplace;
