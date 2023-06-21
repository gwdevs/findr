import { FindrFormProps } from './findr-form/findr-form.d';
import { FindrResultProps } from './findr-results/findr-results.d';

type ChangeEvent = React.ChangeEventHandler<
  HTMLTextAreaElement | HTMLInputElement
>;

interface Result {
  match: string;
  replacement: string;
  context: {
    before: string;
    after: string;
  };
}

interface Groups {
  [key: string]: {
    results: Result[];
  };
}

interface OnReplaceProps {
  target: string;
  replacement: string;
  options: {
    [key: string]: unknown;
  };
}

interface OnReplaceGroupProps extends OnReplaceProps {
  group: {
    results: Result[];
  };
}

interface OnReplaceResultProps extends OnReplaceProps {
  result: Result;
}

export interface FindrMUIProps extends FindrFormProps, FindrResultProps {
  open?: boolean;
}