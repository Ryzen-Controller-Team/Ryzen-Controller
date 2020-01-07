### Prerequisite

- Node v11
- Yarn

### Why yarn

See https://github.com/electron-userland/electron-builder/issues/1147#issuecomment-276284477

### Debian install 

```bash
# Install the app
sudo dpkg -i ryzen-controller_x.x.x_amd64.deb
# If you get error about missing dependencies
sudo apt-get -f install
# To ensure correct temperature and others sys-info
sudo apt-get -y smartmontools lm-sensors
```
