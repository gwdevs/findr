// import styled from '@emotion/styled';

// /* eslint-disable-next-line */
// export interface ResultsTreeProps {}

// const StyledResultsTree = styled.div`
//   color: pink;
// `;

// export function ResultsTree(props: ResultsTreeProps) {
//   return (
//     {groupKey && (
//         <TreeView
//           aria-label="file system navigator"
//           defaultCollapseIcon={<ExpandMoreIcon />}
//           defaultExpandIcon={<ChevronRightIcon />}
//           sx={{ height: 240, flexGrow: 1, width: 'auto', overflowY: 'auto' }}
//           // label={_groupsValue.key}
//         >
//           <TreeItem
//             nodeId="1"
//             label={
//               <ResultLabel tooltip={_groupsValue.hoverText}>
//                 {_groupsValue.key}
//               </ResultLabel>
//             }
//           >
//             {_groupsValue?.results?.map((value, index) => (
//               <ResultsTreeItem
//                 key={value.key}
//                 nodeId={_groupsValue.key + value.match + index}
//                 label={
//                   <ResultLabel>
//                     <Box
//                       sx={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         p: 0.5,
//                         pr: 0,
//                       }}
//                     >
//                       <Typography
//                         variant="body2"
//                         sx={{ fontWeight: 'inherit', flexGrow: 1, width: 'auto' }}
//                         title={
//                           value.metadata.bookCode +
//                           ' ' +
//                           value.metadata.chapter +
//                           ':' +
//                           value.metadata.verses
//                         }
//                         onClick={() => onClickResult(value)}
//                       >
//                         <SearchResult
//                           ellipsis={'…'}
//                           context={value.context}
//                           match={value.match}
//                           replacement={value.replacement}
//                           noWrap={true}
//                         />
//                       </Typography>
//                       <Box
//                         component="span"
//                         // variant="caption"
//                         color="inherit"
//                         sx={{ display: 'grid', gridTemplateColumns: 'auto auto' }}
//                       >
//                         <IconButton
//                           aria-label="Replace Result"
//                           title="Replace Result"
//                           size="small"
//                           onClick={() =>
//                             onReplaceResult({
//                               target,
//                               replacement,
//                               result: value,
//                               options,
//                             })
//                           }
//                         >
//                           <VscReplace fontSize="inherit" />
//                         </IconButton>
//                         <IconButton
//                           aria-label="Dismiss result"
//                           size="small"
//                           title="Dismiss result"
//                           onClick={() =>
//                             setGroups((groups) => ({
//                               ...groups,
//                               [groupKey]: {
//                                 ..._groupsValue,
//                                 results: _groupsValue?.results.filter(
//                                   (_, i) => index !== i
//                                 ),
//                               },
//                             }))
//                           }
//                         >
//                           <VscClose fontSize="inherit" />
//                         </IconButton>
//                       </Box>
//                     </Box>
//                   </ResultLabel>
//                 }
//               />
//             ))}
//           </TreeItem>
//         </TreeView>
//       )}
//   );
// }

// export default ResultsTree;
