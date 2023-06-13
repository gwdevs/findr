import { createContext } from 'react';
import {
  Result,
  UseFindAndReplaceProps,
} from '../use-group-handlers';
import { UseFindrReturn } from '../use-findr/use-findr';
import useFindr from '../use-findr/use-findr';

export const FindrContext = createContext<Partial<UseFindrReturn<any, any>>|null>(null);

type FindrProviderProps<R, O> = {
  defaultOptions?: O;
} & UseFindAndReplaceProps<R, O> &
  React.PropsWithChildren;

export function FindrProvider<R extends Result, O>({
  onSearch,
  onReplace,
  defaultOptions,
  sourcesKeys = [],
  metadata,
  ...props
}: FindrProviderProps<R, O | undefined>) {
  const value = useFindr<R, O>({ sourcesKeys, metadata, onSearch, onReplace, defaultOptions });
  return (
    <FindrContext.Provider value={value}>{props.children}</FindrContext.Provider>
  );
}

export default FindrProvider;
