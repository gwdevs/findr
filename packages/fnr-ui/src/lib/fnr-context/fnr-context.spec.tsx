import { render } from '@testing-library/react';

import FindAndReplaceContext from './fnr-context';

describe('FindAndReplaceContext', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FindAndReplaceContext />);
    expect(baseElement).toBeTruthy();
  });
});
