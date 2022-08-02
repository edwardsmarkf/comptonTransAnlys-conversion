/*   clientContext.sql
*/
        SET  @LAYOUT_NAME           = 'PESL'                            ;
        SET  @SESSION_NAME          = 'Time1'                           ;
        SET  @TEACHER_EMAIL         = 'info@englishwithoutaccent.com'   ;
        SET  @CLIENT_EMAIL          =  'edwards.mark@yahoo.com'   ;   ##   '12yukos@gmail.com' ;   ## 'mark_f_edwards@yahoo.com
        
SELECT  ##JSON_ARRAYAGG(
                JSON_OBJECT
( 'soundPhoneme'              ,    `clientContext`.`soundPhoneme`
, 'clientContextError'        ,    `clientContext`.`clientContextSpeakingErrors`
, 'frequency'                 ,    `clientContext`.`frequency`
, 'clientContextErrorNotes'   ,    `clientContext`.`clientContextErrorNotes`
, 'contextAutoIncr'           ,    `clientContext`.`contextAutoIncr`
) ''  ## blank out the header
FROM `comptonTransAnlys`.`clientContext`
WHERE 1
AND `layoutName`         = @LAYOUT_NAME
AND `teacherEmail`       = @TEACHER_EMAIL
AND `clientMasterEmail`  = @CLIENT_EMAIL
AND `sessionName`        = @SESSION_NAME
ORDER BY `contextAutoIncr`
;
