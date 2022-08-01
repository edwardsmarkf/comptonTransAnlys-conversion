        SET  @LAYOUT_NAME           = 'PESL'                            ;
        SET  @SESSION_NAME          = 'Time1'                           ;
        SET  @TEACHER_EMAIL         = 'info@englishwithoutaccent.com'   ;
        SET  @CLIENT_EMAIL          = 'mark_f_edwards@yahoo.com'        ;   ## '12yukos@gmail.com'
        SET  @LANGUAGE_NORMS_NAME   = 'Indian-pakistan'                 ;
        SET  @STIMWORD_PAGE_NBR     =  "1"                              ;
        SET  @STIMWORD_LINE_NBR     =  "1"                              ;
        
SELECT * 
FROM comptonTransAnlys.clientContext
WHERE 1
AND layoutName         = @LAYOUT_NAME
AND teacherEmail       = @TEACHER_EMAIL
AND clientMasterEmail  = @CLIENT_EMAIL
AND sessionName        = @SESSION_NAME
;
