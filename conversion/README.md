
current server:

##   DID NOT WORK 2023-05-15 - changed --extended-insert=FALSE  to   --extended-insert=TRUE  since the bug appears to be fixed now.

outputFile='/home/comptonpeslonline.com/comptonTransAnlys.sql' ;

/usr/bin/mariadb-dump --extended-insert=FALSE --user=root --password='!zzyzx15zzyzx!' comptonTransAnlys > $outputFile; 
 
/usr/bin/gzip  --force  $outputFile   ;
     
   FTP FILE OVER
   
   rm   /home/comptonpeslonline.com/comptonTransAnlys.sql.gz   ;   # dont forget!
 
new server:

    bash -vx  runConversion.bsh ;
    
