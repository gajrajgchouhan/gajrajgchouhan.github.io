---
title: How to switch between different git accounts on your machine?
date: 2022-03-27
slug: how-to-switch-between-different-git-accounts-on-your-machine
status: published
---

## I'll show you how to switch between git accounts on your machine.

You might have a different git account for work and personal use, switching between those accounts can be time-consuming and prone to error. It's also pretty boring to do. You need to change your email, name and even create a ssh key to use with github.

So what can we do about it ? Why automation, of course!

![6fg3aicn6if41.png](/images/how-to-switch-between-different-git-accounts-on-your-machine/wr-9jJ7sk-c88a3e4f.png) _source - https://www.reddit.com/r/ProgrammerHumor/comments/f0ag3i/automation/_

I created a python script to automate this stuff. To use the script you need to create a file called `gitConfig`. You can create it using

```bash
git config --list > gitConfig
```

Now you need you copy contents of your `.ssh` folder to another folder called `ssh`. So the config file and ssh folder is all you need to switch a user.

To use the `switch_users.py`, install the required dependencies, and make sure the folder structure is of the form as given below.

You can switch your git accounts by specifing the folder name.

```
python3 switch_users.py -f folderName # folderName can be user or work for the tree below.
```

```
.
├── switch_users.py
├── user
│   ├── gitConfig
│   └── ssh
│       ├── authorized_keys
│       ├── id_ed25519
│       ├── id_ed25519.pub
│       ├── id_rsa
│       ├── id_rsa.pub
│       └── known_hosts
└── work
    ├── gitConfig
    └── ssh
        ├── authorized_keys
        ├── id_ed25519
        ├── id_ed25519.pub
        ├── id_rsa
        ├── id_rsa.pub
        └── known_hosts
```

## How does this work?

The code copies the ssh folder for a user, and it sets the email and other keys by reading it from `gitConfig`.

You can find the whole code here - https://github.com/gajrajgchouhan/Switch\_GitConfigs
