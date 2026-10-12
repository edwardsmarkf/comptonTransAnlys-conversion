

to get the existing voicefiles directory structure for testing:
```
 find ~/public_html/voicefiles -type d -print0  | tar --create --verbose --file=voicefileStructure.tar --null --no-recursion --files-from=-
```

to build the new server:
```
dnf  --assumeyes  update   ;   ### optional!
```
```
dnf  --assumeyes  install  \
           git             \
           expect          \
           mariadb-server  ;

systemctl  enable  mariadb.service ;
systemctl  start   mariadb.service ;
firewall-cmd --permanent --add-port=3030/tcp ;
firewall-cmd --reload                        ;
```
be in user directory:
```
git clone  https://github.com/edwardsmarkf/comptonTransAnlys-conversion/  ;
```
log into mariadb:
```
mariadb ;
```
run these commands in mariadb:
```
DROP USER IF EXISTS 'knexUser'@'localhost'				;
CREATE USER 'knexUser'@'localhost' IDENTIFIED BY 'knexPassword';
GRANT ALL ON `comptonTransAnlys`.* TO 'knexUser'@'localhost'	\
IDENTIFIED BY 'knexPassword' 							\
WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0	;
CREATE DATABASE IF NOT EXISTS `comptonTransAnlys` 			;
GRANT ALL PRIVILEGES ON `comptonTransAnlys`.* TO 'knexUser'@'localhost'	;
-- mariadb  --host=localhost --user=knexUser  --password=knexPassword    comptonTransAnlys    ;   
```
test the mariadb connection using last line above.
then install npm and feathers:
```
bash -vx   /home/mark/comptonTransAnlys-conversion/feathers-server/transAnlysServer/install-npm-and-feathers.bsh   ;
```
```
cd      /home/mark/comptonTransAnlys-conversion/feathers-server/transAnlysServer/    ;
bash  -vx   ./masterBuilder.bsh  2026-10-12   ## the date(parm) will be the server name
```
```
cd   ./2026-10-12  ;
npm start ;
```
testing:
```
http://192.168.100.157:3030/date-time/
```
```
http://192.168.100.157:3030/knex-generic-raw/?knexSQL=serverVersionNowSQL&param=Testing
```
