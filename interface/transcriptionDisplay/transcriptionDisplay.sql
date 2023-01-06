/*   transcriptionDisplay.sql
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
, 'clientContextSpeakingsError'     ,    `clientContext`.`clientContextSpeakingErrors`
, 'frequency'                       ,    `clientContext`.`frequency`
, 'clientContextSpeakingsError'     ,    `clientContext`.`clientContextSpeakingErrors`
, 'clientContextErrorNotes'         ,    `clientContext`.`clientContextErrorNotes`
, 'contextAutoIncr'                 ,    `clientContext`.`contextAutoIncr`
, 'clientContextAutoIncr'           ,    `clientContext`.`clientContextAutoIncr`
#)
) 'JSON_ARRAYAGG'
FROM `comptonTransAnlys`.`clientContext`
,    `comptonTransAnlys`.`context`
WHERE 1
AND `context`.`layoutName`                     = @LAYOUT_NAME
AND `clientContext`.`layoutName`               = @LAYOUT_NAME
AND `clientContext`.`teacherEmail`             = @TEACHER_EMAIL
AND `clientContext`.`clientMasterEmail`        = @CLIENT_EMAIL
AND `clientContext`.`sessionName`              = @SESSION_NAME
AND `context`.`contextAutoIncr`                = `clientContext`.`contextAutoIncr`
ORDER BY `clientContext`.`contextAutoIncr`
;
