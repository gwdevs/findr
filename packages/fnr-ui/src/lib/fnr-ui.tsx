import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface FnrUiProps {}

const StyledFnrUi = styled.div`
  color: pink;
`;

export function FnrUi(props: FnrUiProps) {
  return (
    <StyledFnrUi>
      <h1>Welcome to FnrUi!</h1>
    </StyledFnrUi>
  );
}

export default FnrUi;
