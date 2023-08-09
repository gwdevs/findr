import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import useFnrCallbacks from './use-group-handlers';

// TODO: Create more tests to cover the basic functionality of use-group-handlers

describe('useFnrCallbacks', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useFnrCallbacks());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
