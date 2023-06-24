

update clientStimword 
       set clientStimwordNotes = 'Manually added by mark!' 
       where clientMasterEmail = '12yukos@gmail.com' 
       and stimwordWord = 'crib'  
       and clientStimwordAutoIncr = 8109607
       ;
       
