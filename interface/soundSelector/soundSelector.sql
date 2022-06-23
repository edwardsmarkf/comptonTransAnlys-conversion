###    S O U N D     S E L E C T O R

SET @LAYOUT_NAME = 'PESL'  ;

SELECT JSON_ARRAYAGG(JSON_OBJECT
( 'soundTitle'		,	sound.soundTitle
, 'soundSubtitle'	,	sound.soundSubTitle
, 'soundPhoneme'	,	sound.soundPhoneme
, 'contextPosition'	,	context.contextPosition
, 'contextAutoIncr'	,	context.contextAutoIncr
)) ''
FROM comptonTransAnlys.sound
, comptonTransAnlys.context
WHERE 1
AND sound.soundAutoIncr = context.soundAutoIncr
AND sound.layoutName = @LAYOUT_NAME
ORDER BY sound.soundOrder
, context.contextLabelOrder
;
