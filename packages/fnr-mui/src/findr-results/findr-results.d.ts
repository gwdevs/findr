import * as React from 'react';
import { BoxProps } from "@mui/material";
import { Groups } from '../findr-mui/findr-mui.d';

export interface FindrResultProps extends Partial<BoxProps> {
  target: string;
  replacement: string;
  options: {
    [key: string]: unknown;
  };
  groups: Groups;
  setGroups?: React.Dispatch<React.SetStateAction<object>>;
  onChangeOptions:
    | React.Dispatch<React.SetStateAction<object>>
    | ((params: object) => void);
  onReplaceGroup: (params: OnReplaceGroupProps) => void;
  onReplaceResult: (params: OnReplaceResultProps) => void;
  onSetGroupTitle?: (data: unknown) => string;
  onSetGroupCaption?: (data: unknown) => string;
  onSetResultPopover?: (data: unknown) => string;
  onSetResultKey?: (data: unknown) => string;
  onSetResultTooltip?: (data: unknown) => React.ReactNode;
  onClickResult?: (data: unknown) => void;
  defaultCollapsed: boolean;
  onRenderResult?: (args: {
    nodes: React.ReactNode;
    data: unknown;
  }) => React.ReactNode;
  contextLength?: number;
}

