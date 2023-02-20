/*      code to produce the literal "row number" for stimwordPosition

    2023-02-20 -
        change stimwordPageNbr   to stimwordPlacement
        change stimwordLineNbr   to stimwordOrderNbr
*/

'use strict;'

const knexConnectOptions = {
  client: 'mysql',
  debug: false,
  connection: 'mysql://knexUser:knexPassword@localhost:3306/comptonTransAnlys'
};

const knex = require('knex')(knexConnectOptions);

knex.from('stimwordPosition')
        .select (       'layoutName'
                ,       'stimwordPlacement'
                ,       'stimwordOrderNbr'
                ,       'stimwordWord'
                ,       'stimwordPositionNbr'
                ,       'contextPosition'
                ,       'stimwordPositionSetting'
                ,       'soundPhoneme'
                ,       'stimwordPositionAutoIncr'
                )
        .where  (true)
        .orderBy([{ column: 'layoutName' } , { column: 'stimwordPlacement'} , {column: 'stimwordOrderNbr' } , { column: 'stimwordPositionAutoIncr'}])
        .then( rows => {
                let saved = {};
                for (row of rows) {
                        if      (       JSON.stringify({ layoutName : row.layoutName, stimwordPlacement : row.stimwordPlacement, stimwordOrderNbr : row.stimwordOrderNbr , stimwordWord: row.stimwordWord })
                                ==      JSON.stringify(saved)
                                )
                        {
                                rowCount++;
                        } else {
                                rowCount = 0;
                                saved = { layoutName : row.layoutName, stimwordPlacement : row.stimwordPlacement, stimwordOrderNbr : row.stimwordOrderNbr , stimwordWord: row.stimwordWord };
                        }
                                                                                /*
                                                                                knex('stimwordPosition')
                                                                                        .where  ({'stimwordPositionAutoIncr'    : row.stimwordPositionAutoIncr  })
                                                                                        .update ({ 'soundPhonemeOrderNbr'       : rowCount                      })
                                                                                        .then   ( rows => { console.log ('success: ' + JSON.stringify(rows)); } )
                                                                                        .catch  ((err) => { console.log( JSON.stringify(err)); throw err })
                                                                                        ;
                                                                                */
                        //console.log(rowCount, row.stimwordPositionAutoIncr, row.layoutName, row.stimwordPlacement, row.stimwordOrderNbr, row.stimwordWord, row.stimwordPositionNbr, row.contextPosition, row.stimwordPositionSetting, row.soundPhoneme);
                        console.log('UPDATE `stimwordPosition` SET `soundPhonemeOrderNbr` = ' + rowCount + ' WHERE TRUE AND `stimwordPositionAutoIncr` = ' + row.stimwordPositionAutoIncr + ';' ) ;
                }
            })
        .catch((err) => { console.log( err); throw err })
        .finally(() => {
                knex.destroy();
                process.exit();
        });
