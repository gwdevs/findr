import { render } from '@testing-library/react';

import FindAndReplace from './find-and-replace';

describe('FindAndReplace', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FindAndReplace />);
    expect(baseElement).toBeTruthy();
  });
});
