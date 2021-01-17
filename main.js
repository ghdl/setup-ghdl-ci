const core = require('@actions/core');
const exec = require('@actions/exec');
const io = require('@actions/io');
const tc = require('@actions/tool-cache');
const path = require('path');

async function run() {
  try {
    const isWindows = process.platform == 'win32';
    const isLinux = process.platform == 'linux';
    let backend = core.getInput('backend');
    if (backend === '') { backend = 'mcode' };

    let osVersion = '';

    if ( isLinux ) {
      const options = {
        listeners: {
          stdout: (data) => { osVersion += data.toString().replace(/^\s+|\s+$/g, ''); }
        }
      };
      if ( await exec.exec('sed', ['-n', 's/^VERSION_ID="\\(.*\\)".*/\\1/p', '/etc/os-release'], options) ) {
        throw new Error(`Could not read os version ID from '/etc/os-release!`);
      };
      if ( osVersion !== '18.04' && osVersion !== '20.04' ) {
        throw new Error(`Ubuntu version ${ osVersion.replace(/^\s+|\s+$/g, '') } is not supported!`);
      }
    }

    const url = 'https://github.com/ghdl/ghdl/releases/download/nightly/' + (isWindows ?
      (backend === 'llvm' ?
        'mingw-w64-x86_64-ghdl-llvm-ci-1-any.pkg.tar.zst'
        :
        'mingw-w64-i686-ghdl-mcode-ci-1-any.pkg.tar.zst'
      )
      :
      `ghdl-gha-ubuntu-${ osVersion }-${ backend }.tgz`
    );
    console.log('Package URL:', url);

    const pkg = await tc.downloadTool(url);
    console.log('Package:', pkg);

    let ghdlPrefix = '';

    if (isWindows) {

      async function pacman(args, opts) {
        await exec.exec('msys2', ['-c', ['pacman', '--noconfirm'].concat(args).join(' ')], opts);
      }
      await pacman(['-U', pkg.replace(/\\/g, '/')]);
      await pacman(['-S', '--needed', 'gcc']);

      let MSYS2_PATH = '';
      await exec.exec('msys2', ['-c', ['cygpath', '-w', '/'].join(' ')], {
        listeners: { stdout: (data) => { MSYS2_PATH = data.toString().trim(); } }
      });
      core.exportVariable('MSYS2_PATH', MSYS2_PATH);
      ghdlPrefix = MSYS2_PATH + process.env['MSYSTEM'];

    } else {

      const tmp_dir = process.env['RUNNER_TEMP'];
      if (!tmp_dir) {
        core.setFailed('Undefined environment variable RUNNER_TEMP');
        return;
      }
      ghdlPrefix = path.join(tmp_dir, 'ghdl');
      await io.mkdirP(ghdlPrefix);
      console.log('Destination:', pkg);
      core.addPath(path.join(ghdlPrefix, 'bin'));

      await exec.exec('tar', ['-xvf', pkg], {cwd: ghdlPrefix});

      // For 18.04
      let gnatVersion = '7';
      let llvmVersion = '5.0';

      if ( osVersion == '20.04' ) {
        gnatVersion = '9';
        llvmVersion = '10';
      }

      // FIXME: without libgnat-* the following error is produced:
      // ghdl: error while loading shared libraries: libgnarl-*.so.1: cannot open shared object file: No such file or directory
      // See https://github.com/ghdl/docker/issues/9
      let pkgs = ['libgnat-' + gnatVersion]

      if (backend == 'llvm') {
        pkgs = pkgs.concat(['libllvm' + llvmVersion])
      }
      await exec.exec('sudo', ['apt', 'install', '-y'].concat(pkgs));
    }

    core.exportVariable('GHDL', path.join(ghdlPrefix, 'bin', 'ghdl' + ((isWindows) ? '.exe' : '')));
    const ghdlLibs = path.join(ghdlPrefix, 'lib', 'ghdl');
    // GHDL expects GHDL_PREFIX this variable to point to the libs prefix, not to the system prefix where GHDL is installed
    core.exportVariable('GHDL_PREFIX', ghdlLibs );
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
