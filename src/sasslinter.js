const execSync = require('child_process').execSync;
const argv = require('yargs').argv;
const isWindows = process.platform === 'win32';
if (argv.development) {
  execSync(`npm run ${isWindows ? 'sasslintDevWin' : 'sasslintDev'}`, { stdio: 'inherit' });
} else {
  execSync(`npm run ${isWindows ? 'sasslintWin' : 'sasslint'}`, { stdio: 'inherit' });
}
