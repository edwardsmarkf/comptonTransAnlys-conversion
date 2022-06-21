# comptonTransAnlys-conversion
Compton Phonetic transcription conversion

copied from the drive.google.com


2021-04-26- since we are using unicodes, this conversion should be done on a linux workstation, or at least a command-line-interpretor that can handle unicodes.  using an ordinary minimial centos-8 could not handle unicodes.  probably an easy fix....  but i found it easier to use a linux workstation instead.

to test results:

grep ERROR  *.log  | grep -v ERRORS  | grep -v 'SEMANTIC ERROR' | grep -v 'ERROR LINKING' | grep -v  'SEMANTIC' ;


2021-11-18 -- DO WE HAVE DUPLICATE KEYS OR UNNECESSARY KEYS ?

2021-11-21 -- do we REALLY need _2_THIS-TABLE-NAME    in the key/constraint names?   isnt THIS-TABLE-NAME implied???

2021-11-21-a      it appears the KEY needs to be in the PARENT and the CONSTRAINT needs to be in the child!   

          i have been including  the KEY and the CONSTRAINT in the child!

DAMAGED KEY FIXED 2020-10-30 -

still to do:

rename  Client_master_2_teacher_foreign_key_symbol_2
         Client_anlys_detail_2_frequency_list_foreign_key_symbol_2  (remove _2)
         
\### somewhere there is a damaged key...?
\### grep  CASCADE  xxx.sql  | grep -v 'ON DELETE CASCADE ON UPDATE CASCADE'
\### 
\### damaged key!
\### 
\###  CONSTRAINT `Client_anlys_detail_2_frequency_list_foreign_key_symbol` FOREIGN KEY (`Client_anlys_detail_error_frequency`) REFERENCES `Frequency_list` (`Frequency`) ON DELETE \###  NO ACTION ON UPDATE CASCADE
\###  
\###  CONSTRAINT `Client_master_2_teacher_foreign_key_symbol` FOREIGN KEY (`Client_master_teacher_name`) REFERENCES `Teacher` (`Teacher_name`) ON DELETE NO ACTION ON UPDATE CASCADE
