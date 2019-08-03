const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')
const lyrics = [
  "I'm awake",
  "I'm alive",
  "now",
  "I know",
  "what I",
  "believe inside",
  "NOW",
  "It's my time",
  "I'll do",
  "what I want",
  "'cause this",
  "is my life",
  "Here",
  "right now",
  "I will",
  "stand my ground",
  "and never back down",
  "I know",
  "what I",
  "believe inside",
  "I'm awake",
  "and",
  "I'm alive",
  "--",
];
var lyrics_pos = -1;
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
    lyrics_pos++;
    console.log(`${lyrics[ lyrics_pos % lyrics.length ]}`);
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
