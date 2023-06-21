import { render } from '@testing-library/react';

import OptionButton from './option-button';

describe('OptionButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OptionButton />);
    expect(baseElement).toBeTruthy();
  });
});
