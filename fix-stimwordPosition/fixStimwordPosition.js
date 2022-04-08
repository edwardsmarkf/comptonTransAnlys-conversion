
/*      code to produce the literal "row number" for stimwordPosition
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
                 ,      'stimwordPageNbr'
                ,       'stimwordLineNbr'
                ,       'stimwordWord'
                ,       'stimwordPositionNbr'
                ,       'contextPosition'
                ,       'stimwordPositionSetting'
                ,       'soundPhoneme'
                )
        .where  (true)
        .orderBy('stimwordPositionAutoIncr')
        .then( rows => {
                let saved = {};
                for (row of rows) {
                        if      (       JSON.stringify({  layoutName      : row.laytoutName
                                                        , stimwordPageNbr : row.stimwordPageNbr
                                                        , stimwordLineNbr : row.stimwordLineNbr
                                                        , stimwordWord    : row.stimwordWord 
                                                        })
                                ==      JSON.stringify(saved)
                                )
                        {
                                rowCount++;
                        } else {
                                rowCount = 0;
                                saved = {   layoutName          : row.layoutName
                                         ,  stimwordPageNbr     : row.stimwordPageNbr
                                         ,  stimwordLineNbr     : row.stimwordLineNbr
                                         ,  stimwordWord        : row.stimwordWord
                                        };
                        }
                        console.log(    rowCount
                                   ,    row.layouytName
                                   ,    row.stimwordPageNbr
                                   ,    row.stimwordLineNbr
                                   ,    row.stimwordWord
                                   ,    row.stimwordPositionNbr
                                   ,    row.contextPosition
                                   ,    row.stimwordPositionSetting
                                   ,    row.soundPhoneme
                                   );
                                                                        //console.log(JSON.stringify(row));
                }
            })
        .catch((err) => { console.log( err); throw err })
        .finally(() => {
                knex.destroy();
                process.exit();
        });
~
