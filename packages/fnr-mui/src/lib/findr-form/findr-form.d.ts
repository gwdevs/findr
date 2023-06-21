import { ChangeEvent, Groups, OnReplaceProps } from '../fnr-mui.d';

interface OnReplaceAllProps extends OnReplaceProps {
  groups: Groups;
}

export interface FindrFormProps {
  onChangeOptions:
    | React.Dispatch<React.SetStateAction<object>>
    | ((params: object) => void);
  onChangeTarget: ChangeEvent;
  onChangeReplacement: ChangeEvent;
  onReplaceAll: (params: OnReplaceAllProps) => void;
  target: string;
  replacement: string;
  options: {
    [key: string]: unknown;
  };
  groups: Groups;
}
