const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

var keepAlive = false;

getInstallerConfig()
.then(createWindowsInstaller)
.catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
.then(function(){
  clearInterval(keepAlive);
  console.log('Installer created.');
})

function getInstallerConfig () {
  console.log('creating windows installer')
  keepAlive = setInterval(function(){
    console.log(`I'm alive ...`);
  }, 10000);
  const rootPath = path.join('./')
  
  return Promise.resolve({
    appDirectory: path.join(rootPath, 'release-builds', 'RyzenController-win32-ia32/'),
    authors: 'Decaunes Quentin',
    outputDirectory: path.join(rootPath, 'installer-builds'),
    setupExe: 'RyzenControllerInstaller.exe',
    noMsi: true
  })
}
