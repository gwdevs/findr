import { render } from '@testing-library/react';

import FindrForm from './findr-form';

describe('FindrForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FindrForm />);
    expect(baseElement).toBeTruthy();
  });
});
