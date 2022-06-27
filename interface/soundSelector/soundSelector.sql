###    S O U N D     S E L E C T O R

SET @LAYOUT_NAME = 'PESL'  ;

SELECT JSON_ARRAYAGG(JSON_OBJECT
( 'soundTitle'			,	`sound_a`.`soundTitle`
, 'soundSubtitle'		,	`sound_a`.`soundSubTitle`
, 'soundPhoneme'	,	`sound_a`.`soundPhoneme`
, 'contextPosition'	,	`context_a`.`contextPosition`
, 'soundSubTitleCOUNT'	,
					(	SELECT  COUNT(`sound_b`.`soundSubTitle`)
						FROM	`comptonTransAnlys`.`sound` `sound_b` 
						WHERE	1
						AND		`sound_a`.`layoutName`		= `sound_b`.`layoutName`
						AND		`sound_a`.`soundTitle`		= `sound_b`.`soundTitle`
						AND		`sound_a`.`soundSubTitle`	= `sound_b`.`soundSubTitle`
						GROUP BY	`sound_b`.`soundTitle`
                        ,			`sound_b`.`soundSubTitle`
					)
, 'contextPositionCOUNT', 
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
							)
, 'contextAutoIncr'	,	`context_a`.`contextAutoIncr`
)) ''
FROM	`comptonTransAnlys`.`sound`		`sound_a`
,		`comptonTransAnlys`.`context`   `context_a`
WHERE 1
AND `sound_a`.`layoutName` = @LAYOUT_NAME
AND `sound_a`.`soundAutoIncr` = `context_a`.`soundAutoIncr`
ORDER BY	`sound_a`.`soundOrder`
,			`context_a`.`contextLabelOrder`
;
