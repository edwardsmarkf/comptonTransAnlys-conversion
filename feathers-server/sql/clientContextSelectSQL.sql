SELECT  JSON_ARRAYAGG(
        JSON_OBJECT
        (       'soundPhoneme'                  ,       `clientContext`.`soundPhoneme`
        ,       'clientContextErrorSound'       ,       `clientContext`.`clientContextErrorSound`
        ,       'clientContextErrorCount'       ,       `clientContext`.`clientContextErrorCount`
        ,       'clientContextErrorNotes'       ,       IFNULL(`clientContext`.`clientContextErrorNotes`,       '')
        ,       'contextAutoIncr'               ,       `clientContext`.`contextAutoIncr`
        ,       'clientContextAutoIncr'         ,       `clientContext`.`clientContextAutoIncr`
        ,       'clientStimwordCOUNT'           ,       /*      2023-01-31      COUNT(  `clientStimword`.`clientStimwordAutoIncr`)      */
                                                (       SELECT  COUNT(  `clientStimword`.`clientStimwordAutoIncr`)
                                                        FROM    `clientStimword`
                                                        WHERE   1
                                                        AND     `clientContext`.`clientContextAutoIncr` =       `clientStimword`.`clientContextAutoIncr`
                                                )
        )
)       'JSON_ARRAYAGG'
FROM    `context`
,       `layout`
,       `teacher`
,       `clientMaster`
,       `clientSession`
,       `clientContext`
WHERE   1
AND     `context`.`layoutName`                  =       :LAYOUT_NAME
AND     `layout`.`layoutName`                   =       :LAYOUT_NAME
AND     `teacher`.`teacherEmail`                =       :TEACHER_EMAIL
AND     `clientMaster`.`clientMasterEmail`      =       :CLIENT_MASTER_EMAIL
AND     `clientSession`.`sessionName`           =       :SESSION_NAME
AND     `clientContext`.`contextAutoIncr`       =       :CONTEXT_AUTO_INCR

AND     `layout`.`layoutName`                   =       `teacher`.`layoutName`

AND     `teacher`.`teacherEmail`                =       `clientMaster`.`teacherEmail`
AND     `teacher`.`teacherAutoIncr`             =       `clientMaster`.`teacherAutoIncr`

AND     `clientMaster`.`teacherEmail`           =       `clientSession`.`teacherEmail`
AND     `clientMaster`.`ClientMasterEmail`      =       `clientSession`.`clientMasterEmail`
AND     `clientMaster`.`clientMasterAutoIncr`   =       `clientSession`.`clientMasterAutoIncr`

AND     `clientSession`.`teacherEmail`          =       `clientContext`.`teacherEmail`
AND     `clientSession`.`clientMasterEmail`     =       `clientContext`.`clientMasterEmail`
AND     `clientSession`.`sessionName`           =       `clientContext`.`sessionName`
AND     `clientSession`.`clientSessionAutoIncr` =       `clientContext`.`clientSessionAutoIncr`

AND     `context`.`contextAutoIncr`             =       `clientContext`.`contextAutoIncr`
ORDER BY        `clientContext`.`contextAutoIncr`
;
