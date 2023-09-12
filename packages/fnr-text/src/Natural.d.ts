/** @namespace Natural */

/**
@description A natural number is an integer that is greater than or equal to 0
@memberof Natural
*/
export type Natural = 
  /*
    this "readonly" bit is a technique called "tagging" and is used
    to ensure that users of Natural cannot use any number value 
    in it's place.

    Consider the alternative:

    ```
    type Natural = number
    ```

    While this makes sense, it has a prolem: nothing prevents a user from
    using something like `1.2` whenever a `Natural` is expected. By tagging
    our number with a Natural symbol we prevent users from accidently using
    a number when a Natural is expected. 

    see https://www.typescriptlang.org/docs/handbook/symbols.html for details on `unique symbol`    
    see https://kubyshkin.name/posts/newtype-in-typescript/ for more a blog
    post on this. 
  */
  { readonly Natural: unique symbol
  ; n: number 
  };

/**
@description Parse a number to a Natural
@memberof Natural
*/
export declare const fromNumber: (n: number) => Natural | null;

/**
@description Converts a Natural to a number
@memberof Natural
*/
export declare const toNumber: (nat: Natural) => number;
