
current server:

##   2023-05-15 - changed --extended-insert=FALSE  to   --extended-insert=TRUE  since the bug appears to be fixed now.

 /usr/bin/mariadb-dump       --extended-insert=TRUE   --user=root  --password='!zzyzx15zzyzx!'  comptonTransAnlys > /home/comptonpeslonline.com/comptonTransAnlys.sql   ; 
 
 /usr/bin/gzip  --force /home/comptonpeslonline.com/comptonTransAnlys.sql   ;
     
   FTP FILE OVER
   
   rm   /home/comptonpeslonline.com/comptonTransAnlys.sql.gz   ;   # dont forget!
 
new server:

    bash -vx  runConversion.bsh ;
    
