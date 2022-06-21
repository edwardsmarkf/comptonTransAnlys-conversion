


 

		
          ##  ?? do we even need this one anymor???		
		
                SELECT  `sessionNames`.`sessionReplicate`
                ,       `sessionNames`.`sessionBeginLineNbr`
                ,       `sessionNames`.`sessionEndLineNbr`
                ,       `sessionNames`.`sessionErrorsCssNormalClass`
                ,       `sessionNames`.`sessionErrorsCssReplicateClass`
                FROM    `sessionNames`
                WHERE   1
                AND     `sessionNames`.`sessionName`              =       'Time1'
                ;








OLD OLD OLD OLD OLD OLD OLD
                SELECT  COUNT(*)
                        FROM stimwordPosition
                        WHERE   1=1
                        AND     stimwordPositionLayoutName                      = 'P-ESL'
                        AND     stimwordPositionPageNbr                 = 1
                        AND     stimwordPositionLineNbr                 = 1
                        AND     stimwordPosition_stimulus_word          = 'Horse'
                UNION ALL
                SELECT COUNT(*)
                        FROM Language_norms
                        RIGHT JOIN (stimwordPosition)
                        ON      (       1
                                AND     stimwordPositionLayoutName              /* added 05-19-2006 */
                                    =   Language_normsLayoutName                /* added 05-19-2006 */
                                AND     stimwordPosition_position
                                    =   Language_norms_position
                                AND     stimwordPosition_target_sound_1
                                    =   Language_norms_target_sound_1
                                AND     stimwordPosition_target_sound_2
                                    =   Language_norms_target_sound_2
                                AND     stimwordPosition_target_sound_3
                                    =   Language_norms_target_sound_3

                                AND     stimwordPositionLayoutName              = 'P-ESL'
                                AND     stimwordPositionPageNbr         = 1
                                AND     stimwordPositionLineNbr         = 1
                                AND     stimwordPosition_stimulus_word  = 'Horse'
                                )
                        WHERE   Language_norms_language_name            = 'Filipino'

                SELECT  COUNT(*)
                        FROM stimwordPosition
                        WHERE   1=1
                        AND     stimwordPositionLayoutName                      = 'P-ESL'
                        AND     stimwordPositionPageNbr                 = 1
                        AND     stimwordPositionLineNbr                 = 1
                        AND     stimwordPositionWord            = 'Horse'
                UNION ALL
                SELECT COUNT(*)
                        FROM languageNorms
                        RIGHT JOIN (stimwordPosition)
                        ON      (       1
                                AND     stimwordPosition.stimwordPositionLayoutName
                                    =   languageNorms.languageNormsLayoutName
                                AND     stimwordPosition.stimwordPositionName
                                    =   languageNorms.languageNormsPosition
                                AND     stimwordPosition.stimwordPositionPhoneme
                                    =   languageNorms.languageNormsPhoneme
                                AND     stimwordPosition.stimwordPositionLayoutName             = 'P-ESL'
                                AND     stimwordPosition.stimwordPositionPageNbr                = 1
                                AND     stimwordPosition.stimwordPositionLineNbr                = 1
                                AND     stimwordPosition.stimwordPositionWord   = 'Horse'
                                )
                        WHERE   languageNormsName               = 'Filipino'



OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD



          SELECT  ALL ''
                ,	`stimwordPosition`.`layoutName`
                ,       `stimwordPosition`.`stimwordWord`                   
                ,       `stimwordPosition`.`contextPosition`
                ,       `stimwordPosition`.`stimwordPositionNbr`                    'stimwordPositionNbr'
                ,       `stimwordPosition`.`stimwordPositionSetting`
                ,       `stimwordPosition`.`stimwordPositionBackgroundColor`
                ,       `stimwordPosition`.`stimwordPositionBdrColor`
                ,       `stimwordPosition`.`stimwordPositionBdrStyle`
                ,       `stimwordPosition`.`stimwordPositionBdrThickness`
                ,       `stimwordPosition`.`soundPhoneme`
                ,       `stimwordPosition`.`stimwordPageNbr`      	            'stimwordPositionPageNbr'
                ,       `stimwordPosition`.`stimwordPositionAutoIncr`               'stimwordPositionAutoIncr'
                ,	`languageNorms`.`languageNormsError`
                ,       `clientStimwordCURRENT`.`clientContextError`                'clientContextError CURRENT'
                ,       `clientStimwordREPLICATE`.`clientContextError`              'clientContextError REPLICATE'
                FROM    
                `context` LEFT OUTER JOIN `languageNorms` ON
                (		1
                AND		`context`.`contextAutoIncr`		= `languageNorms`.`contextAutoIncr`
                AND		`context`.`layoutName`	      		= `languageNorms`.`layoutName`
                AND		`context`.`soundPhoneme`		= `languageNorms`.`soundPhoneme`
                AND		`context`.`contextPosition`		= `languageNorms`.`contextPosition`
                AND		`languageNorms`.`layoutName`		= 'PESL'
                AND		`languageNorms`.`languageNormsName` 	= 'Indian-pakistan'
                )
                ,
                `stimwordPosition` LEFT OUTER JOIN `clientStimword` `clientStimwordCURRENT` ON
                (       1
                AND     `stimwordPosition`.`stimwordPositionAutoIncr`       	=       `clientStimwordCURRENT`.`stimwordPositionAutoIncr`
                AND     `stimwordPosition`.`layoutName`                     	=       `clientStimwordCURRENT`.`layoutName`
                AND     `stimwordPosition`.`stimwordPageNbr`        		=       `clientStimwordCURRENT`.`stimwordPageNbr`
                AND     `stimwordPosition`.`stimwordLineNbr`        		=       `clientStimwordCURRENT`.`stimwordLineNbr`
                AND     `stimwordPosition`.`stimwordWord`           		=       `clientStimwordCURRENT`.`stimwordWord`

                AND     `stimwordPosition`.`contextPosition`                	=       `clientStimwordCURRENT`.`contextPosition`
                AND     `stimwordPosition`.`stimwordPositionNbr`            	=       `clientStimwordCURRENT`.`stimwordPositionNbr`
                AND     `stimwordPosition`.`stimwordPositionSetting`        	=       `clientStimwordCURRENT`.`stimwordPositionSetting`
                AND	`stimwordPosition`.`soundPhoneme`			= 	`clientStimwordCURRENT`.`soundPhoneme`

                AND     `clientStimwordCURRENT`.`teacherEmail`              	=       'info@englishwithoutaccent.com'
                AND     `clientStimwordCURRENT`.`clientMasterEmail`         	=       'mark_f_edwards@yahoo.com'
                AND     `clientStimwordCURRENT`.`sessionName`   				=       'Time2'
                AND     `clientStimwordCURRENT`.`layoutName`                	=       'PESL'
                )
                LEFT OUTER JOIN `clientStimword` `clientStimwordREPLICATE` ON
                (       1
                AND     `stimwordPosition`.`stimwordPositionAutoIncr`       	=       `clientStimwordREPLICATE`.`stimwordPositionAutoIncr`
                AND     `stimwordPosition`.`layoutName`                     	=	`clientStimwordREPLICATE`.`layoutName`
                AND     `stimwordPosition`.`stimwordPageNbr`                	=       `clientStimwordREPLICATE`.`stimwordPageNbr`
                AND     `stimwordPosition`.`stimwordLineNbr`                	=       `clientStimwordREPLICATE`.`stimwordLineNbr`
                AND     `stimwordPosition`.`stimwordWord`                   	=       `clientStimwordREPLICATE`.`stimwordWord`

                AND     `stimwordPosition`.`contextPosition`                	=       `clientStimwordREPLICATE`.`contextPosition`
                AND     `stimwordPosition`.`stimwordPositionNbr`            	=       `clientStimwordREPLICATE`.`stimwordPositionNbr`
                AND     `stimwordPosition`.`stimwordPositionSetting`        	=       `clientStimwordREPLICATE`.`stimwordPositionSetting`
		AND	`stimwordPosition`.`soundPhoneme`			=	`clientStimwordREPLICATE`.`soundPhoneme`

                AND     `clientStimwordREPLICATE`.`teacherEmail`            	=       'info@englishwithoutaccent.com'
                AND     `clientStimwordREPLICATE`.`clientMasterEmail`       	=       'mark_f_edwards@yahoo.com'
                AND     `clientStimwordREPLICATE`.`sessionName` 		=       'Time1'
                AND     `clientStimwordREPLICATE`.`layoutName`              	=       'PESL'
                )
                WHERE   1                       /* dummy first one */
                AND		`context`.`contextAutoIncr`  =      `stimwordPosition`.`contextAutoIncr`
                AND     `stimwordPosition`.`layoutName`                         =       'PESL'
                AND     `stimwordPosition`.`stimwordPageNbr`                    =       1
                AND     `stimwordPosition`.`stimwordLineNbr`                    =       1
                AND     `stimwordPosition`.`stimwordWord`                       =       'Horse'
                ORDER BY        `stimwordPosition`.`stimwordPositionAutoIncr`
                ;


        SELECT  Language_norms_error_sound_1
        ,       Language_norms_error_sound_2
        ,       Language_norms_error_sound_3
        ,       Language_norms_error_sound_4
        FROM    Language_norms
        WHERE   1
        AND     Language_normsLayoutName        =       'P-ESL'
        AND     Language_norms_language_name    =       'Filipino'
        AND     Language_norms_position         =       'blend'
        AND     Language_norms_target_sound_1   =       'd'
        AND     Language_norms_target_sound_2   =       'r'
        AND     Language_norms_target_sound_3   =       ''
        ;


      SELECT    languageNorms.languageNormsError1
        ,       languageNorms.languageNormsError2
        ,       languageNorms.languageNormsError3
        ,       languageNorms.languageNormsError4
        FROM    languageNorms
        WHERE   1
        AND     languageNorms.languageNormsLayoutName        =       'P-ESL'
        AND     languageNorms.languageNormsName           =       'Filipino'
        AND     languageNorms.languageNormsPosition         =       'blend'
        AND     languageNorms.languageNormsPhoneme       =       'dr'
        ;




UNUSED UNUSED UNUSED UNUSED
                SELECT  Phonetic_spelling_target_sound
                FROM    Phonetic_spelling
                WHERE   1
                AND     Phonetic_spellingLayoutName     =       'P-ESL'
                AND     Phonetic_spellingPageNbr        =       1
                AND     Phonetic_spellingLineNbr        =       1
                AND     Phonetic_spelling_stimulus_word =       'Horse'
                ORDER BY
                        Phonetic_spelling_order_nbr
                ;
UNUSED UNUSED UNUSED UNUSED





               Eval_master             =>      stimwordPosition
                Client_anlys_detail     =>      clientContext
                Client_eval_detail      =>      clientStimword


                                stimwordPosition                        clientStimword
                                ================                        ==============
Eval_master_stimulus_word    => stimwordPositionWord            ==      clientPositionWord
Eval_master_position         => stimwordPostionName             ==      clientContextPositionName (!!!!!)  clientContextPosition                (????)
Eval_master_position_nbr     => stimwordPositionNbr             ==      clientStimwordPostionNbr
Eval_master_context          => stimwordPositionSetting         ==      clientStimwordSetting


`stimwordPositionWord` char(25) NOT NULL,
`stimwordPositionName` varchar(20) NOT NULL,
`stimwordPositionNbr` tinyint(3) unsigned NOT NULL,
`stimwordPositionSetting` char(20) NOT NULL,

`clientStimwordWord` char(25) NOT NULL,
`clientContextPositionName` varchar(20) NOT NULL,
`clientStimwordPositionNbr` tinyint(3) unsigned NOT NULL,
`clientStimwordSetting` char(20) NOT NULL,

