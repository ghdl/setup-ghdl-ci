const core = require('@actions/core');
const exec = require('@actions/exec');
const io = require('@actions/io');
const tc = require('@actions/tool-cache');
const path = require('path');

async function run() {
  try {
    const isWindows = process.platform == 'win32';
    let backend = core.getInput('backend');
    if (backend === '') { backend = 'mcode' };

    const url = 'https://github.com/ghdl/ghdl/releases/download/nightly/' + (isWindows ?
      (backend === 'llvm' ?
        'mingw-w64-x86_64-ghdl-llvm-ci-1-any.pkg.tar.zst'
        :
        'mingw-w64-i686-ghdl-mcode-ci-1-any.pkg.tar.zst'
      )
      :
      'ghdl-gha-ubuntu-' + backend + '.tgz'
    );
    console.log('Package URL:', url);

    const pkg = await tc.downloadTool(url);
    console.log('Package:', pkg);

    if (isWindows) {

      await exec.exec('msys2do', ['pacman', '--noconfirm', '-U', pkg.replace(/\\/g, '/')]);
      await exec.exec('msys2do', ['pacman', '--noconfirm', '-S', 'gcc', 'zlib-devel']);
      if (backend == 'llvm') {
        await exec.exec('msys2do', ['pacman', '--noconfirm', '-S', 'mingw-w64-x86_64-clang']);
      }

    } else {

      const tmp_dir = process.env['RUNNER_TEMP'];
      if (!tmp_dir) {
        core.setFailed('Undefined environment variable RUNNER_TEMP');
        return;
      }
      const dest = path.join(tmp_dir, 'ghdl');
      await io.mkdirP(dest);
      console.log('Destination:', pkg);
      core.addPath(path.join(dest, 'bin'));

      await exec.exec('tar', ['-xvf', pkg], {cwd: dest});
      // FIXME: without libgnat-7 the following error is produced:
      // ghdl: error while loading shared libraries: libgnarl-7.so.1: cannot open shared object file: No such file or directory
      // See https://github.com/ghdl/docker/issues/9
      await exec.exec('sudo', ['apt', 'install', '-y', 'libllvm5.0', 'libgnat-7']);

    }

    core.exportVariable('GHDL', 'ghdl');
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
