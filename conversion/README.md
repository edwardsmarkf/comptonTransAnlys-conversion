# To Run:

    cd  ~                                                                           ;  \
    rm -Rf  ~/comptonTransAnlys-conversion                                          ;  \
    git clone  https://github.com/edwardsmarkf/comptonTransAnlys-conversion         ;  \
    cd  ~/comptonTransAnlys-conversion/conversion/                                  ;  \
    pwd                                                                             ;  \
    cp --verbose  ~/comptonTransAnlys.sql  .                                        ;  \
    echo  'y'  |  nohup   bash -vx  ./00_master.bsh  &>   ./00_master.bsh.log          &


 
2026-08-09  added this:

ALTER TABLE users 
ADD COLUMN email VARCHAR(255) NOT NULL UNIQUE CHECK (email LIKE '_%@_%._%');


CONSTRAINT chk_email CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')


ADD CONSTRAINT chk_email 
CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$');


current server:

##   DID NOT WORK 2023-05-15 - changed --extended-insert=FALSE  to   --extended-insert=TRUE  since the bug appears to be fixed now.  (NOT!)



outputFile='/home/comptonpeslonline.com/comptonTransAnlys.sql' ;
/usr/bin/mariadb-dump --extended-insert=FALSE --user=root --password='!zzyzx15zzyzx!' comptonTransAnlys > $outputFile; 

this MIGHT be necessary:  (2024-09-09)

    REPAIR TABLE mysql.proc;

from:  https://serverfault.com/questions/361838/mysql-cannot-load-from-mysql-proc-the-table-is-probably-corrupted

 
/usr/bin/gzip  --force  $outputFile   ;
     
   FTP FILE OVER
   
   rm   /home/comptonpeslonline.com/comptonTransAnlys.sql.gz   ;   # dont forget!
 
new server:

    bash -vx  runConversion.bsh ;
    
possibly use:

     cat comptonTransAnlys-mariadbBackup-2023-06-26-01-00-Monday.sql  | sed -e '/INSERT INTO `Client_eval_detail` VALUES/d; /INSERT INTO `Client_anlys_detail` VALUES/d;'  > ./comptonTransAnlys.sql
