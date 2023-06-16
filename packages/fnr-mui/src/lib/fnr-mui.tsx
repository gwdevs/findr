import { useEffect } from 'react';

import { OnChangeOptionsCallback, OptionsBar } from './options-bar/options-bar';
import OptionButton from './option-button/option-button';
import ResultsTree from './results-tree/results-tree';
import ResultsTreeItem from './results-tree-item/results-tree-item';
import SearchResult from './search-result/search-result';
import SearchBox from './search-box/search-box';
import ReplaceBox from './replace-box/replace-box';
import ReplaceButton from './replace-button/replace-button';
import { FnrMUIProps } from './fnr-mui.d'

import { Box, IconButton } from '@mui/material';
import { VscCaseSensitive, VscWholeWord, VscRegex, VscPreserveCase, VscReplace, VscReplaceAll } from 'react-icons/vsc';

const defaultSearchOptions = {
  isCaseMatched: false,
  isWordMatched: false,
  isRegex: false,
};

const defaultReplaceOptions = {
  isCasePreserved: false,
};

function ResultReplaceButton({ onReplace, title }:  { onReplace: () => void, title: string }) {
  return (
    <IconButton
      aria-label={title}
      title={title}
      size="small"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof onReplace === 'function')
          onReplace();
      }}
    >
      <VscReplace fontSize="inherit" />
    </IconButton>
  );
}

export function FnrMUI<Options>({
  sx,
  target,
  replacement,
  options,
  groups,
  setGroups,
  onChangeTarget,
  onChangeReplacement,
  onChangeOptions: _onChangeOptions,
  onSetGroupTitle,
  onSetGroupCaption,
  onReplaceAll,
  onReplaceGroup,
  onReplaceResult,
  onSetResultKey,
  onSetResultTooltip,
  onClickResult = () => null,
  defaultCollapsed = false
}: FnrMUIProps) {

  useEffect(() => {
    if (typeof _onChangeOptions === 'function'){
      _onChangeOptions({ ...defaultSearchOptions, ...defaultReplaceOptions });}
  }, [_onChangeOptions]);

  const onChangeOptions: OnChangeOptionsCallback = (event, newOptions) => {
    if (typeof _onChangeOptions === 'function')
      _onChangeOptions((options: Options) => ({ ...options, ...newOptions }));
  };
  const groupsEntries = Object.entries(groups);
  return (
    <Box sx={{ display: 'grid', ...sx }}>
      <SearchBox
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
      <Box
        sx={{
          display: 'grid',
          gap: '0.5em',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
        }}
      >
        <ReplaceBox
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
          variant='outlined'
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
      <Box>
        {!groupsEntries.length ? null : (
          <ResultsTree
            defaultExpanded={
              defaultCollapsed
                ? []
                : groupsEntries.map(([sourceKey]) => `${sourceKey}`)
            }
          >
            {groupsEntries.map(([sourceKey, group]) =>
              !group?.results?.length ? null : (
                <ResultsTreeItem
                  key={`${sourceKey}`}
                  itemKey={`${sourceKey}`}
                  title={
                    typeof onSetGroupTitle === 'function'
                      ? onSetGroupTitle(group)
                      : sourceKey
                  }
                  onDismiss={key => typeof setGroups === 'function' && setGroups((currentGroups: typeof groups) => {
                    const newGroups = {...currentGroups}
                    delete newGroups[key];
                    return newGroups
                  })}
                  content={
                    typeof onSetGroupCaption === 'function'
                      ? onSetGroupCaption(group)
                      : ''
                  }
                  tooltip={
                    typeof onSetGroupCaption === 'function'
                      ? onSetGroupCaption(group)
                      : undefined
                  }
                  actions={
                    <ResultReplaceButton
                      onReplace={() =>
                        onReplaceGroup({
                          target,
                          replacement,
                          group,
                          options,
                        })
                      }
                      title="Replace group"
                    />
                  }
                >
                  {group?.results?.map((result, index) => {
                    return (
                      <ResultsTreeItem
                        onClick={() => onClickResult({ result })}
                        onDismiss={() =>
                          typeof setGroups === 'function' &&
                          setGroups((currentGroups: typeof groups) => ({
                            ...currentGroups,
                            [sourceKey]: {
                              ...currentGroups[sourceKey],
                              results: currentGroups[sourceKey]?.results.filter(
                                (_, i) => index !== i
                              ),
                            },
                          }))
                        }
                        tooltip={
                          typeof onSetResultTooltip === 'function'
                            ? onSetResultTooltip({ result })
                            : null
                        }
                        key={sourceKey + '/' + index}
                        itemKey={
                          typeof onSetResultKey === 'function'
                            ? onSetResultKey(result)
                            : sourceKey + '/' + index
                        }
                        actions={
                          <ResultReplaceButton
                            onReplace={() =>
                              onReplaceResult({
                                target,
                                replacement,
                                result,
                                options,
                              })
                            }
                            title="Replace result"
                          />
                        }
                        title={
                          <SearchResult
                            context={result.context}
                            match={result.match}
                            replacement={result.replacement}
                          />
                        }
                      />
                    );
                  })}
                </ResultsTreeItem>
              )
            )}
          </ResultsTree>
        )}
      </Box>
    </Box>
  );
}

export default FnrMUI;
