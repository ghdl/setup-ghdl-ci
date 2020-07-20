
<p align="center">
  <a title="'test' workflow Status" href="https://github.com/ghdl/setup-ghdl-ci/actions?query=workflow%3Atest"><img alt="'test' workflow Status" src="https://img.shields.io/github/workflow/status/ghdl/setup-ghdl-ci/test?longCache=true&style=flat-square&label=test&logo=github"></a><!--
  -->
  <a title="Dependency Status" href="https://david-dm.org/ghdl/setup-ghdl-ci"><img src="https://img.shields.io/david/ghdl/setup-ghdl-ci.svg?longCache=true&style=flat-square&label=deps&logo=npm"></a><!--
  -->
  <a title="DevDependency Status" href="https://david-dm.org/ghdl/setup-ghdl-ci?type=dev"><img src="https://img.shields.io/david/dev/ghdl/setup-ghdl-ci.svg?longCache=true&style=flat-square&label=devdeps&logo=npm"></a>
</p>

# GitHub Action to setup [GHDL](https://github.com/ghdl/ghdl)

**setup-ghdl-ci** is a JavaScript GitHub Action (GHA) to setup GHDL using [nightly](https://github.com/ghdl/ghdl/releases/tag/nightly) release assets. Latest packages are retrieved and installed along with required dependencies, to enable testing of VHDL designs in Continuous Integration (CI) workflows.

Currently, GitHub Actions workflow tasks running on `ubuntu-latest` or `windows-latest` are supported only. Contributions to support addional [platforms](https://help.github.com/en/actions/reference/virtual-environments-for-github-hosted-runners#supported-runners-and-hardware-resources) or CI services are welcome!

## Usage

See [test.yml](.github/workflows/test.yml) and the [actions tab](https://github.com/ghdl/setup-ghdl-ci/actions) for runs of this action! :rocket:

### `ubuntu-latest`

```yaml
- uses: ghdl/setup-ghdl-ci@master
  with:
    backend: llvm
- run: ghdl --version
```

Allowed values for `backend` are: `mcode` (default), `llvm` or `gcc`.

### `windows-latest`

```yml
- uses: msys2/setup-msys2@v2
  with:
    msystem: MINGW64
    update: true
- uses: ghdl/setup-ghdl-ci@master
  with:
    backend: llvm
- shell: msys2 {0}
  run: |
    ghdl --version
```

Note that MSYS2 must be setup first. At the moment, MSYS2 is not available on `windows-latest` environments by default. Hence, using Action [`msys2/setup-msys2`](https://github.com/msys2/setup-msys2) is required.

Allowed values are `MINGW64` and `llvm`, or, `MINGW32` and `mcode`. Other options (`MINGW64-mcode`, `MINGW64-gcc`, `MINGW32-llvm` or `MINGW32-gcc`) are not possible or supported yet.

## Development

Changes should be done in [`main.js`](./main.js), but are uneffective until JS sources are packaged. Packaging generates [`index.js`](./index.js), which is the entry point for GitHub Actions (as defined in [`action.yml`](./action.yml)). Packaging assembles the code into one file, enabling fast and reliable execution and preventing the need to check in `node_modules`.

```sh
$ npm install
$ npm run pkg
```

> NOTE: Unlike other Actions, this is not tagged or explicitly versioned yet. Hence, changes MUST be tested on feature branches prior to merging into `master`.

- See the [metadata documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)
- See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.
- See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)
