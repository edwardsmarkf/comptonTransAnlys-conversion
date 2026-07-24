SELECT
        JSON_ARRAYAGG
        (       DISTINCT JSON_OBJECT
                ( 'stimwordWord'                ,       `stimword`.`stimwordWord`
                , 'stimwordOrderNbr'            ,       `stimword`.`stimwordOrderNbr`
                , 'stimwordPlacement'           ,       `stimword`.`stimwordPlacement`
                )
        ) 'JSON_ARRAYAGG'
FROM    `context`
,       `stimword`
,       `stimwordPosition`
WHERE   1
AND     `context`.`contextAutoIncr`             =       `stimwordPosition`.`contextAutoIncr`
AND     `stimword`.`stimwordAutoIncr`           =       `stimwordPosition`.`stimwordAutoIncr`
AND     `context`.`contextAutoIncr`             =       :contextAutoIncr
;
