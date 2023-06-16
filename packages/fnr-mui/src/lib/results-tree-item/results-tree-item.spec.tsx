import { render } from '@testing-library/react';

import ResultsTreeItem from './results-tree-item';

describe('ResultsTreeItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ResultsTreeItem />);
    expect(baseElement).toBeTruthy();
  });
});
