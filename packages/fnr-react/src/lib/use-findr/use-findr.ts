import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useDeepCompareEffect } from 'use-deep-compare';
import {
  OnReplaceAllProps,
  OnReplaceCallback,
  OnReplaceGroupProps,
  OnReplaceResultProps,
  OnSearchCallback,
  Groups,
  Result,
} from '../use-group-handlers';
import useGroupHandlers from '../use-group-handlers/use-group-handlers';

type ChangeEvent = React.ChangeEventHandler<
  HTMLTextAreaElement | HTMLInputElement
>;

export interface UseFindrProps<R extends Result, O> {
  sourcesKeys: string[];
  metadata: {
    [key: string]: unknown;
  } | undefined;
  onSearch: OnSearchCallback<R, O | undefined>;
  onReplace: OnReplaceCallback<R, O | undefined>;
  defaultOptions: O | undefined;
}

export function useFindr<R extends Result, O>({
  sourcesKeys,
  metadata,
  onSearch: _onSearch,
  onReplace: _onReplace,
  defaultOptions,
}: UseFindrProps<R, O>): UseFindrReturn<R,O> {
  const {
    state: { groups },
    actions: { setGroups },
    events: { onSearch, onReplaceAll, onReplaceGroup, onReplaceResult },
  } = useGroupHandlers({
    sourcesKeys,
    metadata,
    onSearch: _onSearch,
    onReplace: _onReplace,
  });

  const [options, setOptions] = useState(defaultOptions);
  const [target, setTarget] = useState('');
  const [replacement, setReplacement] = useState('');

  const debouncedTarget = useDebouncedCallback((value) => {
    setTarget(value);
  }, 500);

  const debouncedReplace = useDebouncedCallback((value) => {
    setReplacement(value);
  }, 500);

  const onChangeTarget: ChangeEvent = (event) => {
    debouncedTarget(event.target.value);
  };

  const onChangeReplacement: ChangeEvent = (event) => {
    debouncedReplace(event.target.value);
  };

  useDeepCompareEffect(() => {
    if (target !== '') {
      sourcesKeys.forEach((sourceKey) => {
        onSearch({ target, replacement, options, sourceKey });
      });
    } else {
      setGroups({});
    }
  }, [target, replacement, options]);

  const state = {
    target,
    replacement,
    groups,
    options,
  };

  const actions = {
    setTarget,
    setReplacement,
    setOptions,
    setGroups,
  };

  const events = {
    onChangeTarget,
    onChangeReplacement,
    onReplaceAll,
    onReplaceGroup,
    onReplaceResult,
  };

  return {
    state,
    actions,
    events,
  };
}

export interface UseFindrReturn<R, O> {
  state: {
    target: string;
    replacement: string;
    groups: Groups<R>;
    options: O | undefined;
  };
  events: {
    onChangeTarget: ChangeEvent;
    onChangeReplacement: ChangeEvent;
    onReplaceAll: ({
      target,
      replacement,
      groups,
      options,
    }: OnReplaceAllProps) => Promise<void>;
    onReplaceGroup: ({
      target,
      replacement,
      group,
      options,
    }: OnReplaceGroupProps) => Promise<void>;
    onReplaceResult: ({
      target,
      replacement,
      result,
      options,
    }: OnReplaceResultProps) => Promise<void>;
  };
  actions: {
    setTarget: React.Dispatch<React.SetStateAction<string>>;
    setReplacement: React.Dispatch<React.SetStateAction<string>>;
    setOptions: React.Dispatch<React.SetStateAction<O | undefined>>;
    setGroups: React.Dispatch<React.SetStateAction<Groups<R>>>;
  };
}

export default useFindr