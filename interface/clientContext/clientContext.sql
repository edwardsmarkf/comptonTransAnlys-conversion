/*   clientContext.sql
      2022-11-07  - added count of clientStimword to determine if this row is eligible for a key change
                      if greater than zero, then there is a corresponding clientStimword record, and we are not allowed
                      to change the key value
*/
/*   clientContext.sql
*/
SET  @LAYOUT_NAME           = 'PESL'                            ;
SET  @SESSION_NAME          = 'Time1'                           ;
SET  @TEACHER_EMAIL         = 'info@englishwithoutaccent.com'   ;
SET  @CLIENT_EMAIL          = '12yukos@gmail.com'  ;  #'12yukos@gmail.com'                      ;   ## 'mark_f_edwards@yahoo.com'

SELECT   ##JSON_ARRAYAGG(
                JSON_OBJECT
( 'soundPhoneme'                    ,    `clientContext`.`soundPhoneme`
, 'clientContextError'              ,    `clientContext`.`clientContextError`
, 'clientContextSpeakingErrors'     ,    `clientContext`.`clientContextSpeakingErrors`
, 'clientContextErrorNotes'         ,    IFNULL(`clientContext`.`clientContextErrorNotes`,'')
, 'contextAutoIncr'                 ,    `clientContext`.`contextAutoIncr`
, 'clientContextAutoIncr'           ,    `clientContext`.`clientContextAutoIncr`
, 'clientStimwordCounting'                  ,    COUNT( `clientStimword`.`clientStimwordAutoIncr`)
#)
) ''
FROM `comptonTransAnlys`.`context`
,    `comptonTransAnlys`.`layout`
,    `comptonTransAnlys`.`teacher`
,    `comptonTransAnlys`.`clientMaster`
,    `comptonTransAnlys`.`clientSession`
,    `comptonTransAnlys`.`clientContext`
                LEFT JOIN `clientStimword` ON   `clientContext`.`clientContextAutoIncr` = `clientStimword`.`clientContextAutoIncr`
WHERE 1
AND `context`.`layoutName`                     = @LAYOUT_NAME
AND `layout`.`layoutName`                      = @LAYOUT_NAME
AND `teacher`.`teacherEmail`                   = @TEACHER_EMAIL
AND `clientMaster`.`clientMasterEmail`         = @CLIENT_EMAIL
AND `clientSession`.`sessionName`              = @SESSION_NAME

AND  `layout`.`layoutName`                     = `teacher`.`layoutName`

AND `teacher`.`teacherEmail`                   = `clientMaster`.`teacherEmail`
AND `teacher`.`teacherAutoIncr`                = `clientMaster`.`teacherAutoIncr`

AND `clientMaster`.`teacherEmail`              = `clientSession`.`teacherEmail`
AND `clientMaster`.`ClientMasterEmail`         = `clientSession`.`clientMasterEmail`
AND `clientMaster`.`clientMasterAutoIncr`      = `clientSession`.`clientMasterAutoIncr`

AND `clientSession`.`teacherEmail`            = `clientContext`.`teacherEmail`
AND `clientSession`.`clientMasterEmail`       = `clientContext`.`clientMasterEmail`
AND `clientSession`.`sessionName`             = `clientContext`.`sessionName`
AND `clientSession`.`clientSessionAutoIncr`   = `clientContext`.`clientSessionAutoIncr`

AND `context`.`contextAutoIncr`                = `clientContext`.`contextAutoIncr`
                                                                                                GROUP BY `clientContext`.`clientContextAutoIncr`
ORDER BY `clientContext`.`contextAutoIncr`
;

/*  for testing to get a zero value (a clientContext row without a corresponding clientStimword row) :
INSERT INTO `comptonTransAnlys`.`clientContext` 
    (`layoutName`, `teacherEmail`, `clientMasterEmail`, `sessionName`, `soundPhoneme`, `contextPosition`, `clientContextError`, `frequency`, `createdAt`, `updatedAt`, `contextAutoIncr`, `clientSessionAutoIncr`) 
VALUES 
    ('PESL', 'info@englishwithoutaccent.com', '12yukos@gmail.com', 'Time1', 'b', 'initial', 'XX', '', '2022-11-08', '2022-11-07', '6', '2349');
*/
############, 'Occurences'                      ,    `context`.`contextCount`
############, 'frequency'                       ,    `clientContext`.`frequency`
#####  ????  ######  AND  `layout`.`layoutAutoIncr`                 = `teacher`.`layoutAutoIncr`
