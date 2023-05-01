import { useState } from 'react';
import type {
  Result,
  UseFindAndReplaceProps,
  OnReplaceProps,
  Group,
  Groups,
  OnSearchProps,
} from './index.d.ts';

export function useFnrCallbacks<R extends Result, O = undefined>({
  sourcesKeys = [],
  metadata,
  onSearch: _onSearch,
  onReplace: _onReplace,
}: UseFindAndReplaceProps<R, O>) {
  const [groups, setGroups] = useState<Groups<R>>({});

  const getResult = async ({
    target,
    replacement,
    sourceKey,
    resultsKeys,
    options,
  }: OnReplaceProps<O>) => {
    const shouldWrite = !(resultsKeys === undefined || resultsKeys === null);
    return shouldWrite
      ? await _onReplace({
          target,
          replacement,
          sourceKey,
          resultsKeys,
          options,
        })
      : await _onSearch({ target, replacement, sourceKey, options });
  };

  const buildGroup = async ({
    target,
    replacement,
    sourceKey,
    resultsKeys,
    options,
  }: OnReplaceProps<O>) => {
    const results = await getResult({
      target,
      replacement /* config */,
      sourceKey,
      resultsKeys,
      options,
    });
    const group: Group<R> = {
      key: `${sourceKey}`,
      title: metadata?.title ? `${sourceKey}` : undefined,
      hoverText: metadata?.hoverText ? `${sourceKey}` : undefined,
      results,
      metadata: metadata,
    };
    return group;
  };

  const getGroups = async ({
    target,
    replacement = '',
    resultsKeys,
    options,
  }: Omit<OnReplaceProps<O>, 'sourceKey'>) => {
    return await sourcesKeys.reduce(async (groupsPromise, sourceKey) => {
      const group: Group<R> = await buildGroup({
        sourceKey,
        target,
        replacement,
        resultsKeys,
        options,
      });
      const groups = await groupsPromise;
      groups[sourceKey] = group;
      return groups;
    }, Promise.resolve({} as Groups<R>));
  };

  const onSearch = async ({
    target,
    replacement = '',
    options,
  }: OnSearchProps<O>) => {
    const groups = await getGroups({ target, replacement, options });
    setGroups((prevGroups) => ({ ...prevGroups, ...groups }));
  };

  interface OnReplaceAllProps extends OnSearchProps<O> {
    groups: Groups<R>;
  }

  const onReplaceAll = async ({
    target,
    replacement,
    groups,
    options,
  }: OnReplaceAllProps) => {
    const groupKeys = groups ? Object.keys(groups) : [];
    if (!groupKeys.length) {
      const newGroups = await getGroups({
        target,
        replacement,
        resultsKeys: 'all',
        options,
      });
      setGroups((prevGroups) => ({ ...prevGroups, ...newGroups }));
      return;
    }
    const newGroups = await groupKeys.reduce(
      async (newGroupsPromise, groupKey: string) => {
        const group = groups[groupKey];
        const results = group.results;
        const resultsKeys = results.map((result) => result.resultKey);
        const newGroup = await buildGroup({
          sourceKey: groupKey,
          target,
          replacement,
          resultsKeys,
          options,
        });
        const newGroups = await newGroupsPromise;
        newGroups[groupKey] = newGroup;
        return newGroups;
      },
      Promise.resolve({} as Groups<R>)
    );
    setGroups((prevGroups) => ({ ...prevGroups, ...newGroups }));
  };

  interface OnReplaceGroupProps extends OnSearchProps<O> {
    group: Group<R>;
  }

  const onReplaceGroup = async ({
    target,
    replacement,
    group,
    options,
  }: OnReplaceGroupProps) => {
    const { results, key: sourceKey } = group;
    const resultsKeys = results.map((result) => result.resultKey);
    const _groups = {
      [sourceKey]: await buildGroup({
        sourceKey,
        target,
        replacement,
        resultsKeys,
        options,
      }),
    };
    setGroups((prevGroups) => ({ ...prevGroups, ..._groups }));
  };

  interface OnReplaceGroupProps extends OnSearchProps<O> {
    result: R;
  }

  const onReplaceResult = async ({
    target,
    replacement,
    result,
    options,
  }: OnReplaceGroupProps) => {
    const { resultKey, sourceKey } = result;
    const resultsKeys = [resultKey];
    const _groups = {
      [sourceKey]: await buildGroup({
        sourceKey,
        target,
        replacement,
        resultsKeys,
        options,
      }),
    };
    setGroups((prevGroups) => ({ ...prevGroups, ..._groups }));
  };

  return {
    state: {
      groups,
    },
    actions: {
      setGroups,
    },
    events: {
      onSearch,
      onReplaceAll,
      onReplaceGroup,
      onReplaceResult,
    },
  };
}

export default useFnrCallbacks;
