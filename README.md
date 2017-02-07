# meta

A tool for managing multi-project systems and libraries. Why choose between a monorepo and many repos, when you can have a meta repo?

## Why meta?

Most developers, at some point in their careers, work on what they later learn was a monolithic appication. And, typically, they walk
away from that experience with a healthy motivation to never build or work on such an app again. 

Long before the term 'microservices' got popular, people were building distributed systems. Those who learned to fear monolithic apps
were building distributed systems with many services, where each service does one thing and does it well. Often, by making a service do 
one thing – and only one thing – the complexity of that service would be dramatically reduced, compared to something a bit more monolithic.
But the cost of spreading your complexity out amongst simpler parts is to have a bit of complexity in the architecture, itself. The trees
are quite easy to see, but the forest starts out a bit fuzzy.

Meta is a plugin-powered tool whose purpose is to make building distributed systems easier. It does so by providing commands which can be 
executed against any number of projects in your solution at once. Need to create a branch on five projects at once, commit, and push? start 
with `meta git checkout -b feature/my-new-branch --include-only project1, project2, project3`. 

## Why not X?

Meta was created after years of using an alternative tool, gitslave, to manage very large systems. Gitslave works in much the same way as meta-git's commands. But, 
gitslave is minimally supported and clunky. Meta started as an attempt to replace gitslave, but quickly turned into something more than
just git commands. 

Git submodules and git subtree both offer the ability to load child repositories under a parent, but both too have some clunkiness around 
ensuring updates end up in the correct repository, or that updates indeed make it into yours. 

Lerna is the newest kid on the block. Lerna hears the question "Mono repo or many repos?" and says mono. Unfortunately, despite their benefits, 
monorepos have problems of their own. Eventually, as systems get large enough, different services become owned by different teams and individuals. 
Over time, it makes less sense to have a single repository define the entire system that runs an organization. Eventually, teams would prefer to 
run slices of that system. Lerna does not have this capability, but meta does. Meta can allow finer grained access permissions to different
parts of your code base. And, with some fancy tricks, meta can still provide all the benefits of a metarepo (think a special branch that contains
you child repository files, for the purpose of continuous integration).

[![asciicast](https://asciinema.org/a/4e5oa02980izleujtrch6bary.png)](https://asciinema.org/a/4e5oa02980izleujtrch6bary)

## Sample Usage

Meta is a work in progress. So far just `git clone`, `git status`, and `git checkout` are implemented: 
```
➜  meta

  Usage: meta [options] [command]


  Commands:

    exec        run commands against your meta and child repositories
    git         manage your meta repo and child git repositories
    init        initialize a new meta repo
    npm         run npm commands against your meta and child repositories
    project     add & remove child repositories
    help [cmd]  display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```
```
➜  meta git

  Usage: meta-git [options] [command]


  Commands:

    checkout    checkout a common branch across all repositories
    clone       clone meta and child repositories
    status      git status of meta and child repositories
    help [cmd]  display help for [cmd]

  Options:

    -h, --help  output usage information
```

## Plugin Architecture

The git functionality above is provided to meta via the [meta-git](https://github.com/mateodelnorte/meta-git) plugin. 
Meta, itself, actually only implements functionality to load plugins, provide tab completion, and render help text. As such,
all functionality comes from plugins. 

Want to add functionality to run against your entire system, composed of many repos, all 
at once? Write a plugin! Plugins follow the git-subcommand pattern of commander.js and implement a single index.js function 
to apply their top level menu to the bare meta command. 
