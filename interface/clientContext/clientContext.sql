/*   clientContext.sql
*/
SET  @LAYOUT_NAME           = 'PESL'                            ;
SET  @SESSION_NAME          = 'Time1'                           ;
SET  @TEACHER_EMAIL         = 'info@englishwithoutaccent.com'   ;
SET  @CLIENT_EMAIL          = '12yukos@gmail.com'  ;  #'12yukos@gmail.com'        		;   ## 'mark_f_edwards@yahoo.com'

SELECT   ##JSON_ARRAYAGG(
                JSON_OBJECT
( 'soundPhoneme'                    ,    `clientContext`.`soundPhoneme`
, 'Occurences'                      ,    `context`.`contextCount`
, 'clientContextError'              ,    `clientContext`.`clientContextError`
############, 'frequency'                       ,    `clientContext`.`frequency`
, 'clientContextSpeakingsError'     ,    `clientContext`.`clientContextSpeakingErrors`
, 'clientContextErrorNotes'         ,    `clientContext`.`clientContextErrorNotes`
, 'contextAutoIncr'                 ,    `clientContext`.`contextAutoIncr`
, 'clientContextAutoIncr'           ,    `clientContext`.`clientContextAutoIncr`
#)
) ''
FROM `comptonTransAnlys`.`context`
,    `comptonTransAnlys`.`layout`
,    `comptonTransAnlys`.`teacher`
,    `comptonTransAnlys`.`clientMaster`
,    `comptonTransAnlys`.`clientSession`
,    `comptonTransAnlys`.`clientContext`
WHERE 1
AND `context`.`layoutName`                     = @LAYOUT_NAME
AND `layout`.`layoutName`                      = @LAYOUT_NAME
AND `teacher`.`teacherEmail`                   = @TEACHER_EMAIL
AND `clientMaster`.`clientMasterEmail`         = @CLIENT_EMAIL
AND `clientSession`.`sessionName`              = @SESSION_NAME

AND  `layout`.`layoutName`                     = `teacher`.`layoutName`
#####  ????  ######  AND  `layout`.`layoutAutoIncr`                 = `teacher`.`layoutAutoIncr`

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
ORDER BY `clientContext`.`contextAutoIncr`
;
