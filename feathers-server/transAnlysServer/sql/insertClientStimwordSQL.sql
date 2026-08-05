
    INSERT INTO `clientStimword`
        (       `layoutName`
        ,       `teacherEmail`
        ,       `clientMasterEmail`
        ,       `sessionName`
        ,       `soundPhoneme`
        ,       `contextPosition`
        ,       `clientContextErrorSound`
        ,       `stimwordPlacement`
        ,       `stimwordOrderNbr`
        ,       `stimwordWord`
        ,       `stimwordPositionNbr`
        ,       `stimwordPositionSetting`
        ,       `clientContextAutoIncr`
        ,       `stimwordPositionAutoIncr`
        )
        (       SELECT  `clientContext`.`layoutName`
                ,       `clientContext`.`teacherEmail`
                ,       `clientContext`.`clientMasterEmail`
                ,       `clientContext`.`sessionName`
                ,       `stimwordPosition`.`soundPhoneme`
                ,       `stimwordPosition`.`contextPosition`
                ,       `clientContext`.`clientContextErrorSound`
                ,       `stimwordPosition`.`stimwordPlacement`
                ,       `stimwordPosition`.`stimwordOrderNbr`
                ,       `stimwordPosition`.`stimwordWord`
                ,       `stimwordPosition`.`stimwordPositionNbr`
                ,       `stimwordPosition`.`stimwordPositionSetting`
                ,       `clientContext`.`clientContextAutoIncr`
                ,       `stimwordPosition`.`stimwordPositionAutoIncr`
                FROM    `clientContext`
                INNER JOIN      `stimwordPosition`
                        ON      1
                        AND     `stimwordPosition`.`stimwordPositionAutoIncr`       = :stimwordPositionAutoIncr
                        AND     `clientContext`.`layoutName`                        = `stimwordPosition`.`layoutName`
                WHERE   1
                AND             `clientContext`.`clientContextAutoIncr`             = :clientContextAutoIncr
        )
        RETURNING `clientStimwordAutoIncr`
