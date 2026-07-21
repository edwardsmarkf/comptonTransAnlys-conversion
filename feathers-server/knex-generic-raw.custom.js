export function returnSqlStatement(tag) {

        let returnVal;

        switch (tag)    {
                case    'selectVersion' :
                        returnVal = 'SELECT VERSION(), NOW() ;'  ;
                        break;

                case    'clientContextStimwordPositionSelectSQL'        :
                        returnVal =
                                `
                                SELECT  JSON_ARRAYAGG
                                        (       DISTINCT JSON_OBJECT
                                                (       'stimwordWord'          ,       \`stimword\`.\`stimwordWord\`
                                                ,       'stimwordAutoIncr'      ,       \`stimword\`.\`stimwordAutoIncr\`
                                                )
                                        ) 'JSON_ARRAYAGG'
                                FROM    \`clientContext\`
                                ,       \`clientStimword\`
                                ,       \`stimword\`
                                ,       \`stimwordPosition\`
                                WHERE   1
                                AND     \`clientContext\`.\`clientContextAutoIncr\`             = \`clientStimword\`.\`clientContextAutoIncr\`
                                AND     \`stimwordPosition\`.\`stimwordPositionAutoIncr\`       = \`clientStimword\`.\`stimwordPositionAutoIncr\`
                                AND     \`stimwordPosition\`.\`stimwordAutoIncr\`               = \`stimword\`.\`stimwordAutoIncr\`
                                AND     \`clientContext\`.\`clientContextAutoIncr\`             = :clientContextAutoIncr
                                ORDER BY
                                        \`stimword\`.\`stimwordWord\`
                                        ASC
                                `
                                ;
                        break;
                case    'clientContextDeleteSQL'        :
                        returnVal =
                                `
                                DELETE FROM     \`clientContext\`
                                WHERE   1
                                AND     \`clientContext\`.\`teacherEmail\`              = :TEACHER_EMAIL
                                AND     \`clientContext\`.\`clientMasterEmail\`         = :CLIENT_MASTER_EMAIL
                                AND     \`clientContext\`.\`sessionName\`               = :SESSION_NAME
                                AND     \`clientContext\`.\`layoutName\`                = :LAYOUT_NAME
                                AND     \`clientContext\`.\`soundPhoneme\`              = :soundPhoneme
                                AND     \`clientContext\`.\`contextPosition\`           = :contextPosition
                                AND     \`clientContext\`.\`contextAutoIncr\`           = :contextAutoIncr
                                AND     \`clientContext\`.\`clientSessionAutoIncr\`     = :clientSessionAutoIncr
                                AND     \`clientContext\`.\`clientContextErrorCount\`   = 0
                                AND     (       \`clientContext\`.\`clientContextErrorNotes\`   = ''
                                        OR      \`clientContext\`.\`clientContextErrorNotes\`   IS NULL
                                        )
                                AND     \`clientContext\`.\`clientContextAutoIncr\`     NOT IN
                                        (
                                        SELECT  \`clientStimword\`.\`clientContextAutoIncr\`
                                        FROM    \`clientStimword\`
                                        WHERE   1
                                        AND     \`clientStimword\`.\`teacherEmail\`             = \`clientContext\`.\`teacherEmail\`
                                        AND     \`clientStimword\`.\`clientMasterEmail\`        = \`clientContext\`.\`clientMasterEmail\`
                                        AND     \`clientStimword\`.\`sessionName\`              = \`clientContext\`.\`sessionName\`
                                        AND     \`clientStimword\`.\`layoutName\`               = \`clientContext\`.\`layoutName\`
                                        AND     \`clientStimword\`.\`soundPhoneme\`             = \`clientContext\`.\`soundPhoneme\`
                                        AND     \`clientStimword\`.\`contextPosition\`          = \`clientContext\`.\`contextPosition\`
                                        AND     \`clientStimword\`.\`clientContextErrorSound\`  = \`clientContext\`.\`clientContextErrorSound\`
                                        )
                                RETURNING       \`clientContext\`.\`clientContextAutoIncr\`
                                `
                                ;
                        break;
                case    'clientContextSelectSQL'        :
                        returnVal =
                                `
                                SELECT JSON_ARRAYAGG(
                                        JSON_OBJECT
                                        ( 'soundPhoneme'                    ,    \`clientContext\`.\`soundPhoneme\`
                                        , 'clientContextErrorSound'         ,    \`clientContext\`.\`clientContextErrorSound\`
                                        , 'clientContextErrorCount'         ,    \`clientContext\`.\`clientContextErrorCount\`
                                        , 'clientContextErrorNotes'         ,    IFNULL(\`clientContext\`.\`clientContextErrorNotes\`, '')
                                        , 'contextAutoIncr'                 ,    \`clientContext\`.\`contextAutoIncr\`
                                        , 'clientContextAutoIncr'           ,    \`clientContext\`.\`clientContextAutoIncr\`
                                        , 'clientStimwordCOUNT'             ,                    /*  2023-01-31  COUNT( \`clientStimword\`.\`clientStimwordAutoIncr\`)  */
                                                                                (       SELECT COUNT( \`clientStimword\`.\`clientStimwordAutoIncr\`)
                                                                                        FROM \`clientStimword\`
                                                                                        WHERE 1
                                                                                        AND  \`clientContext\`.\`clientContextAutoIncr\` = \`clientStimword\`.\`clientContextAutoIncr\`
                                                                                )
                                        )
                                ) 'JSON_ARRAYAGG'
                                FROM \`context\`
                                ,    \`layout\`
                                ,    \`teacher\`
                                ,    \`clientMaster\`
                                ,    \`clientSession\`
                                ,    \`clientContext\`
                                WHERE 1
                                AND \`context\`.\`layoutName\`                     = :LAYOUT_NAME
                                AND \`layout\`.\`layoutName\`                      = :LAYOUT_NAME
                                AND \`teacher\`.\`teacherEmail\`                   = :TEACHER_EMAIL
                                AND \`clientMaster\`.\`clientMasterEmail\`         = :CLIENT_MASTER_EMAIL
                                AND \`clientSession\`.\`sessionName\`              = :SESSION_NAME
                                AND \`clientContext\`.\`contextAutoIncr\`          = :CONTEXT_AUTO_INCR

                                AND  \`layout\`.\`layoutName\`                     = \`teacher\`.\`layoutName\`

                                AND \`teacher\`.\`teacherEmail\`                   = \`clientMaster\`.\`teacherEmail\`
                                AND \`teacher\`.\`teacherAutoIncr\`                = \`clientMaster\`.\`teacherAutoIncr\`

                                AND \`clientMaster\`.\`teacherEmail\`              = \`clientSession\`.\`teacherEmail\`
                                AND \`clientMaster\`.\`ClientMasterEmail\`         = \`clientSession\`.\`clientMasterEmail\`
                                AND \`clientMaster\`.\`clientMasterAutoIncr\`      = \`clientSession\`.\`clientMasterAutoIncr\`

                                AND \`clientSession\`.\`teacherEmail\`            = \`clientContext\`.\`teacherEmail\`
                                AND \`clientSession\`.\`clientMasterEmail\`       = \`clientContext\`.\`clientMasterEmail\`
                                AND \`clientSession\`.\`sessionName\`             = \`clientContext\`.\`sessionName\`
                                AND \`clientSession\`.\`clientSessionAutoIncr\`   = \`clientContext\`.\`clientSessionAutoIncr\`

                                AND \`context\`.\`contextAutoIncr\`                = \`clientContext\`.\`contextAutoIncr\`
                                ORDER BY \`clientContext\`.\`contextAutoIncr\`
                                `
                                ;
                        break;

                case    'clientContextStimwordSelectSQL'        :

                        returnVal =
                                `
                                SELECT
                                        JSON_ARRAYAGG (
                                                JSON_OBJECT
                                                (               'contextPositionSoundPhoneme'   ,       CONCAT
                                                                                                        (       \`stimwordPosition\`.\`contextPosition\`
                                                                                                        ,       ' -- '
                                                                                                        ,       \`stimwordPosition\`.\`soundPhoneme\`
                                                                                                        )
                                                        ,       'stimwordPositionSetting'       ,       \`stimwordPosition\`.\`stimwordPositionSetting\`
                                                        ,       'stimwordBackgroundColor'       ,       IFNULL(\`stimwordPosition\`.\`stimwordPositionBackgroundColor\` , '' )
                                                        ,       'clientContextErrorSound'       ,       IFNULL(\`clientStimwordCURRENT\`.\`clientContextErrorSound\`    , '' )
                                                        ,       'replicationValue'              ,       IFNULL(\`clientStimwordREPLICATE\`.\`clientContextErrorSound\`  , '' )
                                                        ,       'languageNormsError'            ,       IFNULL(\`languageNorms\`.\`languageNormsError\`                 , '' )
                                                        ,       'stimwordPositionAutoIncr'      ,       \`stimwordPosition\`.\`stimwordPositionAutoIncr\`
                                                        ,       'languageNormsErrorCOUNT'       ,
                                                        (
                                                                SELECT  COUNT(\`context_SUBSELECT\`.\`soundPhoneme\`)
                                                                FROM    \`context\`     \`context_SUBSELECT\`
                                                                ,       \`languageNorms\`       \`languageNorms_SUBSELECT\`
                                                                ,       \`stimword\`    \`stimword_SUBSELECT\`
                                                                WHERE   1

                                                                AND     \`context\`.\`contextAutoIncr\`                 =       \`context_SUBSELECT\`.\`contextAutoIncr\`
                                                                AND     \`stimword\`.\`stimwordAutoIncr\`               =       \`stimword_SUBSELECT\`.\`stimwordAutoIncr\`
                                                                AND     \`languageNorms\`.\`layoutName\`                =       \`languageNorms_SUBSELECT\`.\`layoutName\`
                                                                AND     \`languageNorms\`.\`languageNormsName\`         =       \`languageNorms_SUBSELECT\`.\`languageNormsName\`

                                                                AND     \`context_SUBSELECT\`.\`contextAutoIncr\`       =       \`languageNorms_SUBSELECT\`.\`contextAutoIncr\`
                                                                AND     \`context_SUBSELECT\`.\`layoutName\`            =       \`languageNorms_SUBSELECT\`.\`layoutName\`
                                                                AND     \`context_SUBSELECT\`.\`soundPhoneme\`          =       \`languageNorms_SUBSELECT\`.\`soundPhoneme\`
                                                                AND     \`context_SUBSELECT\`.\`contextPosition\`       =       \`languageNorms_SUBSELECT\`.\`contextPosition\`
                                                        )
                                                        ,       'clientStimwordNotes'           ,       IFNULL(\`clientStimwordCURRENT\`.\`clientStimwordNotes\`        , '' )
                                                        ,       'contextAutoIncr'               ,       \`context\`.\`contextAutoIncr\`
                                                        ,       'clientStimwordAutoIncr'        ,       \`clientStimwordCURRENT\`.\`clientStimwordAutoIncr\`
                                                )
                                        )       'JSON_ARRAYAGG' /*      to      suppress        any     sort    of      column  heading!        */
                                FROM    \`stimword\`
                                , \`context\` LEFT OUTER JOIN   \`languageNorms\`       \`languageNorms\`       ON
                                        (       1
                                                AND     \`context\`.\`contextAutoIncr\`                         =       \`languageNorms\`.\`contextAutoIncr\`
                                                AND     \`context\`.\`layoutName\`                              =       \`languageNorms\`.\`layoutName\`
                                                AND     \`context\`.\`soundPhoneme\`                            =       \`languageNorms\`.\`soundPhoneme\`
                                                AND     \`context\`.\`contextPosition\`                         =       \`languageNorms\`.\`contextPosition\`
                                                AND     \`languageNorms\`.\`layoutName\`                        =       :LAYOUT_NAME
                                                AND     \`languageNorms\`.\`languageNormsName\`                 =       :LANGUAGE_NORMS_NAME
                                        )
                                , \`stimwordPosition\` LEFT OUTER JOIN  \`clientStimword\`      \`clientStimwordCURRENT\`       ON
                                        (       1
                                                AND     \`stimwordPosition\`.\`stimwordPositionAutoIncr\`       =       \`clientStimwordCURRENT\`.\`stimwordPositionAutoIncr\`
                                                AND     \`stimwordPosition\`.\`layoutName\`                     =       \`clientStimwordCURRENT\`.\`layoutName\`
                                                AND     \`stimwordPosition\`.\`stimwordPlacement\`              =       \`clientStimwordCURRENT\`.\`stimwordPlacement\`
                                                AND     \`stimwordPosition\`.\`stimwordOrderNbr\`               =       \`clientStimwordCURRENT\`.\`stimwordOrderNbr\`
                                                AND     \`stimwordPosition\`.\`stimwordWord\`                   =       \`clientStimwordCURRENT\`.\`stimwordWord\`

                                                AND     \`stimwordPosition\`.\`contextPosition\`                =       \`clientStimwordCURRENT\`.\`contextPosition\`
                                                AND     \`stimwordPosition\`.\`stimwordOrderNbr\`               =       \`clientStimwordCURRENT\`.\`stimwordOrderNbr\`
                                                AND     \`stimwordPosition\`.\`stimwordPositionSetting\`        =       \`clientStimwordCURRENT\`.\`stimwordPositionSetting\`
                                                AND     \`stimwordPosition\`.\`soundPhoneme\`                   =       \`clientStimwordCURRENT\`.\`soundPhoneme\`

                                                AND     \`clientStimwordCURRENT\`.\`teacherEmail\`              =       :TEACHER_EMAIL
                                                AND     \`clientStimwordCURRENT\`.\`clientMasterEmail\`         =       :CLIENT_MASTER_EMAIL
                                                AND     \`clientStimwordCURRENT\`.\`sessionName\`               =       :SESSION_NAME
                                                AND     \`clientStimwordCURRENT\`.\`layoutName\`                =       :LAYOUT_NAME
                                        )
                                LEFT OUTER JOIN \`clientStimword\`      \`clientStimwordREPLICATE\`     ON
                                        (       1
                                                AND     \`stimwordPosition\`.\`stimwordPositionAutoIncr\`       =       \`clientStimwordREPLICATE\`.\`stimwordPositionAutoIncr\`
                                                AND     \`stimwordPosition\`.\`layoutName\`                     =       \`clientStimwordREPLICATE\`.\`layoutName\`
                                                AND     \`stimwordPosition\`.\`stimwordPlacement\`              =       \`clientStimwordREPLICATE\`.\`stimwordPlacement\`
                                                AND     \`stimwordPosition\`.\`stimwordOrderNbr\`               =       \`clientStimwordREPLICATE\`.\`stimwordOrderNbr\`
                                                AND     \`stimwordPosition\`.\`stimwordWord\`                   =       \`clientStimwordREPLICATE\`.\`stimwordWord\`

                                                AND     \`stimwordPosition\`.\`contextPosition\`                =       \`clientStimwordREPLICATE\`.\`contextPosition\`
                                                AND     \`stimwordPosition\`.\`stimwordOrderNbr\`               =       \`clientStimwordREPLICATE\`.\`stimwordOrderNbr\`
                                                AND     \`stimwordPosition\`.\`stimwordPositionSetting\`        =       \`clientStimwordREPLICATE\`.\`stimwordPositionSetting\`
                                                AND     \`stimwordPosition\`.\`soundPhoneme\`                   =       \`clientStimwordREPLICATE\`.\`soundPhoneme\`

                                                AND     \`clientStimwordREPLICATE\`.\`teacherEmail\`            =       :TEACHER_EMAIL
                                                AND     \`clientStimwordREPLICATE\`.\`clientMasterEmail\`       =       :CLIENT_MASTER_EMAIL
                                                AND     \`clientStimwordREPLICATE\`.\`sessionName\`             =       :REPLICATION_NAME
                                                AND     \`clientStimwordREPLICATE\`.\`layoutName\`              =       :LAYOUT_NAME
                                        )

                                WHERE   1       /*      dummy   first   one     */
                                AND     \`stimword\`.\`stimwordAutoIncr\`                       =       \`stimwordPosition\`.\`stimwordAutoIncr\`
                                AND     \`context\`.\`contextAutoIncr\`                         =       \`stimwordPosition\`.\`contextAutoIncr\`
                                AND     \`stimword\`.\`layoutName\`                             =       :LAYOUT_NAME
                                AND     \`stimword\`.\`stimwordPlacement\`                      =       :STIMWORD_PLACEMENT
                                AND     \`stimword\`.\`stimwordOrderNbr\`                       =       :STIMWORD_ORDER_NBR

                                ORDER BY        \`stimwordPosition\`.\`stimwordPlacement\`
                                ,               \`stimwordPosition\`.\`stimwordOrderNbr\`
                                ,               \`stimwordPosition\`.\`soundPhonemeOrderNbr\`
                                ;
                                `
                                ;
                        break;

                case    'contextStimwordStimwordPosition'       :
                        returnVal =
                                `
                                SELECT
                                        JSON_ARRAYAGG
                                        (       DISTINCT JSON_OBJECT
                                                ( 'stimwordWord'                ,       \`stimword\`.\`stimwordWord\`
                                                , 'stimwordOrderNbr'            ,       \`stimword\`.\`stimwordOrderNbr\`
                                                , 'stimwordPlacement'           ,       \`stimword\`.\`stimwordPlacement\`
                                                )
                                        ) 'JSON_ARRAYAGG'
                                FROM    \`context\`
                                ,       \`stimword\`
                                ,       \`stimwordPosition\`
                                WHERE   1
                                AND     \`context\`.\`contextAutoIncr\`         =       \`stimwordPosition\`.\`contextAutoIncr\`
                                AND     \`stimword\`.\`stimwordAutoIncr\`       =       \`stimwordPosition\`.\`stimwordAutoIncr\`
                                AND     \`context\`.\`contextAutoIncr\`         =       :contextAutoIncr
                                ;
                                `
                                ;
                        break;

                case    'analysisSQL'   :
                        returnVal =
                                `
                                SELECT
                                        JSON_ARRAYAGG
                                        (       JSON_OBJECT
                                                        (       'soundOrder'                    ,       \`sound\`.\`soundOrder\`
                                                        ,       'soundTitle'                    ,       \`sound\`.\`soundTitle\`
                                                        ,       'soundSubTitle'                 ,       \`sound\`.\`soundSubTitle\`
                                                        ,       'occurences'                    ,
                                                                                (       SELECT  COUNT(*)
                                                                                        FROM \`stimwordPosition\`
                                                                                        WHERE 1
                                                                                        AND     \`context\`.\`contextAutoIncr\` = \`stimwordPosition\`.\`contextAutoIncr\`
                                                                                        AND     \`stimwordPosition\`.\`stimwordPositionSetting\` IN ( 'word','sentence')
                                                                                )
                                                        ,       'positionSound'                  ,
                                                                        CONCAT
                                                                        (        \`context\`.\`soundPhoneme\`
                                                                        ,        '-'
                                                                        ,        \`context\`.\`contextPosition\`
                                                                        )
                                                        ,       'contextLabelColor'             ,       \`context\`.\`contextLabelColor\`
                                                        ,       'clientContextErrorSound'       ,       \`clientContext\`.\`clientContextErrorSound\`
                                                        ,       'clientContextErrorCount'       ,       \`clientContext\`.\`clientContextErrorCount\`
                                                        ,       'wordCount'
                                                                                                ,
                                                                                (       SELECT  COUNT(*)
                                                                                        FROM    \`clientStimword\`
                                                                                        WHERE   1
                                                                                        AND     \`clientContext\`.\`clientContextAutoIncr\`     = \`clientStimword\`.\`clientContextAutoIncr\`
                                                                                        AND     \`clientStimword\`.\`stimwordPositionSetting\`  = 'word'
                                                                                )
                                                        ,       'sentenceCount'                 ,
                                                                                (       SELECT  COUNT(*)
                                                                                        FROM    \`clientStimword\`
                                                                                        WHERE   1
                                                                                        AND     \`clientContext\`.\`clientContextAutoIncr\`     = \`clientStimword\`.\`clientContextAutoIncr\`
                                                                                        AND     \`clientStimword\`.\`stimwordPositionSetting\`  = 'sentence'
                                                                                )
                                                        ,       'readingCount'                  ,
                                                                                (       SELECT  COUNT(*)
                                                                                        FROM    \`clientStimword\`
                                                                                        WHERE   1
                                                                                        AND     \`clientContext\`.\`clientContextAutoIncr\`     = \`clientStimword\`.\`clientContextAutoIncr\`
                                                                                        AND     \`clientStimword\`.\`stimwordPositionSetting\`  = 'reading'
                                                                                )

                                                        ,       'frequency'                     ,       \`clientContext\`.\`frequency\`
                                                        ,       'clientContextErrorNotes'       ,       \`clientContext\`.\`clientContextErrorNotes\`
                                                        ,       'contextAutoIncr'               ,       \`context\`.\`contextAutoIncr\`
                                                        ,       'clientContextAutoIncr'         ,       \`clientContext\`.\`clientContextAutoIncr\`
                                                        ,       'stimwordPositionSetting'       ,       \`clientStimword\`.\`stimwordPositionSetting\`
                                                        ,       'stimwordWord'                  ,       \`clientStimword\`.\`stimwordWord\`
                                                        ,       'clientStimwordNotes'           ,       \`clientStimword\`.\`clientStimwordNotes\`
                                                        )
                                        )       'JSON_ARRAYAGG' /* to suppress any sort of column heading! */
                                FROM    \`layout\`
                                ,       \`sound\`
                                ,       \`context\`
                                ,       \`teacher\`
                                ,       \`clientMaster\`
                                ,       \`clientSession\`
                                ,       \`clientContext\`       \`clientContext\`
                                        LEFT JOIN       \`clientStimword\`
                                                ON      \`clientContext\`.\`clientContextAutoIncr\`             = \`clientStimword\`.\`clientContextAutoIncr\`
                                WHERE   1
                                AND     \`layout\`.\`layoutAutoIncr\`                           = \`teacher\`.\`layoutAutoIncr\`
                                AND     \`teacher\`.\`teacherAutoIncr\`                         = \`clientMaster\`.\`teacherAutoIncr\`
                                AND     \`clientMaster\`.\`clientMasterAutoIncr\`               = \`clientSession\`.\`clientMasterAutoIncr\`
                                AND     \`clientSession\`.\`clientSessionAutoIncr\`             = \`clientContext\`.\`clientSessionAutoIncr\`
                                AND     \`sound\`.\`soundAutoIncr\`                             = \`context\`.\`soundAutoIncr\`
                                AND     \`context\`.\`contextAutoIncr\`                         = \`clientContext\`.\`contextAutoIncr\`
                                AND     \`layout\`.\`layoutName\`                               = :LAYOUT_NAME
                                AND     \`teacher\`.\`teacherEmail\`                            = :TEACHER_EMAIL
                                AND     \`clientMaster\`.\`clientMasterEmail\`                  = :CLIENT_MASTER_EMAIL
                                AND     \`clientSession\`.\`sessionName\`                       = :SESSION_NAME
                                ;
                                `
                                ;
                                                                                /*       not working for some reason....?????
                                                                                ORDER BY        \`sound\`.\`soundOrder\`
                                                                                ,       \`context\`.\`contextAutoIncr\`
                                                                                ASC
                                                                                */
                                                        //,     'clientStimwordNotes'           ,       \`clientStimword\`.\`clientStimwordNotes\`
                                break;

                        case    'soundSelectorSelectSQL'        :
                                returnVal =
                                        `
                                        SELECT
                                                JSON_ARRAYAGG(JSON_OBJECT
                                                ( 'soundTitle'                  ,       \`sound_a\`.\`soundTitle\`
                                                , 'soundSubTitle'               ,       \`sound_a\`.\`soundSubTitle\`
                                                , 'soundPhoneme'                ,       \`sound_a\`.\`soundPhoneme\`
                                                , 'contextPosition'             ,       \`context_a\`.\`contextPosition\`
                                                , 'soundSubTitleCOUNT'  ,
                                                                                (       SELECT  COUNT(DISTINCT \`sound_b\`.\`soundSubTitle\`)
                                                                                        FROM    \`sound\` \`sound_b\`
                                                                                        WHERE 1
                                                                                        AND             \`sound_a\`.\`layoutName\`              = \`sound_b\`.\`layoutName\`
                                                                                        AND             \`sound_a\`.\`soundTitle\`              = \`sound_b\`.\`soundTitle\`
                                                                                        GROUP BY \`sound_b\`.\`soundTitle\`
                                                                                )
                                                , 'soundPhonemeCOUNT'   ,
                                                                                (       SELECT  COUNT(\`sound_b\`.\`soundSubTitle\`)
                                                                                        FROM    \`sound\` \`sound_b\`
                                                                                        WHERE   1
                                                                                        AND             \`sound_a\`.\`layoutName\`              = \`sound_b\`.\`layoutName\`
                                                                                        AND             \`sound_a\`.\`soundTitle\`              = \`sound_b\`.\`soundTitle\`
                                                                                        AND             \`sound_a\`.\`soundSubTitle\`           = \`sound_b\`.\`soundSubTitle\`
                                                                                        GROUP BY        \`sound_b\`.\`soundTitle\`
                                                                       ,                                \`sound_b\`.\`soundSubTitle\`
                                                                                        )
                                                , 'contextPositionCOUNT',
                                                                                (       SELECT  COUNT(\`context_b\`.\`contextPosition\`)
                                                                                        FROM    \`sound\`               \`sound_b\`
                                                                                        ,               \`context\`     \`context_b\`
                                                                                        WHERE 1
                                                                                        AND     \`sound_a\`.\`layoutName\`      = \`sound_b\`.\`layoutName\`
                                                                                        AND \`sound_a\`.\`soundAutoIncr\`       = \`sound_b\`.\`soundAutoIncr\`
                                                                                        AND \`sound_b\`.\`soundAutoIncr\`       = \`context_b\`.\`soundAutoIncr\`
                                                                                        GROUP BY        \`sound_b\`.\`soundTitle\`
                                                                                        ,               sound_b.soundSubTitle
                                                                                        ,               sound_b.soundPhoneme
                                                                                )
                                                , 'contextAutoIncr'     ,       \`context_a\`.\`contextAutoIncr\`
                                                )) 'JSON_ARRAYAGG'
                                FROM    \`sound\`       \`sound_a\`
                                ,       \`context\`     \`context_a\`
                                WHERE   1
                                AND     \`sound_a\`.\`layoutName\`              = :LAYOUT_NAME
                                AND     \`sound_a\`.\`soundAutoIncr\`           = \`context_a\`.\`soundAutoIncr\`
                                ORDER BY        \`sound_a\`.\`soundOrder\`
                                ,               \`context_a\`.\`contextLabelOrder\`
                                ;
                                `
                                ;
                        break;
        }  // end switch
        return returnVal;
}
