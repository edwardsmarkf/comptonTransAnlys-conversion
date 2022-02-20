
                ## test display written 2022-02-18

        SELECT  `clientContext`.`clientContextError`
        ,       `clientContext`.`contextPosition`
        ,       `clientContext`.`clientContextErrorSpeakingCount`
        ,       `clientContext`.`clientContextErrorNotes`
        ,       `clientContext`.`clientContextAutoIncr`
        FROM    `comptonTransAnlys`.`clientContext`
        WHERE   1
        AND     `clientContext`.`contextAutoIncr`               =       56
        AND     `clientContext`.`clientSessionAutoIncr`         =       2349
        ;

        SELECT  `clientContext`.`clientContextError`
        ,       `clientStimword`.`stimwordWord`
        ,       `clientStimword`.`contextPosition`
        ,       `clientStimword`.`stimwordPositionSetting`
        ,       `clientStimword`.`clientStimwordNotes`
        ,       `clientStimword`.`clientStimwordAutoIncr`
        ,       `clientStimword`.`stimwordPositionAutoIncr`
        ,       `clientStimword`.`clientStimwordAutoIncr`
        FROM    `comptonTransAnlys`.`clientContext`
        LEFT JOIN `comptonTransAnlys`.`clientStimword`
        ON      (`clientContext`.`clientContextAutoIncr`        =       `clientStimword`.`clientContextAutoIncr`)
        WHERE   `clientContext`.`contextAutoIncr`               =       56
        AND     `clientContext`.`clientSessionAutoIncr`         =       2349
        ;
