import * as React from 'react';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';

import { VscClose } from 'react-icons/vsc';
export interface ResultsTreeItemProps
  extends Omit<TreeItemProps, 'nodeId' | 'title' | 'label' | 'onClick'> {
  tooltip?: React.ReactNode;
  itemKey: string;
  title?: React.ReactNode;
  content?: React.ReactNode;
  onReplace?: (key: string) => void;
  onDismiss?: (key: string) => void;
  onClick?: (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    key: string
  ) => void;
  actions?: React.ReactNode;
  nodeId?: string;
  onRenderTitle?: ({ items }: { items: React.ReactNode }) => React.ReactNode;
}

const theme = createTheme({
  components: {
    MuiTreeItem: {
      styleOverrides: {
        content: {
          width: 'auto',
        },
        group: {
          marginLeft: 0,
        },
      },
    },
  },
});

export function ResultsTreeItem({
  itemKey,
  tooltip,
  title,
  content,
  onRenderTitle = () => null,
  onReplace = () => null,
  onDismiss = () => null,
  onClick = () => null,
  children,
  actions,
  ...props
}: ResultsTreeItemProps) {
  const renderTitle = React.useCallback(
    (items: typeof children) => {
      const customItems = onRenderTitle({ items });
      return customItems || items;
    },
    [onRenderTitle]
  );

  return (
    <ThemeProvider theme={theme}>
      <TreeItem
        key={itemKey}
        onClick={(e) => onClick(e, itemKey)}
        label={
          <Tooltip title={tooltip || ''} enterDelay={800} enterNextDelay={800}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) auto',
                gap: 0.5,
                p: 0.5,
                pr: 0,
                '&:hover': {
                  '& .action-buttons': {
                    display: 'grid',
                  },
                  '& .results-count': {
                    display: 'none',
                  },
                },
              }}
            >
              <Box
                component={'span'}
                sx={{
                  display: 'inline-block',
                  alignItems: 'center',
                  p: 0.5,
                  pr: 0,
                  textOverflow: 'ellipsis',
                  position: 'relative',
                  textWrap: 'nowrap',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'inherit',
                    width: 'auto',
                    display: 'inline',
                  }}
                >
                  {renderTitle(title)}{' '}
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 'inherit', width: 'auto' }}
                  >
                    {content}
                  </Typography>
                </Typography>
              </Box>
              <Box
                className={'action-buttons'}
                color="inherit"
                sx={{ display: 'none', gridAutoFlow: 'column' }}
              >
                {[
                  actions,
                  <IconButton
                    aria-label="Dismiss result"
                    size="small"
                    title="Dismiss"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDismiss(itemKey);
                    }}
                  >
                    <VscClose fontSize="inherit" />
                  </IconButton>,
                ]
                  .flat()
                  .map((action, index) => {
                    return (
                      <Box key={index} sx={{ display: 'inline-block' }}>
                        {action}
                      </Box>
                    );
                  })}
              </Box>
              <Box
                className={'results-count'}
                color="inherit"
                sx={{ display: 'grid', gridAutoFlow: 'column' }}
              >
                {Array.isArray(children) && children.length ? (
                  <Chip
                    label={children.length}
                    sx={{ transform: 'scale(0.8)' }}
                    color={'primary'}
                  />
                ) : null}
              </Box>
            </Box>
          </Tooltip>
        }
        {...props}
        nodeId={String(itemKey)}
      >
        {children}
      </TreeItem>
    </ThemeProvider>
  );
}

export default ResultsTreeItem;
