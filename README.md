[![Build Status](https://travis-ci.com/mateodelnorte/meta.svg?branch=master)](https://travis-ci.com/mateodelnorte/meta)
[![npm version](https://badge.fury.io/js/meta.svg)](https://badge.fury.io/js/meta)
<img src="https://img.shields.io/github/release-date/mateodelnorte/meta.svg" alt="Latest Release Date" />

<span class="badge-daviddm"><a href="https://www.npmjs.com/package/meta" title="View the status of this project's dependencies on NPM"><img src="https://img.shields.io/david/mateodelnorte/meta.svg" alt="Dependency Status" /></a></span>
<span class="badge-daviddmdev"><a href="https://www.npmjs.com/package/meta" title="View the status of this project's development dependencies on DavidDM"><img src="https://img.shields.io/david/dev/mateodelnorte/meta.svg" alt="Dev Dependency Status" /></a></span>

<span class="badge-npmdownloads"><a href="https://npmjs.org/package/meta" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/meta.svg" alt="NPM downloads" /></a></span>
<span><img src="https://img.shields.io/github/contributors/mateodelnorte/meta.svg" alt="Contributors" /></span>
<span class="badge-daviddmdev"><a href="https://gitter.im/meta-repos-ftw/Lobby" title="Discuss meta on Gitter"><img src="https://img.shields.io/gitter/room/mateodelnorte/meta.svg" alt="Gitter" /></a></span>

# meta

meta is a tool for managing multi-project systems and libraries. It answers the conundrum of choosing between a mono repo or many repos by saying "both", with a meta repo!

meta is powered by plugins that wrap common commands, letting you execute them against some or all of the repos in your solution at once. meta is built on [loop](https://github.com/mateodelnorte/loop), and as such inherits loops ability to easily target a particular set of directories for executing a common command (eg `meta git status --include-only dir1,dir2`. See [loop](https://github.com/mateodelnorte/loop) for more available options). 

meta is packaged with a few of these core plugins by default: https://github.com/mateodelnorte/meta/blob/master/package.json#L63-L66

## Why meta?

  - clone a many-project architecture in one line
  - give every engineer on your team the same project setup, regardless of where it's cloned
  - npm / yarn install against all your projects at once
  - execute arbitrary commands against many repos to manage your projects
  - super simple plugin architecture using commander.js
  - easily wrap commands for working with any platform, not just Node!
  - meta repo keeps code in per project repos, benefiting deployment and reuse
  - use the same tools you always use. no strange side effects of git submodules or subtree
  - give different teams different slices of your architecture, with multiple metarepos!
  - use `meta project migrate` to migrate mono-repos to a meta repo consisting of many repos

# getting started

## installing

`npm i -g meta` will install a `meta` command on your system.

## initializing a new meta project

To create a new meta project: 

 1. create a new directory for your meta project `mkdir my-meta-repo`
 2. initialize a new git repository in your new dir: `cd my-meta-repo && git init`
 3. initialize your new repository as a meta repo: `meta init`

meta will have created a .meta file to hold references to any child repositories you add. 

 4. 
    (a) to create a new project, use `meta project create [folder] [repo url]`
    (b) to import an existing project, use `meta project import [folder] [repo url]`

for each project added, meta will update your .gitignore file and the .meta file with references to the new child repo

 [![asciicast](https://asciinema.org/a/d3nnfgv3n0vj2omzsl33l8um6.png)](https://asciinema.org/a/d3nnfgv3n0vj2omzsl33l8um6)

You can now perform commands against all of the repositories that make up your meta repository by using `meta exec`.

For example, to list all of the files in each project:

```
meta exec "ls -la"
```

## cloning an existing meta project

To clone an existing meta repo, rather than `git clone` like you are used to, simply execute `meta git clone [meta repo url]` instead. `meta` will clone your meta repo and all child repositories at once. 

```
meta git clone git@github.com:mateodelnorte/meta.git
```

 [![asciicast](https://asciinema.org/a/2rkev7pu41cv51a0bajwnxu7s.png)](https://asciinema.org/a/2rkev7pu41cv51a0bajwnxu7s)

# working with meta

The most basic way to interact with meta repositories is to use the `meta exec` command. This will let you run any command against the projects that make up your meta repo.

```
meta exec "git checkout master"
```

In many cases, that is enough. There are also special cases where the functionality provided by the initial tool wasn't quite meta-y enough, and for those, there are plugins.

Meta plugins are able to wrap common commands for a friendly user experience, or, are able to extend the native tool's capabilities. For example, `git update` is not a git command, but `meta git update` will clone any repos that exist in your .meta file that aren't cloned locally - a problem that doesn't exist with a single git repo.

All in all, you shouldn't have much new syntax to memorize for some crazy new utilities nobody knows about. For instance, if you want to check the `git status` of all your repositories at once, you can just type `meta git status`: 

 [![asciicast](https://asciinema.org/a/83lg1tvqz9gwynixq5nhwsm2k.png)](https://asciinema.org/a/83lg1tvqz9gwynixq5nhwsm2k)

In the case a command has not been wrapped with a plugin, just use `meta exec` instead.

## plugins

All meta functionality is contributed by plugins - node modules that begin with `meta-` and are either installed globally or in your meta repo's node_modules directory. We recommend you install them as devDependencies in your meta repo's package.json. Plugins add additional sub commands to meta, and can leverage [loop](https://github.com/mateodelnorte/loop) or [meta-loop](https://github.com/mateodelnorte/meta-loop) to easily execute a common command against your meta repo and all child repos. 

Here's how easy it is to install `meta-npm` as a plugin, and gain the ability to `meta npm install` all your repos at once:

  [![asciicast](https://asciinema.org/a/8iqph5ju6j00drxpknbj6lnm6.png)](https://asciinema.org/a/8iqph5ju6j00drxpknbj6lnm6)

And if you prefer the speediness of yarn, try `meta-yarn` with `npm install --save-dev meta-yarn`:

 [![asciicast](https://asciinema.org/a/agd362q71smyvblztr1kw07fy.png)](https://asciinema.org/a/agd362q71smyvblztr1kw07fy)

### meta git

#### meta git clone

Clones a meta repository and it's child repositories.

```
meta git clone <repo>
```

#### meta git update

Clones any child repositories from the `.meta` file that are missing.

```
meta git clone <repo>
```

#### meta git status

Track your progress on all branches at once:

```
meta git status
```

 [![asciicast](https://asciinema.org/a/83lg1tvqz9gwynixq5nhwsm2k.png)](https://asciinema.org/a/83lg1tvqz9gwynixq5nhwsm2k)

#### meta git branch

View what branches exist on all your repos:

```
meta git branch
```

 [![asciicast](https://asciinema.org/a/5nt6i1dwm73igxtjgzifyqi2y.png)](https://asciinema.org/a/5nt6i1dwm73igxtjgzifyqi2y)
 
#### meta git checkout

Create new branches on all your repos at once:

```
meta git checkout -b [branch-name]
```

Check out an existing branch in all projects:

```
meta git checkout main
```

Revert all modified files to their remote status:

```
meta git checkout .
```

 [![asciicast](https://asciinema.org/a/amhfxkwax50ef4ic4g1vqyifp.png)](https://asciinema.org/a/amhfxkwax50ef4ic4g1vqyifp)
 
#### meta git clean

Remove unwanted untracked files on all repos:

```
meta git clean -fd
```

 [![asciicast](https://asciinema.org/a/0s8f9wp49nfilzpub3tnf9shg.png)](https://asciinema.org/a/0s8f9wp49nfilzpub3tnf9shg)

### Available Plugins

* [meta-init](https://github.com/mateodelnorte/meta-init)
* [meta-project](https://github.com/mateodelnorte/meta-project)
* [meta-git](https://github.com/mateodelnorte/meta-git)
* [meta-exec](https://github.com/mateodelnorte/meta-exec)
* [meta-gh](https://github.com/mateodelnorte/meta-gh)
* [meta-loop](https://github.com/mateodelnorte/meta-loop)
* [meta-npm](https://github.com/mateodelnorte/meta-npm)
* [meta-yarn](https://github.com/mateodelnorte/meta-yarn)
* [meta-template](https://github.com/patrickleet/meta-template)

### Third-party Plugins

* [meta-bump](https://github.com/patrykzurawik/meta-bump)
* [meta-release](https://github.com/alqh/meta-release)
* [meta-search](https://www.npmjs.com/package/meta-search)

### Available Templates

* [meta-plugin](https://github.com/patrickleet/meta-template-meta-plugin)

## Want to help develop meta locally?

The best way to get started is to do the following:

```
npm i -g meta
meta git clone git@github.com:mateodelnorte/meta.git
cd ./meta
npm install
meta npm install
meta npm link --all
npm link
```

This will clone the meta project, `meta`, enter the directory, and then use `meta` to perform `npm install`, `npm link --all` in each directory listed in `projects` of the `.meta` JSON configuration file, and link meta itself to be used as a global command.

You can then write your command and test using `./bin/meta git gh [subcommand]`. 

You can run the above as a single command:
```
meta git clone git@github.com:mateodelnorte/meta.git && cd ./meta && npm i && meta npm install && meta npm link --all && npm link
```
Yarn lovers can do the same: 
```
npm i -g meta
meta git clone git@github.com:mateodelnorte/meta.git
cd ./meta
yarn
meta yarn install
meta yarn link --all
yarn link
```
Or
```
meta git clone git@github.com:mateodelnorte/meta.git && cd ./meta && yarn && meta yarn install && meta yarn link --all && yarn link
```
See discussion [here](https://github.com/mateodelnorte/meta/issues/8) for more details

## More resources

* [Mono-repo or multi-repo? Why choose one, when you can have both? by @patrickleet](https://medium.com/@patrickleet/mono-repo-or-multi-repo-why-choose-one-when-you-can-have-both-e9c77bd0c668)
* [Developing a plugin for meta by @patrickleet](https://medium.com/@patrickleet/developing-a-plugin-for-meta-bd2e9c39882d)
