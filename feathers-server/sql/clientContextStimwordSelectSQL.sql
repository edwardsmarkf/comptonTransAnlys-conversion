SELECT
JSON_ARRAYAGG (
JSON_OBJECT
(               'contextPositionSoundPhoneme'   ,       CONCAT
                                                        (       `stimwordPosition`.`contextPosition`
                                                        ,       ' -- '
                                                        ,       `stimwordPosition`.`soundPhoneme`
                                                        )
        ,       'stimwordPositionSetting'       ,       `stimwordPosition`.`stimwordPositionSetting`
        ,       'stimwordBackgroundColor'       ,       IFNULL(`stimwordPosition`.`stimwordPositionBackgroundColor`     , ''    )
        ,       'clientContextErrorSound'       ,       IFNULL(`clientStimwordCURRENT`.`clientContextErrorSound`        , ''    )
        ,       'replicationValue'              ,       IFNULL(`clientStimwordREPLICATE`.`clientContextErrorSound`      , ''    )
        ,       'languageNormsError'            ,       IFNULL(`languageNorms`.`languageNormsError`                     , ''    )
        ,       'stimwordPositionAutoIncr'      ,       `stimwordPosition`.`stimwordPositionAutoIncr`
        ,       'languageNormsErrorCOUNT'       ,
        (
                SELECT  COUNT(`context_SUBSELECT`.`soundPhoneme`)
                FROM    `context`       `context_SUBSELECT`
                ,       `languageNorms` `languageNorms_SUBSELECT`
                ,       `stimword`      `stimword_SUBSELECT`
                WHERE   1

                AND     `context`.`contextAutoIncr`             =       `context_SUBSELECT`.`contextAutoIncr`
                AND     `stimword`.`stimwordAutoIncr`           =       `stimword_SUBSELECT`.`stimwordAutoIncr`
                AND     `languageNorms`.`layoutName`            =       `languageNorms_SUBSELECT`.`layoutName`
                AND     `languageNorms`.`languageNormsName`     =       `languageNorms_SUBSELECT`.`languageNormsName`

                AND     `context_SUBSELECT`.`contextAutoIncr`   =       `languageNorms_SUBSELECT`.`contextAutoIncr`
                AND     `context_SUBSELECT`.`layoutName`        =       `languageNorms_SUBSELECT`.`layoutName`
                AND     `context_SUBSELECT`.`soundPhoneme`      =       `languageNorms_SUBSELECT`.`soundPhoneme`
                AND     `context_SUBSELECT`.`contextPosition`   =       `languageNorms_SUBSELECT`.`contextPosition`
        )
        ,       'clientStimwordNotes'           ,       IFNULL(`clientStimwordCURRENT`.`clientStimwordNotes`    , ''    )
        ,       'contextAutoIncr'               ,       `context`.`contextAutoIncr`
        ,       'clientStimwordAutoIncr'        ,       `clientStimwordCURRENT`.`clientStimwordAutoIncr`
)
)       'JSON_ARRAYAGG' /*      to      suppress        any     sort    of      column  heading!        */
FROM    `stimword`
, `context` LEFT OUTER JOIN     `languageNorms` `languageNorms` ON
(       1
AND     `context`.`contextAutoIncr`                     =       `languageNorms`.`contextAutoIncr`
AND     `context`.`layoutName`                          =       `languageNorms`.`layoutName`
AND     `context`.`soundPhoneme`                        =       `languageNorms`.`soundPhoneme`
AND     `context`.`contextPosition`                     =       `languageNorms`.`contextPosition`
AND     `languageNorms`.`layoutName`                    =       :LAYOUT_NAME
AND     `languageNorms`.`languageNormsName`             =       :LANGUAGE_NORMS_NAME
)
, `stimwordPosition` LEFT OUTER JOIN    `clientStimword`        `clientStimwordCURRENT` ON
(       1
AND     `stimwordPosition`.`stimwordPositionAutoIncr`   =       `clientStimwordCURRENT`.`stimwordPositionAutoIncr`
AND     `stimwordPosition`.`layoutName`                 =       `clientStimwordCURRENT`.`layoutName`
AND     `stimwordPosition`.`stimwordPlacement`          =       `clientStimwordCURRENT`.`stimwordPlacement`
AND     `stimwordPosition`.`stimwordOrderNbr`           =       `clientStimwordCURRENT`.`stimwordOrderNbr`
AND     `stimwordPosition`.`stimwordWord`               =       `clientStimwordCURRENT`.`stimwordWord`

AND     `stimwordPosition`.`contextPosition`            =       `clientStimwordCURRENT`.`contextPosition`
AND     `stimwordPosition`.`stimwordOrderNbr`           =       `clientStimwordCURRENT`.`stimwordOrderNbr`
AND     `stimwordPosition`.`stimwordPositionSetting`    =       `clientStimwordCURRENT`.`stimwordPositionSetting`
AND     `stimwordPosition`.`soundPhoneme`               =       `clientStimwordCURRENT`.`soundPhoneme`

AND     `clientStimwordCURRENT`.`teacherEmail`          =       :TEACHER_EMAIL
AND     `clientStimwordCURRENT`.`clientMasterEmail`     =       :CLIENT_MASTER_EMAIL
AND     `clientStimwordCURRENT`.`sessionName`           =       :SESSION_NAME
AND     `clientStimwordCURRENT`.`layoutName`            =       :LAYOUT_NAME
)
LEFT OUTER JOIN `clientStimword`        `clientStimwordREPLICATE`       ON
(       1
AND     `stimwordPosition`.`stimwordPositionAutoIncr`   =       `clientStimwordREPLICATE`.`stimwordPositionAutoIncr`
AND     `stimwordPosition`.`layoutName`                 =       `clientStimwordREPLICATE`.`layoutName`
AND     `stimwordPosition`.`stimwordPlacement`          =       `clientStimwordREPLICATE`.`stimwordPlacement`
AND     `stimwordPosition`.`stimwordOrderNbr`           =       `clientStimwordREPLICATE`.`stimwordOrderNbr`
AND     `stimwordPosition`.`stimwordWord`               =       `clientStimwordREPLICATE`.`stimwordWord`

AND     `stimwordPosition`.`contextPosition`            =       `clientStimwordREPLICATE`.`contextPosition`
AND     `stimwordPosition`.`stimwordOrderNbr`           =       `clientStimwordREPLICATE`.`stimwordOrderNbr`
AND     `stimwordPosition`.`stimwordPositionSetting`    =       `clientStimwordREPLICATE`.`stimwordPositionSetting`
AND     `stimwordPosition`.`soundPhoneme`               =       `clientStimwordREPLICATE`.`soundPhoneme`

AND     `clientStimwordREPLICATE`.`teacherEmail`        =       :TEACHER_EMAIL
AND     `clientStimwordREPLICATE`.`clientMasterEmail`   =       :CLIENT_MASTER_EMAIL
AND     `clientStimwordREPLICATE`.`sessionName`         =       :REPLICATION_NAME
AND     `clientStimwordREPLICATE`.`layoutName`          =       :LAYOUT_NAME
)

WHERE   1       /*      dummy   first   one     */
AND     `stimword`.`stimwordAutoIncr`                   =       `stimwordPosition`.`stimwordAutoIncr`
AND     `context`.`contextAutoIncr`                     =       `stimwordPosition`.`contextAutoIncr`
AND     `stimword`.`layoutName`                         =       :LAYOUT_NAME
AND     `stimword`.`stimwordPlacement`                  =       :STIMWORD_PLACEMENT
AND     `stimword`.`stimwordOrderNbr`                   =       :STIMWORD_ORDER_NBR

ORDER BY        `stimwordPosition`.`stimwordPlacement`
,               `stimwordPosition`.`stimwordOrderNbr`
,               `stimwordPosition`.`soundPhonemeOrderNbr`
;
