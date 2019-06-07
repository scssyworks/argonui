const execSync = require('child_process').execSync;
const { hasArgs } = require('./args');
const isWindows = process.platform === 'win32';
if (hasArgs('development')) {
  execSync(`npm run ${isWindows ? 'sasslintDevWin' : 'sasslintDev'}`, { stdio: 'inherit' });
} else {
  execSync(`npm run ${isWindows ? 'sasslintWin' : 'sasslint'}`, { stdio: 'inherit' });
}
