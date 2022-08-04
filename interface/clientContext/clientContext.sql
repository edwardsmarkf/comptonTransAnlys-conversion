/*   clientContext.sql
*/
SET  @LAYOUT_NAME           = 'PESL'                            ;
SET  @SESSION_NAME          = 'Time1'                           ;
SET  @TEACHER_EMAIL         = 'info@englishwithoutaccent.com'   ;
SET  @CLIENT_EMAIL          = '12yukos@gmail.com'  ;  #'12yukos@gmail.com'        		;   ## 'mark_f_edwards@yahoo.com'

SELECT   ##JSON_ARRAYAGG(
                JSON_OBJECT
( 'soundPhoneme'                    ,    `clientContext`.`soundPhoneme`
, 'Occurences'                      ,    COUNT(`stimwordPosition`.`contextAutoIncr`)
, 'clientContextError'              ,    `clientContext`.`clientContextError`
, 'clientContextSpeakingsError'     ,    `clientContext`.`clientContextSpeakingErrors`
, 'frequency'                       ,    `clientContext`.`frequency`
, 'clientContextSpeakingsError'     ,    `clientContext`.`clientContextSpeakingErrors`
, 'clientContextErrorNotes'         ,    `clientContext`.`clientContextErrorNotes`
, 'contextAutoIncr'                 ,    `clientContext`.`contextAutoIncr`
, 'clientContextAutoIncr'           ,    `clientContext`.`clientContextAutoIncr`
#)
) ''
FROM `comptonTransAnlys`.`clientContext`
,    `comptonTransAnlys`.`context`
,    `comptonTransAnlys`.`stimwordPosition`
WHERE 1
AND `context`.`layoutName`                     = @LAYOUT_NAME
AND `clientContext`.`layoutName`               = @LAYOUT_NAME
AND `clientContext`.`teacherEmail`             = @TEACHER_EMAIL
AND `clientContext`.`clientMasterEmail`        = @CLIENT_EMAIL
AND `clientContext`.`sessionName`              = @SESSION_NAME
AND `context`.`contextAutoIncr`                = `stimwordPosition`.`contextAutoIncr`
AND `context`.`contextAutoIncr`                = `clientContext`.`contextAutoIncr`
GROUP BY ( `stimwordPosition`.`contextAutoIncr` )
ORDER BY `clientContext`.`contextAutoIncr`
;
/*
SELECT COUNT(*)
FROM `comptonTransAnlys`.`context`
,    `comptonTransAnlys`.`stimwordPosition`
where `context`.`soundPhoneme` = 'b'
and `context`.`contextPosition` = 'final'
AND `context`.`layoutName` = 'PESL'
AND `context`.`contextAutoIncr` = stimwordPosition.contextAutoIncr
;*/
