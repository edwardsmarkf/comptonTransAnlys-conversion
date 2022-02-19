
                ## test display written 2022-02-18

        SELECT  `clientContext`.`clientContextError`
        ,       `clientContext`.`clientContextErrorSpeakingCount`
        ,       `clientContext`.`clientContextErrorNotes`
        ,       `clientContext`.`clientContextAutoIncr`
        FROM    `comptonTransAnlys`.`clientContext`
        WHERE   1
        AND     `clientContext`.`contextAutoIncr`               =       56
        AND     `clientContext`.`clientSessionAutoIncr`         =       2349
        ;

        SELECT  `clientStimword`.`clientStimwordNotes`
        ,       `clientStimword`.`clientStimwordAutoIncr`
        ,       `clientContext`.`clientContextError`
        ,       `clientStimword`.`stimwordPositionAutoIncr`
        ,       `clientStimword`.`clientStimwordAutoIncr`
        FROM    `comptonTransAnlys`.`clientContext`
        LEFT JOIN `comptonTransAnlys`.`clientStimword`
        ON      (`clientContext`.`clientContextAutoIncr`        =       `clientStimword`.`clientContextAutoIncr`)
        WHERE   `clientContext`.`contextAutoIncr`               =       56
        AND     `clientContext`.`clientSessionAutoIncr`         =       2349
        ;
