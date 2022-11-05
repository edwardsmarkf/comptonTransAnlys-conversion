DROP TABLE IF EXISTS `comptonTransAnlys`.`errorSoundsTooltip` ;

CREATE TABLE  `comptonTransAnlys`.`errorSoundsTooltip`	
(	`errorSound`		CHAR(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT ''
,	`rowNbr`			SMALLINT	NOT NULL
,	`toolTip`			VARCHAR(50)	NULL
,	`errorSoundsAutoIncr`	SMALLINT	NOT NULL AUTO_INCREMENT
,	PRIMARY KEY (`errorSoundsAutoIncr`)
); 

INSERT INTO  `comptonTransAnlys`.`errorSoundsTooltip` ( `errorSound`, `rowNbr`, `toolTip` )
VALUES  ("&nbsp;" ,         1,     "Erase"                 )
,       ( "ø"     ,         1,     "Omission"              )
,	      ( "æ"     ,         1,     ""                      )
,	      ( "ɜ"     ,         1,     ""                      )

,	      ( "ɚ"     ,         2,     ""                      )
,	      ( "ʌ"     ,         2,     ""                      )
,	      ( "ɔ"     ,         2,     ""                      )
,	      ( "ɝ"     ,         2,     ""                      )

,	      ( "ʡ"     ,         3,     "Glottal Stop"          )
,	      ( "═"     ,         3,     "Unaspirated"           )
,	      ( "←"     ,         3,     "rtroFlx"               )
,	      ( "ǝ"     ,         3,     ""                      )

,	      ( "Ɒ"     ,         4,     "Distortion"            )
,	      ( "ɛ"     ,         4,     ""                      )
,	      ( "ʃ"     ,         4,     ""                      )
,	      ( "ð"     ,         4,     ""                      )

,	      ( "ŋ"     ,         5,     ""                      )
,	      ( "θ"     ,         5,     ""                      )
,	      ( "ʀ"     ,         5,     "Trilled"               )
,	      ( "ṭ"     ,         5,     ""                      )

,	      ( "ʊ"     ,         6,     ""                      )
,	      ( "χ"     ,         6,     "pharyngeal friction"   )
,	      ( "ʒ"     ,         6,     ""                      )
,	      ( "ɪ"     ,         6,     ""                      )
;
