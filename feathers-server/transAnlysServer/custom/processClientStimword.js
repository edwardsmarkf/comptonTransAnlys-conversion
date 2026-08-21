



/*      clientStimword.js


        2023-04-18      - updated columns stimwordPageNbr stimwordLineNbr to stimwordPlacement and stimwordOrderNbr
        2023-06-24      - changed  clientContextSpeakingErrors clientContextErrorCount

        to run:
                npm  install knex  mysql
                node  clientStimword.js  '{"clientSessionAutoIncr": 2349, "stimwordPositionAutoIncr": 284, "clientContextErrorSound_OLD":"abc", "clientContextErrorSound_NEW": "def" }'

        for development/debugging:
                contextAutoIncr = 74 when stimwordPosition is 283/284
                contextAutoIncr = 56 when stimwordPosition is 285   !!

        adapted from
                                https://stackoverflow.com/questions/21979388/get-count-result-with-knex-js-bookshelf-js
                                https://stackoverflow.com/questions/30945104/db-raw-with-more-than-one-paremter-with-knex
                                https://stackoverflow.com/questions/33257412/how-to-handle-the-if-else-in-promise-then?rq=1
                                https://stackoverflow.com/questions/35318442/how-to-pass-parameter-to-a-promise-function
                                https://stackoverflow.com/questions/47464078/mysql-insert-with-multiple-selects-with-differing-number-of-returned-columns
                                https://stackoverflow.com/questions/48558183/knex-select-result-return-to-a-variable
                                https://stackoverflow.com/questions/53751587/knex-js-or-inside-where
                                https://stackoverflow.com/questions/54407751/how-to-add-two-bind-params-in-knex/54422388
                                https://stackoverflow.com/questions/65413824/multiple-count-and-left-joins-in-mysql-node-using-knex
                                https://stackoverflow.com/questions/70883305/best-way-to-make-a-knex-request-from-inside-a-promise      (mine)
                                https://stackoverflow.com/questions/71210850/best-way-to-have-a-knex-column-search-be-optional          (mine)

                                https://javascript.info/promise-basics

                                https://stackify.dev/136700-knex-js-how-to-select-columns-from-multiple-tables
                                https://editor.datatables.net/manual/nodejs/conditions

                                try this:  (2022-04-01 )     https://www.sitepoint.com/community/t/promises-feedback/384246/3
*/


                //                      'use strict';
                //
                //                                      //                const   parmClientStimwordAutoIncr      = myArgs.clientContextAutoIncr          ;
                //
                //
                //
                //                                                                                      //      mariadb  --host=localhost --user=knexUser  --password=knexPassword    comptonTransAnlys
                //                      const knexConnectOptions =
                //                              {       'host'          :       '127.0.0.1'
                //                              ,       'client'        :       'mysql'
                //                              ,       'debug'         :       false
                //                              ,       'connection'    :       'mysql://knexUser:knexPassword@localhost:3306/comptonTransAnlys'
                //                              };
                //
                //                      const knexMasterClient = require('knex')(knexConnectOptions);
                //
                //                      const     myArgs                               = JSON.parse(process.argv.slice(2)[0])  ;


class ExitEarly extends Error {
        /*      2023-08-04      https://www.sitepoint.com/community/t/early-exit-from-a-javascript-promise/422703/3
         *
         */
    constructor(message) {
        super(message);
        this.name = "ExitEarly";
    }
}

    /*   //export function processClientStimword (knexClient, argObj)    ??  */
export const processClientStimword = async (knexClient, argObj) => {

        const   parmClientSessionAutoIncr               = argObj.clientSessionAutoIncr          ;
        const   parmStimwordPositionAutoIncr            = argObj.stimwordPositionAutoIncr       ;
        const   parmclientContextErrorSound_OLD         = argObj.clientContextErrorSound_OLD    ;
        const   parmclientContextErrorSound_NEW         = argObj.clientContextErrorSound_NEW    ;

        return returnContextAutoIncr(knexClient, parmStimwordPositionAutoIncr)
                .catch( err =>  {
                        console.warn(err);
                        console.warn(0, `Bad returnContextAutoIncr:   parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}`, err);
                        return;
                })
                .then( val =>   {
                        
                        if  ( typeof val == 'undefined' )  {
                                console.error('contextAutoIncr cannot be undefined!')
                                throw new ExitEarly ( 'quitting this procedure!' );
                        }
                        
                        let contextAutoIncr = val.contextAutoIncr ;
                        var clientContextAutoIncr;

                        switch(true)    {
                                                /*
                                                        OLD is blank,   NEW is filled in
                                                */

                                case ( Boolean(parmclientContextErrorSound_OLD)  == false  &&    Boolean(parmclientContextErrorSound_NEW) == true )       :
                                {
                                        return selectClientContextStimword
                                                        (       knexClient
                                                        ,       parmClientSessionAutoIncr
                                                        ,       parmStimwordPositionAutoIncr
                                                        ,       true
                                                        )
                                                .then( val =>   {
                                                        if  ( val.length > 0 )  {
                                                                throw new ExitEarly
                                                                                (
                                                                                       (`Minor issue: we expected to find zero entries , but instead we found ${val.length} entries.   \
                                                                                        parmclientContextErrorSound_NEW: ${parmclientContextErrorSound_NEW},  \
                                                                                        parmClientAutoIncr: ${parmClientSessionAutoIncr},  \
                                                                                        parmStimwordPositionAutoIncr ${parmStimwordPositionAutoIncr},  \
                                                                                        stimword count: ${val.length}.\
                                                                                        `).replace(/\t/g, '' )
                                                                                );
                                                        }
                                                })

                                                .then( () =>    {

                                                        return selectClientContext
                                                                (       knexClient
                                                                ,       parmclientContextErrorSound_NEW
                                                                ,       parmClientSessionAutoIncr
                                                                ,       contextAutoIncr
                                                                )
                                                })
                                                  .then( val =>  {
                                                        if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                return  returnArray;
                                                        } else {
                                                                return insertClientContext
                                                                        (       knexClient
                                                                        ,       val
                                                                        ,       parmclientContextErrorSound_NEW
                                                                        ,       contextAutoIncr
                                                                        ,       parmClientSessionAutoIncr
                                                                        )
                                                                        ;
                                                        }
                                                })
                                                .then( val =>  {
                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                clientContextAutoIncr = val[0][0]['clientContextAutoIncr']      ;
                                                                return clientContextAutoIncr                                    ;
                                                        } else {
                                                                throw new Error ('ERROR: Bad clientContextAutoIncr on insert! ', JSON.stringify(val)   );
                                                        }
                                                })
                                                .then( ( clientContextAutoIncr) =>      {
                                                        return insertClientStimword
                                                                (       knexClient
                                                                ,       clientContextAutoIncr
                                                                ,       parmStimwordPositionAutoIncr
                                                                )
                                                                ;
                                                })
                                                .then(  (val) =>  {
                                                        let retObj =
                                                                {       'status'                        :       1
                                                                ,       'clientContextAutoIncr'         :       clientContextAutoIncr
                                                                ,       'clientStimwordAutoIncr'        :       val[0][0]['clientStimwordAutoIncr']
                                                                ,       'message'                       :       'Successful insert of clientStimword.'
                                                                }
                                                        return retObj;
                                                })
                                                .catch( err =>  {
                                                        if (err instanceof ExitEarly)   {
                                                                let retObj =
                                                                        {       'status'        :       0
                                                                        ,       'message'       :       err.name        //      'ExitEarly'
                                                                        }
                                                                return retObj
                                                        } else {
                                                                console.warn(err);
                                                                return;
                                                        }
                                                })

                                        break;
                                }

                                                /*
                                                        OLD is filled in,   NEW is filled in
                                                */

                                case ( Boolean(parmclientContextErrorSound_OLD)  == true  &&     Boolean(parmclientContextErrorSound_NEW) == true )       :
                                {
                                        var clientContextAutoIncr_OLD   ;
                                        var clientContextAutoIncr_NEW   ;

                                        return selectClientContextStimword
                                                        (       knexClient
                                                        ,       parmClientSessionAutoIncr
                                                        ,       parmStimwordPositionAutoIncr
                                                        ,       parmclientContextErrorSound_OLD
                                                        )
                                                .catch( err =>  {
                                                        console.warn(err);
                                                        console.warn    (       (`selectClientContextStimnword select failed!  \
                                                                                        selectCparmclientContextErrorSound_OLD: ${parmclientContextErrorSound_OLD},  \
                                                                                        parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  \
                                                                                        parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}.\
                                                                                        `).replace(/\t/g, '')
                                                                                ,       err
                                                                        )
                                                                        ;
                                                        return;
                                                })

                                                .then( val =>   {
                                                        let clientStimwordCount = val.length;
                                                        if  ( clientStimwordCount != 1 )        {
                                                                throw new ExitEarly
                                                                                (
                                                                                       (`minor issue: Rejecting! clientStimwordCount is equal to ${clientStimwordCount}. \
                                                                                        Cannot find:  \
                                                                                        parmclientContextErrorSound_OLD: ${parmclientContextErrorSound_OLD},  \
                                                                                        parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  \
                                                                                        parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}.\
                                                                                        `).replace(/\t/g, '')
                                                                                )
                                                                                ;
                                                        }

                                                        clientContextAutoIncr_OLD = val[0]['clientContextAutoIncr'];
                                                        return selectClientContext
                                                                        (       knexClient
                                                                        ,       parmclientContextErrorSound_NEW
                                                                        ,       parmClientSessionAutoIncr
                                                                        ,       contextAutoIncr
                                                                        )
                                                .then( val =>  {
                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                        return  returnArray;
                                                                } else {
                                                                        return insertClientContext
                                                                                (       knexClient
                                                                                ,       val
                                                                                ,       parmclientContextErrorSound_NEW
                                                                                ,       contextAutoIncr
                                                                                ,       parmClientSessionAutoIncr
                                                                                )
                                                                                ;
                                                                }
                                                        })

                                                .then( val =>  {
                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                clientContextAutoIncr_NEW = val[0][0]['clientContextAutoIncr'];
                                                        } else {
                                                                throw new ExitEarly
                                                                                (
                                                                                       (`Error on insertClientContext! \
                                                                                        parmclientContextErrorSound_NEW: ${parmclientContextErrorSound_NEW},  \
                                                                                        contextAutoIncr: ${contextAutoIncr},  \
                                                                                        parmClientSessionAutoIncr: ${parmClientSessionAutoIncr}.\
                                                                                        `).replace(/\t/g, '')
                                                                                ,       JSON.stringify(val)
                                                                                )
                                                                                ;
                                                        }

                                                        let updateClientStimwordParms =
                                                                {       'clientContextAutoIncr_OLD'     :       clientContextAutoIncr_OLD
                                                                ,       'clientContextAutoIncr_NEW'     :       clientContextAutoIncr_NEW
                                                                ,       'stimwordPositionAutoIncr'      :       parmStimwordPositionAutoIncr
                                                                ,       'clientContextErrorSound_OLD'   :       parmclientContextErrorSound_OLD
                                                                ,       'clientContextErrorSound_NEW'   :       parmclientContextErrorSound_NEW
                                                                }
                                                                ;

                                                        return  updateClientStimword(knexClient, updateClientStimwordParms)
                                                })
                                                .then( () =>    {
                                                        return deleteChildlessClientContext
                                                                        (       knexClient
                                                                        ,       contextAutoIncr
                                                                        ,       clientContextAutoIncr_OLD
                                                                        ,       parmclientContextErrorSound_OLD
                                                                        )
                                                })
                                                })
                                                .then( () =>   {
                                                        let retObj =
                                                                {       'status'                        :       1
                                                                ,       'clientContextAutoIncr - OLD'   :       clientContextAutoIncr_OLD
                                                                ,       'clientContextAutoIncr - NEW'   :       clientContextAutoIncr_NEW
                                                                ,       'message'                       :       'Successful update of clientStimword.'
                                                                }
                                                        return retObj;
                                                })
                                                .catch( err =>  {
                                                        if (err instanceof ExitEarly)   {
                                                                let retObj =
                                                                        {       'status'        :       0
                                                                        ,       'message'       :       err.name        //      'ExitEarly'
                                                                        }
                                                                return retObj
                                                        } else {
                                                                console.warn(err);
                                                                return;
                                                        }
                                                })

                                        break;
                                }

                                                /*
                                                        OLD is filled in,   NEW is BLANK!
                                                */

                                case ( Boolean(parmclientContextErrorSound_OLD)  == true  &&     Boolean(parmclientContextErrorSound_NEW) == false        )       :
                                {
                                        var clientContextAutoIncr ;

                                        return selectClientContextStimword
                                                        (       knexClient
                                                        ,       parmClientSessionAutoIncr
                                                        ,       parmStimwordPositionAutoIncr
                                                        ,       parmclientContextErrorSound_OLD
                                                        )
                                                .catch( err =>  {
                                                        console.warn(err);
                                                        console.warn    (       (`selectClientContextStimnword select failed!  \
                                                                                selectCparmclientContextErrorSound_OLD: ${parmclientContextErrorSound_OLD},  \
                                                                                parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  \
                                                                                parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}.\
                                                                                `).replace(/\t/g, '')
                                                                        ,       err
                                                                        )
                                                                        ;
                                                        return null;
                                                })
                                                .then( val =>   {
                                                        let clientStimwordCount = val.length;
                                                        if  ( clientStimwordCount != 1 )        {
                                                                throw new ExitEarly
                                                                                (
                                                                                       (`Minor error: clientStimwordCount is equal to ${clientStimwordCount}. \
                                                                                        Cannot find:   \
                                                                                        parmclientContextErrorSound_OLD: ${parmclientContextErrorSound_OLD},  \
                                                                                         to delete!  \
                                                                                        parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  \
                                                                                        parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}.\
                                                                                        `).replace(/\t/g, '')
                                                                                )
                                                                                ;
                                                        }

                                                        clientContextAutoIncr = val[0]['clientContextAutoIncr'];
                                                        return deleteClientStimword
                                                                (       knexClient
                                                                ,       parmStimwordPositionAutoIncr
                                                                ,       clientContextAutoIncr
                                                                ,       parmclientContextErrorSound_OLD
                                                                )
                                                })
                                                .then( (val) =>    {
                                                        return deleteChildlessClientContext
                                                                (       knexClient
                                                                ,       contextAutoIncr
                                                                ,       clientContextAutoIncr
                                                                ,       parmclientContextErrorSound_OLD
                                                                )
                                                })
                                                .then( val =>   {
                                                        let retObj =
                                                                {       'status'                        :       1
                                                                ,       'message'                       :       'Successful delete of clientContext & clientStimword.'
                                                                }
                                                        return retObj;
                                                })
                                                .catch( err =>  {
                                                        if (err instanceof ExitEarly)   {
                                                                console.info(err);
                                                                let retObj =
                                                                        {       'status'        :       0
                                                                        ,       'message'       :       err.name                //      'ExitEarly'
                                                                        }
                                                                return retObj
                                                        } else {
                                                                console.warn(err);
                                                                return null;
                                                        }
                                                })
                                                ;
                                        break;
                                }


                                default :       {
                                        return      (       (`Bad processing!  Attempted  \
                                                                parmclientContextErrorSound_OLD: ${parmclientContextErrorSound_OLD},  \
                                                                parmclientContextErrorSound_NEW: ${parmclientContextErrorSound_NEW}.\
                                                                `).replace(/\t/g, '')
                                                        )
                                                        ;
                                }
                        }
                })
};


async function selectClientContextStimword(knexClient, clientSessionAutoIncr, stimwordPositionAutoIncr, clientContextErrorSound)       {

        let clientContextErrorSoundFlag;

        if  ( typeof clientContextErrorSound == 'boolean' )  {
                clientContextErrorSoundFlag  = clientContextErrorSound    ;
        } else if ( typeof clientContextErrorSound == 'number' )   {
                clientContextErrorSoundFlag  = false ;
        } else {
                clientContextErrorSoundFlag  = false ;
        }

        return knexClient
                .select         ('clientContext.clientContextAutoIncr')
                .from           ('clientStimword')
                .innerJoin      ('clientContext', 'clientContext.clientContextAutoIncr', 'clientStimword.clientContextAutoIncr')
                .where          (true)
                .andWhere       (       {       'clientContext.clientSessionAutoIncr'           : clientSessionAutoIncr
                                        ,       'clientStimword.stimwordPositionAutoIncr'       : stimwordPositionAutoIncr
                                        }
                                )
                .andWhere       ( val =>        {
                                        val.where       (       {       'clientContext.clientContextErrorSound'        :       clientContextErrorSound              }       )
                                        val.orWhereRaw  (               '(true = ?)'                                    ,       clientContextErrorSoundFlag                  )
                                })
                ;
                                /*
                                        SELECT clientContext.clientContextAutoIncr
                                        FROM clientStimword
                                        INNER JOIN clientContext
                                        ON clientContext.clientContextAutoIncr = clientStimword.clientContextAutoIncr
                                        WHERE 1
                                        AND clientContext.clientSessionAutoIncr = 2349
                                        AND clientContext.clientContextErrorSound   = 'def'
                                        AND ( clientStimword.stimwordPositionAutoIncr = 285 OR true = true )
                                */
}


async function selectClientContext(knexClient, clientContextErrorSound, clientSessionAutoIncr, contextAutoIncr)        {
        return knexClient
                .select         ('clientContext.clientContextAutoIncr')
                .from           ('clientContext')
                .where          (true)
                .andWhere       (       {       'clientContext.clientContextErrorSound' : clientContextErrorSound
                                        ,       'clientContext.clientSessionAutoIncr'   : clientSessionAutoIncr
                                        ,       'clientContext.contextAutoIncr'         : contextAutoIncr
                                        }
                                )
                ;
}


function insertClientContext(knexClient, val, clientContextErrorSound, contextAutoIncr, clientSessionAutoIncr)   {

        let insertClientContextParms =
                {       'clientContextErrorSound'               :       clientContextErrorSound
                ,       'contextAutoIncr'                       :       contextAutoIncr
                ,       'clientSessionAutoIncr'                 :       clientSessionAutoIncr
                ,       'clientContextErrorCount'               :       0
                ,       'frequency'                             :       ''
                ,       'clientContextErrorNotes'               :       null
                }
                ;
        return knexClient.raw(returnSqlStatement('insertClientContextSQL'), insertClientContextParms);
                                                                                                                                    //  2026-08-04        return knexClient.raw(returnInsertClientContextStatement(), insertClientContextParms);
}

function insertClientStimword(knexClient, clientContextAutoIncr, stimwordPositionAutoIncr)     {

        let insertClientStimwordParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'stimwordPositionAutoIncr'              :       stimwordPositionAutoIncr
                }
                ;
        return knexClient.raw(returnSqlStatement('insertClientStimwordSQL'), insertClientStimwordParms);
                                                                                                                 //   2026-08-04   return knexClient.raw(returnInsertClientStimwordStatement(), insertClientStimwordParms);
}


function returnContextAutoIncr(knexClient, stimwordPositionAutoIncr)        {
        return knexClient
                .from('stimwordPosition')
                .select('contextAutoIncr')
                .where ({ 'stimwordPositionAutoIncr': stimwordPositionAutoIncr })
                .then( val => { return val[0]; } )                              // WHY IS THIS REQUIRED  ? ? ? ? ? ?? ? ? ? ? ? ? ? ? ? ? ?? ? ? ?
                ;
}


function updateClientStimword(knexClient, parmObject)    {

        let updateClientStimwordWhereParms =
                {       'stimwordPositionAutoIncr'      :       parmObject.stimwordPositionAutoIncr
                ,       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_OLD
                ,       'clientContextErrorSound'       :       parmObject.clientContextErrorSound_OLD
                };

        let updateClientStimwordUpdateParms =
                {       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_NEW
                ,       'clientContextErrorSound'       :       parmObject.clientContextErrorSound_NEW
                };

        return knexClient
                .from('clientStimword')
                .where(updateClientStimwordWhereParms)
                .update(updateClientStimwordUpdateParms)
                ;
}

function deleteClientStimword(knexClient, stimwordPositionAutoIncr, clientContextAutoIncr, clientContextErrorSound)      {
        let deleteClientStimwordParms =
                {       'stimwordPositionAutoIncr'      :       stimwordPositionAutoIncr
                ,       'clientContextAutoIncr'         :       clientContextAutoIncr
                ,       'clientContextErrorSound'       :       clientContextErrorSound
                };
        return knexClient
                .from('clientStimword')
                .where(deleteClientStimwordParms)
                .delete()
                ;
}


function deleteChildlessClientContext(knexClient, contextAutoIncr, clientContextAutoIncr, clientContextErrorSound)       {
        let deleteClientContextParms =
                {       'contextAutoIncr'                       :       contextAutoIncr
                ,       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'clientContextErrorSound'               :       clientContextErrorSound
                };
                                                                        //      2023-08-06      ,       'clientContextErrorNotes'               :       null
                                                                        //      2023-08-06      ,       'frequency'                             :       ''
                                                                        //      2023-08-06o     ,       'clientContextErrorCount'               :       0
        return knexClient
                .from('clientContext')
                .delete()
                .where          ( deleteClientContextParms      )
                                        /* ?????????????????????????????????????????????????????????????
                                         * notice NO arrow function () => allowed here.....!    ???????????????????????????
                                         *      https://github.com/knex/knex/issues/2028
                                        */
                .andWhere       ( (myVal) =>    {       myVal.whereNull ('clientContextErrorNotes'                              )       ;
                                                        myVal.orWhere   ('clientContextErrorNotes'      , '='           , ''    )       ;
                                                }
                                )
                .andWhere       ( function()    {       this.whereNull  ('frequency'                                            )       ;
                                                        this.orWhere    ('frequency'                    , '='           , ''    )       ;
                                                }
                                )
                .andWhere       (       'clientContextErrorCount'
                                ,       '='
                                ,       0
                                )
                .andWhere       (       'clientContextAutoIncr'
                                ,       'NOT IN'
                                ,
                                        knexClient      .select('clientContextAutoIncr')
                                                        .from('clientStimword')
                                                        .where({ 'clientContextAutoIncr'        :       clientContextAutoIncr   })
                                )
                ;
}


function returnSqlStatement(filePrefix)        {
  const sqlFile      = process.cwd() + '/src/sql/' + filePrefix + '.sql'    ;
  const sqlStatement = readFile(sqlFile, 'utf8')                            ;
  return  sqlStatement.replaceAll("\\\\n" ,' ')                             ;
}

// 2026-08-04      // insertClientContextSQL
// 2026-08-04      function returnInsertClientContextStatement()   {
// 2026-08-04      
// 2026-08-04      let returnVar =
// 2026-08-04              `
// 2026-08-04              INSERT INTO \`clientContext\`
// 2026-08-04              (               \`layoutName\`
// 2026-08-04              ,               \`teacherEmail\`
// 2026-08-04              ,               \`clientMasterEmail\`
// 2026-08-04              ,               \`sessionName\`
// 2026-08-04              ,               \`clientSessionAutoIncr\`
// 2026-08-04              ,               \`soundPhoneme\`
// 2026-08-04              ,               \`contextPosition\`
// 2026-08-04              ,               \`contextAutoIncr\`
// 2026-08-04              ,               \`clientContextErrorSound\`
// 2026-08-04              ,               \`clientContextErrorCount\`
// 2026-08-04              ,               \`frequency\`
// 2026-08-04              ,               \`frequencyListAutoIncr\`
// 2026-08-04              ,               \`clientContextErrorNotes\`
// 2026-08-04              )
// 2026-08-04              (       SELECT  \`clientSession\`.\`layoutName\`
// 2026-08-04                      ,               \`clientSession\`.\`teacherEmail\`
// 2026-08-04                      ,               \`clientSession\`.\`clientMasterEmail\`
// 2026-08-04                      ,               \`clientSession\`.\`sessionName\`
// 2026-08-04                      ,               \`clientSession\`.\`clientSessionAutoIncr\`
// 2026-08-04                      ,               \`context\`.\`soundPhoneme\`
// 2026-08-04                      ,               \`context\`.\`contextPosition\`
// 2026-08-04                      ,               \`context\`.\`contextAutoIncr\`
// 2026-08-04                      ,               :clientContextErrorSound
// 2026-08-04                      ,               :clientContextErrorCount
// 2026-08-04                      ,               ''
// 2026-08-04                      ,               1
// 2026-08-04                      ,               :clientContextErrorNotes
// 2026-08-04                      FROM    \`clientSession\`
// 2026-08-04                      INNER JOIN              \`context\`
// 2026-08-04                              ON              1
// 2026-08-04                              AND             \`context\`.\`contextAutoIncr\`         = :contextAutoIncr
// 2026-08-04                              AND             \`clientSession\`.\`layoutName\`        = \`context\`.\`layoutName\`
// 2026-08-04                      WHERE   1
// 2026-08-04                      AND     \`clientSession\`.\`clientSessionAutoIncr\`             = :clientSessionAutoIncr
// 2026-08-04              )
// 2026-08-04              RETURNING \`clientContextAutoIncr\`
// 2026-08-04              ;
// 2026-08-04              `;
// 2026-08-04          return returnVar;
// 2026-08-04      };
// 2026-08-04      
// 2026-08-04      //  insertClientStimwordSQL
// 2026-08-04      function        returnInsertClientStimwordStatement()   {
// 2026-08-04              
// 2026-08-04      let returnVar =
// 2026-08-04              `
// 2026-08-04              INSERT INTO \`clientStimword\`
// 2026-08-04              (       \`layoutName\`
// 2026-08-04              ,       \`teacherEmail\`
// 2026-08-04              ,       \`clientMasterEmail\`
// 2026-08-04              ,       \`sessionName\`
// 2026-08-04              ,       \`soundPhoneme\`
// 2026-08-04              ,       \`contextPosition\`
// 2026-08-04              ,       \`clientContextErrorSound\`
// 2026-08-04              ,       \`stimwordPlacement\`
// 2026-08-04              ,       \`stimwordOrderNbr\`
// 2026-08-04              ,       \`stimwordWord\`
// 2026-08-04              ,       \`stimwordPositionNbr\`
// 2026-08-04              ,       \`stimwordPositionSetting\`
// 2026-08-04              ,       \`clientContextAutoIncr\`
// 2026-08-04              ,       \`stimwordPositionAutoIncr\`
// 2026-08-04              )
// 2026-08-04              (       SELECT  \`clientContext\`.\`layoutName\`
// 2026-08-04                      ,       \`clientContext\`.\`teacherEmail\`
// 2026-08-04                      ,       \`clientContext\`.\`clientMasterEmail\`
// 2026-08-04                      ,       \`clientContext\`.\`sessionName\`
// 2026-08-04                      ,       \`stimwordPosition\`.\`soundPhoneme\`
// 2026-08-04                      ,       \`stimwordPosition\`.\`contextPosition\`
// 2026-08-04                      ,       \`clientContext\`.\`clientContextErrorSound\`
// 2026-08-04                      ,       \`stimwordPosition\`.\`stimwordPlacement\`
// 2026-08-04                      ,       \`stimwordPosition\`.\`stimwordOrderNbr\`
// 2026-08-04                      ,       \`stimwordPosition\`.\`stimwordWord\`
// 2026-08-04                      ,       \`stimwordPosition\`.\`stimwordPositionNbr\`
// 2026-08-04                      ,       \`stimwordPosition\`.\`stimwordPositionSetting\`
// 2026-08-04                      ,       \`clientContext\`.\`clientContextAutoIncr\`
// 2026-08-04                      ,       \`stimwordPosition\`.\`stimwordPositionAutoIncr\`
// 2026-08-04                      FROM    \`clientContext\`
// 2026-08-04                      INNER JOIN      \`stimwordPosition\`
// 2026-08-04                              ON      1
// 2026-08-04                              AND     \`stimwordPosition\`.\`stimwordPositionAutoIncr\`       = :stimwordPositionAutoIncr
// 2026-08-04                              AND     \`clientContext\`.\`layoutName\`                        = \`stimwordPosition\`.\`layoutName\`
// 2026-08-04                      WHERE   1
// 2026-08-04                      AND             \`clientContext\`.\`clientContextAutoIncr\`             = :clientContextAutoIncr
// 2026-08-04              )
// 2026-08-04              RETURNING \`clientStimwordAutoIncr\`
// 2026-08-04              `;
// 2026-08-04          return returnVar;
// 2026-08-04      };

