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


'use strict';

                //                const   parmClientStimwordAutoIncr      = myArgs.clientContextAutoIncr          ;



                                                                //      mariadb  --host=localhost --user=kenxUser  --password=knexPassword    comptonTransAnlys
const knexConnectOptions =
        {       'host'          :       '127.0.0.1'
        ,       'client'        :       'mysql'
        ,       'debug'         :       false
        ,       'connection'    :       'mysql://knexUser:knexPassword@localhost:3306/comptonTransAnlys'
        };

const knexClient = require('knex')(knexConnectOptions);

const     myArgs                               = JSON.parse(process.argv.slice(2)[0])  ;

const processClientStimword = async (argObj) => {

        const   parmClientSessionAutoIncr            = argObj.clientSessionAutoIncr          ;
                                                                                                        //const   parmContextAutoIncr                        = argObj.contextAutoIncr       ;
        const   parmStimwordPositionAutoIncr         = argObj.stimwordPositionAutoIncr       ;
        const   parmclientContextErrorSound_OLD      = argObj.clientContextErrorSound_OLD         ;
        const   parmclientContextErrorSound_NEW      = argObj.clientContextErrorSound_NEW         ;


    return returnContextAutoIncr(parmStimwordPositionAutoIncr)
        .catch( err =>  {
                return (0, `Bad returnContextAutoIncr:   parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}`, err);
        })
        .then( val =>   {

                                                                //let contextAutoIncr = parmContextAutoIncr ;
                let contextAutoIncr = val.contextAutoIncr ;
                var clientContextAutoIncr;

                switch(true)    {
                                        /*
                                                OLD is blank,   NEW is filled in
                                        */

                        case ( parmclientContextErrorSound_OLD  == ''  &&    parmclientContextErrorSound_NEW > '' )       :
                        {
                                return selectClientContextStimword(parmClientSessionAutoIncr, parmStimwordPositionAutoIncr, true)
                                        .then( val =>   {
                                                if  ( val.length > 0 )  {
                                                        throw new Error(
                                                                                       (`Duplicate insert!  \
                                                                                        parmclientContextErrorSound_NEW: ${parmclientContextErrorSound_NEW},  \
                                                                                        parmClientAutoIncr: ${parmClientSessionAutoIncr},  \
                                                                                        parmStimwordPositionAutoIncr ${parmStimwordPositionAutoIncr},  \
                                                                                        stimword count: ${val.length}.\
                                                                                        `).replace(/\t/g, '' )
                                                                        );
                                                }
                                        })

                                        .then( () =>    {
                                                return selectClientContext(parmclientContextErrorSound_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                        })
                                          .then( val =>  {
                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                        return  returnArray;
                                                } else {
                                                        return insertClientContext(val, parmclientContextErrorSound_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                }
                                        })
                                        .then( val =>  {
                                                if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                        clientContextAutoIncr = val[0][0]['clientContextAutoIncr']      ;
                                                        return clientContextAutoIncr                                    ;
                                                } else {
                                                        throw new Error ('Bad clientContextAutoIncr on insert! ', JSON.stringify(val)   );
                                                }
                                        })
                                        .then( ( clientContextAutoIncr) =>      {
                                                return insertClientStimword(clientContextAutoIncr, parmStimwordPositionAutoIncr);
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
                                                let retObj =
                                                        {       'status'        :       0
                                                        ,       'message'       :       err
                                                        }
                                                return retObj
                                        })
                                                                                                                                                /*
                                                                                                                                                .finally( val => {
                                                                                                                                                        console.info('finally finally finally');
                                                                                                                                                        console.info(val);
                                                                                                                                                        console.info(typeof val);
                                                                                                                                                        console.info(JSON.stringify(val));
                                                                                                                                                        console.info('finally finally exit');
                                                                                                                                                        return val;
                                                                                                                                                })
                                                                                                                                                */
                                        ;

                                break;
                        }

                                        /*
                                                OLD is filled in,   NEW is filled in
                                        */

                        case ( parmclientContextErrorSound_OLD  > ''  &&     parmclientContextErrorSound_NEW > '' )       :
                        {
                                var clientContextAutoIncr_OLD   ;
                                var clientContextAutoIncr_NEW   ;

                                return selectClientContextStimword(parmClientSessionAutoIncr, parmStimwordPositionAutoIncr, parmclientContextErrorSound_OLD)
                                        .catch( err =>  {
                                                        return  (       (`selectClientContextStimnword select failed!  \
                                                                                selectCparmclientContextErrorSound_OLD: ${parmclientContextErrorSound_OLD},  \
                                                                                parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  \
                                                                                parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}.\
                                                                                `).replace(/\t/g, '')
                                                                        ,       err
                                                                )
                                                                ;
                                        })

                                        .then( val =>   {
                                                let clientStimwordCount = val.length;
                                                if  ( clientStimwordCount != 1 )        {
                                                        throw new Error      (
                                                                               (`Rejecting! cannot find  \
                                                                                parmclientContextErrorSound_OLD: ${parmclientContextErrorSound_OLD},  \
                                                                                parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  \
                                                                                parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}.\
                                                                                `).replace(/\t/g, '')
                                                                        )
                                                                        ;
                                                }

                                                clientContextAutoIncr_OLD = val[0]['clientContextAutoIncr'];
                                                return selectClientContext(parmclientContextErrorSound_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                        .then( val =>  {
                                                        if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                return  returnArray;
                                                        } else {
                                                                return insertClientContext(val, parmclientContextErrorSound_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                        }
                                                })

                                        .then( val =>  {
                                                if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                        clientContextAutoIncr_NEW = val[0][0]['clientContextAutoIncr'];
                                                } else {
                                                        throw new Error      (
                                                                               (`Error on insertClientContext! \
                                                                                parmclientContextErrorSound_NEW: ${parmclientContextErrorSound_NEW},  \
                                                                                contextAutoIncr: ${contextAutoIncr},  \
                                                                                parmClientSessionAutoIncr: ${parmClientSessionAutoIncr}.\
                                                                                `).replace(/\t/g, '')
                                                                        ,       val
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

                                                return  updateClientStimword(updateClientStimwordParms)
                                        })
                                        .then( val =>    {
                                                return deleteChildlessClientContext(contextAutoIncr, clientContextAutoIncr_OLD, parmclientContextErrorSound_OLD) })
                                        })
                                        .then( val =>   {
                                                let retObj =
                                                        {       'status'                        :       1
                                                        ,       'clientContextAutoIncr - OLD'   :       clientContextAutoIncr_OLD
                                                        ,       'clientContextAutoIncr - NEW'   :       clientContextAutoIncr_NEW
                                                        ,       'message'                       :       'Successful update of clientStimword.'
                                                        }
                                                return retObj;
                                        })
                                        .catch( err =>  {
                                                let retObj =
                                                        {       'status'        :       0
                                                        ,       'message'       :       err
                                                        }
                                                return retObj
                                        })

                                break;
                        }

                                        /*
                                                OLD is filled in,   NEW is BLANK!
                                        */

                        case ( parmclientContextErrorSound_OLD  > ''  &&     parmclientContextErrorSound_NEW == ''        )       :
                        {
                                var clientContextAutoIncr ;

                                return selectClientContextStimword(parmClientSessionAutoIncr, parmStimwordPositionAutoIncr, parmclientContextErrorSound_OLD)
                                        .catch( err =>  {
                                                        return  (       (`selectClientContextStimnword select failed!  \
                                                                                selectCparmclientContextErrorSound_OLD: ${parmclientContextErrorSound_OLD},  \
                                                                                parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  \
                                                                                parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}.\
                                                                                `).replace(/\t/g, '')
                                                                        ,       err
                                                                )
                                                                ;
                                        })
                                        .then( val =>   {
                                                let clientStimwordCount = val.length;
                                                if  ( clientStimwordCount != 1 )        {
                                                        throw new Error      (
                                                                               (`Cannot find   \
                                                                                parmclientContextErrorSound_OLD: ${parmclientContextErrorSound_OLD},  \
                                                                                 to delete!  \
                                                                                parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  \
                                                                                parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}.\
                                                                                `).replace(/\t/g, '')
                                                                        )
                                                                        ;
                                                }

                                                clientContextAutoIncr = val[0]['clientContextAutoIncr'];
                                                return deleteClientStimword(parmStimwordPositionAutoIncr, clientContextAutoIncr, parmclientContextErrorSound_OLD)
                                        })
                                        .then( (val) =>    {
                                                return deleteChildlessClientContext(contextAutoIncr, clientContextAutoIncr, parmclientContextErrorSound_OLD)
                                        })
                                        .then( val =>   {
                                                let retObj =
                                                        {       'status'                        :       1
                                                        ,       'message'                       :       'Successful delete of clientContext & clientStimword.'
                                                        }
                                                return retObj;
                                        })
                                        .catch( err =>  {
                                                let retObj =
                                                        {       'status'        :       0
                                                        ,       'message'       :       err
                                                        }
                                                return retObj
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


processClientStimword(myArgs)
        .then(  (val)   =>      {
                console.info('Exit status stuff:');
                console.info(val);
                console.info(JSON.stringify(val));
                console.info('Closing');
                process.exit(val);
        });


async function selectClientContextStimword(clientSessionAutoIncr, stimwordPositionAutoIncr, clientContextErrorSound)       {

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


async function selectClientContext(clientContextErrorSound, clientSessionAutoIncr, contextAutoIncr)        {
        return knexClient
                .select         ('clientContext.clientContextAutoIncr')
                .from           ('clientContext')
                .where          (true)
                .andWhere       (       {       'clientContext.clientContextErrorSound' : clientContextErrorSound
                                        ,       'clientContext.clientSessionAutoIncr'   : clientSessionAutoIncr
                                        ,       'clientContext.contextAutoIncr'         : contextAutoIncr
                                        }
                                )
                                                                        //.then( val => { console.warn('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'); return val[0]; } )
                                                                        /*
                                                                        .then( val =>   {
                                                                                        console.log(val);
                                                                                        console.table(val);
                                                                                        return val;
                                                                        })
                                                                        */
                ;
}


function insertClientContext(val, clientContextErrorSound, contextAutoIncr, clientSessionAutoIncr)   {

        let insertClientContextParms =
                {       'clientContextErrorSound'               :       clientContextErrorSound
                ,       'contextAutoIncr'                       :       contextAutoIncr
                ,       'clientSessionAutoIncr'                 :       clientSessionAutoIncr
                ,       'clientContextErrorCount'               :       0
                ,       'frequency'                             :       ''
                ,       'clientContextErrorNotes'               :       null
                }
                ;

        return knexClient.raw(returnInsertClientContextStatement(), insertClientContextParms);
}

function insertClientStimword(clientContextAutoIncr, stimwordPositionAutoIncr)     {

        let insertClientStimwordParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'stimwordPositionAutoIncr'              :       stimwordPositionAutoIncr
                }
                ;
        return knexClient.raw(returnInsertClientStimwordStatement(), insertClientStimwordParms);
}


function returnContextAutoIncr(stimwordPositionAutoIncr)        {
        return knexClient
                .from('stimwordPosition')
                .select('contextAutoIncr')
                .where ({ 'stimwordPositionAutoIncr': stimwordPositionAutoIncr })
                .then( val => { return val[0]; } )                              // WHY IS THIS REQUIRED  ? ? ? ? ? ?? ? ? ? ? ? ? ? ? ? ? ?? ? ? ?
                ;
}


function updateClientStimword(parmObject)    {

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

function deleteClientStimword(stimwordPositionAutoIncr, clientContextAutoIncr, clientContextErrorSound)      {
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


function deleteChildlessClientContext(contextAutoIncr, clientContextAutoIncr, clientContextErrorSound)       {
        let deleteClientContextParms =
                {       'contextAutoIncr'                       :       contextAutoIncr
                ,       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'clientContextErrorSound'               :       clientContextErrorSound
                ,       'clientContextErrorNotes'               :       null
                ,       'frequency'                             :       ''
                ,       'clientContextErrorCount'               :       0
                };
        return knexClient
                .from('clientContext')
                .delete()
                .where(deleteClientContextParms)
                .andWhere('clientContextAutoIncr', 'NOT IN',
                        knexClient      .select('clientContextAutoIncr')
                                        .from('clientStimword')
                                        .where({ 'clientContextAutoIncr'        :       clientContextAutoIncr   })
                )
                ;
}


function returnInsertClientContextStatement()   {

let returnVar =
        `
        INSERT INTO \`clientContext\`
        (               \`layoutName\`
        ,               \`teacherEmail\`
        ,               \`clientMasterEmail\`
        ,               \`sessionName\`
        ,               \`clientSessionAutoIncr\`
        ,               \`soundPhoneme\`
        ,               \`contextPosition\`
        ,               \`contextAutoIncr\`
        ,               \`clientContextErrorSound\`
        ,               \`clientContextErrorCount\`
        ,               \`frequency\`
        ,               \`clientContextErrorNotes\`
        )
        (       SELECT  \`clientSession\`.\`layoutName\`
                ,               \`clientSession\`.\`teacherEmail\`
                ,               \`clientSession\`.\`clientMasterEmail\`
                ,               \`clientSession\`.\`sessionName\`
                ,               \`clientSession\`.\`clientSessionAutoIncr\`
                ,               \`context\`.\`soundPhoneme\`
                ,               \`context\`.\`contextPosition\`
                ,               \`context\`.\`contextAutoIncr\`
                ,               :clientContextErrorSound
                ,               :clientContextErrorCount
                ,               :frequency
                ,               :clientContextErrorNotes
                FROM    \`clientSession\`
                INNER JOIN              \`context\`
                        ON              1
                        AND             \`context\`.\`contextAutoIncr\`         = :contextAutoIncr
                        AND             \`clientSession\`.\`layoutName\`        = \`context\`.\`layoutName\`
                WHERE   1
                AND     \`clientSession\`.\`clientSessionAutoIncr\`             = :clientSessionAutoIncr
        )
        RETURNING \`clientContextAutoIncr\`
        ;
        `;
    return returnVar;
};


function        returnInsertClientStimwordStatement()   {

let returnVar =
        `
        INSERT INTO \`clientStimword\`
        (       \`layoutName\`
        ,       \`teacherEmail\`
        ,       \`clientMasterEmail\`
        ,       \`sessionName\`
        ,       \`soundPhoneme\`
        ,       \`contextPosition\`
        ,       \`clientContextErrorSound\`
        ,       \`stimwordPlacement\`
        ,       \`stimwordOrderNbr\`
        ,       \`stimwordWord\`
        ,       \`stimwordPositionNbr\`
        ,       \`stimwordPositionSetting\`
        ,       \`clientContextAutoIncr\`
        ,       \`stimwordPositionAutoIncr\`
        )
        (       SELECT  \`clientContext\`.\`layoutName\`
                ,       \`clientContext\`.\`teacherEmail\`
                ,       \`clientContext\`.\`clientMasterEmail\`
                ,       \`clientContext\`.\`sessionName\`
                ,       \`stimwordPosition\`.\`soundPhoneme\`
                ,       \`stimwordPosition\`.\`contextPosition\`
                ,       \`clientContext\`.\`clientContextErrorSound\`
                ,       \`stimwordPosition\`.\`stimwordPlacement\`
                ,       \`stimwordPosition\`.\`stimwordOrderNbr\`
                ,       \`stimwordPosition\`.\`stimwordWord\`
                ,       \`stimwordPosition\`.\`stimwordPositionNbr\`
                ,       \`stimwordPosition\`.\`stimwordPositionSetting\`
                ,       \`clientContext\`.\`clientContextAutoIncr\`
                ,       \`stimwordPosition\`.\`stimwordPositionAutoIncr\`
                FROM    \`clientContext\`
                INNER JOIN      \`stimwordPosition\`
                        ON      1
                        AND     \`stimwordPosition\`.\`stimwordPositionAutoIncr\`       = :stimwordPositionAutoIncr
                        AND     \`clientContext\`.\`layoutName\`                        = \`stimwordPosition\`.\`layoutName\`
                WHERE   1
                AND             \`clientContext\`.\`clientContextAutoIncr\`             = :clientContextAutoIncr
        )
        RETURNING \`clientStimwordAutoIncr\`
        `;
    return returnVar;
};

//






/*
GET contextAutoIncr using stimwordPosition(clientContextAutoIncr)
        switch(true)
        case   ( OLD == <blank> && NEW NOT <blank> )      {
                if  ( selectClientContextStimword(NEW) == 0 )   {
                        if  ( clientContext(NEW) NOT exists )   {
                            INSERT clientContext(NEW)
                        }
                        INSERT clientStimword(NEW)
                } else {        // duplicate!!
                        throw dup error
                }
        case   ( OLD NOT <blank> && NEW NOT <blank> )      {
                if  ( selectClientContextStimword(OLD) == 1 )   {
                        if  ( clientContext(NEW) NOT exists )   {
                            INSERT clientContext(NEW)
                        }
                        MODIFY clientStimword(OLD) to clientStimword(NEW)
                        deleteChildlessClientContext    (OLD)
                } else {
                        throw missing error
                }
        case   ( OLD NOT <blank> && NEW == <blank> )      {
                                                                //      make sure OLD exists ????
                DELETE clientStimword(OLD)
                deleteChildlessClientContext    (OLD)
        }
*/

/*
function exitScript(statusVal, statusTxt, passedJSON)   {
        let returnStatus =
                {       'status'        :       statusVal
                ,       'desc'          :       statusTxt
                };
        if  ( passedJSON )      {
                Object.assign(returnStatus, passedJSON);
        }
        process.exit(statusVal);
}
*/

