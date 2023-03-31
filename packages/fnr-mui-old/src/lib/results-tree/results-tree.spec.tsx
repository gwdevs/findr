import { render } from '@testing-library/react';

import ResultsTree from './results-tree';

describe('ResultsTree', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ResultsTree />);
    expect(baseElement).toBeTruthy();
  });
});
