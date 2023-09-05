export type CaseHandler = (match: string, replaced: string) => string;

export const maintainCase: CaseHandler = (match, replaced) => String(match).toUpperCase() === match ? String(replaced).toUpperCase()
    //TODO: remove need to pass in uppercase regex
    : match[0].toUpperCase() ? `${replaced[0].toUpperCase()}${replaced.slice(1)}`
        : replaced;

export const replaceCase: CaseHandler = (_, r) => r; 