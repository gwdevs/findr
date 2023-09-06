import { SearchResult } from './index.d';

//TODO: merge this with the CaseHandler type
type ResultsBuilder = (results: SearchResult[], searchIndex : number ) => string;

export const onlyReplace = (s: string): ResultsBuilder => () => s;

export const replaceAndResult = (s: string, r: SearchResult): ResultsBuilder => (results: SearchResult[], searchIndex) => {
    searchIndex++;
    results.push(r);
    return s;
};
