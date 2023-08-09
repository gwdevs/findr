import fnr from '..';
import { SearchResult } from '../index.d';
import { FindrMultiLineParams } from './index.d';

export function findrMultiLine(params: FindrMultiLineParams) {
  const { source, metadata, config = {}, target } = params;
  const { buildResultKey } = config;
  const _source = source.split('\n');
  let _results: SearchResult[] = [];
  const _replaced: string[] = [];
  _source.forEach((line: string, lineIndex: number) => {
    const lineNumber = lineIndex + 1;
    const _buildResultKey = buildResultKey
      ? (index: number) => buildResultKey(index, lineNumber)
      : (index: number) => _results.length + index;
    const _metadata = { ...metadata, lineNumber };
    const { results, replaced } = fnr({
      ...params,
      source: line,
      target,
      metadata: _metadata,
      config: { ...config, buildResultKey: _buildResultKey },
    });
    if (results.length) {
      _results = _results.concat(results);
    }
    _replaced.push(replaced);
  });
  return {
    results: _results,
    replaced: _replaced.join('\n'),
  };
}

export default findrMultiLine