import { createContext, useContext, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useDeepCompareEffect } from 'use-deep-compare';
import {
  Groups,
  Result,
  UseFindAndReplaceProps,
} from '../use-fnr-callbacks';
import useFnrCallbacks from '../use-fnr-callbacks/use-fnr-callbacks';

type FnrContextProps<O, R> = {
  state: {
    target: string;
    replacement: string;
    groups: Groups<R>;
    options?: O;
  };
  actions?: { [key: string]: unknown };
  events?: { [key: string]: unknown };
};

export const FnrContext = createContext(null);

export const useFnrContext = () => {
  const context = useContext(FnrContext);
  if (!context) {
    throw new Error('useFnrContext has to be used within <FnrProvider>');
  }
  return context;
};

type ChangeEvent = React.ChangeEventHandler<
  HTMLTextAreaElement | HTMLInputElement
>;

type FnrProviderProps<R, O> = {
  defaultOptions?: O;
} & UseFindAndReplaceProps<R, O> &
  React.PropsWithChildren;

export function FnrProvider<R extends Result, O>({
  onSearch: _onSearch,
  onReplace: _onReplace,
  defaultOptions,
  sourcesKeys = [],
  metadata,
  ...props
}: FnrProviderProps<R, O | undefined>) {
  const {
    state: { groups: _groups },
    events: { onSearch, onReplaceAll, onReplaceGroup, onReplaceResult },
  } = useFnrCallbacks({
    sourcesKeys,
    metadata,
    onSearch: _onSearch,
    onReplace: _onReplace,
  });

  const [options, setOptions] = useState(defaultOptions);
  const [groups, setGroups] = useState(_groups);
  const [target, setTarget] = useState('');
  const [replacement, setReplacement] = useState('');

  const debouncedTarget = useDebouncedCallback((value) => {
    setTarget(value);
  }, 300);

  const debouncedReplace = useDebouncedCallback((value) => {
    setReplacement(value);
  }, 300);

  const onChangeTarget: ChangeEvent = (event) => {
    debouncedTarget(event.target.value);
  };

  const onChangeReplacement: ChangeEvent = (event) => {
    debouncedReplace(event.target.value);
  };

  useDeepCompareEffect(() => {
    if (target !== '') {
      console.log({ options });
      sourcesKeys.forEach((sourceKey) => {
        onSearch({ target, replacement, options, sourceKey });
      });
    } else {
      setGroups({});
    }
  }, [target, replacement, options]);

  const value = {
    state: {
      target,
      replacement,
      groups,
      options,
    },
    actions: {
      setTarget,
      setReplacement,
      setOptions,
      setGroups,
    },
    events: {
      onChangeTarget,
      onChangeReplacement,
      onReplaceAll,
      onReplaceGroup,
      onReplaceResult,
    },
  };

  return (
    <FnrContext.Provider value={value}>{props.children}</FnrContext.Provider>
  );
}

export default FnrProvider;
