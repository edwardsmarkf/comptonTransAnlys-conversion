

####   M A I N    S C R E E N    G R I D    C R E A T O R   ! ! !
 
        @LAYOUT_NAME    =  'PESL'   ;


         SELECT  DISTINCT ''
                ,       `stimword`.`stimwordPageNbr`
                ,       `stimword`.`stimwordLineNbr`
                ,       `stimword`.`stimwordWord`
                FROM    `stimword`
		            ,       `stimwordPosition`
                WHERE   1
                AND	`stimword`.`layoutName`		    =	`stimwordPosition`.`layoutName`
                AND	`stimword`.`stimwordPageNbr`	=	`stimwordPosition`.`stimwordPageNbr`
                AND	`stimword`.`stimwordLineNbr`	=	`stimwordPosition`.`stimwordLineNbr`
                AND	`stimword`.`stimwordWord`	    =	`stimwordPosition`.`stimwordWord`
                AND `stimword`.`layoutName`       = @LAYOUT_NAME
          #########################      AND     `stimword`.`stimwordPageNbr`                 BETWEEN  0 AND  1000
                ORDER BY  `stimwordPosition`.`stimwordPageNbr`
                ,         `stimwordPosition`.`stimwordLineNbr`
                ;

