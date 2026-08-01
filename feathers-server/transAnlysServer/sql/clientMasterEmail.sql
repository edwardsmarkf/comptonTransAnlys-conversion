       SELECT
            JSON_OBJECTAGG(`clientMaster`.`clientMasterEmail`,  `clientMaster`.`clientMasterSpecLanguage`   ) 'JSON_OBJECTAGG'
        FROM    `clientMaster`
        WHERE   1
        AND     `layoutName`          =  :LAYOUT_NAME
        AND     `teacherEmail`        =  :TEACHER_EMAIL
        ;
