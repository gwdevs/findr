import { Box, IconButton, Typography } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ListItemButton from '@mui/material/ListItemButton';
import { SearchBox } from './SearchBox';
import { ReplaceBox } from './ReplaceBox';
// import { ToggleButton, ToggleButtonGroup } from '@mui/material';
// import Tooltip from '@mui/material/Tooltip';
// import DoneIcon from '@mui/icons-material/Done';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  VscReplace,
  VscReplaceAll,
  VscClose,
  VscCaseSensitive,
  VscWholeWord,
  VscRegex,
} from 'react-icons/vsc';
import { useDebouncedCallback } from 'use-debounce';
import { ResultDialog } from './ResultDialog';
import { ResultLabel } from './ResultLabel';
import { SearchResult } from './SearchResult';
import { ResultsTreeItem } from './ResultsTreeItem';
import { ReplaceButton } from './ReplaceButton';
import { OnChangeOptionsCallback, OptionsBar } from './OptionsBar';

import { OptionButton } from './OptionButton';
import { useFnrContext } from '@findr/ui';

const defaultSearchOptions = {
  isCaseMatched: false,
  isWordMatched: false,
  isRegex: false,
};

const defaultReplaceOptions = {
  isCasePreserved: false,
};

export function FnrMUI<Options>() {
  const { actions: fnrActons, state: fnrState } = useFnrContext();

  const { setOptions } = fnrActons ?? {};
  const { options } = fnrState ?? {};

  console.log({ options });

  const onChangeOptions: OnChangeOptionsCallback = (event, newOptions) => {
    if (typeof setOptions === 'function')
      setOptions((options: Options) => ({ ...options, ...newOptions }));
  };

  return (
    <Box sx={{ display: 'grid' }}>
      <SearchBox
        searchOptions={
          <OptionsBar
            defaultOptions={defaultSearchOptions}
            onChange={onChangeOptions}
          >
            <OptionButton
              value="isCaseMatched"
              aria-label="isCaseMatched"
              title="Match Case"
            >
              <VscCaseSensitive size={'1.5em'} />
            </OptionButton>
            <OptionButton
              value="isWordMatched"
              aria-label="isWordMatched"
              title="Match Whole Word"
            >
              <VscWholeWord size={'1.5em'} />
            </OptionButton>
            <OptionButton
              value="isRegex"
              aria-label="isRegex"
              title="Use Regular Expression"
            >
              <VscRegex size={'1.5em'} />
            </OptionButton>
          </OptionsBar>
        }
      />
      <Box
        sx={{
          display: 'grid',
          gap: '0.5em',
          gridTemplateColumns: 'auto min-content min-content',
        }}
      >
        {/* <ReplaceBox
          defaultOptions={[]}
          onChange={handleRepChange}
          onChangeOptions={onChangeReplaceOptions}
        />
        <ReplaceButton
          onClick={() => {
            onReplaceResult({
              target,
              replacement,
              result: groups[groupKey]?.results?.[0],
              options,
            });
          }}
          variant="contained"
          sx={{ height: '100%' }}
          title="Replace Next"
        >
          <VscReplace fontSize="1.3em" style={{ margin: 'auto' }} />
        </ReplaceButton>
        <ReplaceButton
          onClick={() => {
            onReplaceAll({
              target,
              replacement,
              group: _groupsValue,
              options,
            });
          }}
          variant="contained"
          sx={{ height: '100%' }}
          title="Replace All"
        >
          <VscReplaceAll fontSize="1.3em" style={{ margin: 'auto' }} />
        </ReplaceButton> */}
      </Box>
    </Box>
  );
}

export default FnrMUI;
