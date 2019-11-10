# CHANGELOG

<!--- next entry here -->

## 1.16.0
2019-11-10

### Features

- Added Dark mode option and tutorial section. (ca1bb86e76c593e8bc7ba642f3f2e0064f56b700)

### Fixes

- :pencil2: Better notification sentence. (3e15ca9a68f3dcc2817b955afe5f1d6bb1f8296c)
- fixed save preset bug (1002880af72421253f83b59ad25105752c1a81ac)

## 1.15.1
2019-08-25

### Fixes

- Keep settings on upgrade. (b967b36a62022dd9d7f6cf5247e56677d5587612)
- Notification will now be displayed using system if available. (ebec1d047ad599601574aa2b7f64b1a217a7ac57)

## 1.15.0
2019-08-18

### Features

- #39 You can now define preset to be applied on AC status change. (55d13e2c5a65abc99d1be5130d7df87368f7923c)

### Fixes

- Updated Sentry to 5.6.1. (27b835c2c22b754d1ea8b080690b26485d288f87)
- #42 revamped start on boot as it was still causing error for some users. (9d01b070d388881bacbfb7e58a0082d53c0a7e40)
- #43 Stop trying to apply settings when ryzenadj has not been set. (ef35ffe128827ebce7c008719e1a5e7643ce1b76)
- #44 Fixed an issue where exporting presets with non latin 1 character was impossible. (22554b41dc0d863bbea53da51b2e97a7cbc318d8)
- **developers:** Avoid recreate shortcut and enabling Sentry in development mode. (32e94d7fc26bd1d9f0741b92780027144c5c7579)
- Added discord link. (029ffc2be972b316373a2f87e57fef1e91257f90)
- **developers:** Refactor windows detection. (89f9950b5973a2cfbdc30ab91e36709def7106ac)
- Tiny notification when applying ryzenAdj. (2442514c1659eea6dce329666364b40e288bfdff)
- **developers:** Display dev version while using development environment. (d87abc47361c574790a13a0b08a63378091c3759)
- Unable to detect dev mode properly. (1a7fd0098aef4c229be5e5ec55a1106a60b620b2)
- Ensure preset exist when applying. (2152f32b8f20b41336990598d77f42548566de8d)

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
