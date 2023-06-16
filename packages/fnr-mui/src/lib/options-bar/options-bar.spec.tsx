import { render } from '@testing-library/react';

import OptionsBar from './options-bar';

describe('OptionsBar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OptionsBar />);
    expect(baseElement).toBeTruthy();
  });
});
