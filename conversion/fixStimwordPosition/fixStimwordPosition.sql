ALTER TABLE comptonTransAnlys.stimwordPosition ADD COLUMN IF NOT EXISTS soundPhonemeOrderNbr int(3) NOT NULL AFTER soundPhoneme ;


# layoutName	stimwordPlacement	stimwordOrderNbr	stimwordWord	contextPosition	stimwordPositionNbr	stimwordPositionSetting	soundPhoneme	soundPhonemeOrderNbr	stimwordPositionBackgroundColor	stimwordPositionBdrColor	stimwordPositionBdrStyle	stimwordPositionBdrThickness	createdAt	updatedAt	contextAutoIncr	stimwordAutoIncr	stimwordPositionAutoIncr
# PESL	15	15	away	vowel	0	reading	e	2	#fff	#000	none	0	2022-02-22 15:24:54	2022-02-22 16:02:55	67	274	735
UPDATE `comptonTransAnlys`.`stimwordPosition` 
    SET `stimwordPositionNbr` = '1' 
    WHERE 1
    AND  (`layoutName` = 'PESL' AND `stimwordPlacement` = 15 AND `stimwordOrderNbr` = 15 AND `stimwordWord` = 'away' AND `stimwordPositionAutoIncr` = '735')
    ;


# layoutName	stimwordPlacement	stimwordOrderNbr	stimwordWord	contextPosition	stimwordPositionNbr	stimwordPositionSetting	soundPhoneme	soundPhonemeOrderNbr	stimwordPositionBackgroundColor	stimwordPositionBdrColor	stimwordPositionBdrStyle	stimwordPositionBdrThickness	createdAt	updatedAt	contextAutoIncr	stimwordAutoIncr	stimwordPositionAutoIncr
# PESL	15	16	on a	vowel	1	reading	ǝ	2	#fff	#000	solid	thin	2022-02-22 15:24:54	2022-02-22 16:02:55	78	275	738
UPDATE `comptonTransAnlys`.`stimwordPosition` 
    SET `stimwordPositionNbr` = '1' 
    WHERE 1
    AND (`layoutName` = 'PESL' AND `stimwordPlacement` = 15 AND `stimwordOrderNbr` = 16 AND `stimwordWord` = 'on a' AND `stimwordPositionAutoIncr` = '738')
    ;


# layoutName	stimwordPlacement	stimwordOrderNbr	stimwordWord	contextPosition	stimwordPositionNbr	stimwordPositionSetting	soundPhoneme	soundPhonemeOrderNbr	stimwordPositionBackgroundColor	stimwordPositionBdrColor	stimwordPositionBdrStyle	stimwordPositionBdrThickness	createdAt	updatedAt	contextAutoIncr	stimwordAutoIncr	stimwordPositionAutoIncr
#PESL	24	15	sixty-one	middle	3	reading	w	6	#fff	#000	solid	thin	2022-02-22 15:24:54	2022-02-22 16:02:55	62	371	1089
UPDATE `comptonTransAnlys`.`stimwordPosition`
    SET `stimwordPositionNbr` = '4' 
    WHERE 1
    AND     (   `layoutName`                = 'PESL'
            AND `stimwordPlacement`           = 24 
            AND `stimwordOrderNbr`           = 15
            AND `stimwordWord`              = 'sixty-one' 
            AND `stimwordPositionAutoIncr`  = '1089'
            )
    ;

SELECT DISTINCT `stimwordPlacement`, `stimwordOrderNbr`, `stimwordWord`,  `stimwordPositionNbr` ,`contextPosition`,  `soundPhoneme`
FROM `comptonTransAnlys`.`stimwordPosition`
WHERE 1
AND `layoutName` = 'PESL'
GROUP BY    `stimwordPlacement`
    ,       `stimwordOrderNbr`
    ,       `stimwordWord`
    ,       `stimwordPositionNbr`
    ,       `contextPosition`        
    ##  , soundPhoneme     ## include and remove soundPhoneme !!
ORDER BY    `layoutName`
        ,   `stimwordPlacement`
        ,   `stimwordOrderNbr`
        ,   `stimwordPositionAutoIncr`
;






/*
#select  *  
SELECT distinct stimwordPositionAutoIncr
,	 stimwordPlacement
, 	stimwordOrderNbr 
,   stimwordWord
, 	stimwordPositionNbr
,  	contextPosition
,	stimwordPositionSetting
,	soundPhoneme  
FROM comptonTransAnlys.stimwordPosition
where 1 
and layoutName = 'PESL'
and stimwordWord = 'zipper'
group  by stimwordPlacement, stimwordLineNbr , stimwordWord, contextPosition  
, stimwordPositionSetting
, soundPhoneme 
order by  stimwordPositionAutoIncr    #stimwordPlacement, stimwordLineNbr , stimwordWord, contextPosition
;
*/
