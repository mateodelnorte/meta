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

1.  create a new directory for your meta project `mkdir my-meta-repo`
2.  initialize a new git repository in your new dir: `cd my-meta-repo && git init`
3.  initialize your new repository as a meta repo: `meta init`

meta will have created a .meta file to hold references to any child repositories you add.

4.  (a) to create a new project, use `meta project create [folder] [repo url]`
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

## Getting meta project updates

If you are working on a team and another members adds a project to the meta repository, to get the project, run `meta git update`.

```sh
# get new .meta file
git pull origin master

# clone missing projects
meta git update
```

# working with meta

## meta exec

The most basic way to interact with meta repositories is to use the `meta exec` command. This will let you run any command against the projects that make up your meta repo.

```
meta exec "git checkout master"
```

In many cases, that is enough. There are also special cases where the functionality provided by the initial tool wasn't quite meta-y enough, and for those, there are plugins.

Even meta-exec, itself is a plugin, but it comes with meta by default.

## plugins

All meta functionality is contributed by plugins - node modules that begin with `meta-` and are either installed globally or in your meta repo's node_modules directory. We recommend you install them as devDependencies in your meta repo's package.json. Plugins add additional sub commands to meta, and can leverage [loop](https://github.com/mateodelnorte/loop) or [meta-loop](https://github.com/mateodelnorte/meta-loop) to easily execute a common command against your meta repo and all child repos.

Here's how easy it is to install `meta-npm` as a plugin, and gain the ability to `meta npm install` all your repos at once:

[![asciicast](https://asciinema.org/a/8iqph5ju6j00drxpknbj6lnm6.png)](https://asciinema.org/a/8iqph5ju6j00drxpknbj6lnm6)

Going deeper - meta plugins are able to wrap common commands for a friendly user experience, such as `meta npm install`. They are also able to extend the native tool's capabilities. For example, `git update` is not a git command, but `meta git update` will clone any repos that exist in your .meta file that aren't cloned locally - a problem that doesn't exist with a single git repo.

You shouldn't have much new syntax to memorize for some crazy new utilities nobody knows about. For instance, if you want to check the `git status` of all your repositories at once, you can just type `meta git status`:

[![asciicast](https://asciinema.org/a/83lg1tvqz9gwynixq5nhwsm2k.png)](https://asciinema.org/a/83lg1tvqz9gwynixq5nhwsm2k)

In the case a command has not been wrapped with a plugin, just use `meta exec` instead.

### Available Plugins

- [meta-init](https://github.com/mateodelnorte/meta-init)
- [meta-project](https://github.com/mateodelnorte/meta-project)
- [meta-git](https://github.com/mateodelnorte/meta-git)
- [meta-exec](https://github.com/mateodelnorte/meta-exec)
- [meta-gh](https://github.com/mateodelnorte/meta-gh)
- [meta-loop](https://github.com/mateodelnorte/meta-loop)
- [meta-npm](https://github.com/mateodelnorte/meta-npm)
- [meta-yarn](https://github.com/mateodelnorte/meta-yarn)
- [meta-template](https://github.com/patrickleet/meta-template)

### Third-party Plugins

- [meta-bump](https://github.com/patrykzurawik/meta-bump)
- [meta-release](https://github.com/alqh/meta-release)
- [meta-search](https://www.npmjs.com/package/meta-search)

### Available Templates

- [meta-plugin](https://github.com/patrickleet/meta-template-meta-plugin)

# Usage Scenarios

## Product Development Team

Your product consists of multiple applications and services. As the project lead, you can use `meta` to group together the projects so every developer is able to `meta git clone` a single project to get everything they need for development.

Furthermore, you could add a `docker-compose` file at this root level to run all of the services and applications:

```
version: '3.7'

services:

  app1:
    image: app1
    build:
      context: projects/app1
    ports:
    - 1234:1234
    env_file: projects/app1/.env

  app2:
    image: app2
    build:
      context: projects/app2
    ports:
    - 1234:1234
    env_file: projects/app2/.env

  service1:
    image: service1
    build:
      context: projects/service1
    ports:
    - 1236:1234
    env_file: projects/service1/.env

  service1:
    image: service1
    build:
      context: src/service2
    ports:
    - 1237:1234
    env_file: src/service2/.env
```

The meta repo is a good place for things like this, including scripts and a `Makefile` that are responsible for meta things, like gettings secrets for each project, like `.env` files for local development.

Take this example `Makefile` at the root of a meta repo:

```Makefile
onboard:
	meta exec "make setup"

setup: install-tools get-secrets

install-tools:
  echo "add install scripts here"

get-secrets:
	echo "get secrets via SOPS/Vault/however and cp into appropriate projects"
```

The command `make onboard` would start the setup task in the root and all of the child directories.

Each project can then contain a `Makefile` like so:

```
setup:
  npm ci
  npm run dev
```

To get new projects up and running you can give them the instructions:

```
meta git clone git@github.com/yourorg/metaproject
cd metaproject
make onboard
```

And they would have a fully running dev environment.

## Developing a Library with many modules

Meta itself is developed with meta. This way you have a monorepo like feel while developing, but with individual components with their own release cycles.

It takes advantage of `npm link`, just like tools like Lerna do.

Using `meta npm link && meta npm link --all` enables a good development experience by creating symlinks so each project uses the development version of any other project in the meta repo:

```sh
# install meta
npm i -g meta

# clone and enter the meta repo
meta git clone git@github.com:mateodelnorte/meta.git
cd ./meta

# install plugins
npm install

# run install for all child repos
meta npm install

# create symlinks to/from all child repos
meta npm link --all

# link meta itself globally
npm link
```

There is admittedly now the problem of updating each repository to use the newly published versions of each other. For this, we recommend using a tool like Renovate, Dependabot, or Greenkeeper.

See this article for an example: [Bring In The Bots, And Let Them Maintain Our Code!](https://hackernoon.com/bring-in-the-bots-and-let-them-maintain-our-code-gh3s33n9)

## Migrating a Monorepo to many repos

'meta project migrate' helps you move from a monorepo to a meta repo by moving directories from
your existing repo into separate child repos, with git history intact. These are then referenced in
your '.meta' file and cloned, making the operation transparent to your codebase.

For example, given the following monorepo structure:

```
- monorepo-base
  - project-a
  - project-b
  - project-c
```

Create git repos for `project-a`, `project-b`, and `project-c`, then run:

```
cd monorepo-base
meta init
meta project migrate project-a git@github.com/yourorg/project-a
meta project migrate project-b git@github.com/yourorg/project-b
meta project migrate project-c git@github.com/yourorg/project-c
```

This will keep the git history of each subproject in tact, using some git magic:

- Explanation: https://help.github.com/en/articles/splitting-a-subfolder-out-into-a-new-repository
- Implementation: https://github.com/mateodelnorte/meta-project/blob/master/lib/splitSubtree.js

### How it works

1. Migrate will first create a copy of your project in a temporary directory and replace the remote
   'origin' with the provided <childRepoUrl>
1. It will split the history from <destFolder> and push to the provided <childRepo>:
   https://help.github.com/en/articles/splitting-a-subfolder-out-into-a-new-repository
1. Next <destFolder> is removed from your monorepo, and then cloned back into the same location.

In the eyes of the monorepo, the only thing that has changed is the .meta file, however, <destFolder> now also has it's own distinct history.

### Migration Phase

If you need the monorepos structure to stay in tact for any extended duration, such as supporting legacy CI systems, you can stop here.

While in this 'migration' phase, you need to commit to the child directory's git history as well as the monorepo's git history. These commits can literally be made twice by cd-ing around or both can be made at once using 'meta git commit'.

### Finishing the Migration

When the monorepo no longer needs to be maintained you can simply add the migrated project to your '.gitignore'.

This will cause changes to only be tracked in the child repo, rather than both, such as during the migration phase.

# FAQs

## How can I create a group of repositories, to, for example, run npm install on only node projects?

There are two ways to do this:

1. Meta repos can contain other meta repos. Make smaller groups of repos that only contain projects with commands that will be executed together. This is commonly not an option such as in migrating legacy monorepos.
1. Use a `Makefile` to declare the groups, and use `make` commands:

```
NODE_APPS=app1,service1,app2,service2

node-install:
	meta npm install --include-only $(NODE_APPS)
```

Then you can run `make node-install`

## Can I run things in parallel?

Yes.

```
meta exec "npm ci" --parallel
```

Output is even grouped nicely together for you at the end! :)

# Developing meta locally

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

- [Mono-repo or multi-repo? Why choose one, when you can have both? by @patrickleet](https://medium.com/@patrickleet/mono-repo-or-multi-repo-why-choose-one-when-you-can-have-both-e9c77bd0c668)
- [Developing a plugin for meta by @patrickleet](https://medium.com/@patrickleet/developing-a-plugin-for-meta-bd2e9c39882d)
