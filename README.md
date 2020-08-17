# Ryzen controller

*_I'm looking for maintainers and reviewers, if you know Electron/React and have some spare times, please open an issue or ping `@storm1er#0376` on [discord](https://discord.gg/EahayUv)._*

Thanks to https://github.com/FlyGoat/RyzenAdj and his author, ryzenadj.exe is included (windows only for now).

- [What's this?](#whats-this)
- [Installation](#installation)
  - [Windows](#windows)
  - [Debian like](#debian-like)
  - [Redhat like](#redhat-like)
- [Troubleshoot, Q&A](#troubleshoot-qa)
- [Development](#development)
  - [Pre-requisite](#pre-requisite)
  - [Dev install](#dev-install)
  - [Building binaries and installers](#building-binaries-and-installers)
    - [Using Windows](#using-windows)
    - [Using Linux](#using-linux)

## What's this?

- It's a little Ryzen Master for laptops.
- Works best on 2xxx Ryzen series (3xxx series is experimental)

## Installation

### Windows

- Go to [release page](https://gitlab.com/le.storm1er/ryzen-controller/releases)
- Download the latest `Ryzen Controller Setup X.X.X.exe`
- Enjoy!

### Debian like

- Go to [RyzenAdj](https://github.com/FlyGoat/RyzenAdj) repo.
- Download and build as explained in [Build requirements](https://github.com/FlyGoat/RyzenAdj#build-requirements).
- Go to Ryzen Controller's [release page](https://gitlab.com/le.storm1er/ryzen-controller/releases)
- Download the latest `ryzen-controller_X.X.X_ARCH.deb` file.
- `sudo dpkg -i ryzen-controller_X.X.X_ARCH.deb`
- Launch with `sudo ryzencontroller`
- Set the path to your freshly builded `ryzenadj` binary into the "settings" tab.
- Enjoy!

### Redhat like

- Go to [RyzenAdj](https://github.com/FlyGoat/RyzenAdj) repo.
- Download and build as explained in [Build requirements](https://github.com/FlyGoat/RyzenAdj#build-requirements).
- Go to Ryzen Controller's [release page](https://gitlab.com/le.storm1er/ryzen-controller/releases)
- Download the latest `ryzen-controller-X.X.X.ARCH.rpm` file.
- `sudo rpm -u ryzen-controller-X.X.X.ARCH.rpm`
- Launch with `sudo ryzencontroller`
- Set the path to your freshly builded `ryzenadj` binary into the "settings" tab.
- Enjoy!

### Caution!
- Ryzen Controller Team is not liable for any damages that my occur from using Ryzen Controller or RyzenADJ, Please use at your own risk!

## Troubleshoot, Q&A

> I'm getting an error when installing ryzen controller on linux

_You may need to install `smartmontools` & `lm-sensors` packages to allow Ryzen Controller to work well._
```bash
# Install the app
sudo dpkg -i ryzen-controller_x.x.x_amd64.deb
# If you get error about missing dependencies
sudo apt-get -f install
# To ensure correct temperature and others sys-info
sudo apt-get -y smartmontools lm-sensors
```

> Why yarn?

_See https://github.com/electron-userland/electron-builder/issues/1147#issuecomment-276284477_



## Development

**THIS PART IS ONLY FOR DEVELOPMENT PURPOSE, IF YOU JUST WANT TO USE RYZEN CONTROLLER, SEE THE [INSTALLATION](#installation) PART.**

### Pre-requisite

- NodeJS v10.18.0 or newer.
- About building dependencies:
  - No dependencies for windows installer
  - See [electron-installer-debian requirements](https://github.com/electron-userland/electron-installer-debian#requirements)
  - See [electron-installer-redhat requirements](https://github.com/electron-userland/electron-installer-redhat#requirements)

### Dev install

```bash
cd project
yarn install --frozen-lockfile # Please commit any change in yarn.lock/package.json in separated merge request
yarn start # You may want to look at "start:*" scripts in package.json
```

### Building binaries and installers

#### Using Windows

```bash
cd project
yarn docker # may not be needed, depends on your machine
yarn clean # You may want to look at "clean:*" scripts in package.json
yarn dist-pack-win # You may want to look at "dist-pack:*" scripts in package.json
```

#### Using Linux

```bash
cd project
yarn docker # may not be needed, depends on your machine
yarn clean # You may want to look at "clean:*" scripts in package.json
yarn dist-pack-linux # You may want to look at "dist-pack:*" scripts in package.json
```
