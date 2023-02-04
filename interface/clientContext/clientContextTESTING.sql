        INSERT INTO  clientSession
                        SET     layoutName                      =       'PESL'
                        ,       teacherEmail                    =       'info@englishwithoutaccent.com'
                        ,       clientMasterEmail               =       'mark_f_edwards@yahoo.com'
                        ,       sessionName                     =       'Time2'
                        ,		clientMasterAutoIncr			=		1617
       ;
			
                INSERT INTO clientContext
                        SET     layoutName                      =       'PESL'
                        ,       teacherEmail                    =       'info@englishwithoutaccent.com'
                        ,       clientMasterEmail               =       '12yukos@gmail.com'
                        ,       sessionName                     =       'Time2'
						            ,       soundPhoneme                    =       'b'
                        ,       contextPosition					        =		'initial'
                        ,       clientContextError              =       'XX'
                        ,		    frequency						            =		''
                        ,       createdAt                       =       CURDATE()
                        ,       updatedAt                       =       CURDATE()
                        ,       contextAutoIncr                 =       6
                        ,       clientSessionAutoIncr           =       2349
                        ;
