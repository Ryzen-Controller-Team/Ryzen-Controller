# CHANGELOG

<!--- next entry here -->

## 1.14.2
2019-08-11

### Fixes

- Linux was unable to start properly in some cases. (417ae7e927086bff1d53274a6cba5d4418efd0f9)
- Added a donation link. (39fc10a6d2799d33d7d45a749f2122f5b2059cb1)
- **developers:** #40 Removing sentry noise on preset import caused by malformed data. (dbf670287377d4948ee1fe3dc2f89e42239cea5f)
- #41 Disabling auto start was causing error in some cases. (7d2578d9f65ac960dfcf0e171aec2bc821a794ff)
- **developers:** Removed and avoid duplicate entry in CHANGELOG.md. (7c5485b37bdf39af921614aed7eff373e1aaf687)
- Avoid error when gitlab release api won't return a good response. (10954f3fece309eb492741e2e6aaaefa682ef0ed)
- Typo in donation link title. (105bedac2923f29d436e54b3e84a3191d9af93ea)

## 1.14.1
2019-08-04

### Fixes

- Old version was displayed. (ebfdb864effdc8064eef247ae6906a97cbe3407b)
- **developers:** Sentry unable to retrieve stacktrace frames in some cases. (f52edce8fc380167af6489ae0c7ca42f77232ba8)

## 1.14.0
2019-08-04

### Features

- Adding go-semrel-gitlab to automate releases. (c93a168a68ddf002d4cf17576b083f3578930349)
- **developers:** Allow developers to create tabs using options_data.json. (90e15811c3d3d56eb2a7c49f5dd65895c2aff649)
- Reorganize tabs based on option performance impact. (43e50e0bd3de73d71c5612392c243f4641d26508)
- #3 Auto start on windows session login. (b5b9b3c839f1b27d45e3e73804951eb66c58520b)

### Fixes

- Avoid sentry noise by shortening source file path. (ad199c3faa0bdda1829a561b7957993d97e93c4b)
- Notify user when no options are selected when applying settings. (58a8b608265aaabc5d2d8b1589d758b1a8b38d23)
- Enhanced README with videos. (8fd02203c7d3de0d09ab918f360d3a1146d84816)
- Wider window as there is a new tab. (67fc8ae650218cc2b7a7305b4a9d5835f581041b)
- Avoid Sentry noise by creating a random user id. (1a1990b9ad4ed670525e0ffb6f337104c0558bff)
- Better build-exe alive message. (56c9d827bbbc58104ab931ad92b26226d4564aa6)
- Release tab content is now appearing after opening windows from minized start. (b079a535dabe5667d586da0a537ed0c0a934339b)
