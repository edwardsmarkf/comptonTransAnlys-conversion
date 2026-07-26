SELECT  JSON_ARRAYAGG
        (       DISTINCT JSON_OBJECT
                (       'stimwordWord'          ,       `stimword`.`stimwordWord`
                ,       'stimwordAutoIncr'      ,       `stimword`.`stimwordAutoIncr`
                )
        ) 'JSON_ARRAYAGG'
FROM    `clientContext`
,       `clientStimword`
,       `stimword`
,       `stimwordPosition`
WHERE   1
AND     `clientContext`.`clientContextAutoIncr`         = `clientStimword`.`clientContextAutoIncr`
AND     `stimwordPosition`.`stimwordPositionAutoIncr`   = `clientStimword`.`stimwordPositionAutoIncr`
AND     `stimwordPosition`.`stimwordAutoIncr`           = `stimword`.`stimwordAutoIncr`
AND     `clientContext`.`clientContextAutoIncr`         = :clientContextAutoIncr
ORDER BY
        `stimword`.`stimwordWord`
        ASC
;
