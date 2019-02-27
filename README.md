# Ryzen controller

## For users

### Pre-requisite

- Go to https://github.com/FlyGoat/RyzenAdj/releases
- Download the latest compiled version.
- Put the content into the bin folder where the "RyzenController.exe" is.
  - So you have
    ```
    RyzenFolder/
    | RyzenController.exe
    | | bin/
    | | | ryzenadj.exe
    | | | WinRing0x64.dll
    | | | WinRing0x64.sys
    ```

## For developpers

### Pre-requisite

- NodeJS v10.15.1 or newer.

### Installation

```bash
$> cd project
$> npm install
$> npm start
```

### Build

```bash
$> cd project
$> npm run-script build
```
