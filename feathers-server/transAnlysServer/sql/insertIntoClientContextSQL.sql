        INSERT INTO     `clientContext`
        (               `layoutName`
        ,               `teacherEmail`
        ,               `clientMasterEmail`
        ,               `sessionName`
        ,               `clientSessionAutoIncr`
        ,               `soundPhoneme`
        ,               `contextPosition`
        ,               `contextAutoIncr`
        ,               `clientContextErrorSound`
        ,               `clientContextErrorCount`
        ,               `frequency`
        ,               `frequencyListAutoIncr`
        ,               `clientContextErrorNotes`
        )
        (       SELECT          `clientSession`.`layoutName`
                ,               `clientSession`.`teacherEmail`
                ,               `clientSession`.`clientMasterEmail`
                ,               `clientSession`.`sessionName`
                ,               `clientSession`.`clientSessionAutoIncr`
                ,               `context`.`soundPhoneme`
                ,               `context`.`contextPosition`
                ,               `context`.`contextAutoIncr`
                ,               :clientContextErrorSound
                ,               :clientContextErrorCount
                ,               ''
                ,               1
                ,               :clientContextErrorNotes
                FROM    `clientSession`
                INNER JOIN              `context`
                        ON              1
                        AND             `context`.`contextAutoIncr`         = :contextAutoIncr
                        AND             `clientSession`.`layoutName`        = `context`.`layoutName`
                WHERE   1
                AND     `clientSession`.`clientSessionAutoIncr`             = :clientSessionAutoIncr
        )
        RETURNING `clientContextAutoIncr`
        ;


