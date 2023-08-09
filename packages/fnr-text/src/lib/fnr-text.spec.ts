import fnr from '.';

/*
TODO: Code Readability Suggestions

It was helpful for me to run the test in debug mode to step through the code.
However, there is only one very basic test. **Creating tests to cover all the
basic functionality of Findr would be helpful.**
*/
describe('fnrText', () => {
  it('should work', () => {
    const params = {
      source: 'lorem ipsum dolor sit amet ipsum',
      target: '',
    };
    expect(fnr(params)).toBeTruthy();
    expect(fnr(params).results.length).toBe(0);
    expect(fnr({ ...params, target: 'ipsum' }).results.length).toBe(2);
  });
});

// TODO: Create more tests to cover cases of findr. Examples like replacement, regex, etc.
