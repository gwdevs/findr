import { createContext, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useDeepCompareEffect } from 'use-deep-compare';

export const FnrContext = createContext({});

const defaultOptions = {
  isCaseMatched: false,
  isWordMatched: false,
  isRegex: false,
  isCasePreserved: false,
};

type SearchOptions = {
  isWordMatched: boolean;
  isCaseMatched: boolean;
  isRegex: boolean;
};

type ReplaceOptions = { isCasePreserved: boolean };

/**
 * @template Group custom properties for a group
 * @template Result the type of a result
 * @typedef {Object} FnrProviderProps
 * @property {{[key: string]: {results: Array<R>} & T}} groups
 */
export interface FnrProviderProps<Group = undefined, Result = undefined> {
  groups: {
    [key: string]: {
      results: Array<Result>;
    } & Partial<Group>;
  };
  onSearch: ({
    target,
    replacement,
    options,
  }: {
    target: string;
    replacement: string;
    options: SearchOptions;
  }) => void;
}
type ChangeEvent = React.ChangeEventHandler<
  HTMLTextAreaElement | HTMLInputElement
>;

export function FnrProvider<Group = undefined, Result = undefined>({
  groups: _groups,
  onSearch,
  ...props
}: FnrProviderProps<Group, Result> & React.PropsWithChildren) {
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
      onSearch({ target, replacement, options });
    } else {
      setGroups({});
    }
  }, [target, replacement, options]);

  // const handleGroup = (e) => {
  //   console.log(e.target.value);
  //   onReplaceAll({group: e.target?.value, target:target, replacement:replacement})
  // }

  const onChangeSearchOptions = (
    newSearchOptions: Array<keyof SearchOptions>
  ) => {
    const searchOptions = newSearchOptions.reduce(
      (options, keys) => {
        options[keys] = true;
        return options;
      },
      { isWordMatched: false, isCaseMatched: false, isRegex: false }
    );
    setOptions((options) => ({
      ...defaultOptions,
      ...options,
      ...searchOptions,
    }));
  };

  const onChangeReplaceOptions = (
    newReplaceOptions: Array<keyof ReplaceOptions>
  ) => {
    const replaceOptions = newReplaceOptions.reduce(
      (options, keys) => {
        options[keys] = true;
        return options;
      },
      { isCasePreserved: false, b: true }
    );
    setOptions((options) => ({ ...options, ...replaceOptions }));
  };

  useDeepCompareEffect(() => {
    setGroups(_groups);
  }, [_groups]);

  const groupKey = Object.keys(groups)[0];
  const _groupsValue = groups[groupKey];
  console.log({ groupKey, group: groups[groupKey]?.results?.[0] });

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
      setGroups,
    },
    events: {
      onChangeReplaceOptions,
      onChangeSearchOptions,
      onChangeTarget,
      onChangeReplacement,
    },
  };

  return (
    <FnrContext.Provider value={value}>{props.children}</FnrContext.Provider>
  );
}

export default FnrProvider;
