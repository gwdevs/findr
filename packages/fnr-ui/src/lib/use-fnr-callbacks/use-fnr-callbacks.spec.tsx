import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import useFnrCallbacks from './use-fnr-callbacks';

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
