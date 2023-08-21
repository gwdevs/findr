# findr

findr is a set of utility libraries for building find and replace UIs in Javascript.

<p>
<a href="https://opencomponents.io/component/unfoldingWord/findr" title="findr is part of the OCE"><img src="https://img.shields.io/badge/OCE-component-green?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDcuNDEgMTQ3LjQxIj48dGl0bGU+b2NlX2NvbXBvbmVudDwvdGl0bGU+PGcgaWQ9IkNhcGFfMiIgZGF0YS1uYW1lPSJDYXBhIDIiPjxnIGlkPSJDYXBhXzEtMiIgZGF0YS1uYW1lPSJDYXBhIDEiPjxwYXRoIGQ9Ik04Ny4xNSw4Ny4zM2MtNy41MSw3LjUzLTguMzYsMjIuNSw4LjExLDI1LjI3LDguMjcsMS40MywxMS42LDUuNCw4LDEwLjE0TDc4LjU3LDE0Ny40MSw0OSwxMTcuODhjLTQuNzMtMy42MS04LjctLjI5LTEwLjEzLDgtMi43NywxNi40OC0xNy43NCwxNS42My0yNS4yNyw4LjEybC0uMTktLjE5Yy03LjUtNy41Mi04LjM1LTIyLjQ5LDguMTItMjUuMjcsOC4yOC0xLjQzLDExLjYtNS40LDgtMTAuMTNMMCw2OC44NSwyNC42OCw0NC4xN2M0Ljc0LTMuNjEsOC43MS0uMjgsMTAuMTMsOCwyLjc4LDE2LjQ4LDE3Ljc1LDE1LjYzLDI1LjI4LDguMTJsLjE4LS4xOGM3LjUtNy41NCw4LjM2LTIyLjUxLTguMTItMjUuMjgtOC4yNi0xLjQyLTExLjYtNS40LTgtMTAuMTNMNjguODUsMCw5OC4zOSwyOS41NGM0LjcyLDMuNjEsOC43LjI5LDEwLjEyLTgsMi43Ny0xNi40OCwxNy43NC0xNS42MiwyNS4yOC04LjEybC4xOS4xOWM3LjQ5LDcuNTIsOC4zNCwyMi41LTguMTIsMjUuMjctOC4yOCwxLjQzLTExLjYsNS40MS04LDEwLjEzbDI5LjU0LDI5LjU1LTI0LjY3LDI0LjY4Yy00Ljc0LDMuNjEtOC43MS4yOC0xMC4xNC04LTIuNzgtMTYuNDgtMTcuNzUtMTUuNjItMjUuMjctOC4xMVoiIHN0eWxlPSJmaWxsOiMyZjVjNmUiLz48L2c+PC9nPjwvc3ZnPg==&amp;style=for-the-badge&amp;labelColor=ffffff&amp;?color=2f5c6e" alt="Open Components Ecosystem"></a>
<a href="https://discord.com/channels/867746700390563850/867746700390563853" title="OCE discord server"><img src="https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&amp;logo=discord&amp;logoColor=white" alt="Discord"></a>
<a href="https://github.com/unfoldingWord/findr/blob/HEAD/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge" alt="license"></a>
</p>

---

## Documentation

| Local Package | NPM Package | Tutorial | Description |
| - | - | - | - |
| [fnr-text](./packages/fnr-text)   | [@findr/text](https://npmjs.com/@findr/text)    | [@findr/text tutorial](https://findrjs.netlify.app/) | all the logic behind a find-and-replace feature |
| [fnr-react](./packages/fnr-react) | [@findr/react](https://npmjs.com/@findr/react)  |  | state management needed to build your own find-and-replace components |
| [fnr-mui](./packages/fnr-mui)     | [@findr/mui](https://npmjs.com/@findr/mui)      |  | library of GUI components for find-and-replace based on [@mui/material](https://mui.com/material-ui/getting-started/) |
| [fnr-perf](./packages/fnr-perf)   | [@findr/perf](https://npmjs.com/@findr/perf)    |  | Pipeline and Actions needed for find-and-replace scripture using [proskomma-json-tools](https://github.com/Proskomma/proskomma-json-tools/) |

[API reference documentation](https://unfoldingword.github.io/findr/index.html)

---

# Contributing

## Support

Join the [Open Components Ecosystem Discord](https://discord.com/channels/867746700390563850/1019675732324143205) for help.

## Getting Started

_All commands (*and `package.json` scripts*) should be executed from root and not from the packages directories._

Install dependencies and launch the playground: 
  ```shell
  pnpm install
  pnpm nx preview fnr-pg
  ```

## Monorepo Tools

This repo is organized as a monorepo and uses the following Javascript tools: 
  - [Nx, a build system](https://nx.dev) 
  - [pnpm, package manager - like npm](https://pnpm.io/installation)

For those new to the Nx and/or pnpm ecosystem here are common commands used in this project:

* Creating a new [**react**](https://nx.dev/packages/react/generators/library) or [**javascript**](https://nx.dev/packages/js/generators/library) library, i.e:

  ```Shell
  pnpm nx g[enerate] lib[rary] --publishable --importPath=@findr/new --name=fnr-new
  ```
* [Creating a component in an existing react package](https://nx.dev/packages/react/generators/component), i.e:

  ```Shell
  pnpm nx g[enerate] c[omponent] --project=fnr-mui
  ```
* Building a library, i.e:

  ```Shell
  pnpm nx build fnr-mui
  ```
* Running a script from package's `package.json`, say `start`, i.e:

  ```Shell
  pnpm nx preview fnr-pg
  ```
* Adding a package dependency should also be done from root, i.e:

  ```Shell
  pnpm add [package-name]
  ```
* See a diagram of the dependencies of the projects:

  ```Shell
  nx graph  
  ```

