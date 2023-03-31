import { Box } from '@mui/material';
import { SearchBox } from './SearchBox';

import { VscCaseSensitive, VscWholeWord, VscRegex } from 'react-icons/vsc';
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
    </Box>
  );
}

export default FnrMUI;
