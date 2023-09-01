import { SearchResult } from './index.d';

type ResultsBuilder = (results: SearchResult[], searchIndex : number, replaceIndex : number) => string;

export const onlyReplace = (s: string): ResultsBuilder => () => s;

export const replaceAndResult = (s: string, r: SearchResult): ResultsBuilder => (results: SearchResult[], searchIndex, replaceIndex) => {
    searchIndex++;
    replaceIndex++;
    results.push(r);
    return s;
};
