# meta
tool for turning many repos into a meta repo. why choose many repos or a monolithic repo, when you can have both with a meta repo?

[![asciicast](https://asciinema.org/a/4e5oa02980izleujtrch6bary.png)](https://asciinema.org/a/4e5oa02980izleujtrch6bary)

## Usage

Meta is a work in progress. So far just `git clone` and `git status` are implemented: 
```
➜  development meta

  Usage: meta [options] [command]


  Commands:

    git         manage your meta repo and child git repositories
    help [cmd]  display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```
```
➜  development meta git

  Usage: meta-git [options] [command]


  Commands:

    clone       clone meta and child repositories
    status      git status of meta and child repositories
    help [cmd]  display help for [cmd]

  Options:

    -h, --help  output usage information
```

## Plugins

The git functionality above is provided to meta via the [meta-git](https://github.com/mateodelnorte/meta-git) plugin. 
Meta, itself, actually only implements functionality to load plugins, provide tab completion, and render help text. As such,
all functionality comes from plugins. Want to add functionality to run against your entire system, composed of many repos, all 
at once? Write a plugin! Plugins follow the git-subcommand pattern of commander.js and implement a single index.js function 
to apply their top level menu to the bare meta command. 
