---
title: Tips for better Linux experience as a dev.
date: 2022-09-07
slug: tips-for-better-linux-experience-as-a-dev
status: published
---

These tips are from my own experience.

**Add a backup method.**

I currently use a program called `rclone` to backup my stuff. I didn't want to install multiple programs for each cloud provider like Drive, Dropbox, also there is not much support in case of Linux. I found `rclone` to be highly customisable and easy to setup.

I have a script which I run every other day, you can run it manually or set up a cronjob.

```bash
#!/bin/bash

/usr/bin/rclone copy -L --update \
         --verbose --transfers 30  \
         --checkers 8 --contimeout 60s \
         --timeout 300s --retries 3 \
         --low-level-retries 10 --stats 1s \
         --max-size "50M" --exclude="**.mp4" \
         --exclude="**.mov" --exclude="**.mkv" \
         --exclude="**.m4v" --exclude="**.pgm" \
         --exclude="env/**" --exclude="__pycache__/**" \
         --exclude="node_modules/**" --exclude=".git/**" \
          "path" "google-drive:Notes"
```

Check this article on how to configure it on Linux - https://www.howtogeek.com/451262/how-to-use-rclone-to-back-up-to-google-drive-on-linux/.

**Backup your configs.**

Now vscode has added it's own sync which is connected your Github or MS Live account. For other editors you can find their config files and add it to the `rclone` !

**Use scripting to automate your tasks.**

You can use scripting languages such as Python or Bash to make functions that can be executed by you. Later you can add aliases to `.bashrc` file to run those files.

This will let you avoid writing same stuff again.

_I also found this scripting kit recently, this might be good enough too - https://www.scriptkit.com/_

**Add a script for first time setup of your OS.**

This script will remove programs that are not used by you and install useful ones. I have a script which is inspired by John Hammond's - https://github.com/JohnHammond/archlinux/blob/master/bootstrap.sh (s/o - checkout his yt if you are into cybersec!)

**Tweak your terminal**

Terminal is the most useful to any linux user, checkout https://ezprompt.net/ to customise your terminal.

Thank you for reading!

https://gajraj.dev
