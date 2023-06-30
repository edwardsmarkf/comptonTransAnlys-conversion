/*      clientStimword.js


        2023-04-18      - updated columns stimwordPageNbr stimwordLineNbr to stimwordPlacement and stimwordOrderNbr
        2023-06-24      - changed  clientContextSpeakingErrors clientContextErrorCount 
        
        to run:
                npm  install knex  mysql
                node  clientStimword.js  '{"clientSessionAutoIncr": 2349, "stimwordPositionAutoIncr": 284, "clientContextErrorSound_OLD":"abc", "clientContextErrorSound_NEW": "def" }'

        for development/debugging:
                contextAutoIncr = 74 when stimwordPosition is 283/284
                contextAutoIncr = 56 when stimwordPosition is 285   !!
 
        adapted from            https://stackoverflow.com/questions/70883305/best-way-to-make-a-knex-request-from-inside-a-promise      (mine)
                                https://stackoverflow.com/questions/71210850/best-way-to-have-a-knex-column-search-be-optional          (mine)
                                https://javascript.info/promise-basics
                                https://stackoverflow.com/questions/35318442/how-to-pass-parameter-to-a-promise-function
                                https://stackoverflow.com/questions/33257412/how-to-handle-the-if-else-in-promise-then?rq=1
*/


'use strict';

var     myArgs                               = JSON.parse(process.argv.slice(2)[0])  ;
const   parmClientSessionAutoIncr            = myArgs.clientSessionAutoIncr          ;
const   parmStimwordPositionAutoIncr         = myArgs.stimwordPositionAutoIncr       ;
const   parmclientContextErrorSound_OLD      = myArgs.clientContextErrorSound_OLD         ;
const   parmclientContextErrorSound_NEW      = myArgs.clientContextErrorSound_NEW         ;
                //                const   parmClientStimwordAutoIncr      = myArgs.clientContextAutoIncr          ;



                                                                //      mariadb  --host=localhost --user=kenxUser  --password=knexPassword    comptonTransAnlys
const knexConnectOptions =
        {       'host'          :       '127.0.0.1'
        ,       'client'        :       'mysql'
        ,       'debug'         :       false
        ,       'connection'    :       'mysql://knexUser:knexPassword@localhost:3306/comptonTransAnlys'
        };

const knex = require('knex')(knexConnectOptions);



const   insertClientContextStatement    =       returnInsertClientContextStatement()    ;

const   insertClientStimwordStatement   =       returnInsertClientStimwordStatement()   ;



//  https://flexiple.com/javascript/javascript-exit-functions/
//javascript exit function using break
const getName = () => {
    getName: {
        console.log("I get logged");   // maybe embed *EVERYTHING* here ???
        break getName;
        //exits the function
        console.log("I don't get logged");
    }
};


returnContextAutoIncr(parmStimwordPositionAutoIncr)
        .catch( err =>  {
                        exitScript(0, `Bad returnContextAutoIncr:   parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}`, err);
        })
        .then( val =>   {
                let contextAutoIncr = val.contextAutoIncr ;

                switch(true)    {

                                        /*
                                                OLD is blank,   NEW is filled in
                                        */

                        case ( parmclientContextErrorSound_OLD  == ''  &&    parmclientContextErrorSound_NEW > '' )       :
                        {
                                selectClientContextStimword(parmClientSessionAutoIncr, parmStimwordPositionAutoIncr, true)
                                        .then( val =>   {

                                                let clientStimwordCount = val.length ;
                                                if  ( clientStimwordCount == 0 )        {
                                                        selectClientContext(parmclientContextErrorSound_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  {
                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                                        return  returnArray;
                                                                                } else {
                                                                                        return insertClientContext(val, parmclientContextErrorSound_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                                                }
                                                                        })
                                                                .then( val =>  {
                                                                        let clientContextAutoIncr;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                exitScript(0, 'Bad clientContextAutoIncr on insert!', val);
                                                                        }
                                                                        insertClientStimword(clientContextAutoIncr, parmStimwordPositionAutoIncr )
                                                                                .then(  val =>  {
                                                                                        console.info('do something with clientContextAutoIncr: ' + clientContextAutoIncr );
                                                                                        let returnObj = val[0];    //       val[0][0]['clientStimwordAutoIncr']);
                                                                                        returnObj['clientContextAutoIncr'] = clientContextAutoIncr;
                                                                                        exitScript(1, 'Successful insert.', returnObj);    
                                                                                });
                                                                })
                                                                .catch( err =>  {
                                                                        exitScript      (       0
                                                                                        ,       (`Cannot find selectClientContext!  parmclientContextErrorSound_NEW: ${parmclientContextErrorSound_NEW},  \
                                                                                                parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  \
                                                                                                contextAutoIncr: ${contextAutoIncr}.\
                                                                                                `).replace(/t/g, '')
                                                                                        ,       err
                                                                                        )
                                                                                        ;
                                                                })
                                                                ;
                                                } else {
                                                        exitScript      (       0
                                                                        ,       (`Duplicate insert!  \
                                                                                parmclientContextErrorSound_NEW: ${parmclientContextErrorSound_NEW},  \
                                                                                parmClientAutoIncr: ${parmClientSessionAutoIncr},  \
                                                                                parmStimwordPositionAutoIncr ${parmStimwordPositionAutoIncr},  \
                                                                                stimword count: ${clientStimwordCount}.\
                                                                                `).replace(/\t/g, '' )
                                                                        )
                                                                        ;
                                                }

                                        })                                                      // end selectClientContextStimword(NEW)
                                        .catch( err =>  {
                                                exitScript(0, 'Cannot do selectClientContextStimword on insert!', err);
                                        })
                                        ;
                                break;  // should NEVER get here.....????
                                exitScript(0, 'Somehow got past the INSERT break point?');
                        }


                                        /*
                                                OLD is filled in,   NEW is filled in
                                        */

                        case ( parmclientContextErrorSound_OLD  > ''  &&     parmclientContextErrorSound_NEW > '' )       :
                        {
                                selectClientContextStimword(parmClientSessionAutoIncr, parmStimwordPositionAutoIncr, parmclientContextErrorSound_OLD)
                                        .then( val =>   {
                                                let clientStimwordCount = val.length;
                                                if  ( clientStimwordCount == 1 )        {


                                                        let clientContextAutoIncr_OLD = val[0]['clientContextAutoIncr'];

                                                        selectClientContext(parmclientContextErrorSound_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  {
                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                                        return  returnArray;
                                                                                } else {
                                                                                        return insertClientContext(val, parmclientContextErrorSound_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                                                }
                                                                        })

                                                                .then( val =>  {
                                                                        let clientContextAutoIncr_NEW;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr_NEW = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                exitScript      (       0
                                                                                                ,       (`Error on insertClientContext! \
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

                                                                        updateClientStimword    (updateClientStimwordParms)
                                                                                .then( () =>    { return deleteChildlessClientContext(contextAutoIncr, clientContextAutoIncr_OLD, parmclientContextErrorSound_OLD) })
                                                                                .then( val =>   {
                                                                                        exitScript(1, 'Successful update of clientStimword.', val);
                                                                                })
                                                                                ;
                                                                })
                                                                .catch( err =>  {
                                                                        exitScript      (       0
                                                                                        ,       (`Bad selectClientContext on update attempt!  \
                                                                                                parmclientContextErrorSound_NEW: ${parmclientContextErrorSound_NEW},  \
                                                                                                parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  \
                                                                                                contextAutoIncr: ${contextAutoIncr}.\
                                                                                                `).replace(/\t/g, '')
                                                                                        ,       err
                                                                                        )
                                                                                        ;
                                                                })

                                                } else {
                                                        exitScript      (       0
                                                                        ,       (`Rejecting! cannot find  \
                                                                                parmclientContextErrorSound_OLD: ${parmclientContextErrorSound_OLD},  \
                                                                                parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  \
                                                                                parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}.\
                                                                                `).replace(/\t/g, '')
                                                                        ,       val
                                                                        )
                                                                        ;
                                                }
                                        })                                              // end selectClientContextStimword(OLD)
                                break;  // should NEVER get here.....????
                                exitScript(0, 'Somehow got past the UPDATE break point?');
                        }


                                        /*
                                                OLD is filled in,   NEW is BLANK!
                                        */

                        case ( parmclientContextErrorSound_OLD  > ''  &&     parmclientContextErrorSound_NEW == ''        )       :
                        {
                                selectClientContextStimword(parmClientSessionAutoIncr, parmStimwordPositionAutoIncr, parmclientContextErrorSound_OLD)
                                        .catch( err =>  {
                                                        exitScript      (       0
                                                                        ,       (`selectClientContextStimnword select failed!  \
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

                                                if  ( clientStimwordCount == 1 )        {

                                                        let clientContextAutoIncr = val[0]['clientContextAutoIncr'];

                                                        deleteClientStimword(parmStimwordPositionAutoIncr, clientContextAutoIncr, parmclientContextErrorSound_OLD)
                                                                .then( () =>    { return deleteChildlessClientContext(contextAutoIncr, clientContextAutoIncr, parmclientContextErrorSound_OLD) })
                                                                .then( val =>   {
                                                                        exitScript(1, 'Successful delete of clientStimword.', val);
                                                                })
                                                                .catch  ( err =>        { exitScript(0, 'Failed deleteClientStimword! - error message:', err); })
                                                                ;
                                                } else {
                                                        exitScript      (       0
                                                                        ,       (`Cannot find   \
                                                                                parmclientContextErrorSound_OLD: ${parmclientContextErrorSound_OLD},  \
                                                                                 to delete!  \
                                                                                parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  \
                                                                                parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}.\
                                                                                `).replace(/\t/g, '')
                                                                        )
                                                                        ;
                                                }
                                        })
                                        ;
                                break;  // should NEVER get here.....????
                                exitScript(0, 'Somehow got past the DELETE break point?');
                        }





                        default :       {
                                exitScript      (       -1
                                                ,       (`Bad processing!  Attempted  \
                                                        parmclientContextErrorSound_OLD: ${parmclientContextErrorSound_OLD},  \
                                                        parmclientContextErrorSound_NEW: ${parmclientContextErrorSound_NEW}.\
                                                        `).replace(/\t/g, '')
                                                )
                                                ;
                        }
                }
        })
        ;



function selectClientContextStimword(clientSessionAutoIncr, stimwordPositionAutoIncr, clientContextErrorSound)       {

                                                        //      https://stackify.dev/136700-knex-js-how-to-select-columns-from-multiple-tables
                                                        //      https://stackoverflow.com/questions/65413824/multiple-count-and-left-joins-in-mysql-node-using-knex
                                                        //      https://editor.datatables.net/manual/nodejs/conditions
        let clientContextErrorSoundFlag;

        if  ( typeof clientContextErrorSound == 'boolean' )  {
                clientContextErrorSoundFlag  = clientContextErrorSound    ;
        } else if ( typeof clientContextErrorSound == 'number' )   {
                clientContextErrorSoundFlag  = false ;
        } else {
                clientContextErrorSoundFlag  = false ;
        }

        return knex
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


function selectClientContext(clientContextErrorSound, clientSessionAutoIncr, contextAutoIncr)        {
                                                //      https://stackoverflow.com/questions/21979388/get-count-result-with-knex-js-bookshelf-js
                                                //      https://stackoverflow.com/questions/53751587/knex-js-or-inside-where
                                                //      https://stackoverflow.com/questions/54407751/how-to-add-two-bind-params-in-knex/54422388
                                                //      https://stackoverflow.com/questions/47464078/mysql-insert-with-multiple-selects-with-differing-number-of-returned-columns
                                                //      https://stackoverflow.com/questions/30945104/db-raw-with-more-than-one-paremter-with-knex
        return knex
                .from           ('clientContext')
                .select         ('clientContext.clientContextAutoIncr')
                .where          (true)
                .andWhere       (       {       'clientContext.clientContextErrorSound' : clientContextErrorSound
                                        ,       'clientContext.clientSessionAutoIncr'   : clientSessionAutoIncr
                                        ,       'clientContext.contextAutoIncr'         : contextAutoIncr
                                        }
                                )
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

        return knex.raw(insertClientContextStatement, insertClientContextParms);
}

function insertClientStimword(clientContextAutoIncr, stimwordPositionAutoIncr)     {

        let insertClientStimwordParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'stimwordPositionAutoIncr'              :       stimwordPositionAutoIncr
                }
                ;
        return knex.raw(insertClientStimwordStatement, insertClientStimwordParms);
}


function returnContextAutoIncr(stimwordPositionAutoIncr)        {
                                                        //      https://stackoverflow.com/questions/48558183/knex-select-result-return-to-a-variable
        return knex.from('stimwordPosition')
                .select('contextAutoIncr')
                .where ({ 'stimwordPositionAutoIncr': stimwordPositionAutoIncr })
                .then( val => { return val[0]; } )
                ;
}


function updateClientStimword   (parmObject)    {

/*
// try this:  (2022-04-01 )     https://www.sitepoint.com/community/t/promises-feedback/384246/3
// function updateClientStimword( {  stimwordPositionAutoIncr
                                   , clientContextAutoIncr_OLD
                                   , clientContextErrorSound_OLD
                                   , clientContextAutoIncr_NEW
                                   , clientContextErrorSound_NEW
                                   }
                                ) 
       {
*/
        let updateClientStimwordWhereParms =
                {       'stimwordPositionAutoIncr'      :       parmObject.stimwordPositionAutoIncr
                ,       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_OLD
                ,       'clientContextErrorSound'       :       parmObject.clientContextErrorSound_OLD
                };

        let updateClientStimwordUpdateParms =
                {       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_NEW
                ,       'clientContextErrorSound'       :       parmObject.clientContextErrorSound_NEW
                };

        return knex
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
        return knex
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
        return knex
                .from('clientContext')
                .delete()
                .where(deleteClientContextParms)
                .andWhere('clientContextAutoIncr', 'NOT IN',
                        knex    .select('clientContextAutoIncr')
                                .from('clientStimword')
                                .where({ 'clientContextAutoIncr'        :       clientContextAutoIncr   })
                )
                ;
}


function exitScript(statusVal, statusTxt, passedJSON)   {
        let returnStatus =
                {       'status'        :       statusVal
                ,       'desc'          :       statusTxt
                };
        if  ( passedJSON )      {
                Object.assign(returnStatus, passedJSON);
                                                                                                        //returnStatus['detail'] = passedJSON   ;
        }
        console.log(JSON.stringify(returnStatus));
        process.exit(statusVal);
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
        ,       \`clientContextError\`
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
                ,       \`clientContext\`.\`clientContextError\`
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
