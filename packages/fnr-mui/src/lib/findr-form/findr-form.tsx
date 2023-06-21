import { useEffect, useState } from 'react';
import { OnChangeOptionsCallback } from '../options-bar/options-bar';
import OptionButton from '../option-button/option-button';
import SearchBox from '../search-box/search-box';
import ReplaceBox from '../replace-box/replace-box';
import ReplaceButton from '../replace-button/replace-button';
import { FindrFormProps } from "./findr-form.d"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, Button, Collapse, FormControl } from '@mui/material';

import {
  VscCaseSensitive,
  VscWholeWord,
  VscRegex,
  VscPreserveCase,
  VscReplaceAll,
} from 'react-icons/vsc';
import OptionsBar from '../options-bar/options-bar';

const defaultSearchOptions = {
  isCaseMatched: false,
  isWordMatched: false,
  isRegex: false,
};

const defaultReplaceOptions = {
  isCasePreserved: false,
};

export function FindrForm<Options>({
  onChangeOptions: _onChangeOptions,
  onChangeTarget,
  onChangeReplacement,
  onReplaceAll,
  target,
  replacement,
  options,
  groups
}: FindrFormProps) {
  const [showReplace, setShowReplace] = useState(false);

  useEffect(() => {
    if (typeof _onChangeOptions === 'function') {
      _onChangeOptions({ ...defaultSearchOptions, ...defaultReplaceOptions });
    }
  }, [_onChangeOptions]);

  const onChangeOptions: OnChangeOptionsCallback = (event, newOptions) => {
    if (typeof _onChangeOptions === 'function')
      _onChangeOptions((options: Options) => ({ ...options, ...newOptions }));
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto minmax(0, 1fr)',
        gridAutoFlow: 'column',
        gap: '0.2em',
      }}
    >
      <FormControl margin={'dense'}>
        <Button
          title={'toggle replace'}
          sx={{
            height: '100%',
            p: 0,
            minWidth: 'auto',
            color: 'rgba(0, 0, 0, 0.87)',
          }}
          variant={'text'}
          onClick={() => setShowReplace((value) => !value)}
        >
          {showReplace ? <ExpandMoreIcon /> : <NavigateNextIcon />}
        </Button>
      </FormControl>
      <Box sx={{ display: 'grid', padding: '0em' }}>
        <SearchBox
          defaultValue={target}
          onChange={
            typeof onChangeTarget === 'function' ? onChangeTarget : () => null
          }
          searchOptions={
            <OptionsBar
              defaultOptions={defaultSearchOptions}
              onChange={onChangeOptions}
            >
              <OptionButton value="isCaseMatched" title="Match Case">
                <VscCaseSensitive size={'1.5em'} />
              </OptionButton>
              <OptionButton value="isWordMatched" title="Match Whole Word">
                <VscWholeWord size={'1.5em'} />
              </OptionButton>
              <OptionButton value="isRegex" title="Use Regular Expression">
                <VscRegex size={'1.5em'} />
              </OptionButton>
            </OptionsBar>
          }
        />
        <Collapse in={showReplace}>
          <Box
            sx={{
              display: 'grid',
              gap: '0.5em',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
            }}
          >
            <ReplaceBox
              defaultValue={replacement}
              onChange={
                typeof onChangeReplacement === 'function'
                  ? onChangeReplacement
                  : () => null
              }
              replaceOptions={
                <OptionsBar
                  defaultOptions={defaultReplaceOptions}
                  onChange={onChangeOptions}
                >
                  <OptionButton value="isCasePreserved" title="Preserve case">
                    <VscPreserveCase size={'1.5em'} />
                  </OptionButton>
                </OptionsBar>
              }
            />
            <ReplaceButton
              variant="outlined"
              onClick={() => {
                onReplaceAll({
                  target,
                  replacement,
                  groups,
                  options,
                });
              }}
              title="Replace All"
            >
              <VscReplaceAll fontSize="1.3em" />
            </ReplaceButton>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}

export default FindrForm;
