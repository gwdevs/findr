import { TreeView, TreeViewProps } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { devNull } from 'os';

/* eslint-disable-next-line */
export type ResultsTreeProps = TreeViewProps;

export function ResultsTree({ children, sx, ...props }: ResultsTreeProps) {
  return ['string', 'number', 'boolean'].includes(typeof children) ||
    !children ? null : (
    <TreeView
      aria-label="Results list"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{
        maxHeight: 240,
        flexGrow: 1,
        width: 'auto',
        overflowY: 'auto',
        ...sx,
      }}
      {...props}
    >
      {children}
    </TreeView>
  );
}

export default ResultsTree;
