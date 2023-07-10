<h1 align="left">@findr/perf 🔍</h1>

Find and Replace pipeline and transforms for [proskomma-json-tools](https://github.com/Proskomma/proskomma-json-tools) based components. This allows building tools to find and replace text accross Bible drafts in PERF (Proskomma Editor Ready Format) format.

<p align="left">
<a href="https://github.com/abelpz/findr/blob/HEAD/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license"></a>
<a href="https://www.npmjs.com/package/@findr/perf"><img src="https://img.shields.io/npm/v/@findr/perf/latest.svg" alt="npm latest package"></a>
<a href="https://www.npmjs.com/package/@findr/perf"><img src="https://img.shields.io/npm/dm/@findr/perf.svg" alt="npm downloads"></a>
</p>

<h2 align="left">Installation</h2>

**@findr/perf** is available as a npm package📚

- npm:

  ```
  npm install @findr/perf
  ```

- yarn:

  ```
  yarn add @findr/perf
  ```

  - pnpm:

  ```
  pnpm add @findr/perf
  ```

<h2 align="left">Usage</h2>

This documentation is a work in progress, check out an example of how this is added to proskomma-json-tools' pipeline handler in [epitelete](https://github.com/Proskomma/epitelete/blob/main/src/index.js):

```js
import { Validator, PipelineHandler } from 'proskomma-json-tools';
import fnr from '@findr/perf'

const pipelineHandler = new PipelineHandler({
    pipelines: ...fnr.pipelines ,
    transforms: ..fnr.transforms,
    proskomma: proskomma,
});
```

<h2 align="left">Made for</h2>

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" width="52" alt="javascript logo"  />
</div>
