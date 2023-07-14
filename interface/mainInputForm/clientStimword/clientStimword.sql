
       ## ** FOR TESTING ONLY **

       ## test display written 2022-02-18

        SELECT  " "
        ;

        SELECT  "Testing clientContext table!"
        ,       count(*)                                "count of clientContext"
        FROM    `comptonTransAnlys`.`clientContext`
        WHERE   1
        AND     `clientContext`.`contextAutoIncr`               =       56
        AND     `clientContext`.`clientSessionAutoIncr`         =       2349
        ;

        SELECT  "Testing clientContext table!"
        ,       `clientContext`.`clientContextErrorSound`
        ,       `clientContext`.`contextPosition`
        ,       `clientContext`.`clientContextErrorCount`
        ,       `clientContext`.`clientContextErrorNotes`
        ,       `clientContext`.`clientContextAutoIncr`
        FROM    `comptonTransAnlys`.`clientContext`
        WHERE   1
        AND     `clientContext`.`contextAutoIncr`               =       56
        AND     `clientContext`.`clientSessionAutoIncr`         =       2349
        ;

        SELECT  " "
        ;

        SELECT  "Testing clientStimword table!"
        ,       count(*)                                "count of clientStimword"
        FROM    `comptonTransAnlys`.`clientContext`
        LEFT JOIN `comptonTransAnlys`.`clientStimword`
        ON      (`clientContext`.`clientContextAutoIncr`        =       `clientStimword`.`clientContextAutoIncr`)
        WHERE   `clientContext`.`contextAutoIncr`               =       56
        AND     `clientContext`.`clientSessionAutoIncr`         =       2349
        ;

        SELECT  "Testing clientStimword table!"
        ,       `clientContext`.`clientContextErrorSound`
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
