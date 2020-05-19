
<p align="center">
  <a title="'test' workflow Status" href="https://github.com/umarcor/setup-ghdl/actions?query=workflow%3Atest"><img alt="'test' workflow Status" src="https://img.shields.io/github/workflow/status/umarcor/setup-ghdl/test?longCache=true&style=flat-square&label=test&logo=github"></a>
</p>

# GitHub Action to setup [GHDL](https://github.com/ghdl/ghdl)

**setup-ghdl** is a JavaScript GitHub Action (GHA) to setup GHDL, using *nightly* releases. Latest packages are retrieved and installed to enable fast testing of VHDL designs.

## Usage

See [test.yml](.github/workflows/test.yml) and the [actions tab](https://github.com/umarcor/setup-ghdl/actions) for runs of this action! :rocket:

### `ubuntu-latest`

```yaml
- uses: umarcor/setup-ghdl@master
  with:
    backend: llvm
- run: ghdl --version
```

Allowed values for `backend` are: `mcode` (default), `llvm` or `gcc`.

### `windows-latest`

```yml
- uses: eine/setup-msys2@v0
  with:
    msystem: MINGW64
    update: true
- uses: umarcor/setup-ghdl@master
  with:
    backend: llvm
- shell: msys2 {0}
  run: |
    ghdl --version
```

Note that MSYS2 must be setup first. At the moment, MSYS2 is not available on `windows-latest` environments by default. Hence, using Action [`eine/setup-msys2`](https://github.com/eine/setup-msys2) is required.

Allowed values are `MINGW64` and `llvm`, or, `MINGW32` and `mcode`. Other options (`MINGW64-mcode`, `MINGW64-gcc`, `MINGW32-llvm` or `MINGW32-gcc`) are not supported yet.

## Development

```sh
$ npm install
$ npm run pkg
```

> NOTE: GitHub Actions will run the entry point from the `action.yml`. Packaging assembles the code into one file, enabling fast and reliable execution and preventing the need to check in `node_modules`.

- See the [metadata documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)
- See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.
- See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)
