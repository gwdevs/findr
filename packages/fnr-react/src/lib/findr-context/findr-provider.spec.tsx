import { render } from '@testing-library/react';

describe('FindAndReplaceContext', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<br />);
    expect(baseElement).toBeTruthy();
  });
});
