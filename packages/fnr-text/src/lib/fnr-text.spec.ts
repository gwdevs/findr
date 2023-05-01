import fnr from '.';

describe('fnrText', () => {
  it('should work', () => {
    const params = { source: 'lorem ipsum dolor sit amet ipsum', target: '' };
    expect(fnr(params)).toBeTruthy();
    expect(fnr(params).results.length).toBe(0);
    expect(fnr({ ...params, target: 'ipsum' }).results.length).toBe(2);
  });
});
