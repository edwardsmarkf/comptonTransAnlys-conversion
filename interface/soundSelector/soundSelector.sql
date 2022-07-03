###    S O U N D     S E L E C T O R

SET @LAYOUT_NAME = 'PESL'  ;

SELECT 	`sound_a`.`soundTitle`
	,	`sound_a`.`soundSubTitle`
		,	`sound_a`.`soundPhoneme`
		,	`context_a`.`contextPosition`
, `context_a`.`contextAutoIncr`
,					(	SELECT  COUNT(DISTINCT `sound_b`.`soundSubTitle`)
						FROM	`comptonTransAnlys`.`sound` `sound_b` 
						WHERE 1
						AND		`sound_a`.`layoutName`		= `sound_b`.`layoutName`
						AND		`sound_a`.`soundTitle`		= `sound_b`.`soundTitle`
						GROUP BY `sound_b`.`soundTitle`
					)  'soundSubTitleCOUNT'	
, 
					(	SELECT  COUNT(`sound_b`.`soundSubTitle`)
						FROM	`comptonTransAnlys`.`sound` `sound_b` 
						WHERE	1
						AND		`sound_a`.`layoutName`		= `sound_b`.`layoutName`
						AND		`sound_a`.`soundTitle`		= `sound_b`.`soundTitle`
						AND		`sound_a`.`soundSubTitle`	= `sound_b`.`soundSubTitle`
						GROUP BY	`sound_b`.`soundTitle`
                        ,			`sound_b`.`soundSubTitle`
					)  'soundPhonemeCOUNT'
, 
							(	SELECT  COUNT(`context_b`.`contextPosition`)
								FROM	`comptonTransAnlys`.`sound`		`sound_b`
								,		`comptonTransAnlys`.`context`	`context_b`
								WHERE 1
								AND	`sound_a`.`layoutName`		= `sound_b`.`layoutName`
								AND `sound_a`.`soundAutoIncr`	= `sound_b`.`soundAutoIncr`
								AND `sound_b`.`soundAutoIncr`	= `context_b`.`soundAutoIncr`
								GROUP BY	`sound_b`.`soundTitle`
								,			sound_b.soundSubTitle
                                ,			sound_b.soundPhoneme  
							)  'contextPositionCOUNT'

FROM	`comptonTransAnlys`.`sound`		`sound_a`
,		`comptonTransAnlys`.`context`   `context_a`
WHERE 1
AND `sound_a`.`layoutName` = @LAYOUT_NAME
AND `sound_a`.`soundAutoIncr` = `context_a`.`soundAutoIncr`
HAVING soundSubTitleCOUNT = 1 or soundPhonemeCOUNT = 1 OR contextPositionCOUNT = 1
ORDER BY	`sound_a`.`soundOrder`
,			`context_a`.`contextLabelOrder`
;
