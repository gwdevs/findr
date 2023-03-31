import { render } from '@testing-library/react';

import FnrUi from './fnr-ui';

describe('FnrUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FnrUi />);
    expect(baseElement).toBeTruthy();
  });
});
