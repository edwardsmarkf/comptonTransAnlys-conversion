

to get the existing voicefiles directory structure for testing:

 find ~/public_html/voicefiles -type d -print0  | tar --create --verbose --file=voicefileStructure.tar --null --no-recursion --files-from=-


dnf  --assumeyes  install  git  expect ;

bash -vx   /home/mark/comptonTransAnlys-conversion/feathers-server/transAnlysServer/install-npm-and-feathers.bsh   ;

bash  -vx    ./masterBuilder.bsh  2026-10-11   ## parm is the server name
