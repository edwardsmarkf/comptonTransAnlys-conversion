#select  *  
SELECT distinct stimwordPositionAutoIncr
,	 stimwordPageNbr
, 	stimwordLineNbr 
,   stimwordWord
, 	stimwordPositionNbr
,  	contextPosition
,	stimwordPositionSetting
,	soundPhoneme  
FROM comptonTransAnlys.stimwordPosition
where 1 
and layoutName = 'PESL'
and stimwordWord = 'zipper'
group  by stimwordPageNbr, stimwordLineNbr , stimwordWord, contextPosition  
, stimwordPositionSetting
, soundPhoneme 
order by  stimwordPositionAutoIncr    #stimwordPageNbr, stimwordLineNbr , stimwordWord, contextPosition
;
