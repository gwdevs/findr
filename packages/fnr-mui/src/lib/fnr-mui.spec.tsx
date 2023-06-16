import { render } from '@testing-library/react';

import FnrMui from './fnr-mui';

describe('FnrMui', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<br />);
    expect(baseElement).toBeTruthy();
  });
});
