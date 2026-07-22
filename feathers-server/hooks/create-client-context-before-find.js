#!  /bin/bash
#
#
#      create-client-context-before-find.js    2026-022



sed --in-place  --expression='s/^       find: [],$/      find: [clientContextBeforeFind],';;   /home/mark/my-new-app/src/services/client-context/client-context.js
