SELECT
                JSON_ARRAYAGG(JSON_OBJECT
                ( 'soundTitle'                  ,       `sound_a`.`soundTitle`
                , 'soundSubTitle'               ,       `sound_a`.`soundSubTitle`
                , 'soundPhoneme'                ,       `sound_a`.`soundPhoneme`
                , 'contextPosition'             ,       `context_a`.`contextPosition`
                , 'soundSubTitleCOUNT'  ,
                                                (       SELECT  COUNT(DISTINCT `sound_b`.`soundSubTitle`)
                                                        FROM    `sound` `sound_b`
                                                        WHERE 1
                                                        AND             `sound_a`.`layoutName`          = `sound_b`.`layoutName`
                                                        AND             `sound_a`.`soundTitle`          = `sound_b`.`soundTitle`
                                                        GROUP BY `sound_b`.`soundTitle`
                                                )
                , 'soundPhonemeCOUNT'   ,
                                                (       SELECT  COUNT(`sound_b`.`soundSubTitle`)
                                                        FROM    `sound` `sound_b`
                                                        WHERE   1
                                                        AND             `sound_a`.`layoutName`          = `sound_b`.`layoutName`
                                                        AND             `sound_a`.`soundTitle`          = `sound_b`.`soundTitle`
                                                        AND             `sound_a`.`soundSubTitle`       = `sound_b`.`soundSubTitle`
                                                        GROUP BY        `sound_b`.`soundTitle`
                                                        ,               `sound_b`.`soundSubTitle`
                                                        )
                , 'contextPositionCOUNT',
                                                (       SELECT  COUNT(`context_b`.`contextPosition`)
                                                        FROM    `sound`         `sound_b`
                                                        ,               `context`       `context_b`
                                                        WHERE 1
                                                        AND     `sound_a`.`layoutName`  = `sound_b`.`layoutName`
                                                        AND `sound_a`.`soundAutoIncr`   = `sound_b`.`soundAutoIncr`
                                                        AND `sound_b`.`soundAutoIncr`   = `context_b`.`soundAutoIncr`
                                                        GROUP BY        `sound_b`.`soundTitle`
                                                        ,               sound_b.soundSubTitle
                                                        ,               sound_b.soundPhoneme
                                                )
                , 'contextAutoIncr'     ,       `context_a`.`contextAutoIncr`
                )) 'JSON_ARRAYAGG'
FROM    `sound`         `sound_a`
,       `context`       `context_a`
WHERE   1
AND     `sound_a`.`layoutName`          = :LAYOUT_NAME
AND     `sound_a`.`soundAutoIncr`               = `context_a`.`soundAutoIncr`
ORDER BY        `sound_a`.`soundOrder`
,               `context_a`.`contextLabelOrder`
;
#
