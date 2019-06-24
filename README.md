# Ryzen controller

*_I'm looking for maintainers and reviewers, if you know html/js and have some spare times, please open an issue or ping `@storm1er#0376` on [discord](https://discord.gg/EahayUv)._*

- [Installation](#installation)
  - [Windows](#windows)
  - [Debian like](#debian-like)
  - [Redhat like](#redhat-like)
- [Development](#development)
  - [Pre-requisite](#pre-requisite)
  - [Installation](#installation)
  - [Building binaries](#building-binaries)
    - [Using Windows](#using-windows)
    - [Using Linux](#using-linux)
  - [Building installers](#building-installers)
    - [For Windows](#for-windows)
    - [For Debian like](#for-debian-like)
    - [For Redhat like](#for-redhat-like)

Thanks to https://github.com/FlyGoat/RyzenAdj and his author, ryzenadj.exe is included (windows only for now).

## Installation

### Windows

- Go to [release page](https://gitlab.com/le.storm1er/ryzen-controller/releases)
- Download the latest `RyzenControllerInstaller.exe`
- Enjoy!

### Debian like

- Go to [RyzenAdj](https://github.com/FlyGoat/RyzenAdj) repo.
- Download and build as explained in [Build requirements](https://github.com/FlyGoat/RyzenAdj#build-requirements).
- Go to Ryzen Controller's [release page](https://gitlab.com/le.storm1er/ryzen-controller/releases)
- Download the latest `ryzencontroller_VERSION_ARCH.deb` file.
- `sudo dpkg -i ryzencontroller_VERSION_ARCH.deb`
- Launch with `sudo ryzencontroller`
- Set the path to your freshly builded `ryzenadj` binary into the "settings" tab.
- Enjoy!

### Redhat like

- Go to [RyzenAdj](https://github.com/FlyGoat/RyzenAdj) repo.
- Download and build as explained in [Build requirements](https://github.com/FlyGoat/RyzenAdj#build-requirements).
- Go to Ryzen Controller's [release page](https://gitlab.com/le.storm1er/ryzen-controller/releases)
- Download the latest `ryzencontroller_VERSION_ARCH.rpm` file.
- `sudo rpm -u ryzencontroller_VERSION_ARCH.rpm`
- Launch with `sudo ryzencontroller`
- Set the path to your freshly builded `ryzenadj` binary into the "settings" tab.
- Enjoy!

## Development

**THIS PART IS ONLY FOR DEVELOPMENT PURPOSE, IF YOU JUST WANT TO USE RYZEN CONTROLLER, SEE THE [INSTALLATION](#installation) PART.**

### Pre-requisite

- NodeJS v10.15.1 or newer.
- About building dependencies:
  - No dependencies for windows installer
  - See [electron-installer-debian requirements](https://github.com/electron-userland/electron-installer-debian#requirements)
  - See [electron-installer-redhat requirements](https://github.com/electron-userland/electron-installer-redhat#requirements)

### Installation

```bash
$> cd project
$> npm install
$> npm start
```

### Building binaries

#### Using Windows

```bash
$> cd project
$> npm run-script package-win32
```

#### Using Linux

```bash
$> cd project
$> npm run-script package-linux
```

### Building installers

#### For Windows

```bash
$> cd project
$> npm run-script package-win32
$> npm run-script build-win32
```

#### For Debian like

```bash
$> cd project
$> npm run-script package-linux
$> npm run-script build-deb
```

#### For Redhat like

```bash
$> cd project
$> npm run-script package-linux
$> npm run-script build-rpm
```
