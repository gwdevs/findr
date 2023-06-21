import { render } from '@testing-library/react';

import FindrResults from './findr-results';

describe('FindrResults', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FindrResults />);
    expect(baseElement).toBeTruthy();
  });
});
