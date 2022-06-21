SET @LAYOUT_NAME    =  'PESL'   ;

SELECT JSON_ARRAYAGG(
		JSON_OBJECT
		(	'stimwordPageNbr'	,	`stimword`.`stimwordPageNbr`
        ,   'stimwordLineNbr'	,	`stimword`.`stimwordLineNbr`
        ,   'stimwordWord'		,	`stimword`.`stimwordWord`
        ,   'stimwordPhonetic'	,	`stimword`.`stimwordPhonetic`
	  	)) AS ''   
FROM    `stimword`
WHERE   1
AND   `stimword`.`layoutName`       = @LAYOUT_NAME
ORDER BY  `stimword`.`stimwordPageNbr`
,         `stimword`.`stimwordLineNbr`
;
© 2022 GitHub, Inc.
Terms
Privacy
Securit
