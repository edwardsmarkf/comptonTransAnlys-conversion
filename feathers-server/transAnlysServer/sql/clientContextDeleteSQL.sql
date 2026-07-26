DELETE FROM     `clientContext`
WHERE   1
AND     `clientContext`.`teacherEmail`                          = :TEACHER_EMAIL
AND     `clientContext`.`clientMasterEmail`                     = :CLIENT_MASTER_EMAIL
AND     `clientContext`.`sessionName`                           = :SESSION_NAME
AND     `clientContext`.`layoutName`                            = :LAYOUT_NAME
AND     `clientContext`.`soundPhoneme`                          = :soundPhoneme
AND     `clientContext`.`contextPosition`                       = :contextPosition
AND     `clientContext`.`contextAutoIncr`                       = :contextAutoIncr
AND     `clientContext`.`clientSessionAutoIncr`                 = :clientSessionAutoIncr
AND     `clientContext`.`clientContextErrorCount`               = 0
AND     (       `clientContext`.`clientContextErrorNotes`       = ''
        OR      `clientContext`.`clientContextErrorNotes`       IS NULL
        )
AND     `clientContext`.`clientContextAutoIncr` NOT IN
        (
        SELECT  `clientStimword`.`clientContextAutoIncr`
        FROM    `clientStimword`
        WHERE   1
        AND     `clientStimword`.`teacherEmail`                 = `clientContext`.`teacherEmail`
        AND     `clientStimword`.`clientMasterEmail`            = `clientContext`.`clientMasterEmail`
        AND     `clientStimword`.`sessionName`                  = `clientContext`.`sessionName`
        AND     `clientStimword`.`layoutName`                   = `clientContext`.`layoutName`
        AND     `clientStimword`.`soundPhoneme`                 = `clientContext`.`soundPhoneme`
        AND     `clientStimword`.`contextPosition`              = `clientContext`.`contextPosition`
        AND     `clientStimword`.`clientContextErrorSound`      = `clientContext`.`clientContextErrorSound`
        )
RETURNING       `clientContext`.`clientContextAutoIncr`
;
