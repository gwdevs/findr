import { render } from '@testing-library/react';

import ReplaceBox from './replace-box';

describe('ReplaceBox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReplaceBox />);
    expect(baseElement).toBeTruthy();
  });
});
