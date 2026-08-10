##
##  createKnexUser.sql  -- 2026-08-09
##

DROP USER IF EXISTS 'knexUser'@'localhost'				                    ;
CREATE USER 'knexUser'@'localhost' IDENTIFIED BY 'knexPassword'       ;

FLUSH PRIVILEGES  ;

GRANT ALL ON `comptonTransAnlys`.* TO 'knexUser'@'localhost'	                                        \
IDENTIFIED BY 'knexPassword' 							                                                            \
WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0	;

############################### DROP DATABASE `comptonTransAnlys` 					;
#################CREATE DATABASE IF NOT EXISTS `comptonTransAnlys` 			;

GRANT ALL PRIVILEGES ON `comptonTransAnlys`.* TO 'knexUser'@'localhost'	        ;

# mariadb  --host=localhost --user=knexUser  --password=knexPassword    comptonTransAnlys    ;   
