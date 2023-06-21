import { render } from '@testing-library/react';

import ReplaceButton from './replace-button';

describe('ReplaceButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReplaceButton />);
    expect(baseElement).toBeTruthy();
  });
});
