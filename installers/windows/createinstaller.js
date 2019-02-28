const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
.then(createWindowsInstaller)
.catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  
  return Promise.resolve({
    appDirectory: path.join(rootPath, 'release-builds', 'RyzenController-win32-ia32/'),
    authors: 'Decaunes Quentin',
    outputDirectory: path.join(rootPath, 'installer-builds'),
    setupExe: 'RyzenControllerInstaller.exe',
    noMsi: true
  })
}
