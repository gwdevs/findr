import { FindrMUIProps } from './fnr-mui.d';
import { Box, Collapse } from '@mui/material';
import FindrForm from './findr-form/findr-form';
import FindrResults from './findr-results/findr-results';

export function FindrMUI({
  sx,
  target,
  replacement,
  options,
  groups,
  setGroups,
  onChangeTarget,
  onChangeReplacement,
  onChangeOptions,
  onSetGroupTitle,
  onSetGroupCaption,
  onReplaceAll,
  onReplaceGroup,
  onReplaceResult,
  onSetResultKey,
  onSetResultTooltip,
  onClickResult = () => null,
  onRenderResult = () => null,
  defaultCollapsed = false,
  open = true,
  contextLength = 6,
}: FindrMUIProps) {
  return (
    <Collapse in={open}>
      <Box sx={{ display: 'grid', ...sx }}>
        <FindrForm
          {...{
            onChangeTarget,
            onChangeReplacement,
            onChangeOptions,
            onReplaceAll,
            target,
            replacement,
            options,
            groups,
          }}
        />
        <FindrResults
          {...{
            target,
            replacement,
            options,
            groups,
            setGroups,
            onChangeOptions,
            onSetGroupTitle,
            onSetGroupCaption,
            onReplaceGroup,
            onReplaceResult,
            onSetResultKey,
            onSetResultTooltip,
            onClickResult,
            onRenderResult,
            defaultCollapsed,
            contextLength,
          }}
        />
      </Box>
    </Collapse>
  );
}

export default FindrMUI;
