/*   clientContext.sql
*/

SET  @LAYOUT_NAME           = 'PESL'                            ;
SET  @SESSION_NAME          = 'Time1'                           ;
SET  @TEACHER_EMAIL         = 'info@englishwithoutaccent.com'   ;
SET  @CLIENT_EMAIL          = '12yukos@gmail.com'  ;  #'12yukos@gmail.com'        		;   ## 'mark_f_edwards@yahoo.com'

SELECT   ##JSON_ARRAYAGG(
                JSON_OBJECT
(   'soundPhoneme'                 ,    `clientContext`.`soundPhoneme`
,   'contextPosition'              ,    `clientContext`.`contextPosition`
,  	'clientContextError'           ,   `clientContext`.`clientContextError`
,   'clientContextSpeakingErrors'  ,   `clientContext`.`clientContextSpeakingErrors`
,   'clientContextErrorNotes'      ,   `clientContext`.`clientContextErrorNotes`
#)
) ''
FROM `comptonTransAnlys`.`clientContext`
WHERE 1
AND `clientContext`.`layoutName`               = @LAYOUT_NAME
AND `clientContext`.`teacherEmail`             = @TEACHER_EMAIL
AND `clientContext`.`clientMasterEmail`        = @CLIENT_EMAIL
AND `clientContext`.`sessionName`              = @SESSION_NAME
;
