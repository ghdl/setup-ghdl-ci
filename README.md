<p align="center">
  <a title="'Test' workflow Status" href="https://github.com/ghdl/setup-ghdl-ci/actions/workflows/test.yml"><img alt="'test' workflow Status" src="https://img.shields.io/github/actions/workflow/status/ghdl/setup-ghdl-ci/test.yml?branch=master&longCache=true&style=flat-square&label=Test&logo=GitHubActions&logoColor=fff"></a><!--
  -->
</p>

# GitHub Action to setup [GHDL](https://github.com/ghdl/ghdl)

> [!CAUTION]
> This GitHub Action has been deprecated in favor of [setup-ghdl](https://github.com/ghdl/setup-ghdl).
> ```yml
> jobs:
>   GHDL-on-Ubuntu:
>     runs-on: ubuntu-24.04
>     steps:
>       - name: Run VHDL Simulation
>         uses: ghdl/setup-ghdl@v1
>         with:
>           version: nightly
>           backend: mcode
> ```

**setup-ghdl-ci** is a JavaScript GitHub Action (GHA) to setup GHDL using [nightly](https://github.com/ghdl/ghdl/releases/tag/nightly) release assets. Latest packages are retrieved and installed along with required dependencies, to enable testing of VHDL designs in Continuous Integration (CI) workflows.

Currently, GitHub Actions workflow tasks running on Ubuntu or Windows are supported only. Precisely [environments](https://github.com/actions/virtual-environments#available-environments) `ubuntu-20.04`, `ubuntu-22.04`, `ubuntu-24.04`|`ubuntu-latest`, `windows-2019` or `windows-2022`|`windows-latest` can be used.

Contributions for supporting addional [platforms](https://help.github.com/en/actions/reference/virtual-environments-for-github-hosted-runners#supported-runners-and-hardware-resources) or CI services are welcome! For instance, GHDL is already tested on GitHub Actions `macos-latest`, but packaging is not done yet.

## Usage

See [test.yml](.github/workflows/test.yml) and the [actions tab](https://github.com/ghdl/setup-ghdl-ci/actions) for runs of this action! :rocket:

This Action sets envvars `GHDL`, `GHDL_PREFIX`, and (on Windows only) `MSYS2_PATH`. Those can be used for running GHDL from shells other than `bash`.

### Ubuntu

```yaml
- uses: ghdl/setup-ghdl-ci@nightly
  with:
    backend: llvm

- run: |
    ghdl --version

    $GHDL --version
```

Allowed values for `backend` are: `mcode` (default), `llvm` or `gcc`.

### Windows

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
    ghdl --version

    $GHDL --version

- shell: bash
  run: |
    $GHDL --version

    "$MSYS2_PATH"MINGW64\\bin\\ghdl.exe --version

- shell: powershell
  run: |
    & "$env:GHDL" --version

    & "$($env:MSYS2_PATH)MINGW64\bin\ghdl.exe" --version
```

Note that MSYS2 must be setup first. Using Action [`msys2/setup-msys2`](https://github.com/msys2/setup-msys2) is recommended.
Allowed values are `MINGW64`, `MINGW32`, or `UCRT64`.
Note that simulation with mcode backend on 64 bits is not supported yet, and backend LLVM is not available on 32 bits yet.

## Development

Changes should be done in [`main.js`](./main.js), but are uneffective until JS sources are packaged. Packaging generates [`index.js`](./index.js), which is the entry point for GitHub Actions (as defined in [`action.yml`](./action.yml)). Packaging assembles the code into one file, enabling fast and reliable execution and preventing the need to check in `node_modules`.

```sh
$ npm install
$ npm run pkg
```

- See the [metadata documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)
- See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.
- See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)
