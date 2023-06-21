import { useMemo } from 'react';
import ResultsTree from '../results-tree/results-tree';
import ResultsTreeItem from '../results-tree-item/results-tree-item';
import SearchResult from '../search-result/search-result';
import { FindrResultProps } from './findr-results.d';
import { Box, IconButton } from '@mui/material';
import { VscReplace } from 'react-icons/vsc';

function ResultReplaceButton({
  onReplace,
  title,
}: {
  onReplace: () => void;
  title: string;
}) {
  return (
    <IconButton
      aria-label={title}
      title={title}
      size="small"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof onReplace === 'function') onReplace();
      }}
    >
      <VscReplace fontSize="inherit" />
    </IconButton>
  );
}

export function FindrResults({
  sx,
  target,
  replacement,
  options,
  groups,
  setGroups,
  onSetGroupTitle,
  onSetGroupCaption,
  onReplaceGroup,
  onReplaceResult,
  onSetResultKey,
  onSetResultTooltip,
  onClickResult = () => null,
  onRenderResult = () => null,
  defaultCollapsed = false,
  contextLength = 6,
}: FindrResultProps) {
  const groupsEntries = useMemo(() => Object.entries(groups), [groups]);
  return (
    <Box sx={sx}>
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
                onDismiss={(key) =>
                  typeof setGroups === 'function' &&
                  setGroups((currentGroups: typeof groups) => {
                    const newGroups = { ...currentGroups };
                    delete newGroups[key];
                    return newGroups;
                  })
                }
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
                          minCtxWords={contextLength}
                          context={result.context}
                          match={result.match}
                          replacement={result.replacement}
                        />
                      }
                      onRenderTitle={({ items }) =>
                        onRenderResult({ nodes: items, data: result })
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
  );
}

export default FindrResults;
