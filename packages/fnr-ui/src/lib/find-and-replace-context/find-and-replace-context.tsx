import { createContext, useContext, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useDeepCompareEffect } from 'use-deep-compare';
import { Result, UseFindAndReplaceProps } from '../use-find-and-replace';
import useFindAndReplace from '../use-find-and-replace/use-find-and-replace';

type FnrContextProps = {
  state?: { [key: string]: unknown };
  actions?: { [key: string]: unknown };
  events?: { [key: string]: unknown };
};

export const FnrContext = createContext<FnrContextProps>({});

export const useFnrContext = () => useContext(FnrContext);

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
  } = useFindAndReplace({
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

  // const handleGroup = (e) => {
  //   console.log(e.target.value);
  //   onReplaceAll({group: e.target?.value, target:target, replacement:replacement})
  // }

  // const onChangeSearchOptions = (
  //   newSearchOptions: Array<keyof SearchOptions>
  // ) => {
  //   const searchOptions = newSearchOptions.reduce(
  //     (options, keys) => {
  //       options[keys] = true;
  //       return options;
  //     },
  //     { isWordMatched: false, isCaseMatched: false, isRegex: false }
  //   );
  //   setOptions((options) => ({
  //     ...defaultOptions,
  //     ...options,
  //     ...searchOptions,
  //   }));
  // };

  // const onChangeReplaceOptions = (
  //   newReplaceOptions: Array<keyof ReplaceOptions>
  // ) => {
  //   const replaceOptions = newReplaceOptions.reduce(
  //     (options, keys) => {
  //       options[keys] = true;
  //       return options;
  //     },
  //     { isCasePreserved: false, b: true }
  //   );
  //   setOptions((options) => ({ ...options, ...replaceOptions }));
  // };

  useDeepCompareEffect(() => {
    setGroups(_groups);
  }, [_groups]);

  // const groupKey = Object.keys(groups)[0];
  // const _groupsValue = groups[groupKey];
  // console.log({ groupKey, group: groups[groupKey]?.results?.[0] });

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
