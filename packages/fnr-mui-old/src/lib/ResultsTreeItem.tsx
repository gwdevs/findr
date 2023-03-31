// import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';
import TreeItem from '@mui/lab/TreeItem';
import { TreeItemProps } from '@mui/lab';

// const theme = createTheme({
//   components: {
//     MuiTreeItem: {
//       styleOverrides: {
//         content: {
//           width: 'auto',
//         },
//       },
//     },
//   },
// });

// const StyledTreeItem = styled((props: TreeItemProps) => (
//   <TreeItem {...props} TransitionComponent={TransitionComponent} />
// ))(({ theme }) => ({
//   [`& .${treeItemClasses.iconContainer}`]: {
//     '& .close': {
//       opacity: 0.3,
//     },
//   },
//   [`& .${treeItemClasses.group}`]: {
//     marginLeft: 15,
//     paddingLeft: 18,
//     borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
//   },
// }));

export function ResultsTreeItem(props: TreeItemProps) {
  return (
    // <ThemeProvider theme={theme}>
    <TreeItem {...props} /* sx={{ width: 'auto' }} */ />
    // </ThemeProvider>
  );
}
