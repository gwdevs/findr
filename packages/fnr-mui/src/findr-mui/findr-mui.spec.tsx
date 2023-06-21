import { render } from '@testing-library/react';

import FindrMUI from './findr-mui';

describe('FindrMUI', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FindrMUI />);
    expect(baseElement).toBeTruthy();
  });
});
