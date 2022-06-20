###  THE BIG ONE!   (several more below)

###	2022-05-10 - added 'COUNT' and 'GROUP BY'
###	2022-05-11 - removed "GROUP BY" and added subquery instead
###	2022-05-13 - added "stimwordPositionAutoIncr" and removed "stimwordWord"


   ###   mariadb      --skip-column-names comptonTransAnlys   < x.sql | sed -e 's/},{/}\n,{/g'  ;  ########      | tr '|' '\n'   ;

        SELECT  ##JSON_ARRAYAGG(
                JSON_OBJECT
                ( 	'contextPositionSoundPhoneme'   , CONCAT( `stimwordPosition`.`contextPosition`, ' -- ' , `stimwordPosition`.`soundPhoneme` )
                ,       'stimwordPositionSetting'       , `stimwordPosition`.`stimwordPositionSetting`
                ,       'stimwordBackgroundColor'       , IFNULL(`stimwordPosition`.`stimwordPositionBackgroundColor`,'')
                ,       'clientContextError'            , IFNULL(`clientStimwordCURRENT`.`clientContextError`, '')
                ,       'replicationValue'              , IFNULL(`clientStimwordREPLICATE`.`clientContextError`,'')
                ,       'languageNormsError'            , IFNULL(`languageNorms`.`languageNormsError`, '')
                ,       'stimwordPositionAutoIncr'      , `stimwordPosition`.`stimwordPositionAutoIncr`
                ,        'languageNormsErrorCOUNT'      ,               
                                (
                                        SELECT  COUNT(`context_SUBSELECT`.`soundPhoneme`)
                                        FROM    `context`               `context_SUBSELECT`
                                        ,       `languageNorms`         `languageNorms_SUBSELECT`
                                        ,       `stimword`              `stimword_SUBSELECT`
                                        WHERE   1

                                        AND     `context`.`contextAutoIncr`             = `context_SUBSELECT`.`contextAutoIncr`
                                        AND     `stimword`.`stimwordAutoIncr`           = `stimword_SUBSELECT`.`stimwordAutoIncr`
                                        AND     `languageNorms`.`layoutName`            = `languageNorms_SUBSELECT`.`layoutName`
                                        AND     `languageNorms`.`languageNormsName`     = `languageNorms_SUBSELECT`.`languageNormsName`

                                        AND     `context_SUBSELECT`.`contextAutoIncr`   = `languageNorms_SUBSELECT`.`contextAutoIncr`
                                        AND     `context_SUBSELECT`.`layoutName`        = `languageNorms_SUBSELECT`.`layoutName`
                                        AND     `context_SUBSELECT`.`soundPhoneme`      = `languageNorms_SUBSELECT`.`soundPhoneme`
                                        AND     `context_SUBSELECT`.`contextPosition`   = `languageNorms_SUBSELECT`.`contextPosition`
                                )
                )
                ##)  ''   /* to suppress any sort of column heading! */
                FROM    `stimword`
                ,
                `context` LEFT OUTER JOIN `languageNorms` `languageNorms` ON
                (               1
                AND             `context`.`contextAutoIncr`             = `languageNorms`.`contextAutoIncr`
                AND             `context`.`layoutName`          = `languageNorms`.`layoutName`
                AND             `context`.`soundPhoneme`                = `languageNorms`.`soundPhoneme`
                AND             `context`.`contextPosition`             = `languageNorms`.`contextPosition`
                AND             `languageNorms`.`layoutName`            = 'PESL'
                AND             `languageNorms`.`languageNormsName`     = 'Indian-pakistan'
                )
                ,
                `stimwordPosition` LEFT OUTER JOIN `clientStimword` `clientStimwordCURRENT` ON
                (       1
                AND     `stimwordPosition`.`stimwordPositionAutoIncr`           =       `clientStimwordCURRENT`.`stimwordPositionAutoIncr`
                AND     `stimwordPosition`.`layoutName`                         =       `clientStimwordCURRENT`.`layoutName`
                AND     `stimwordPosition`.`stimwordPageNbr`                    =       `clientStimwordCURRENT`.`stimwordPageNbr`
                AND     `stimwordPosition`.`stimwordLineNbr`                    =       `clientStimwordCURRENT`.`stimwordLineNbr`
                AND     `stimwordPosition`.`stimwordWord`                       =       `clientStimwordCURRENT`.`stimwordWord`

                AND     `stimwordPosition`.`contextPosition`                    =       `clientStimwordCURRENT`.`contextPosition`
                AND     `stimwordPosition`.`stimwordPositionNbr`                =       `clientStimwordCURRENT`.`stimwordPositionNbr`
                AND     `stimwordPosition`.`stimwordPositionSetting`            =       `clientStimwordCURRENT`.`stimwordPositionSetting`
                AND     `stimwordPosition`.`soundPhoneme`                       =       `clientStimwordCURRENT`.`soundPhoneme`

                AND     `clientStimwordCURRENT`.`teacherEmail`                  =       'info@englishwithoutaccent.com'
                AND     `clientStimwordCURRENT`.`clientMasterEmail`             =       'mark_f_edwards@yahoo.com' ## '12yukos@gmail.com'
                AND     `clientStimwordCURRENT`.`sessionName`                   =       'Time2'
                AND     `clientStimwordCURRENT`.`layoutName`                    =       'PESL'
                )
                LEFT OUTER JOIN `clientStimword` `clientStimwordREPLICATE` ON
                (       1
                AND     `stimwordPosition`.`stimwordPositionAutoIncr`           =       `clientStimwordREPLICATE`.`stimwordPositionAutoIncr`
                AND     `stimwordPosition`.`layoutName`                         =       `clientStimwordREPLICATE`.`layoutName`
                AND     `stimwordPosition`.`stimwordPageNbr`                    =       `clientStimwordREPLICATE`.`stimwordPageNbr`
                AND     `stimwordPosition`.`stimwordLineNbr`                    =       `clientStimwordREPLICATE`.`stimwordLineNbr`
                AND     `stimwordPosition`.`stimwordWord`                       =       `clientStimwordREPLICATE`.`stimwordWord`

                AND     `stimwordPosition`.`contextPosition`                    =       `clientStimwordREPLICATE`.`contextPosition`
                AND     `stimwordPosition`.`stimwordPositionNbr`                =       `clientStimwordREPLICATE`.`stimwordPositionNbr`
                AND     `stimwordPosition`.`stimwordPositionSetting`            =       `clientStimwordREPLICATE`.`stimwordPositionSetting`
                AND     `stimwordPosition`.`soundPhoneme`                       =       `clientStimwordREPLICATE`.`soundPhoneme`

                AND     `clientStimwordREPLICATE`.`teacherEmail`                =       'info@englishwithoutaccent.com'
                AND     `clientStimwordREPLICATE`.`clientMasterEmail`           =       'mark_f_edwards@yahoo.com'  ##'12yukos@gmail.com'
                AND     `clientStimwordREPLICATE`.`sessionName`                                 =       'Time1'
                AND     `clientStimwordREPLICATE`.`layoutName`                  =       'PESL'
                )

                WHERE   1                       /* dummy first one */
                AND `stimword`.`stimwordAutoIncr`                               =       `stimwordPosition`.`stimwordAutoIncr`
                AND `context`.`contextAutoIncr`                                 =       `stimwordPosition`.`contextAutoIncr`
                AND `stimword`.`layoutName`                                     =       "PESL"
                AND `stimword`.`stimwordPageNbr`                                =       "1"  ## see below
                AND `stimword`.`stimwordLineNbr`                                =       "1"    

                ORDER BY        `stimwordPosition`.`stimwordPageNbr`
                ,               `stimwordPosition`.`stimwordLineNbr`
                ,               `stimwordPosition`.`soundPhonemeOrderNbr`
                ;
 /* horse         --  1/1 
    snake         --  1/2
    clown         --  1/3  
    dog           --  1/4 
    protected     --  21/5
    thread        --  2/19
    sixty-seven   --  25/9
    Rockefeller   --  9/3, 16/3
    threatening   --  20/7
    Eventually    --  13/1
  */




