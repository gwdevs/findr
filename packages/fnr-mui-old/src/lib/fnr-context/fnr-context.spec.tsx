import { render } from '@testing-library/react';

import FnrContext from './fnr-context';

describe('FnrContext', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FnrContext />);
    expect(baseElement).toBeTruthy();
  });
});
