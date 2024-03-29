DROP TABLE IF EXISTS `comptonTransAnlys`.`errorSoundsTooltip` ;

CREATE TABLE  `comptonTransAnlys`.`errorSoundsTooltip`	
(  `layoutName`                  CHAR(04)                                            NOT NULL
,  `errorSound`                  CHAR(01) CHARACTER SET utf8mb4  COLLATE utf8mb4_bin NOT NULL DEFAULT ''
,  `rowNbr`                      TINYINT(02)	                                       NOT NULL
,  `toolTip`                     VARCHAR(50)	                                       NULL
,  `errorSoundsTooltipAutoIncr`	TINYINT(02)                                          NOT NULL AUTO_INCREMENT
,  PRIMARY KEY (`errorSoundsTooltipAutoIncr`)
); 

INSERT INTO  `comptonTransAnlys`.`errorSoundsTooltip` 
               (`layoutName`, `errorSound`, `rowNbr`, `toolTip` )
VALUES  ("PESL"    ,  " "      ,         1,     "Erase"                 )
,       ("PESL"    ,   "ø"     ,         1,     "Omission"              )
,	      ("PESL"    ,   "æ"     ,         1,     ""                      )
,	      ("PESL"    ,   "ɜ"     ,         1,     ""                      )

,	      ("PESL"    ,   "ɚ"     ,         2,     ""                      )
,	      ("PESL"    ,   "ʌ"     ,         2,     ""                      )
,	      ("PESL"    ,   "ɔ"     ,         2,     ""                      )
,	      ("PESL"    ,   "ɝ"     ,         2,     ""                      )

,	      ("PESL"    ,   "ʡ"     ,         3,     "Glottal Stop"          )
,	      ("PESL"    ,   "═"     ,         3,     "Unaspirated"           )
,	      ("PESL"    ,   "←"     ,         3,     "rtroFlx"               )
,	      ("PESL"    ,   "ǝ"     ,         3,     ""                      )

,	      ("PESL"    ,   "Ɒ"     ,         4,     "Distortion"            )
,	      ("PESL"    ,   "ɛ"     ,         4,     ""                      )
,	      ("PESL"    ,   "ʃ"     ,         4,     ""                      )
,	      ("PESL"    ,   "ð"     ,         4,     ""                      )

,	      ("PESL"    ,   "ŋ"     ,         5,     ""                      )
,	      ("PESL"    ,   "θ"     ,         5,     ""                      )
,	      ("PESL"    ,   "ʀ"     ,         5,     "Trilled"               )
,	      ("PESL"    ,   "ṭ"     ,         5,     ""                      )

,	      ("PESL"    ,   "ʊ"     ,         6,     ""                      )
,	      ("PESL"    ,   "χ"     ,         6,     "pharyngeal friction"   )
,	      ("PESL"    ,   "ʒ"     ,         6,     ""                      )
,	      ("PESL"    ,   "ɪ"     ,         6,     ""                      )
;
