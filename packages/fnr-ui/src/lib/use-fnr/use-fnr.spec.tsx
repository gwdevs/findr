import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import useFnr from './use-fnr';

describe('useFnr', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useFnr());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
