SELECT
        JSON_ARRAYAGG
        (       JSON_OBJECT
                        (       'soundOrder'                    ,       `sound`.`soundOrder`
                        ,       'soundTitle'                    ,       `sound`.`soundTitle`
                        ,       'soundSubTitle'                 ,       `sound`.`soundSubTitle`
                        ,       'occurences'                    ,
                                                (       SELECT  COUNT(*)
                                                        FROM    `stimwordPosition`
                                                        WHERE   1
                                                        AND     `context`.`contextAutoIncr` = `stimwordPosition`.`contextAutoIncr`
                                                        AND     `stimwordPosition`.`stimwordPositionSetting` IN ( 'word','sentence')
                                                )
                        ,       'positionSound'                  ,
                                        CONCAT
                                        (        `context`.`soundPhoneme`
                                        ,        '-'
                                        ,        `context`.`contextPosition`
                                        )
                        ,       'contextLabelColor'             ,       `context`.`contextLabelColor`
                        ,       'clientContextErrorSound'       ,       `clientContext`.`clientContextErrorSound`
                        ,       'clientContextErrorCount'       ,       `clientContext`.`clientContextErrorCount`
                        ,       'wordCount'
                                                                ,
                                                (       SELECT  COUNT(*)
                                                        FROM    `clientStimword`
                                                        WHERE   1
                                                        AND     `clientContext`.`clientContextAutoIncr` = `clientStimword`.`clientContextAutoIncr`
                                                        AND     `clientStimword`.`stimwordPositionSetting`      = 'word'
                                                )
                        ,       'sentenceCount'                 ,
                                                (       SELECT  COUNT(*)
                                                        FROM    `clientStimword`
                                                        WHERE   1
                                                        AND     `clientContext`.`clientContextAutoIncr` = `clientStimword`.`clientContextAutoIncr`
                                                        AND     `clientStimword`.`stimwordPositionSetting`      = 'sentence'
                                                )
                        ,       'readingCount'                  ,
                                                (       SELECT  COUNT(*)
                                                        FROM    `clientStimword`
                                                        WHERE   1
                                                        AND     `clientContext`.`clientContextAutoIncr` = `clientStimword`.`clientContextAutoIncr`
                                                        AND     `clientStimword`.`stimwordPositionSetting`      = 'reading'
                                                )

                        ,       'frequency'                     ,       `clientContext`.`frequency`
                        ,       'clientContextErrorNotes'       ,       `clientContext`.`clientContextErrorNotes`
                        ,       'contextAutoIncr'               ,       `context`.`contextAutoIncr`
                        ,       'clientContextAutoIncr'         ,       `clientContext`.`clientContextAutoIncr`
                        ,       'stimwordPositionSetting'       ,       `clientStimword`.`stimwordPositionSetting`
                        ,       'stimwordWord'                  ,       `clientStimword`.`stimwordWord`
                        ,       'clientStimwordNotes'           ,       `clientStimword`.`clientStimwordNotes`
                        )
        )       'JSON_ARRAYAGG' /* to suppress any sort of column heading! */
FROM    `layout`
,       `sound`
,       `context`
,       `teacher`
,       `clientMaster`
,       `clientSession`
,       `clientContext` `clientContext`
        LEFT JOIN       `clientStimword`
                ON      `clientContext`.`clientContextAutoIncr`         = `clientStimword`.`clientContextAutoIncr`
WHERE   1
AND     `layout`.`layoutAutoIncr`                       = `teacher`.`layoutAutoIncr`
AND     `teacher`.`teacherAutoIncr`                     = `clientMaster`.`teacherAutoIncr`
AND     `clientMaster`.`clientMasterAutoIncr`           = `clientSession`.`clientMasterAutoIncr`
AND     `clientSession`.`clientSessionAutoIncr`         = `clientContext`.`clientSessionAutoIncr`
AND     `sound`.`soundAutoIncr`                         = `context`.`soundAutoIncr`
AND     `context`.`contextAutoIncr`                     = `clientContext`.`contextAutoIncr`
AND     `layout`.`layoutName`                           = :LAYOUT_NAME
AND     `teacher`.`teacherEmail`                        = :TEACHER_EMAIL
AND     `clientMaster`.`clientMasterEmail`              = :CLIENT_MASTER_EMAIL
AND     `clientSession`.`sessionName`                   = :SESSION_NAME
;
