import { render } from '@testing-library/react';

import FindAndReplaceContext from './find-and-replace-context';

describe('FindAndReplaceContext', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FindAndReplaceContext />);
    expect(baseElement).toBeTruthy();
  });
});
