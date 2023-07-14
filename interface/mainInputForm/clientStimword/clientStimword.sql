
       ## ** FOR TESTING ONLY **

       ## test display written 2022-02-18

        SELECT  " "
        ;

        SELECT  count(*)                "count of clientContext table:"
        FROM    `comptonTransAnlys`.`clientContext`
        WHERE   1
        AND     `clientContext`.`contextAutoIncr`               =       56
        AND     `clientContext`.`clientSessionAutoIncr`         =       2349
        ;

        SELECT  `clientContext`.`clientContextErrorSound`       "Sound"
        ,       `clientContext`.`contextPosition`               "Position"
        ,       `clientContext`.`clientContextErrorCount`
        ,       `clientContext`.`clientContextErrorNotes`
        ,       `clientContext`.`contextAutoIncr`
        ,       `clientContext`.`clientContextAutoIncr`
        FROM    `comptonTransAnlys`.`clientContext`
        WHERE   1
        AND     `clientContext`.`contextAutoIncr`               =       56
        AND     `clientContext`.`clientSessionAutoIncr`         =       2349
        ;

        SELECT  " "
        ;

        SELECT  count(*)                "count of clientContextStimword table:"
        FROM    `comptonTransAnlys`.`clientContext`
        LEFT JOIN `comptonTransAnlys`.`clientStimword`
        ON      (`clientContext`.`clientContextAutoIncr`        =       `clientStimword`.`clientContextAutoIncr`)
        WHERE   `clientContext`.`contextAutoIncr`               =       56
        AND     `clientContext`.`clientSessionAutoIncr`         =       2349
        ;

        SELECT  `clientContext`.`clientContextErrorSound`       "Sound"
        ,       CONCAT(`clientStimword`.`contextPosition`       , '-', `clientStimword`.`stimwordWord`                  )
                                                                "Position-Word"
        ,       `clientStimword`.`stimwordPositionSetting`      "Setting"
        ,       `clientStimword`.`clientStimwordAutoIncr`
        ,       `clientStimword`.`stimwordPositionAutoIncr`
        ,       `clientStimword`.`clientStimwordAutoIncr`
        FROM    `comptonTransAnlys`.`clientContext`
        LEFT JOIN `comptonTransAnlys`.`clientStimword`
        ON      (`clientContext`.`clientContextAutoIncr`        =       `clientStimword`.`clientContextAutoIncr`)
        WHERE   `clientContext`.`contextAutoIncr`               =       56
        AND     `clientContext`.`clientSessionAutoIncr`         =       2349
        ;

        SELECT  " "
        ;
