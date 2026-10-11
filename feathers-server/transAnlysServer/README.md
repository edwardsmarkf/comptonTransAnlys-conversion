

to get the existing voicefiles directory structure for testing:

 find ~/public_html/voicefiles -type d -print0  | tar --create --verbose --file=voicefileStructure.tar --null --no-recursion --files-from=-



```
dnf  --assumeyes  update   ;
dnf  --assumeyes  install  \
           git             \
           expect          \
           mariadb-server  ;

systemctl  enable  mariadb.service ;
systemctl  start   mariadb.service ;
firewall-cmd --permanent --add-port=3030/tcp ;
firewall-cmd --reload                        ;

git clone  https://github.com/edwardsmarkf/comptonTransAnlys-conversion/  ;
```
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
```
bash -vx   /home/mark/comptonTransAnlys-conversion/feathers-server/transAnlysServer/install-npm-and-feathers.bsh   ;
```
```
bash  -vx   /home/mark/comptonTransAnlys-conversion/feathers-server/transAnlysServer/masterBuilder.bsh  2026-10-11   ## the date(parm) will be the server name
```
testing:
http://192.168.100.157:3030/date-time/    
http://192.168.100.157:3030/knex-generic-raw/?knexSQL=serverVersionNowSQL&param=Testing
