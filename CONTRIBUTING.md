# How to contribute

## 1. For everyone

You can help us in many ways:

Without beeing a developer
- By [opening an issue](https://gitlab.com/ryzen-controller-team/ryzen-controller/issues/new) when:
  - you found a bug
  - have a suggestion
  - or just to tell us thanks
- By testing new features an give feedbacks
  - on merge requests labeled `[to-test]`, take a look at the pipelines, you'll see some some green "bubbles". The one named _installers_ allow you to download artifacts.

If you have some developer/IT knowledge
- By doing code reviews:
  - on merge requests labeled `[to-review]`, by commenting the code.
  - on the [whole codebase](https://gitlab.com/ryzen-controller-team/ryzen-controller/tree/v2-react/src), by [opening an issue](https://gitlab.com/ryzen-controller-team/ryzen-controller/issues/new)

If you want to be a part of Ryzen Controller Team, ask to become a member by [opening an issue](https://gitlab.com/ryzen-controller-team/ryzen-controller/issues/new) ;)

## 2. To members or Ryzen Controller Team

### 2.1. Git workflow

This project is fast forward commit only. It means the [commit graph](https://gitlab.com/ryzen-controller-team/ryzen-controller/-/network/master) will stay on one line. It also means that every merge request must be up-to-date with the target branch before beeing merged.

This allow us to avoid any side effect due to merge commits.

A little article about this: [A git workflow using rebase](https://medium.com/singlestone/a-git-workflow-using-rebase-1b1210de83e5)

#### 2.1.1. Quick example

```bash
git clone git@gitlab.com:ryzen-controller-team/ryzen-controller.git ryzencontroller
cd ryzencontroller
git checkout -b my-bugfix
# Doing stuff with files
git add .
git commit -m "fix: Ensure people know what to do."
git push origin my-bugfix
```
Then you'll see a like to create a merge request

### 2.2. Automation

This project contains a [`.gitlab-ci.yml`](https://gitlab.com/ryzen-controller-team/ryzen-controller/blob/master/.gitlab-ci.yml) file.

This file allow us to auotmatically test, build, package and publish Ryzen Controller app.

It's executed for each merge request update and each week on the master branch.

Here a list of what's done by stage.

#### 2.2.1. Tests

Some jobs to enhance gitlab features like [code quality review](https://docs.gitlab.com/ee/user/project/merge_requests/code_quality.html), [security dashboard](https://gitlab.com/ryzen-controller-team/ryzen-controller/security/dashboard/), [Static Application Security Testing](https://docs.gitlab.com/ee/user/application_security/sast/).

And a release-check ([sample job](https://gitlab.com/ryzen-controller-team/ryzen-controller/-/jobs/400164480)), this analyse commit list to detect if a new version must be released.

#### 2.2.2. Install

`yarn install --frozen-lockfile`: https://yarnpkg.com/lang/en/docs/cli/install/#toc-yarn-install-frozen-lockfile

Don’t generate a yarn.lock lockfile and fail if an update is needed.

#### 2.2.3. Build

`yarn build`: Compile projects files into `build/` folder, production ready.

#### 2.2.4. Installers

`yarn dist-pack-all`: Create a electron package and the installers that goes with it.

#### 2.2.5. Release note

Only executed on scheduled pipelines

`create-rpm-link`, `create-deb-link`, `create-exe-link`: Create bitly links so we can count downloads =)
`update-changelog`: Update [CHANGELOG.md](https://gitlab.com/ryzen-controller-team/ryzen-controller/blob/master/CHANGELOG.md) files, will be used for the release description.

#### 2.2.6. Release

Only executed on scheduled pipelines

`publish`: Will create a new [release](https://gitlab.com/ryzen-controller-team/ryzen-controller/-/releases)
`no-publish`: Avoid the red flag when no release has to be published.
