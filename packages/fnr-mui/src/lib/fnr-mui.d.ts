import { BoxProps } from '@mui/material';

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

interface OnReplaceAllProps extends OnReplaceProps {
  groups: Groups;
}

interface OnReplaceGroupProps extends OnReplaceProps {
  group: {
    results: Result[];
  };
}

interface OnReplaceResultProps extends OnReplaceProps {
  result: Result;
}

/* eslint-disable-next-line */
export interface FnrMUIProps extends Partial<BoxProps> {
  target: string;
  replacement: string;
  options: {
    [key: string]: unknown;
  };
  groups: Groups;
  setGroups?: React.Dispatch<React.SetStateAction<object>>;
  onChangeTarget: ChangeEvent;
  onChangeReplacement: ChangeEvent;
  onChangeOptions:
    | React.Dispatch<React.SetStateAction<object>>
    | ((params: object) => void);
  onReplaceAll: (params: OnReplaceAllProps) => void;
  onReplaceGroup: (params: OnReplaceGroupProps) => void;
  onReplaceResult: (params: OnReplaceResultProps) => void;
  onSetGroupTitle?: (data: unknown) => string;
  onSetGroupCaption?: (data: unknown) => string;
  onSetResultPopover?: (data: unknown) => string;
  onSetResultKey?: (data: unknown) => string;
  onSetResultTooltip?: (data: unknown) => React.ReactNode;
  onClickResult?: (data: unknown) => void;
  defaultCollapsed: boolean;
}
