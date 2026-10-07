/*  http://192.168.100.117:3030/knex-generic-raw/?knexSQL=analysisSQL&LAYOUT_NAME=PESL&TEACHER_EMAIL=info@englishwithoutaccent.com&CLIENT_MASTER_EMAIL=adelaideXX@noemail.com&SESSION_NAME=Time1&CLIENT_SESSION_AUTO_INCR=6
*/
SELECT
        JSON_ARRAYAGG
        (       JSON_OBJECT
                        (       'soundOrder'                    ,       `sound`.`soundOrder`
                        ,       'soundTitle'                    ,       `sound`.`soundTitle`
                        ,       'soundSubTitle'                 ,       `sound`.`soundSubTitle`
                        ,       'occurences'                    ,
                                               (       SELECT  COUNT( DISTINCT `stimword`.`stimwordWord` )
                                                        FROM    `stimwordPosition`
                                                        ,       `stimword`
                                                        WHERE   1
                                                        AND     `stimwordPosition`.`contextAutoIncr`    =       `context`.`contextAutoIncr`
                                                        AND     `stimwordPosition`.`stimwordAutoIncr`   =       `stimword`.`stimwordAutoIncr`
                                                        AND     `stimword`.`stimwordClass`              =       'SIXTYSIX_WORDS'
                                                )
                        ,       'stimwords'                     ,
                                               (       SELECT  GROUP_CONCAT( DISTINCT  `stimword`.`stimwordWord` ORDER BY `stimword`.`stimwordWord`  SEPARATOR ',' )
                                                        FROM    `stimwordPosition`
                                                        ,       `stimword`
                                                        WHERE 1
                                                        AND     `stimwordPosition`.`contextAutoIncr`    =       `context`.`contextAutoIncr`
                                                        AND     `stimwordPosition`.`stimwordAutoIncr`   =       `stimword`.`stimwordAutoIncr`
                                                        AND     `stimword`.`stimwordClass`              =       'SIXTYSIX_WORDS'
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
