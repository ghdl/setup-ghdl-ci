
<p align="center">
  <a title="'Test' workflow Status" href="https://github.com/ghdl/setup-ghdl-ci/actions?query=workflow%3ATest"><img alt="'test' workflow Status" src="https://img.shields.io/github/workflow/status/ghdl/setup-ghdl-ci/Test?longCache=true&style=flat-square&label=test&logo=github"></a><!--
  -->
  <a title="Dependency Status" href="https://david-dm.org/ghdl/setup-ghdl-ci"><img src="https://img.shields.io/david/ghdl/setup-ghdl-ci.svg?longCache=true&style=flat-square&label=deps&logo=npm"></a><!--
  -->
  <a title="DevDependency Status" href="https://david-dm.org/ghdl/setup-ghdl-ci?type=dev"><img src="https://img.shields.io/david/dev/ghdl/setup-ghdl-ci.svg?longCache=true&style=flat-square&label=devdeps&logo=npm"></a>
</p>

# GitHub Action to setup [GHDL](https://github.com/ghdl/ghdl)

**setup-ghdl-ci** is a JavaScript GitHub Action (GHA) to setup GHDL using [nightly](https://github.com/ghdl/ghdl/releases/tag/nightly) release assets. Latest packages are retrieved and installed along with required dependencies, to enable testing of VHDL designs in Continuous Integration (CI) workflows.

Currently, GitHub Actions workflow tasks running on Ubuntu or Windows are supported only. Precisely [environments](https://github.com/actions/virtual-environments#available-environments) `ubuntu-18.04`|`ubuntu-latest`, `ubuntu-20.04`, `windows-2019`|`windows-latest` or `windows-2016` can be used.

Contributions for supporting addional [platforms](https://help.github.com/en/actions/reference/virtual-environments-for-github-hosted-runners#supported-runners-and-hardware-resources) or CI services are welcome! For instance, GHDL is already tested on GitHub Actions `macos-latest`, but packaging is not done yet.

## Usage

See [test.yml](.github/workflows/test.yml) and the [actions tab](https://github.com/ghdl/setup-ghdl-ci/actions) for runs of this action! :rocket:

### Ubuntu

```yaml
- uses: ghdl/setup-ghdl-ci@nightly
  with:
    backend: llvm

- run: ghdl --version
```

Allowed values for `backend` are: `mcode` (default), `llvm` or `gcc`.

### Windows

For convenience, this Action sets environment variable `MSYS2_PATH` to the root of the MSYS2 installation. That can be used for running GHDL from powershell, the command-line or from Git for Windows.

```yml
- uses: msys2/setup-msys2@v2
  with:
    msystem: MINGW64
    update: true

- uses: ghdl/setup-ghdl-ci@nightly
  with:
    backend: llvm

- shell: msys2 {0}
  run: |
    echo "MSYS2_PATH: $MSYS2_PATH"
    ghdl --version

- shell: bash
  run: |
    echo "MSYS2_PATH: $MSYS2_PATH"
    "$MSYS2_PATH"${{ matrix.sys.msys }}\\bin\\ghdl.exe --version

- shell: powershell
  run: |
    echo "MSYS2_PATH: $env:MSYS2_PATH"
    & "$($env:MSYS2_PATH)${{ matrix.sys.msys }}\bin\ghdl.exe" --version
```

Note that MSYS2 must be setup first. Using Action [`msys2/setup-msys2`](https://github.com/msys2/setup-msys2) is recommended.

Allowed values are `MINGW64` and `llvm`, or, `MINGW32` and `mcode`. Other options (`MINGW64-mcode`, `MINGW64-gcc`, `MINGW32-llvm` or `MINGW32-gcc`) are not possible or supported yet.

## Development

Changes should be done in [`main.js`](./main.js), but are uneffective until JS sources are packaged. Packaging generates [`index.js`](./index.js), which is the entry point for GitHub Actions (as defined in [`action.yml`](./action.yml)). Packaging assembles the code into one file, enabling fast and reliable execution and preventing the need to check in `node_modules`.

```sh
$ npm install
$ npm run pkg
```

- See the [metadata documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)
- See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.
- See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)
