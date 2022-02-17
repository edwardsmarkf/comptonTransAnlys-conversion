====  2022-02-17

[root@localhost knex]# clear
[root@localhost knex]# cat  clientStimword.js

//       node  clientStimword.js  '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 284, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def", "clientStimwordNotes" : "my client stimword notes"}'


/*
  ## new ball word "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "notes ball word abc 285"}'              ;       ##      ONE

  ## duplicate error!
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "hopefully a duplicate error"}'          ;       ##      TWO

  ## another duplicate error!
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"", "clientContextError_NEW" : "XXX"    , "clientStimwordNotes" : "hopefully a duplicate error"}'          ;       ##      THREE

  ## new ball sentence "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 286, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "notes ball sentence abc 286"}'          ;       ##      FOUR

  ## new seal word "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 273, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "notes seal word abc 273"}'              ;       ##      FIVE

  ## new seal sentence "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 274, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "notes seal sentence abc 274"}'          ;       ##      SIX

  ## change ball word from "abc" to "def"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def" , "clientStimwordNotes" : "notes ball word abc -> def"}'           ;       ##      SEVEN

  ## should fail on trying to change item
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def" , "clientStimwordNotes" : "cannot find item to change"}'           ;       ##      EIGHT

  ## delete ball word "def"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"def", "clientContextError_NEW" : ""   , "clientStimwordNotes" : "deleting ball word def"    }'            ;       ##      NINE

  ## delete ball sentence "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 286, "clientContextError_OLD" :"abc", "clientContextError_NEW" : ""   , "clientStimwordNotes" : "deleting ball word abc"    }'            ;       ##      TEN

  ## cannot find item to delete
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 286, "clientContextError_OLD" :"abc", "clientContextError_NEW" : ""   , "clientStimwordNotes" : "cannot find item to delete!"    }'       ;       ##      ELEVEN

*/


//      contextAutoIncr = 74 when stimwordPosition is 283/284
//      contextAutoIncr = 56 when stimwordPosition is 285   !!

'use strict';

var     myArgs                          = JSON.parse(process.argv.slice(2)[0])  ;
const   parmClientSessionAutoIncr       = myArgs.clientSessionAutoIncr          ;
const   parmStimwordPositionAutoIncr    = myArgs.stimwordPositionAutoIncr       ;
const   parmClientContextError_OLD      = myArgs.clientContextError_OLD         ;
const   parmClientContextError_NEW      = myArgs.clientContextError_NEW         ;
const   parmClientStimwordNotes         = myArgs.clientStimwordNotes            ;

                                                                        //      mariadb  --host=localhost --user=knexUser  --password=knexPassword    knexDb    ;
                                                                        //      mariadb  --host=localhost --user=kenxUser  --password=knexPassword    comptonTransAnlys
const knexConnectOptions =
        {       'client'        :       'mysql'
        ,       'debug'         :       false
        ,       'connection'    :       'mysql://knexUser:knexPassword@localhost:3306/comptonTransAnlys'
        };

const knex = require('knex')(knexConnectOptions);

                                //      https://javascript.info/promise-basics
                                //      https://stackoverflow.com/questions/35318442/how-to-pass-parameter-to-a-promise-function
                                //      https://stackoverflow.com/questions/33257412/how-to-handle-the-if-else-in-promise-then?rq=1


const   insertClientContextStatement    =       returnInsertClientContextStatement()    ;

const   insertClientStimwordStatement   =       returnInsertClientStimwordStatement()   ;

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

                        case ( parmClientContextError_OLD  == ''  &&    parmClientContextError_NEW != ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_NEW, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {

                                                let clientStimwordCount = val.length ;
                                                if  ( clientStimwordCount == 0 )        {
                                                        selectClientContext(parmClientContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  {
                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                                        return  returnArray;
                                                                                } else {
                                                                                        return insertClientContext(val, parmClientContextError_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                                                }
                                                                        })
                                                                .then( val =>  {
                                                                        let clientContextAutoIncr;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                exitScript(0, 'Bad clientContextAutoIncr on insert!', val);
                                                                        }
                                                                        insertClientStimword(clientContextAutoIncr, parmStimwordPositionAutoIncr, parmClientStimwordNotes)
                                                                                .then(  val =>  {
                                                                                        exitScript(1, 'Successful insert.', val[0]);    //       val[0][0]['clientStimwordAutoIncr']);
                                                                                });
                                                                })
                                                                .catch( err =>  {
                                                                        exitScript      (       0
                                                                                        ,       (`Cannot find selectClientContext!  parmClientContextError_NEW: ${parmClientContextError_NEW},  \
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
                                                                                parmClientContextError_NEW: ${parmClientContextError_NEW},  \
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

                        case ( parmClientContextError_OLD  > ''  &&     parmClientContextError_NEW > '' )       :
                        {
                                selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {
                                                let clientStimwordCount = val.length;
                                                if  ( clientStimwordCount == 1 )        {


                                                        let clientContextAutoIncr_OLD = val[0]['clientContextAutoIncr'];

                                                        selectClientContext(parmClientContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  {
                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                                        return  returnArray;
                                                                                } else {
                                                                                        return insertClientContext(val, parmClientContextError_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                                                }
                                                                        })

                                                                .then( val =>  {
                                                                        let clientContextAutoIncr_NEW;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr_NEW = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                exitScript      (       0
                                                                                                ,       (`Error on insertClientContext! \
                                                                                                        parmClientContextError_NEW: ${parmClientContextError_NEW},  \
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
                                                                                                        ,       'clientContextError_OLD'        :       parmClientContextError_OLD
                                                                                                        ,       'clientContextError_NEW'        :       parmClientContextError_NEW
                                                                                                        ,       'clientStimwordNotes'           :       parmClientStimwordNotes
                                                                                                        }
                                                                                                        ;

                                                                        let updateClientStimwordResult;
                                                                        updateClientStimword    (updateClientStimwordParms)
                                                                                .then( () =>    { return deleteChildlessClientContext(contextAutoIncr, clientContextAutoIncr_OLD, parmClientContextError_OLD) })
                                                                                .then( val =>   {
                                                                                        Object.assign(val, updateClientStimwordResult);
                                                                                        exitScript(1, 'Successful update of clientStimword.', val);
                                                                                })
                                                                                ;
                                                                })
                                                                .catch( err =>  {
                                                                        exitScript      (       0
                                                                                        ,       (`Bad selectClientContext on update attempt!  \
                                                                                                parmClientContextError_NEW: ${parmClientContextError_NEW},  \
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
                                                                                parmClientContextError_OLD: ${parmClientContextError_OLD},  \
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

                        case ( parmClientContextError_OLD  != ''  &&    parmClientContextError_NEW == ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .catch( err =>  {
                                                        exitScript      (       0
                                                                        ,       (`selectClientContextStimnword select failed!  \
                                                                                selectCparmClientContextError_OLD: ${parmClientContextError_OLD},  \
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

                                                        let deleteClientStimwordResult  ;
                                                        deleteClientStimword(parmStimwordPositionAutoIncr, clientContextAutoIncr, parmClientContextError_OLD)
                                                                .then   ( val =>        {
                                                                                if  ( typeof val == 'number' )  {
                                                                                        deleteClientStimwordResult = val ;
                                                                                }
                                                                                return deleteChildlessClientContext(contextAutoIncr, clientContextAutoIncr, parmClientContextError_OLD) ;
                                                                        })
                                                                .then   ( val =>        {
                                                                                let deleteClientContextResult;
                                                                                if  ( typeof val == 'number' )  {
                                                                                        deleteClientContextResult = val ;
                                                                                }
                                                                                exitScript      (       1
                                                                                                ,       (`Successful delete  of childlessClientContent.  \
                                                                                                        clientContextAutoIncr: ${clientContextAutoIncr},  \
                                                                                                        parmClientContextError_OLD: ${parmClientContextError_OLD},  \
                                                                                                        clientContent deleted: ${deleteClientContextResult},  \
                                                                                                        clientStimword deleted: ${deleteClientStimwordResult}.\
                                                                                                        `).replace(/\t/g, '')
                                                                                                ,       val
                                                                                                )
                                                                        })
                                                                .catch  ( err =>        { exitScript(0, 'Failed deleteClientStimword! - error message:', err); })
                                                                ;
                                                } else {
                                                        exitScript      (       0
                                                                        ,       (`Cannot find this one for delete!  \
                                                                                parmClientContextError_OLD: ${parmClientContextError_OLD},  \
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
                                                        parmClientContextError_OLD: ${parmClientContextError_OLD},  \
                                                        parmClientContextError_NEW: ${parmClientContextError_NEW}.\
                                                        `).replace(/\t/g, '')
                                                )
                                                ;
                        }
                }
        })
        ;

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

function selectClientContextStimword(clientContextError, clientSessionAutoIncr, stimwordPositionAutoIncr)       {

                                                        //      https://stackify.dev/136700-knex-js-how-to-select-columns-from-multiple-tables
                                                        //      https://stackoverflow.com/questions/65413824/multiple-count-and-left-joins-in-mysql-node-using-knex
                                                        //      https://editor.datatables.net/manual/nodejs/conditions
        return knex
                                                                                //.count          ('* as clientContextStimwordCount')
                .select         ('clientContext.clientContextAutoIncr')
                .from           ('clientStimword')
                .innerJoin      ('clientContext', 'clientContext.clientContextAutoIncr', 'clientStimword.clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientSessionAutoIncr'         : clientSessionAutoIncr         })
                .andWhere       ({'clientStimword.stimwordPositionAutoIncr'     : stimwordPositionAutoIncr      })
                ;
                                /*
                                        SELECT clientContext.clientContextAutoIncr
                                        FROM clientStimword
                                        INNER JOIN clientContext
                                        ON clientContext.clientContextAutoIncr = clientStimword.clientContextAutoIncr
                                        WHERE 1
                                        AND clientContext.clientSessionAutoIncr = 2349
                                        AND clientContext.clientContextError   = 'def'
                                        AND ( clientStimword.stimwordPositionAutoIncr = 285 OR true = true )
                                */
}


function selectClientContext(clientContextError, clientSessionAutoIncr, contextAutoIncr)        {
                                                //      https://stackoverflow.com/questions/21979388/get-count-result-with-knex-js-bookshelf-js
                                                //      https://stackoverflow.com/questions/53751587/knex-js-or-inside-where
                                                //      https://stackoverflow.com/questions/54407751/how-to-add-two-bind-params-in-knex/54422388
                                                //      https://stackoverflow.com/questions/47464078/mysql-insert-with-multiple-selects-with-differing-number-of-returned-columns
                                                //      https://stackoverflow.com/questions/30945104/db-raw-with-more-than-one-paremter-with-knex
        return knex
                .from           ('clientContext')
                .select         ('clientContext.clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientContextError'    : clientContextError            })
                .andWhere       ({'clientContext.clientSessionAutoIncr' : clientSessionAutoIncr         })
                .andWhere       ({'clientContext.contextAutoIncr'       : contextAutoIncr               })
                ;
}


function insertClientContext(val, clientContextError, contextAutoIncr, clientSessionAutoIncr)   {

        let insertClientContextParms =
                {       'clientContextError'                    :       clientContextError
                ,       'contextAutoIncr'                       :       contextAutoIncr
                ,       'clientSessionAutoIncr'                 :       clientSessionAutoIncr
                ,       'clientContextErrorSpeakingCount'       :       0
                ,       'frequency'                             :       ''
                ,       'clientContextErrorNotes'               :       null
                }
                ;

        return knex.raw(insertClientContextStatement, insertClientContextParms);
}

function insertClientStimword(clientContextAutoIncr, stimwordPositionAutoIncr, clientStimwordNotes)     {

        let insertClientStimwordParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'stimwordPositionAutoIncr'              :       stimwordPositionAutoIncr
                ,       'clientStimwordNotes'                   :       clientStimwordNotes
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

        let updateClientStimwordWhereParms =
                {       'stimwordPositionAutoIncr'      :       parmObject.stimwordPositionAutoIncr
                ,       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_OLD
                ,       'clientContextError'            :       parmObject.clientContextError_OLD
                };

        let updateClientStimwordUpdateParms =
                {       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_NEW
                ,       'clientContextError'            :       parmObject.clientContextError_NEW
                ,       'clientStimwordNotes'           :       parmObject.clientStimwordNotes
                };

        return knex
                .from('clientStimword')
                .where(updateClientStimwordWhereParms)
                .update(updateClientStimwordUpdateParms)
                ;
}

function deleteClientStimword(stimwordPositionAutoIncr, clientContextAutoIncr, clientContextError)      {
        let deleteClientStimwordParms =
                {       'stimwordPositionAutoIncr'      :       stimwordPositionAutoIncr
                ,       'clientContextAutoIncr'         :       clientContextAutoIncr
                ,       'clientContextError'            :       clientContextError
                };
        return knex
                .from('clientStimword')
                .where(deleteClientStimwordParms)
                .delete()
                ;
}


function deleteChildlessClientContext(contextAutoIncr, clientContextAutoIncr, clientContextError)       {
        let deleteClientContextParms =
                {       'contextAutoIncr'                       :       contextAutoIncr
                ,       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'clientContextError'                    :       clientContextError
                ,       'clientContextErrorNotes'               :       null
                ,       'frequency'                             :       ''
                ,       'clientContextErrorSpeakingCount'       :       0
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
        ,               \`clientContextError\`
        ,               \`clientContextErrorSpeakingCount\`
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
                ,               :clientContextError
                ,               :clientContextErrorSpeakingCount
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
        ,       \`stimwordPageNbr\`
        ,       \`stimwordLineNbr\`
        ,       \`stimwordWord\`
        ,       \`stimwordPositionNbr\`
        ,       \`stimwordPositionSetting\`
        ,       \`clientStimwordNotes\`
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
                ,       \`stimwordPosition\`.\`stimwordPageNbr\`
                ,       \`stimwordPosition\`.\`stimwordLineNbr\`
                ,       \`stimwordPosition\`.\`stimwordWord\`
                ,       \`stimwordPosition\`.\`stimwordPositionNbr\`
                ,       \`stimwordPosition\`.\`stimwordPositionSetting\`
                ,       :clientStimwordNotes
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
[root@localhost knex]#









====   2022-02-16

[root@localhost knex]# clear
[root@localhost knex]#
[root@localhost knex]#
[root@localhost knex]# cat  clientStimword.js

//       node  clientStimword.js  '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 284, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def", "clientStimwordNotes" : "my client stimword notes"}'


/*
  ## new ball word "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "notes ball word abc 285"}'              ;       ##      ONE

  ## duplicate error!
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "hopefully a duplicate error"}'          ;       ##      TWO

  ## new ball sentence "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 286, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "notes ball sentence abc 286"}'          ;       ##      THREE

  ## new seal word "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 273, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "notes seal word abc 273"}'              ;       ##      FOUR

  ## new seal sentence "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 274, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "notes seal sentence abc 274"}'          ;       ##      FIVE

  ## change ball word from "abc" to "def"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def" , "clientStimwordNotes" : "notes ball word abc -> def"}'           ;       ##      SIX

  ## should fail on trying to change item
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def" , "clientStimwordNotes" : "cannot find item to change"}'           ;       ##      SEVEN

  ## delete ball word "def"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"def", "clientContextError_NEW" : ""   , "clientStimwordNotes" : "deleting ball word def"    }'            ;       ##      EIGHT

  ## delete ball sentence "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 286, "clientContextError_OLD" :"abc", "clientContextError_NEW" : ""   , "clientStimwordNotes" : "deleting ball word abc"    }'            ;       ##      NINE

  ## cannot find item to delete
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 286, "clientContextError_OLD" :"abc", "clientContextError_NEW" : ""   , "clientStimwordNotes" : "cannot find item to delete!"    }'       ;       ##      TEN

*/


//      contextAutoIncr = 74 when stimwordPosition is 283/284
//      contextAutoIncr = 56 when stimwordPosition is 285   !!

'use strict';

var     myArgs                          = JSON.parse(process.argv.slice(2)[0])  ;
const   parmClientSessionAutoIncr       = myArgs.clientSessionAutoIncr          ;
const   parmStimwordPositionAutoIncr    = myArgs.stimwordPositionAutoIncr       ;
const   parmClientContextError_OLD      = myArgs.clientContextError_OLD         ;
const   parmClientContextError_NEW      = myArgs.clientContextError_NEW         ;
const   parmClientStimwordNotes         = myArgs.clientStimwordNotes            ;

                                                                        //      mariadb  --host=localhost --user=knexUser  --password=knexPassword    knexDb    ;
                                                                        //      mariadb  --host=localhost --user=kenxUser  --password=knexPassword    comptonTransAnlys
const knexConnectOptions =
        {       'client'        :       'mysql'
        ,       'debug'         :       false
        ,       'connection'    :       'mysql://knexUser:knexPassword@localhost:3306/comptonTransAnlys'
        };

const knex = require('knex')(knexConnectOptions);

                                //      https://javascript.info/promise-basics
                                //      https://stackoverflow.com/questions/35318442/how-to-pass-parameter-to-a-promise-function
                                //      https://stackoverflow.com/questions/33257412/how-to-handle-the-if-else-in-promise-then?rq=1


const   insertClientContextStatement    =       returnInsertClientContextStatement()    ;

const   insertClientStimwordStatement   =       returnInsertClientStimwordStatement()   ;

returnContextAutoIncr(parmStimwordPositionAutoIncr)
        .catch( err =>  {
                        exitScript(0, `Bad returnContextAutoIncr  -- parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}`, err);
        })
        .then( val =>   {
                let contextAutoIncr = val.contextAutoIncr ;

                switch(true)    {

                                        /*

                                                OLD is blank,   NEW is filled in

                                        */

                        case ( parmClientContextError_OLD  == ''  &&    parmClientContextError_NEW != ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_NEW, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {

                                                let clientStimwordCount = val.length ;
                                                if  ( clientStimwordCount == 0 )        {
                                                        selectClientContext(parmClientContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  {
                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                                        return  returnArray;
                                                                                } else {
                                                                                        return insertClientContext(val, parmClientContextError_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                                                }
                                                                        })
                                                                .then( val =>  {
                                                                        let clientContextAutoIncr;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                exitScript(0, 'Bad clientContextAutoIncr on insert!', val);
                                                                        }
                                                                        insertClientStimword(clientContextAutoIncr, parmStimwordPositionAutoIncr, parmClientStimwordNotes)
                                                                                .then(  val =>  {
                                                                                        exitScript(1, 'Successful insert', val);        //       val[0][0]['clientStimwordAutoIncr']);
                                                                                });
                                                                })
                                                                .catch( err =>  {
                                                                        exitScript      (       0
                                                                                        ,       (`Cannot find selectClientContext  parmClientContextError_NEW: ${parmClientContextError_NEW}, \
                                                                                                parmClientSessionAutoIncr: ${parmClientSessionAutoIncr}, \
                                                                                                contextAutoIncr: ${contextAutoIncr}\
                                                                                                `).replace(/t/g, '')
                                                                                        ,       err
                                                                                        )
                                                                                        ;
                                                                })
                                                                ;
                                                } else {
                                                        exitScript      (       0
                                                                        ,       (`Duplicate insert, \
                                                                                parmClientContextError_NEW: ${parmClientContextError_NEW}, \
                                                                                parmClientAutoIncr: ${parmClientSessionAutoIncr}, \
                                                                                parmStimwordPositionAutoIncr ${parmStimwordPositionAutoIncr}, \
                                                                                stimword count: ${clientStimwordCount}\
                                                                                `).replace(/\t/g, '' )
                                                                        )
                                                                        ;
                                                }

                                        })                                                      // end selectClientContextStimword(NEW)
                                        .catch( err =>  {
                                                exitScript(0, 'Cannot selectClientContextStimword on insert', err);
                                        })
                                        ;
                                break;  // should NEVER get here.....????
                                exitScript(0, 'Somehow got past the INSERT break point?');
                        }


                                        /*

                                                OLD is filled in,   NEW is filled in

                                        */

                        case ( parmClientContextError_OLD  != ''  &&    parmClientContextError_NEW != ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {
                                                let clientStimwordCount = val.length;
                                                if  ( clientStimwordCount == 1 )        {


                                                        let clientContextAutoIncr_OLD = val[0]['clientContextAutoIncr'];

                                                        selectClientContext(parmClientContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  {
                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                                        return  returnArray;
                                                                                } else {
                                                                                        return insertClientContext(val, parmClientContextError_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                                                }
                                                                        })

                                                                .then( val =>  {
                                                                        let clientContextAutoIncr_NEW;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr_NEW = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                exitScript      (       0
                                                                                                ,       (`Error on insertClientContext \
                                                                                                        parmClientContextError_NEW: ${parmClientContextError_NEW}, \
                                                                                                        contextAutoIncr: ${contextAutoIncr}, \
                                                                                                        parmClientSessionAutoIncr: ${parmClientSessionAutoIncr}\
                                                                                                        `).replace(/\t/g, '')
                                                                                                ,       val
                                                                                                )
                                                                                                ;
                                                                        }

                                                                        let updateClientStimwordParms =
                                                                                                        {       'clientContextAutoIncr_OLD'     :       clientContextAutoIncr_OLD
                                                                                                        ,       'clientContextAutoIncr_NEW'     :       clientContextAutoIncr_NEW
                                                                                                        ,       'stimwordPositionAutoIncr'      :       parmStimwordPositionAutoIncr
                                                                                                        ,       'clientContextError_OLD'        :       parmClientContextError_OLD
                                                                                                        ,       'clientContextError_NEW'        :       parmClientContextError_NEW
                                                                                                        ,       'clientStimwordNotes'           :       parmClientStimwordNotes
                                                                                                        }
                                                                                                        ;

                                                                        updateClientStimword    (updateClientStimwordParms)

                                                                                .then( val => { return selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, true)})

                                                                                .then( val => {

                                                                                        let clientStimwordCount;
                                                                                        switch (true)
                                                                                        {

                                                                                        case    ( typeof val === 'number'                                                               ) :
                                                                                                clientStimwordCount = val                                       ;
                                                                                                break                                                           ;
                                                                                        case    ( typeof val === 'object'                                                               ) :
                                                                                                clientStimwordCount = val.length                                ;
                                                                                                break                                                           ;
                                                                                        default:
                                                                                                exitScript(0, 'Failed update', val);
                                                                                        }

                                                                                        if  ( clientStimwordCount == 0 )        {
                                                                                                deleteChildlessClientContext(clientContextAutoIncr_OLD, parmClientContextError_OLD)
                                                                                                        .then( val =>   {
                                                                                                                exitScript(1, 'Successful update with delete of clientContext', val);
                                                                                                        })
                                                                                                        .catch( err =>  {
                                                                                                                exitScript(0, 'Bad update', err);
                                                                                                        })
                                                                                                        ;
                                                                                        } else {
                                                                                                exitScript(1, 'Successful update with no delete of clientContext');
                                                                                        }
                                                                                });
                                                                })
                                                                .catch( err =>  {
                                                                        exitScript      (       0
                                                                                        ,       (`Bad selectClientContext on update attempt \
                                                                                                parmClientContextError_NEW: ${parmClientContextError_NEW}, \
                                                                                                parmClientSessionAutoIncr: ${parmClientSessionAutoIncr}, \
                                                                                                contextAutoIncr: ${contextAutoIncr}\
                                                                                                `).replace(/\t/g, '')
                                                                                        ,       err
                                                                                        )
                                                                                        ;
                                                                })

                                                } else {
                                                        exitScript      (       0
                                                                        ,       (`Rejecting, cannot find \
                                                                                parmClientContextError_OLD: ${parmClientContextError_OLD}, \
                                                                                parmClientSessionAutoIncr: ${parmClientSessionAutoIncr}, \
                                                                                parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}\
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

                        case ( parmClientContextError_OLD  != ''  &&    parmClientContextError_NEW == ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .catch( err =>  {
                                                        exitScript      (       0
                                                                        ,       (`Bad delete attempted for parmClientContextError_OLD: ${parmClientContextError_OLD}, \
                                                                                parmClientSessionAutoIncr: ${parmClientSessionAutoIncr}, \
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

                                                        let deleteClientStimwordResult  ;
                                                        deleteClientStimword(parmStimwordPositionAutoIncr, clientContextAutoIncr, parmClientContextError_OLD)
                                                                .then   ( val =>        {
                                                                                if  ( typeof val == 'number' )  {
                                                                                        deleteClientStimwordResult = val ;
                                                                                }
                                                                                return deleteChildlessClientContext(clientContextAutoIncr, parmClientContextError_OLD)  ;
                                                                        })
                                                                .then   ( val =>        {
                                                                                let deleteClientContextResult;
                                                                                if  ( typeof val == 'number' )  {
                                                                                        deleteClientContextResult = val ;
                                                                                }
                                                                                exitScript      (       1
                                                                                                ,       (`Successful deleteChildlessClientContent \
                                                                                                        clientContextAutoIncr: ${clientContextAutoIncr}, \
                                                                                                        parmClientContextError_OLD: ${parmClientContextError_OLD}, \
                                                                                                        clientContent deleted: ${deleteClientContextResult}, \
                                                                                                        clientStimword deleted: ${deleteClientStimwordResult}.\
                                                                                                        `).replace(/\t/g, '')
                                                                                                ,       val
                                                                                                )
                                                                        })
                                                                .catch  ( err =>        { exitScript(0, 'Failed deleteClientStimword - error message:', err); })
                                                                ;
                                                } else {
                                                        exitScript      (       0
                                                                        ,       (`Cannot find this one for delete!  \
                                                                                parmClientContextError_OLD: ${parmClientContextError_OLD}, \
                                                                                parmClientSessionAutoIncr: ${parmClientSessionAutoIncr}, \
                                                                                parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}\
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
                                exitScript      (       0
                                                ,       (`Bad processing attempted \
                                                        parmClientContextError_OLD: ${parmClientContextError_OLD}, \
                                                        parmClientContextError_NEW: ${parmClientContextError_NEW}\
                                                        `).replace(/\t/g, '')
                                                )
                                                ;
                        }
                }
        })
        ;

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
                        deleteChildlessClientContext(OLD)
                } else {
                        throw missing error
                }

        case   ( OLD NOT <blank> && NEW == <blank> )      {
                                                                //      make sure OLD exists ????
                DELETE clientStimword(OLD)
                deleteChildlessClientContext(OLD)
        }
*/

function selectClientContextStimword(clientContextError, clientSessionAutoIncr, stimwordPositionAutoIncr)       {

                                                        //      https://stackify.dev/136700-knex-js-how-to-select-columns-from-multiple-tables
                                                        //      https://stackoverflow.com/questions/65413824/multiple-count-and-left-joins-in-mysql-node-using-knex
                                                        //      https://editor.datatables.net/manual/nodejs/conditions
        return knex
                                                                                //.count          ('* as clientContextStimwordCount')
                .select         ('clientContext.clientContextAutoIncr')
                .from           ('clientStimword')
                .innerJoin      ('clientContext', 'clientContext.clientContextAutoIncr', 'clientStimword.clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientContextError'            : clientContextError            })
                .andWhere       ({'clientContext.clientSessionAutoIncr'         : clientSessionAutoIncr         })
                .andWhere       ( (val) =>      {
                                        val.where       (       {       'clientStimword.stimwordPositionAutoIncr'       :       stimwordPositionAutoIncr        }       )
                                        val.orWhereRaw  (               '(true = ?)'                                    ,       stimwordPositionAutoIncr                )
                                })
                ;
                                /*
                                        SELECT clientContext.clientContextAutoIncr
                                        FROM clientStimword
                                        INNER JOIN clientContext
                                        ON clientContext.clientContextAutoIncr = clientStimword.clientContextAutoIncr
                                        WHERE 1
                                        AND clientContext.clientSessionAutoIncr = 2349
                                        AND clientContext.clientContextError   = 'def'
                                        AND ( clientStimword.stimwordPositionAutoIncr = 285 OR true = true )
                                */
}


function selectClientContext(clientContextError, clientSessionAutoIncr, contextAutoIncr)        {
                                                //      https://stackoverflow.com/questions/21979388/get-count-result-with-knex-js-bookshelf-js
                                                //      https://stackoverflow.com/questions/53751587/knex-js-or-inside-where
                                                //      https://stackoverflow.com/questions/54407751/how-to-add-two-bind-params-in-knex/54422388
                                                //      https://stackoverflow.com/questions/47464078/mysql-insert-with-multiple-selects-with-differing-number-of-returned-columns
                                                //      https://stackoverflow.com/questions/30945104/db-raw-with-more-than-one-paremter-with-knex
        return knex
                .from           ('clientContext')
                .select         ('clientContext.clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientContextError'    : clientContextError            })
                .andWhere       ({'clientContext.clientSessionAutoIncr' : clientSessionAutoIncr         })
                .andWhere       ({'clientContext.contextAutoIncr'       : contextAutoIncr               })
                ;
}


function insertClientContext(val, clientContextError, contextAutoIncr, clientSessionAutoIncr)   {

        let insertClientContextParms =
                {       'clientContextError'                    :       clientContextError
                ,       'contextAutoIncr'                       :       contextAutoIncr
                ,       'clientSessionAutoIncr'                 :       clientSessionAutoIncr
                ,       'clientContextErrorSpeakingCount'       :       0
                ,       'frequency'                             :       ''
                ,       'clientContextErrorNotes'               :       null
                }
                ;

        return knex.raw(insertClientContextStatement, insertClientContextParms);
}

function insertClientStimword(clientContextAutoIncr, stimwordPositionAutoIncr, clientStimwordNotes)     {

        let insertClientStimwordParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'stimwordPositionAutoIncr'              :       stimwordPositionAutoIncr
                ,       'clientStimwordNotes'                   :       clientStimwordNotes
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

        let updateClientStimwordWhereParms =
                {       'stimwordPositionAutoIncr'      :       parmObject.stimwordPositionAutoIncr
                ,       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_OLD
                ,       'clientContextError'            :       parmObject.clientContextError_OLD
                };

        let updateClientStimwordUpdateParms =
                {       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_NEW
                ,       'clientContextError'            :       parmObject.clientContextError_NEW
                ,       'clientStimwordNotes'           :       parmObject.clientStimwordNotes
                };

        return knex
                .from('clientStimword')
                .where(updateClientStimwordWhereParms)
                .update(updateClientStimwordUpdateParms)
                ;
}

function deleteClientStimword(stimwordPositionAutoIncr, clientContextAutoIncr, clientContextError)      {
        let deleteClientStimwordParms =
                {       'stimwordPositionAutoIncr'      :       stimwordPositionAutoIncr
                ,       'clientContextAutoIncr'         :       clientContextAutoIncr
                ,       'clientContextError'            :       clientContextError
                };
        return knex
                .from('clientStimword')
                .where(deleteClientStimwordParms)
                .delete()
                ;
}


function deleteChildlessClientContext(clientContextAutoIncr, clientContextError)        {
        let deleteClientContextParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'clientContextError'                    :       clientContextError
                ,       'clientContextErrorNotes'               :       null
                ,       'frequency'                             :       ''
                ,       'clientContextErrorSpeakingCount'       :       0
                };
        return knex
                .from('clientContext')
                .where(deleteClientContextParms)
                .delete()
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
        console.log(returnStatus);
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
        ,               \`clientContextError\`
        ,               \`clientContextErrorSpeakingCount\`
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
                ,               :clientContextError
                ,               :clientContextErrorSpeakingCount
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
        ,       \`stimwordPageNbr\`
        ,       \`stimwordLineNbr\`
        ,       \`stimwordWord\`
        ,       \`stimwordPositionNbr\`
        ,       \`stimwordPositionSetting\`
        ,       \`clientStimwordNotes\`
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
                ,       \`stimwordPosition\`.\`stimwordPageNbr\`
                ,       \`stimwordPosition\`.\`stimwordLineNbr\`
                ,       \`stimwordPosition\`.\`stimwordWord\`
                ,       \`stimwordPosition\`.\`stimwordPositionNbr\`
                ,       \`stimwordPosition\`.\`stimwordPositionSetting\`
                ,       :clientStimwordNotes
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
[root@localhost knex]#




====  2022-02-15-a

[root@localhost knex]# clear
[root@localhost knex]#
[root@localhost knex]#
[root@localhost knex]# cat  clientStimword.js

//       node  clientStimword.js  '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 284, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def", "clientStimwordNotes" : "my client stimword notes"}'


/*
  ## new ball word "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "notes ball word abc 285"}'              ;       ##      ONE

  ## duplicate error!
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "hopefully a duplicate error"}'          ;       ##      TWO

  ## new ball sentence "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 286, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "notes ball sentence abc 286"}'          ;       ##      THREE

  ## new seal word "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 273, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "notes seal word abc 273"}'              ;       ##      FOUR

  ## new seal sentence "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 274, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "notes seal sentence abc 274"}'          ;       ##      FIVE

  ## change ball word from "abc" to "def"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def" , "clientStimwordNotes" : "notes ball word abc -> def"}'           ;       ##      SIX

  ## should fail on trying to change item
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def" , "clientStimwordNotes" : "cannot find item to change"}'           ;       ##      SEVEN

  ## delete ball word "def"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"def", "clientContextError_NEW" : ""   , "clientStimwordNotes" : "deleting ball word def"    }'            ;       ##      EIGHT

  ## delete ball sentence "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 286, "clientContextError_OLD" :"abc", "clientContextError_NEW" : ""   , "clientStimwordNotes" : "deleting ball word abc"    }'            ;       ##      NINE

  ## cannot find item to delete
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 286, "clientContextError_OLD" :"abc", "clientContextError_NEW" : ""   , "clientStimwordNotes" : "cannot find item to delete!"    }'       ;       ##      TEN

*/


//      contextAutoIncr = 74 when stimwordPosition is 283/284
//      contextAutoIncr = 56 when stimwordPosition is 285   !!

'use strict'

var     myArgs                          = JSON.parse(process.argv.slice(2)[0])  ;
const   parmClientSessionAutoIncr       = myArgs.clientSessionAutoIncr          ;
const   parmStimwordPositionAutoIncr    = myArgs.stimwordPositionAutoIncr       ;
const   parmClientContextError_OLD      = myArgs.clientContextError_OLD         ;
const   parmClientContextError_NEW      = myArgs.clientContextError_NEW         ;
const   parmClientStimwordNotes         = myArgs.clientStimwordNotes            ;

                                                                        //      mariadb  --host=localhost --user=knexUser  --password=knexPassword    knexDb    ;
                                                                        //      mariadb  --host=localhost --user=kenxUser  --password=knexPassword    comptonTransAnlys
const knexConnectOptions =
        {       'client'        :       'mysql'
        ,       'debug'         :       false
        ,       'connection'    :       'mysql://knexUser:knexPassword@localhost:3306/comptonTransAnlys'
        };

const knex = require('knex')(knexConnectOptions);

                                //      https://javascript.info/promise-basics
                                //      https://stackoverflow.com/questions/35318442/how-to-pass-parameter-to-a-promise-function
                                //      https://stackoverflow.com/questions/33257412/how-to-handle-the-if-else-in-promise-then?rq=1


const   insertClientContextStatement    =       returnInsertClientContextStatement()    ;

const   insertClientStimwordStatement   =       returnInsertClientStimwordStatement()   ;

returnContextAutoIncr(parmStimwordPositionAutoIncr)
        .catch( err =>  {
                        exitScript(0, `Bad returnContextAutoIncr  -- parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}`, err);
        })
        .then( val =>   {
                let contextAutoIncr = val.contextAutoIncr ;

                switch(true)    {

                                        /*

                                                OLD is blank,   NEW is filled in

                                        */

                        case ( parmClientContextError_OLD  == ''  &&    parmClientContextError_NEW != ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_NEW, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {

                                                let clientStimwordCount = val.length ;
                                                if  ( clientStimwordCount == 0 )        {
                                                        selectClientContext(parmClientContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  {
                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                                        return  returnArray;
                                                                                } else {
                                                                                        return insertClientContext(val, parmClientContextError_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                                                }
                                                                        })
                                                                .then( val =>  {
                                                                        let clientContextAutoIncr;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                exitScript(0, 'Bad clientContextAutoIncr on insert!', val);
                                                                        }
                                                                        insertClientStimword(clientContextAutoIncr, parmStimwordPositionAutoIncr, parmClientStimwordNotes)
                                                                                .then(  val =>  {
                                                                                        exitScript(1, 'Successful insert', val);        //       val[0][0]['clientStimwordAutoIncr']);
                                                                                });
                                                                })
                                                                .catch( err =>  {
                                                                        exitScript(0, `Cannot find selectClientContext  parmClientContextError_NEW: ${parmClientContextError_NEW},  parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  contextAutoIncr: ${contextAutoIncr}`, err);
                                                                })
                                                                ;
                                                } else {
                                                        exitScript(0, `Duplicate insert, parmClientContextError_NEW: ${parmClientContextError_NEW},  parmClientAutoIncr: ${parmClientSessionAutoIncr},  parmStimwordPositionAutoIncr ${parmStimwordPositionAutoIncr}, stimword count: ` + clientStimwordCount );
                                                }

                                        })                                                      // end selectClientContextStimword(NEW)
                                        .catch( err =>  {
                                                exitScript(0, 'Cannot selectClientContextStimword on insert', err);
                                        })
                                        ;
                                break;  // should NEVER get here.....????
                                exitScript(0, 'Somehow got past the INSERT break point?');
                        }


                                        /*

                                                OLD is filled in,   NEW is filled in

                                        */

                        case ( parmClientContextError_OLD  != ''  &&    parmClientContextError_NEW != ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {
                                                let clientStimwordCount = val.length;
                                                if  ( clientStimwordCount == 1 )        {


                                                        let clientContextAutoIncr_OLD = val[0]['clientContextAutoIncr'];

                                                        selectClientContext(parmClientContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  {
                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                                        return  returnArray;
                                                                                } else {
                                                                                        return insertClientContext(val, parmClientContextError_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                                                }
                                                                        })

                                                                .then( val =>  {
                                                                        let clientContextAutoIncr_NEW;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr_NEW = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                exitScript(0, `Error on insertClientContext using parmClientContextError_NEW: ${parmClientContextError_NEW}, contextAutoIncr: ${contextAutoIncr}, parmClientSessionAutoIncr: ${parmClientSessionAutoIncr}`, val);
                                                                        }

                                                                        let updateClientStimwordParms =
                                                                                                        {       'clientContextAutoIncr_OLD'     :       clientContextAutoIncr_OLD
                                                                                                        ,       'clientContextAutoIncr_NEW'     :       clientContextAutoIncr_NEW
                                                                                                        ,       'stimwordPositionAutoIncr'      :       parmStimwordPositionAutoIncr
                                                                                                        ,       'clientContextError_OLD'        :       parmClientContextError_OLD
                                                                                                        ,       'clientContextError_NEW'        :       parmClientContextError_NEW
                                                                                                        ,       'clientStimwordNotes'           :       parmClientStimwordNotes
                                                                                                        }
                                                                                                        ;

                                                                        updateClientStimword    (updateClientStimwordParms)

                                                                                .then( val => { return selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, true)})

                                                                                .then( val => {

                                                                                        let clientStimwordCount;
                                                                                        switch (true)
                                                                                        {

                                                                                        case    ( typeof val === 'number'                                                               ) :
                                                                                                clientStimwordCount = val                                       ;
                                                                                                break                                                           ;
                                                                                        case    ( typeof val === 'object'                                                               ) :
                                                                                                clientStimwordCount = val.length                                ;
                                                                                                break                                                           ;
                                                                                        default:
                                                                                                exitScript(0, 'Failed update', val);
                                                                                        }

                                                                                        if  ( clientStimwordCount == 0 )        {
                                                                                                deleteChildlessClientContext(clientContextAutoIncr_OLD, parmClientContextError_OLD)
                                                                                                        .then( val =>   {
                                                                                                                exitScript(1, 'Successful update with delete of clientContext', val);
                                                                                                        })
                                                                                                        .catch( err =>  {
                                                                                                                exitScript(0, 'Bad update', err);
                                                                                                        })
                                                                                                        ;
                                                                                        } else {
                                                                                                exitScript(1, 'Successful update with no delete of clientContext');
                                                                                        }
                                                                                });
                                                                })
                                                                .catch( err =>  {
                                                                        exitScript(0, `Bad selectClientContext on update attempt parmClientContextError_NEW: ${parmClientContextError_NEW}, parmClientSessionAutoIncr: ${parmClientSessionAutoIncr}, contextAutoIncr: ${contextAutoIncr}`, err);
                                                                })

                                                } else {
                                                        exitScript(0, `Rejecting, cannot find parmClientContextError_OLD: ${parmClientContextError_OLD}, parmClientSessionAutoIncr: ${parmClientSessionAutoIncr}, parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}`, val );
                                                }
                                        })                                              // end selectClientContextStimword(OLD)
                                break;  // should NEVER get here.....????
                                exitScript(0, 'Somehow got past the UPDATE break point?');
                        }


                                        /*

                                                OLD is filled in,   NEW is BLANK!

                                        */

                        case ( parmClientContextError_OLD  != ''  &&    parmClientContextError_NEW == ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .catch( err =>  {
                                                        exitScript(0, `Bad delete attempted for parmClientContextError_OLD: ${parmClientContextError_OLD},  parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}`, err);
                                        })
                                        .then( val =>   {

                                                let clientStimwordCount = val.length;

                                                if  ( clientStimwordCount == 1 )        {

                                                        let clientContextAutoIncr = val[0]['clientContextAutoIncr'];

                                                        deleteClientStimword(parmStimwordPositionAutoIncr, clientContextAutoIncr, parmClientContextError_OLD)
                                                                .then   ( () =>         { return deleteChildlessClientContext(clientContextAutoIncr, parmClientContextError_OLD)})
                                                                .then   ( val =>        { exitScript(1, `Successful deleteChildlessClientContent clientContextAutoIncr" ${clientContextAutoIncr}, parmClientContextError_OLD: ${parmClientContextError_OLD}`, val )})
                                                                .catch  ( err =>        { exitScript(0, 'Failed deleteClientStimword', err); })
                                                                ;
                                                } else {
                                                        exitScript(0, `Cannot find this one for delete!  parmClientContextError_OLD: ${parmClientContextError_OLD},  parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}`);
                                                }
                                        })
                                        ;
                                break;  // should NEVER get here.....????
                                exitScript(0, 'Somehow got past the DELETE break point?');
                        }
                        default :       {
                                                                        //let returnMsg = `Bad processing attempted for old: ${parmClientContextError_OLD}, new: ${parmClientContextError_OLD}` err)    ;
                                exitScript(0, `Bad processing attempted for parmClientContextError_OLD: ${parmClientContextError_OLD},  parmClientContextError_NEW: ${parmClientContextError_NEW}`);
                        }
                }
        })
        ;

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
                        deleteChildlessClientContext(OLD)
                } else {
                        throw missing error
                }

        case   ( OLD NOT <blank> && NEW == <blank> )      {
                                                                //      make sure OLD exists ????
                DELETE clientStimword(OLD)
                deleteChildlessClientContext(OLD)
        }
*/

function selectClientContextStimword(clientContextError, clientSessionAutoIncr, stimwordPositionAutoIncr)       {

                                                        //      https://stackify.dev/136700-knex-js-how-to-select-columns-from-multiple-tables
                                                        //      https://stackoverflow.com/questions/65413824/multiple-count-and-left-joins-in-mysql-node-using-knex
                                                        //      https://editor.datatables.net/manual/nodejs/conditions
        return knex
                                                                                //.count          ('* as clientContextStimwordCount')
                .select         ('clientContext.clientContextAutoIncr')
                .from           ('clientStimword')
                .innerJoin      ('clientContext', 'clientContext.clientContextAutoIncr', 'clientStimword.clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientContextError'            : clientContextError            })
                .andWhere       ({'clientContext.clientSessionAutoIncr'         : clientSessionAutoIncr         })
                .andWhere       ( (val) =>      {
                                        val.where       (       {       'clientStimword.stimwordPositionAutoIncr'       :       stimwordPositionAutoIncr        }       )
                                        val.orWhereRaw  (               '(true = ?)'                                    ,       stimwordPositionAutoIncr                )
                                })
                ;
                                /*
                                        SELECT clientContext.clientContextAutoIncr
                                        FROM clientStimword
                                        INNER JOIN clientContext
                                        ON clientContext.clientContextAutoIncr = clientStimword.clientContextAutoIncr
                                        WHERE 1
                                        AND clientContext.clientSessionAutoIncr = 2349
                                        AND clientContext.clientContextError   = 'def'
                                        AND ( clientStimword.stimwordPositionAutoIncr = 285 OR true = true )
                                */
}


function selectClientContext(clientContextError, clientSessionAutoIncr, contextAutoIncr)        {
                                                //      https://stackoverflow.com/questions/21979388/get-count-result-with-knex-js-bookshelf-js
                                                //      https://stackoverflow.com/questions/53751587/knex-js-or-inside-where
                                                //      https://stackoverflow.com/questions/54407751/how-to-add-two-bind-params-in-knex/54422388
                                                //      https://stackoverflow.com/questions/47464078/mysql-insert-with-multiple-selects-with-differing-number-of-returned-columns
                                                //      https://stackoverflow.com/questions/30945104/db-raw-with-more-than-one-paremter-with-knex
        return knex
                .from           ('clientContext')
                .select         ('clientContext.clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientContextError'    : clientContextError            })
                .andWhere       ({'clientContext.clientSessionAutoIncr' : clientSessionAutoIncr         })
                .andWhere       ({'clientContext.contextAutoIncr'       : contextAutoIncr               })
                ;
}


function insertClientContext(val, clientContextError, contextAutoIncr, clientSessionAutoIncr)   {

        let insertClientContextParms =
                {       'clientContextError'                    :       clientContextError
                ,       'contextAutoIncr'                       :       contextAutoIncr
                ,       'clientSessionAutoIncr'                 :       clientSessionAutoIncr
                ,       'clientContextErrorSpeakingCount'       :       0
                ,       'frequency'                             :       ''
                ,       'clientContextErrorNotes'               :       null
                }
                ;

        return knex.raw(insertClientContextStatement, insertClientContextParms);
}

function insertClientStimword(clientContextAutoIncr, stimwordPositionAutoIncr, clientStimwordNotes)     {

        let insertClientStimwordParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'stimwordPositionAutoIncr'              :       stimwordPositionAutoIncr
                ,       'clientStimwordNotes'                   :       clientStimwordNotes
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

        let updateClientStimwordWhereParms =
                {       'stimwordPositionAutoIncr'      :       parmObject.stimwordPositionAutoIncr
                ,       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_OLD
                ,       'clientContextError'            :       parmObject.clientContextError_OLD
                };

        let updateClientStimwordUpdateParms =
                {       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_NEW
                ,       'clientContextError'            :       parmObject.clientContextError_NEW
                ,       'clientStimwordNotes'           :       parmObject.clientStimwordNotes
                };

        return knex
                .from('clientStimword')
                .where(updateClientStimwordWhereParms)
                .update(updateClientStimwordUpdateParms)
                ;
}

function deleteClientStimword(stimwordPositionAutoIncr, clientContextAutoIncr, clientContextError)      {
        let deleteClientStimwordParms =
                {       'stimwordPositionAutoIncr'      :       stimwordPositionAutoIncr
                ,       'clientContextAutoIncr'         :       clientContextAutoIncr
                ,       'clientContextError'            :       clientContextError
                };
        return knex
                .from('clientStimword')
                .where(deleteClientStimwordParms)
                .delete()
                ;
}


function deleteChildlessClientContext(clientContextAutoIncr, clientContextError)        {
        let deleteClientContextParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'clientContextError'                    :       clientContextError
                ,       'clientContextErrorNotes'               :       null
                ,       'frequency'                             :       ''
                ,       'clientContextErrorSpeakingCount'       :       0
                };
        return knex
                .from('clientContext')
                .where(deleteClientContextParms)
                .delete()
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
        console.log(returnStatus);
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
        ,               \`clientContextError\`
        ,               \`clientContextErrorSpeakingCount\`
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
                ,               :clientContextError
                ,               :clientContextErrorSpeakingCount
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
        ,       \`stimwordPageNbr\`
        ,       \`stimwordLineNbr\`
        ,       \`stimwordWord\`
        ,       \`stimwordPositionNbr\`
        ,       \`stimwordPositionSetting\`
        ,       \`clientStimwordNotes\`
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
                ,       \`stimwordPosition\`.\`stimwordPageNbr\`
                ,       \`stimwordPosition\`.\`stimwordLineNbr\`
                ,       \`stimwordPosition\`.\`stimwordWord\`
                ,       \`stimwordPosition\`.\`stimwordPositionNbr\`
                ,       \`stimwordPosition\`.\`stimwordPositionSetting\`
                ,       :clientStimwordNotes
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
[root@localhost knex]#








==== 2022-02-15

  status: 1,
  desc: 'Successful insert'
}
[root@localhost knex]# node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 274, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "notes seal sentence abc 274"}'
{
  '0': [ RowDataPacket { clientStimwordAutoIncr: 7186294 } ],
  '1': [
    FieldPacket {
      catalog: 'def',
      db: 'comptonTransAnlys',
      table: 'clientStimword',
      orgTable: 'clientStimword',
      name: 'clientStimwordAutoIncr',
      orgName: 'clientStimwordAutoIncr',
      charsetNr: 63,
      length: 10,
      type: 3,
      flags: 16931,
      decimals: 0,
      default: undefined,
      zeroFill: false,
      protocol41: true
    }
  ],
  status: 1,
  desc: 'Successful insert'
}
[root@localhost knex]#
[root@localhost knex]# node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def" , "clientStimwordNotes" : "notes ball word abc -> def"}'
{
  status: 1,
  desc: 'Successful update with no delete of clientContext'
}
[root@localhost knex]#
[root@localhost knex]#
[root@localhost knex]#
[root@localhost knex]# vi  clientStimword.js

[1]+  Stopped                 vi clientStimword.js
[root@localhost knex]# node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def" , "clientStimwordNotes" : "cannot find item to change"}'
rejecting, cannot find abc
^C
[root@localhost knex]# fg
vi clientStimword.js

[1]+  Stopped                 vi clientStimword.js
[root@localhost knex]#
[root@localhost knex]#
[root@localhost knex]#
[root@localhost knex]#
[root@localhost knex]# node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def" , "clientStimwordNotes" : "cannot find item to change"}'
/root/knex/clientStimword.js:221
                                                        exitScript(0 `Rejecting, cannot find parmClientContextError_OLD: ${parmClientContextError_OLD}, parmClientSessionAutoIncr: ${parmClientSessionAutoIncr}, parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}`, val );
                                                                     ^

TypeError: 0 is not a function
    at /root/knex/clientStimword.js:221:21
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
[root@localhost knex]# fg
vi clientStimword.js

[1]+  Stopped                 vi clientStimword.js
[root@localhost knex]#
[root@localhost knex]#
[root@localhost knex]#
[root@localhost knex]# node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def" , "clientStimwordNotes" : "cannot find item to change"}'
{
  status: 0,
  desc: 'Rejecting, cannot find parmClientContextError_OLD: abc, parmClientSessionAutoIncr: 2349, parmStimwordPositionAutoIncr: 285'
}
[root@localhost knex]#
[root@localhost knex]#
[root@localhost knex]# clear
[root@localhost knex]#
[root@localhost knex]#
[root@localhost knex]# cat  clientStimword.js

//       node  clientStimword.js  '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 284, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def", "clientStimwordNotes" : "my client stimword notes"}'


/*
  ## new ball word "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "notes ball word abc 285"}'              ;

  ## duplicate error!
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "hopefully a duplicate error"}'          ;

  ## new ball sentence "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 286, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "notes ball sentence abc 286"}'          ;

  ## new seal word "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 273, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "notes seal word abc 273"}'              ;

  ## new seal sentence "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 274, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "notes seal sentence abc 274"}'          ;

  ## change ball word from "abc" to "def"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def" , "clientStimwordNotes" : "notes ball word abc -> def"}'           ;

  ## should fail on trying to change item
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def" , "clientStimwordNotes" : "cannot find item to change"}'           ;

  ## delete ball word "def"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"def", "clientContextError_NEW" : ""   , "clientStimwordNotes" : "deleting ball word def"    }'            ;

  ## delete ball sentence "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 286, "clientContextError_OLD" :"abc", "clientContextError_NEW" : ""   , "clientStimwordNotes" : "deleting ball word abc"    }'            ;

  ## cannot find item to delete
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 286, "clientContextError_OLD" :"abc", "clientContextError_NEW" : ""   , "clientStimwordNotes" : "cannot find item to delete!"    }'       ;

*/


//      contextAutoIncr = 74 when stimwordPosition is 283/284
//      contextAutoIncr = 56 when stimwordPosition is 285   !!

                                                                                                                //              console.log(process.argv)       ;
'use strict'

var     myArgs                          = JSON.parse(process.argv.slice(2)[0])  ;
const   parmClientSessionAutoIncr       = myArgs.clientSessionAutoIncr          ;
const   parmStimwordPositionAutoIncr    = myArgs.stimwordPositionAutoIncr       ;
const   parmClientContextError_OLD      = myArgs.clientContextError_OLD         ;
const   parmClientContextError_NEW      = myArgs.clientContextError_NEW         ;
const   parmClientStimwordNotes         = myArgs.clientStimwordNotes            ;

const knexConnectOptions =
        {       'client'        :       'mysql'
        ,       'debug'         :       false
        ,       'connection'    :       'mysql://knexUser:knexPassword@localhost:3306/comptonTransAnlys'
        };

const knex = require('knex')(knexConnectOptions);

                                //      https://javascript.info/promise-basics
                                //      https://stackoverflow.com/questions/35318442/how-to-pass-parameter-to-a-promise-function
                                //      https://stackoverflow.com/questions/33257412/how-to-handle-the-if-else-in-promise-then?rq=1


const   insertClientContextStatement    =       returnInsertClientContextStatement()    ;

const   insertClientStimwordStatement   =       returnInsertClientStimwordStatement()   ;

                                                                                                                /*
                                                                                                                console.log('Starting run.');

                                                                                                                console.log('000000 calling returnContextAutoIncr using: ' + parmStimwordPositionAutoIncr);
                                                                                                                */
returnContextAutoIncr(parmStimwordPositionAutoIncr)
        .then( val =>   {
                let contextAutoIncr = val.contextAutoIncr ;

                switch(true)    {

                                        /*

                                                OLD is blank,   NEW is filled in

                                        */

                        case ( parmClientContextError_OLD  == ''  &&    parmClientContextError_NEW != ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_NEW, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {

                                                let clientStimwordCount = val.length ;
                                                if  ( clientStimwordCount == 0 )        {
                                                        selectClientContext(parmClientContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  {
                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                                        return  returnArray;
                                                                                } else {
                                                                                        return insertClientContext(val, parmClientContextError_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                                                }
                                                                        })
                                                                .then( val =>  {
                                                                        let clientContextAutoIncr;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                exitScript(0, 'Bad clientContextAutoIncr on insert!', val);
                                                                        }
                                                                        insertClientStimword(clientContextAutoIncr, parmStimwordPositionAutoIncr, parmClientStimwordNotes)
                                                                                .then(  val =>  {
                                                                                        exitScript(1, 'Successful insert', val);        //       val[0][0]['clientStimwordAutoIncr']);
                                                                                });
                                                                })
                                                                .catch( err =>  {
                                                                        exitScript(0, `Cannot find selectClientContext  parmClientContextError_NEW: ${parmClientContextError_NEW},  parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  contextAutoIncr: ${contextAutoIncr}`, err);
                                                                })
                                                                ;
                                                } else {
                                                        exitScript(0, `Duplicate insert, parmClientContextError_NEW: ${parmClientContextError_NEW},  parmClientAutoIncr: ${parmClientSessionAutoIncr},  parmStimwordPositionAutoIncr ${parmStimwordPositionAutoIncr}, stimword count: ` + clientStimwordCount );
                                                }

                                        })                                                      // end selectClientContextStimword(NEW)
                                        .catch( err =>  {
                                                exitScript(0, 'Cannot selectClientContextStimword on insert', err);
                                                console.log(err); return 0;
                                        })
                                        ;
                                break;  // should NEVER get here.....????
                                exitScript(0, 'Somehow got past the break point?');
                        }

                                        /*

                                                OLD is filled in,   NEW is filled in

                                        */

                        case ( parmClientContextError_OLD  != ''  &&    parmClientContextError_NEW != ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {
                                                let clientStimwordCount = val.length;
                                                if  ( clientStimwordCount == 1 )        {


                                                        let clientContextAutoIncr_OLD = val[0]['clientContextAutoIncr'];

                                                        selectClientContext(parmClientContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  {
                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                                        return  returnArray;
                                                                                } else {
                                                                                        return insertClientContext(val, parmClientContextError_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                                                }
                                                                        })

                                                                .then( val =>  {
                                                                        let clientContextAutoIncr_NEW;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr_NEW = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                console.log('ERROR!');
                                                                                console.log(JSON.stringify(val));
                                                                                return 0;
                                                                        }

                                                                        let updateClientStimwordParms =
                                                                                                        {       'clientContextAutoIncr_OLD'     :       clientContextAutoIncr_OLD
                                                                                                        ,       'clientContextAutoIncr_NEW'     :       clientContextAutoIncr_NEW
                                                                                                        ,       'stimwordPositionAutoIncr'      :       parmStimwordPositionAutoIncr
                                                                                                        ,       'clientContextError_OLD'        :       parmClientContextError_OLD
                                                                                                        ,       'clientContextError_NEW'        :       parmClientContextError_NEW
                                                                                                        ,       'clientStimwordNotes'           :       parmClientStimwordNotes
                                                                                                        }
                                                                                                        ;

                                                                        updateClientStimword    (updateClientStimwordParms)

                                                                                                //.then( val => { console.log('about to run selectClientContextStimword!'); return selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)})
                                                                                .then( val => { return selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, true)})

                                                                                .then( val => {

                                                                                        let clientStimwordCount;
                                                                                        switch (true)
                                                                                        {
                                                                                                                        //       [{"clientContextAutoIncr":3043146},{"clientContextAutoIncr":3043146},{"clientContextAutoIncr":3043146}]

                                                                                        case    ( typeof val === 'number'                                                               ) :
                                                                                                clientStimwordCount = val                                       ;
                                                                                                break                                                           ;
                                                                                        case    ( typeof val === 'object'                                                               ) :
                                                                                                clientStimwordCount = val.length                                ;
                                                                                                break                                                           ;
                                                                                        default:
                                                                                                exitScript(0, 'Failed update', val);
                                                                                        }

                                                                                        if  ( clientStimwordCount == 0 )        {
                                                                                                deleteChildlessClientContext(clientContextAutoIncr_OLD, parmClientContextError_OLD)
                                                                                                        .then( val =>   {
                                                                                                                exitScript(1, 'Successful update with delete of clientContext', val);
                                                                                                                                                        //console.log('complete update with clientContext delete result: ' + JSON.stringify(val));
                                                                                                        })
                                                                                                        .catch( err =>  {
                                                                                                                exitScript(0, 'Bad update', err);
                                                                                                        })
                                                                                                        ;
                                                                                        } else {
                                                                                                exitScript(1, 'Successful update with no delete of clientContext');
                                                                                                                                                                //      console.log('complete update! clientStimwordCount: ' + clientStimwordCount );
                                                                                        }
                                                                                });
                                                                })
                                                                .catch( err =>  {
                                                                        exitScript(0, `Bad selectClientContext on update attempt parmClientContextError_NEW: ${parmClientContextError_NEW}, parmClientSessionAutoIncr: ${parmClientSessionAutoIncr}, contextAutoIncr: ${contextAutoIncr}`, err);
                                                                })

                                                } else {
                                                        exitScript(0, `Rejecting, cannot find parmClientContextError_OLD: ${parmClientContextError_OLD}, parmClientSessionAutoIncr: ${parmClientSessionAutoIncr}, parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}`, val );
                                                        return 0;
                                                }
                                        })                                              // end selectClientContextStimword(OLD)
                                break;  // should NEVER get here.....????
                        }


                                        /*

                                                OLD is filled in,   NEW is BLANK!

                                        */

                        case ( parmClientContextError_OLD  != ''  &&    parmClientContextError_NEW == ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {

                                                let clientStimwordCount = val.length;
                                                if  ( clientStimwordCount == 1 )        {

                                                        let clientContextAutoIncr = val[0]['clientContextAutoIncr'];

                                                        deleteClientStimword(parmStimwordPositionAutoIncr, clientContextAutoIncr, parmClientContextError_OLD)
                                                                .then( ()  => { return deleteChildlessClientContext(clientContextAutoIncr, parmClientContextError_OLD);})
                                                                .then( val =>   {
                                                                        exitScript(1, 'Successful delete', val);
                                                                })
                                                                .catch( err =>  {
                                                                        exitScript(0, 'Failed delete', err);
                                                                })
                                                                ;
                                                                                                                                                                //      console.log('complete update! clientStimwordCount: ' + clientStimwordCount );

                                                } else {
                                                        exitScript(0, `Cannot find this one for delete!  parmClientContextError_OLD: ${parmClientContextError_OLD},  parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}`);
                                                }
                                        })
                                        .catch( err =>  {
                                                        exitScript(0, `Bad delete attempted for parmClientContextError_OLD: ${parmClientContextError_OLD},  parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}`, err);
                                        })
                                        ;
                        }
                        default :       {
                                                                        //let returnMsg = `Bad processing attempted for old: ${parmClientContextError_OLD}, new: ${parmClientContextError_OLD}` err)    ;
                                exitScript(0, `Bad processing attempted for parmClientContextError_OLD: ${parmClientContextError_OLD},  parmClientContextError_NEW: ${parmClientContextError_NEW}`, err);
                        }
                }
        })
        .catch( err =>  {
                        exitScript(0, 'Bad returnContextAutoIncr', err);
        })
        ;

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
                        deleteChildlessClientContext(OLD)
                } else {
                        throw missing error
                }

        case   ( OLD NOT <blank> && NEW == <blank> )      {
                                                                //      make sure OLD exists ????
                DELETE clientStimword(OLD)
                deleteChildlessClientContext(OLD)
        }
*/

function selectClientContextStimword(clientContextError, clientSessionAutoIncr, stimwordPositionAutoIncr)       {

                                                        //      https://stackify.dev/136700-knex-js-how-to-select-columns-from-multiple-tables
                                                        //      https://stackoverflow.com/questions/65413824/multiple-count-and-left-joins-in-mysql-node-using-knex
                                                        //      https://editor.datatables.net/manual/nodejs/conditions
        return knex
                                                                                //.count          ('* as clientContextStimwordCount')
                .select         ('clientContext.clientContextAutoIncr')
                .from           ('clientStimword')
                .innerJoin      ('clientContext', 'clientContext.clientContextAutoIncr', 'clientStimword.clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientContextError'            : clientContextError            })
                .andWhere       ({'clientContext.clientSessionAutoIncr'         : clientSessionAutoIncr         })
                .andWhere       ( (val) =>      {
                                        val.where       (       {       'clientStimword.stimwordPositionAutoIncr'       :       stimwordPositionAutoIncr        }       )
                                        val.orWhereRaw  (               '(true = ?)'                                    ,       stimwordPositionAutoIncr                )
                                })
                ;
                                /*
                                        SELECT clientContext.clientContextAutoIncr
                                        FROM clientStimword
                                        INNER JOIN clientContext
                                        ON clientContext.clientContextAutoIncr = clientStimword.clientContextAutoIncr
                                        WHERE 1
                                        AND clientContext.clientSessionAutoIncr = 2349
                                        AND clientContext.clientContextError   = 'def'
                                        AND ( clientStimword.stimwordPositionAutoIncr = 285 OR true = true )
                                */
}


function selectClientContext(clientContextError, clientSessionAutoIncr, contextAutoIncr)        {
                                                //      https://stackoverflow.com/questions/21979388/get-count-result-with-knex-js-bookshelf-js
                                                //      https://stackoverflow.com/questions/53751587/knex-js-or-inside-where
                                                //      https://stackoverflow.com/questions/54407751/how-to-add-two-bind-params-in-knex/54422388
                                                //      https://stackoverflow.com/questions/47464078/mysql-insert-with-multiple-selects-with-differing-number-of-returned-columns
                                                //      https://stackoverflow.com/questions/30945104/db-raw-with-more-than-one-paremter-with-knex
        return knex
                .from           ('clientContext')
                .select         ('clientContext.clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientContextError'    : clientContextError            })
                .andWhere       ({'clientContext.clientSessionAutoIncr' : clientSessionAutoIncr         })
                .andWhere       ({'clientContext.contextAutoIncr'       : contextAutoIncr               })
                ;
}


function insertClientContext(val, clientContextError, contextAutoIncr, clientSessionAutoIncr)   {

        let insertClientContextParms =
                {       'clientContextError'                    :       clientContextError
                ,       'contextAutoIncr'                       :       contextAutoIncr
                ,       'clientSessionAutoIncr'                 :       clientSessionAutoIncr
                ,       'clientContextErrorSpeakingCount'       :       0
                ,       'frequency'                             :       ''
                ,       'clientContextErrorNotes'               :       null
                }
                ;
                                                                                                                        //      console.log('parms: ' + JSON.stringify(insertClientContextParms));

        return knex.raw(insertClientContextStatement, insertClientContextParms);
}

function insertClientStimword(clientContextAutoIncr, stimwordPositionAutoIncr, clientStimwordNotes)     {

        let insertClientStimwordParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'stimwordPositionAutoIncr'              :       stimwordPositionAutoIncr
                ,       'clientStimwordNotes'                   :       clientStimwordNotes
                }
                ;
                                                                                                                        //      console.log('parms: ' + JSON.stringify(insertClientStimwordParms));

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

        let updateClientStimwordWhereParms =
                {       'stimwordPositionAutoIncr'      :       parmObject.stimwordPositionAutoIncr
                ,       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_OLD
                ,       'clientContextError'            :       parmObject.clientContextError_OLD
                };

        let updateClientStimwordUpdateParms =
                {       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_NEW
                ,       'clientContextError'            :       parmObject.clientContextError_NEW
                ,       'clientStimwordNotes'           :       parmObject.clientStimwordNotes
                };

        return knex
                .from('clientStimword')
                .where(updateClientStimwordWhereParms)
                .update(updateClientStimwordUpdateParms)
                ;
}

function deleteClientStimword(stimwordPositionAutoIncr, clientContextAutoIncr, clientContextError)      {
        let deleteClientStimwordParms =
                {       'stimwordPositionAutoIncr'      :       stimwordPositionAutoIncr
                ,       'clientContextAutoIncr'         :       clientContextAutoIncr
                ,       'clientContextError'            :       clientContextError
                };
        return knex
                .from('clientStimword')
                .where(deleteClientStimwordParms)
                .delete()
                ;
}


function deleteChildlessClientContext(clientContextAutoIncr, clientContextError)        {
        let deleteClientContextParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'clientContextError'                    :       clientContextError
                ,       'clientContextErrorNotes'               :       null
                ,       'frequency'                             :       ''
                ,       'clientContextErrorSpeakingCount'       :       0
                };
        return knex
                .from('clientContext')
                .where(deleteClientContextParms)
                .delete()
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
        console.log(returnStatus);
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
        ,               \`clientContextError\`
        ,               \`clientContextErrorSpeakingCount\`
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
                ,               :clientContextError
                ,               :clientContextErrorSpeakingCount
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
                //   can we use \` on RETURNING variable????????????????????????????//
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
        ,       \`stimwordPageNbr\`
        ,       \`stimwordLineNbr\`
        ,       \`stimwordWord\`
        ,       \`stimwordPositionNbr\`
        ,       \`stimwordPositionSetting\`
        ,       \`clientStimwordNotes\`
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
                ,       \`stimwordPosition\`.\`stimwordPageNbr\`
                ,       \`stimwordPosition\`.\`stimwordLineNbr\`
                ,       \`stimwordPosition\`.\`stimwordWord\`
                ,       \`stimwordPosition\`.\`stimwordPositionNbr\`
                ,       \`stimwordPosition\`.\`stimwordPositionSetting\`
                ,       :clientStimwordNotes
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
                //   can we use \` on RETURNING variable????????????????????????????//
};





/*






*/


//      mariadb  --host=localhost --user=knexUser  --password=knexPassword    knexDb    ;
//      mariadb  --host=localhost --user=kenxUser  --password=knexPassword    comptonTransAnlys

/*
function firstPromise(promiseInput)     {
        console.log('parameter passed into first promise: ' + promiseInput);
        return  knex.raw("SELECT VERSION()")    ;
}
function secondPromise(promiseInput)    {
        console.log('result of first promise into second promise: ' + JSON.stringify(promiseInput));
        return ('second promise added to promiseInput. ' + promiseInput);
}
/*
firstPromise('promise input!')
        .then(secondPromise)
        .catch(console.log('error!'))
        ;
*/


                                                                                                                /*
                                                                                                                const myArgs = process.argv.slice(2);
                                                                                                                console.log('myArgs: ', myArgs);

                                                                                                                console.log('start:');
                                                                                                                console.log(myArgs[0].clientSessionAutoIncr);
                                                                                                                console.log(myArgs[0].clientPositionAutoIncr);
                                                                                                                console.log(JSON.parse(myArgs[0]));

                                                                                                                console.log(
                                                                                                                        parmClientSessionAutoIncr
                                                                                                                ,       parmStimwordPositionAutoIncr
                                                                                                                ,       parmClientContextError_OLD
                                                                                                                ,       parmClientContextError_NEW
                                                                                                                ,       parmClientStimwordNotes
                                                                                                                );

                                                                                                                */


/*
firstPromise('promise input!')
        .then(  (response)      =>      {       console.log     ('response from firstPromise: ' + response)     ;
                                                return response                                                 ;
                                        }                                                                               )
        .then(  (newResponse)   =>      console.log     ('ending! ' + newResponse)                                      )
        .then(  ()              =>      knex.destroy()                                                                  )
        .then(  ()              =>      secondPromise('stuff into second promise')
                                                .then((result) => { console.log('calling second promise: ' + result); return (result);} )       )
        .then(  (lastResponse)  =>      console.log     ('last response: ' + lastResponse)                              )
        .catch( (error)         =>      console.log     ('error! ' + error)                                             )
        ;


        if  ( NEW != <blank> )      {
                if  ( clientStimwordCount(NEW) == 0 )   {
                        if  ( clientContext(NEW) NOT exists )   {
                            INSERT clientContext(NEW)
                        }
                        if  ( NEW != <blank> && OLD == <blank> ) {
                                INSERT clientStimword(NEW)
                        } else {
                                if  ( clientStimwordCount(OLD) EXISTS ) {
                                        MODIFY clientStimword(OLD) to clientStimword(NEW)
                                }
                                deleteChildlessClientContext(OLD)
                        }
                } else {        // duplicate!!
                        throw dup error
                }
        } else if  ( OLD  != <blank> && NEW == <blank> )  {
                                                                //      make sure OLD exists ????
                DELETE clientStimword(OLD)
                deleteChildlessClientContext(OLD)
        }

                                                                /*
                                                                const firstPromise = ( promiseInput )   =>      {
                                                                        return new Promise((resolve, reject) => {
                                                                                console.log('parameter passed into promise: ' + promiseInput);

                                                                                knex.raw("SELECT VERSION()")
                                                                                .then(
                                                                                    (version) => {      console.log     ('inside:  ' + version[0][0]["VERSION()"] );
                                                                                                        resolve         ('outside: ' + version[0][0]["VERSION()"] );
                                                                                                }
                                                                                ).catch(
                                                                                        (err) => { reject(err); }
                                                                                )
                                                                        })
                                                                }

                                                                const secondPromise = ( input ) =>              {
                                                                        return new Promise (    (resolve, reject) => {
                                                                                resolve (input) ;
                                                                        })
                                                                }
*/
[root@localhost knex]#





=====2022-02-13-a

[root@localhost knex]# clear
[root@localhost knex]#
[root@localhost knex]#
[root@localhost knex]# cat  clientStimword.js

//       node  clientStimword.js  '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 284, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def", "clientStimwordNotes" : "my client stimword notes"}'


/*
  ## new ball word "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "notes ball word abc 285"}'

  ## new ball sentence "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 286, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "notes ball sentence abc 286"}'

  ## new seal word "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 273, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "notes seal word abc 273"}'

  ## new seal sentence "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 274, "clientContextError_OLD" :"", "clientContextError_NEW" : "abc"    , "clientStimwordNotes" : "notes seal sentence abc 274"}'

  ## change ball word from "abc" to "def"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def" , "clientStimwordNotes" : "notes ball word abc -> def"}'

  ## delete ball word "def"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"def", "clientContextError_NEW" : ""   , "clientStimwordNotes" : ""    }'

  ## delete ball sentence "abc"
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 286, "clientContextError_OLD" :"abc", "clientContextError_NEW" : ""   , "clientStimwordNotes" : ""    }'
*/


//      contextAutoIncr = 74 when stimwordPosition is 283/284
//      contextAutoIncr = 56 when stimwordPosition is 285   !!

                                                                                                                //              console.log(process.argv)       ;
'use strict'

var     myArgs                          = JSON.parse(process.argv.slice(2)[0])  ;
const   parmClientSessionAutoIncr       = myArgs.clientSessionAutoIncr          ;
const   parmStimwordPositionAutoIncr    = myArgs.stimwordPositionAutoIncr       ;
const   parmClientContextError_OLD      = myArgs.clientContextError_OLD         ;
const   parmClientContextError_NEW      = myArgs.clientContextError_NEW         ;
const   parmClientStimwordNotes         = myArgs.clientStimwordNotes            ;

const knexConnectOptions =
        {       'client'        :       'mysql'
        ,       'debug'         :       false
        ,       'connection'    :       'mysql://knexUser:knexPassword@localhost:3306/comptonTransAnlys'
        };

const knex = require('knex')(knexConnectOptions);

                                //      https://javascript.info/promise-basics
                                //      https://stackoverflow.com/questions/35318442/how-to-pass-parameter-to-a-promise-function
                                //      https://stackoverflow.com/questions/33257412/how-to-handle-the-if-else-in-promise-then?rq=1


const   insertClientContextStatement    =       returnInsertClientContextStatement()    ;

const   insertClientStimwordStatement   =       returnInsertClientStimwordStatement()   ;

                                                                                                                /*
                                                                                                                console.log('Starting run.');

                                                                                                                console.log('000000 calling returnContextAutoIncr using: ' + parmStimwordPositionAutoIncr);
                                                                                                                */
returnContextAutoIncr(parmStimwordPositionAutoIncr)
        .then( val =>   {
                let contextAutoIncr = val.contextAutoIncr ;

                switch(true)    {

                                        /*

                                                OLD is blank,   NEW is filled in

                                        */

                        case ( parmClientContextError_OLD  == ''  &&    parmClientContextError_NEW != ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_NEW, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {

                                                let clientStimwordCount = val.length ;
                                                if  ( clientStimwordCount == 0 )        {
                                                        selectClientContext(parmClientContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  {
                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                                        return  returnArray;
                                                                                } else {
                                                                                        return insertClientContext(val, parmClientContextError_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                                                }
                                                                        })
                                                                .then( val =>  {
                                                                        let clientContextAutoIncr;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                console.log('ERROR!');
                                                                                console.log(JSON.stringify(val));
                                                                                return 0;
                                                                        }
                                                                        insertClientStimword(clientContextAutoIncr, parmStimwordPositionAutoIncr, parmClientStimwordNotes)
                                                                                .then(  val =>  {
                                                                                        console.log('successful insert! ' + val[0][0]['clientStimwordAutoIncr']);
                                                                                        process.exit(1);
                                                                                });
                                                                });
                                                } else {
                                                        console.log('duplicate error!  returning....');
                                                        return 0;
                                                }

                                        })                                                      // end selectClientContextStimword(NEW)
                                        .catch( err => { console.log(err); return 0; })
                                        ;
                                break;  // should NEVER get here.....????
                        }

                                        /*

                                                OLD is filled in,   NEW is filled in

                                        */

                        case ( parmClientContextError_OLD  != ''  &&    parmClientContextError_NEW != ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {
                                                let clientStimwordCount = val.length;
                                                if  ( clientStimwordCount == 1 )        {


                                                        let clientContextAutoIncr_OLD = val[0]['clientContextAutoIncr'];

                                                        selectClientContext(parmClientContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  {
                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                                        return  returnArray;
                                                                                } else {
                                                                                        return insertClientContext(val, parmClientContextError_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                                                }
                                                                        })

                                                                .then( val =>  {
                                                                        let clientContextAutoIncr_NEW;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr_NEW = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                console.log('ERROR!');
                                                                                console.log(JSON.stringify(val));
                                                                                return 0;
                                                                        }

                                                                        let updateClientStimwordParms =
                                                                                                        {       'clientContextAutoIncr_OLD'     :       clientContextAutoIncr_OLD
                                                                                                        ,       'clientContextAutoIncr_NEW'     :       clientContextAutoIncr_NEW
                                                                                                        ,       'stimwordPositionAutoIncr'      :       parmStimwordPositionAutoIncr
                                                                                                        ,       'clientContextError_OLD'        :       parmClientContextError_OLD
                                                                                                        ,       'clientContextError_NEW'        :       parmClientContextError_NEW
                                                                                                        ,       'clientStimwordNotes'           :       parmClientStimwordNotes
                                                                                                        }
                                                                                                        ;

                                                                        updateClientStimword    (updateClientStimwordParms)

                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                //.then( val => { console.log('about to run selectClientContextStimword!'); return selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)})
                                                                                .then( val => { return selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, true)})
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                .then( val => {

                                                                                        let clientStimwordCount;
                                                                                        switch (true)
                                                                                        {
                                                                                                                        //       [{"clientContextAutoIncr":3043146},{"clientContextAutoIncr":3043146},{"clientContextAutoIncr":3043146}]

                                                                                        case    ( typeof val === 'number'                                                               ) :
                                                                                                clientStimwordCount = val                                       ;
                                                                                                break                                                           ;
                                                                                        case    ( typeof val === 'object'                                                               ) :
                                                                                                clientStimwordCount = val.length                                ;
                                                                                                break                                                           ;
                                                                                        default:
                                                                                                console.log('error! ' + JSON.stringify(val));
                                                                                        }

                                                                                        if  ( clientStimwordCount == 0 )        {
                                                                                                deleteChildlessClientContext(clientContextAutoIncr_OLD, parmClientContextError_OLD)
                                                                                                        .then( val =>   {
                                                                                                                console.log('complete update with clientContext delete result: ' + JSON.stringify(val));
                                                                                                                process.exit(1);
                                                                                                        })
                                                                                                        ;
                                                                                        } else {
                                                                                                console.log('complete update! clientStimwordCount: ' + clientStimwordCount );
                                                                                                process.exit(1);
                                                                                        }
                                                                                });
                                                                })

                                                } else {
                                                        console.log('rejecting, cannot find ' + parmClientContextError_OLD );
                                                        return 0;
                                                }
                                        })                                              // end selectClientContextStimword(OLD)
                                break;  // should NEVER get here.....????
                        }


                                        /*

                                                OLD is filled in,   NEW is BLANK!

                                        */

                        case ( parmClientContextError_OLD  != ''  &&    parmClientContextError_NEW == ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {

                                                let clientStimwordCount = val.length;
                                                if  ( clientStimwordCount == 1 )        {

                                                        let clientContextAutoIncr = val[0]['clientContextAutoIncr'];

                                                        deleteClientStimword(parmStimwordPositionAutoIncr, clientContextAutoIncr, parmClientContextError_OLD)
                                                                .then( ()  => { return deleteChildlessClientContext(clientContextAutoIncr, parmClientContextError_OLD);})
                                                                .then( val => { console.log('Done! ' + JSON.stringify(val)); return 0 })
                                                                ;

                                                                                                        /*
                                                                                                        .then( val => {
                                                                                                                        return deleteChildlessClientContext(clientContextAutoIncr, parmClientContextError_OLD);
                                                                                                                });
                                                                                                        */
                                                } else {
                                                        console.log('cannot find this one for delete!');
                                                }
                                        })
                        }
                }
        });

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
                        deleteChildlessClientContext(OLD)
                } else {
                        throw missing error
                }

        case   ( OLD NOT <blank> && NEW == <blank> )      {
                                                                //      make sure OLD exists ????
                DELETE clientStimword(OLD)
                deleteChildlessClientContext(OLD)
        }
*/

function selectClientContextStimword(clientContextError, clientSessionAutoIncr, stimwordPositionAutoIncr)       {

                                                                                                                                        /*
                                                                                                                                        console.log('                                   in selectClientContextStimword!');
                                                                                                                                        console.log('                                   in selectClientContextStimword!');
                                                                                                                                        console.log('clientContextError:       ' + clientContextError);
                                                                                                                                        console.log('clientSessionAutoIncr:    ' + clientSessionAutoIncr);
                                                                                                                                        console.log('stimwordPositionAutoIncr: ' + stimwordPositionAutoIncr);
                                                                                                                                        console.log('                                   in selectClientContextStimword!');
                                                                                                                                        console.log('                                   in selectClientContextStimword!');
                                                                                                                                        let stimwordPositionAutoIncrFlag;
                                                                                                                                        switch (true)   {
                                                                                                                                        case  ( typeof stimwordPositionAutoIncr == 'undefined' )        :
                                                                                                                                                stimwordPositionAutoIncrFlag    =       true                            ;
                                                                                                                                        case  ( typeof stimwordPositionAutoIncr == 'number' )           :
                                                                                                                                                stimwordPositionAutoIncrFlag    =       false                           ;
                                                                                                                                        }
                                                                                                                                        */

                                                        //      https://stackify.dev/136700-knex-js-how-to-select-columns-from-multiple-tables
                                                        //      https://stackoverflow.com/questions/65413824/multiple-count-and-left-joins-in-mysql-node-using-knex
                                                        //      https://editor.datatables.net/manual/nodejs/conditions
        return knex
                                                                                //.count          ('* as clientContextStimwordCount')
                .select         ('clientContext.clientContextAutoIncr')
                .from           ('clientStimword')
                .innerJoin      ('clientContext', 'clientContext.clientContextAutoIncr', 'clientStimword.clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientContextError'            : clientContextError            })
                .andWhere       ({'clientContext.clientSessionAutoIncr'         : clientSessionAutoIncr         })
                .andWhere       ( (val) =>      {
                                        val.where       (       {       'clientStimword.stimwordPositionAutoIncr'       :       stimwordPositionAutoIncr        }       )
                                        val.orWhereRaw  (               '(true = ?)'                                    ,       stimwordPositionAutoIncr                )
                                })
                ;
                                /*
                                        SELECT clientContext.clientContextAutoIncr
                                        FROM clientStimword
                                        INNER JOIN clientContext
                                        ON clientContext.clientContextAutoIncr = clientStimword.clientContextAutoIncr
                                        WHERE 1
                                        AND clientContext.clientSessionAutoIncr = 2349
                                        AND clientContext.clientContextError   = 'def'
                                        AND ( clientStimword.stimwordPositionAutoIncr = 285 OR true = true )
                                */
}


function selectClientContext(clientContextError, clientSessionAutoIncr, contextAutoIncr)        {
                                                //      https://stackoverflow.com/questions/21979388/get-count-result-with-knex-js-bookshelf-js
                                                //      https://stackoverflow.com/questions/53751587/knex-js-or-inside-where
                                                //      https://stackoverflow.com/questions/54407751/how-to-add-two-bind-params-in-knex/54422388
                                                //      https://stackoverflow.com/questions/47464078/mysql-insert-with-multiple-selects-with-differing-number-of-returned-columns
                                                //      https://stackoverflow.com/questions/30945104/db-raw-with-more-than-one-paremter-with-knex
        return knex
                .from           ('clientContext')
                .select         ('clientContext.clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientContextError'    : clientContextError            })
                .andWhere       ({'clientContext.clientSessionAutoIncr' : clientSessionAutoIncr         })
                .andWhere       ({'clientContext.contextAutoIncr'       : contextAutoIncr               })
                ;
}


function insertClientContext(val, clientContextError, contextAutoIncr, clientSessionAutoIncr)   {

        let insertClientContextParms =
                {       'clientContextError'                    :       clientContextError
                ,       'contextAutoIncr'                       :       contextAutoIncr
                ,       'clientSessionAutoIncr'                 :       clientSessionAutoIncr
                ,       'clientContextErrorSpeakingCount'       :       0
                ,       'frequency'                             :       ''
                ,       'clientContextErrorNotes'               :       null
                }
                ;
                                                                                                                        //      console.log('parms: ' + JSON.stringify(insertClientContextParms));

        return knex.raw(insertClientContextStatement, insertClientContextParms);
}

function insertClientStimword(clientContextAutoIncr, stimwordPositionAutoIncr, clientStimwordNotes)     {

        let insertClientStimwordParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'stimwordPositionAutoIncr'              :       stimwordPositionAutoIncr
                ,       'clientStimwordNotes'                   :       clientStimwordNotes
                }
                ;
                                                                                                                        //      console.log('parms: ' + JSON.stringify(insertClientStimwordParms));

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
                                                                                                                                        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
                                                                                                                                        console.log('JSON.stringify(parmObject):');
                                                                                                                                        console.log(typeof parmObject);
                                                                                                                                        console.log(JSON.stringify(parmObject));
                                                                                                                                        console.log(JSON.stringify(parmObject));

                                                                                                                                        console.log('parmObject.stimwordPositionAutoIncr:');
                                                                                                                                        console.log(parmObject.stimwordPositionAutoIncr);

                                                                                                                                        console.log('parmObject.clientContextAutoIncr_OLD:');
                                                                                                                                        console.log(parmObject.clientContextAutoIncr_OLD);

                                                                                                                                        console.log('parmObject.clientContextAutoIncr_NEW:');
                                                                                                                                        console.log(parmObject.clientContextAutoIncr_NEW);

                                                                                                                                        console.log('parmObject.clientContextError_OLD:');
                                                                                                                                        console.log(parmObject.clientContextError_OLD);

                                                                                                                                        console.log('parmObject.clientContextError_NEW:');
                                                                                                                                        console.log(parmObject.clientContextError_NEW);

                                                                                                                                        console.log('parmObject.clientStimwordNotes:');
                                                                                                                                        console.log(parmObject.clientStimwordNotes);
                                                                                                                                        */



        let updateClientStimwordWhereParms =
                {       'stimwordPositionAutoIncr'      :       parmObject.stimwordPositionAutoIncr
                ,       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_OLD
                ,       'clientContextError'            :       parmObject.clientContextError_OLD
                };

        let updateClientStimwordUpdateParms =
                {       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_NEW
                ,       'clientContextError'            :       parmObject.clientContextError_NEW
                ,       'clientStimwordNotes'           :       parmObject.clientStimwordNotes
                };

        return knex
                .from('clientStimword')
                .where(updateClientStimwordWhereParms)
                .update(updateClientStimwordUpdateParms)
                ;

                                        /*
                                        knex('books')
                                          .where('published_date', '<', 2000)
                                          .update({
                                            status: 'archived',
                                            thisKeyIsSkipped: undefined
                                          })
                                        */
}

function deleteClientStimword(stimwordPositionAutoIncr, clientContextAutoIncr, clientContextError)      {
        let deleteClientStimwordParms =
                {       'stimwordPositionAutoIncr'      :       stimwordPositionAutoIncr
                ,       'clientContextAutoIncr'         :       clientContextAutoIncr
                ,       'clientContextError'            :       clientContextError
                };
        return knex
                .from('clientStimword')
                .where(deleteClientStimwordParms)
                .delete()
                ;
}


function deleteChildlessClientContext(clientContextAutoIncr, clientContextError)        {
        let deleteClientContextParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'clientContextError'                    :       clientContextError
                ,       'clientContextErrorNotes'               :       null
                ,       'frequency'                             :       ''
                ,       'clientContextErrorSpeakingCount'       :       0
                };
        return knex
                .from('clientContext')
                .where(deleteClientContextParms)
                .delete()
                ;
                                                                                                        /*
                                                                                                        if      (       clientContext.clientContextErrorNotes(OLD)      blank?
                                                                                                                &&      clientContext.clientContextFrequency            blank?
                                                                                                                &&      clientContext.clientContextErrorSpeakingCount   zero?
                                                                                                                &&      clientContext(OLD) [clientStimword]             childless?
                                                                                                                )
                                                                                                        {
                                                                                                                                //DELETE clientContext(OLD)
                                                                                                        }
                                                                                                        */
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
        ,               \`clientContextError\`
        ,               \`clientContextErrorSpeakingCount\`
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
                ,               :clientContextError
                ,               :clientContextErrorSpeakingCount
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
                //   can we use \` on RETURNING variable????????????????????????????//
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
        ,       \`stimwordPageNbr\`
        ,       \`stimwordLineNbr\`
        ,       \`stimwordWord\`
        ,       \`stimwordPositionNbr\`
        ,       \`stimwordPositionSetting\`
        ,       \`clientStimwordNotes\`
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
                ,       \`stimwordPosition\`.\`stimwordPageNbr\`
                ,       \`stimwordPosition\`.\`stimwordLineNbr\`
                ,       \`stimwordPosition\`.\`stimwordWord\`
                ,       \`stimwordPosition\`.\`stimwordPositionNbr\`
                ,       \`stimwordPosition\`.\`stimwordPositionSetting\`
                ,       :clientStimwordNotes
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
                //   can we use \` on RETURNING variable????????????????????????????//
};





/*






*/


//      mariadb  --host=localhost --user=knexUser  --password=knexPassword    knexDb    ;
//      mariadb  --host=localhost --user=kenxUser  --password=knexPassword    comptonTransAnlys

/*
function firstPromise(promiseInput)     {
        console.log('parameter passed into first promise: ' + promiseInput);
        return  knex.raw("SELECT VERSION()")    ;
}
function secondPromise(promiseInput)    {
        console.log('result of first promise into second promise: ' + JSON.stringify(promiseInput));
        return ('second promise added to promiseInput. ' + promiseInput);
}
/*
firstPromise('promise input!')
        .then(secondPromise)
        .catch(console.log('error!'))
        ;
*/


                                                                                                                /*
                                                                                                                const myArgs = process.argv.slice(2);
                                                                                                                console.log('myArgs: ', myArgs);

                                                                                                                console.log('start:');
                                                                                                                console.log(myArgs[0].clientSessionAutoIncr);
                                                                                                                console.log(myArgs[0].clientPositionAutoIncr);
                                                                                                                console.log(JSON.parse(myArgs[0]));

                                                                                                                console.log(
                                                                                                                        parmClientSessionAutoIncr
                                                                                                                ,       parmStimwordPositionAutoIncr
                                                                                                                ,       parmClientContextError_OLD
                                                                                                                ,       parmClientContextError_NEW
                                                                                                                ,       parmClientStimwordNotes
                                                                                                                );

                                                                                                                */


/*
firstPromise('promise input!')
        .then(  (response)      =>      {       console.log     ('response from firstPromise: ' + response)     ;
                                                return response                                                 ;
                                        }                                                                               )
        .then(  (newResponse)   =>      console.log     ('ending! ' + newResponse)                                      )
        .then(  ()              =>      knex.destroy()                                                                  )
        .then(  ()              =>      secondPromise('stuff into second promise')
                                                .then((result) => { console.log('calling second promise: ' + result); return (result);} )       )
        .then(  (lastResponse)  =>      console.log     ('last response: ' + lastResponse)                              )
        .catch( (error)         =>      console.log     ('error! ' + error)                                             )
        ;


        if  ( NEW != <blank> )      {
                if  ( clientStimwordCount(NEW) == 0 )   {
                        if  ( clientContext(NEW) NOT exists )   {
                            INSERT clientContext(NEW)
                        }
                        if  ( NEW != <blank> && OLD == <blank> ) {
                                INSERT clientStimword(NEW)
                        } else {
                                if  ( clientStimwordCount(OLD) EXISTS ) {
                                        MODIFY clientStimword(OLD) to clientStimword(NEW)
                                }
                                deleteChildlessClientContext(OLD)
                        }
                } else {        // duplicate!!
                        throw dup error
                }
        } else if  ( OLD  != <blank> && NEW == <blank> )  {
                                                                //      make sure OLD exists ????
                DELETE clientStimword(OLD)
                deleteChildlessClientContext(OLD)
        }

                                                                /*
                                                                const firstPromise = ( promiseInput )   =>      {
                                                                        return new Promise((resolve, reject) => {
                                                                                console.log('parameter passed into promise: ' + promiseInput);

                                                                                knex.raw("SELECT VERSION()")
                                                                                .then(
                                                                                    (version) => {      console.log     ('inside:  ' + version[0][0]["VERSION()"] );
                                                                                                        resolve         ('outside: ' + version[0][0]["VERSION()"] );
                                                                                                }
                                                                                ).catch(
                                                                                        (err) => { reject(err); }
                                                                                )
                                                                        })
                                                                }

                                                                const secondPromise = ( input ) =>              {
                                                                        return new Promise (    (resolve, reject) => {
                                                                                resolve (input) ;
                                                                        })
                                                                }
*/
[root@localhost knex]#





=====   2022-02-13


[root@localhost knex]# clear
[root@localhost knex]# cat  clientStimword.js

//       node  clientStimword.js  '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 284, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def", "clientStimwordNotes" : "my client stimword notes"}'


/*
  ## new ball word
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"abc", "clientContextError_NEW" : ""    , "clientStimwordNotes" : "notes 285"}'

  ## new ball sentence
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 286, "clientContextError_OLD" :"abc", "clientContextError_NEW" : ""    , "clientStimwordNotes" : "notes 286"}'

  ## change ball word from abc to def
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def" , "clientStimwordNotes" : "notes abc -> def"}'

  ## delete ball word
node clientStimword.js '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 285, "clientContextError_OLD" :"def", "clientContextError_NEW" : ""   , "clientStimwordNotes" : ""    }'
*/



//      contextAutoIncr = 74 when stimwordPosition is 283/284
//      contextAutoIncr = 56 when stimwordPosition is 285   !!

console.log(process.argv)       ;

var     myArgs                          = JSON.parse(process.argv.slice(2)[0])  ;
const   parmClientSessionAutoIncr       = myArgs.clientSessionAutoIncr          ;
const   parmStimwordPositionAutoIncr    = myArgs.stimwordPositionAutoIncr       ;
const   parmClientContextError_OLD      = myArgs.clientContextError_OLD         ;
const   parmClientContextError_NEW      = myArgs.clientContextError_NEW         ;
const   parmClientStimwordNotes         = myArgs.clientStimwordNotes            ;

const knexConnectOptions = {
  client: 'mysql',
  debug: true,
  connection: 'mysql://knexUser:knexPassword@localhost:3306/comptonTransAnlys'
};

const knex = require('knex')(knexConnectOptions);

                                //      https://javascript.info/promise-basics
                                //      https://stackoverflow.com/questions/35318442/how-to-pass-parameter-to-a-promise-function
                                //      https://stackoverflow.com/questions/33257412/how-to-handle-the-if-else-in-promise-then?rq=1





const   insertClientContextStatement =  returnInsertClientContextStatement();

const   insertClientStimwordStatement   = returnInsertClientStimwordStatement();


console.log('Starting run.');

console.log('000000 calling returnContextAutoIncr using: ' + parmStimwordPositionAutoIncr);

returnContextAutoIncr(parmStimwordPositionAutoIncr)
        .then( val =>   {
                let contextAutoIncr = val.contextAutoIncr ;

                switch(true)    {

                                        /*

                                                OLD is blank,   NEW is filled in

                                        */

                        case ( parmClientContextError_OLD  == ''  &&    parmClientContextError_NEW != ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_NEW, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {

                                                let clientStimwordCount = val.length ;
                                                if  ( clientStimwordCount == 0 )        {
                                                        selectClientContext(parmClientContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  {
                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                                        return  returnArray;
                                                                                } else {
                                                                                        return insertClientContext(val, parmClientContextError_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                                                }
                                                                        })
                                                                .then( val =>  {
                                                                        let clientContextAutoIncr;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                console.log('ERROR!');
                                                                                console.log(JSON.stringify(val));
                                                                                return 0;
                                                                        }
                                                                        insertClientStimword(clientContextAutoIncr, parmStimwordPositionAutoIncr, parmClientStimwordNotes)
                                                                                .then( val => { console.log(JSON.stringify(val));});
                                                                });
                                                } else {
                                                        console.log('duplicate error!  returning....');
                                                        return 0;
                                                }

                                        })                                                      // end selectClientContextStimword(NEW)
                                        .catch( err => { console.log(err); return 0; })
                                        ;
                                break;  // should NEVER get here.....????
                        }

                                        /*

                                                OLD is filled in,   NEW is filled in

                                        */

                        case ( parmClientContextError_OLD  != ''  &&    parmClientContextError_NEW != ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {
                                                let clientStimwordCount = val.length;
                                                if  ( clientStimwordCount == 1 )        {


                                                        let clientContextAutoIncr_OLD = val[0]['clientContextAutoIncr'];

                                                        selectClientContext(parmClientContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  {
                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                                        return  returnArray;
                                                                                } else {
                                                                                        return insertClientContext(val, parmClientContextError_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                                                }
                                                                        })

                                                                .then( val =>  {
                                                                        let clientContextAutoIncr_NEW;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr_NEW = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                console.log('ERROR!');
                                                                                console.log(JSON.stringify(val));
                                                                                return 0;
                                                                        }

                                                                        let updateClientStimwordParms =
                                                                                                        {       'clientContextAutoIncr_OLD'     :       clientContextAutoIncr_OLD
                                                                                                        ,       'clientContextAutoIncr_NEW'     :       clientContextAutoIncr_NEW
                                                                                                        ,       'stimwordPositionAutoIncr'      :       parmStimwordPositionAutoIncr
                                                                                                        ,       'clientContextError_OLD'        :       parmClientContextError_OLD
                                                                                                        ,       'clientContextError_NEW'        :       parmClientContextError_NEW
                                                                                                        ,       'clientStimwordNotes'           :       parmClientStimwordNotes
                                                                                                        }
                                                                                                        ;

                                                                        updateClientStimword    (updateClientStimwordParms)

                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                        //.then( val => { console.log('about to run selectClientContextStimword!'); return selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)})
                                                                                .then( val => { return selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, true)})
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                .then( val => {

                                                                                        let clientStimwordCount;
                                                                                        switch (true)
                                                                                        {
                                                                                        case    ( typeof val === 'number'                                                               ) :
                                                                                                clientStimwordCount = val                                       ;
                                                                                                break                                                           ;
                                                                                        case    ( typeof val === 'object'       &&  val.length == 0                                     ) :
                                                                                                clientStimwordCount = 0                                         ;
                                                                                                break                                                           ;
                                                                                        case    ( typeof val === 'object'       &&  val[0]['clientContextStimwordCount'] === 'numeric'  ) :
                                                                                                clientStimwordCount = val[0]['clientContextStimwordCount']      ;
                                                                                                break                                                           ;
                                                                                        default:
                                                                                                console.log('error! ' + JSON.stringify(val));
                                                                                        }

                                                                                        if  ( clientStimwordCount == 0 )        {
                                                                                                deleteChildlessClientContext(clientContextAutoIncr_OLD, parmClientContextError_OLD)
                                                                                                        .then( val => { console.log('delete result: ' + JSON.stringify(val)); return 0} )
                                                                                                        ;
                                                                                        } else {
                                                                                                return 0;
                                                                                        }
                                                                                });
                                                                })

                                                } else {
                                                        console.log('rejecting, cannot find ' + parmClientContextError_OLD );
                                                        return 0;
                                                }
                                        })                                              // end selectClientContextStimword(OLD)
                                break;  // should NEVER get here.....????
                        }


                                        /*

                                                OLD is filled in,   NEW is BLANK!

                                        */

                        case ( parmClientContextError_OLD  != ''  &&    parmClientContextError_NEW == ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {

                                                let clientStimwordCount = val.length;
                                                if  ( clientStimwordCount == 1 )        {

                                                        let clientContextAutoIncr = val[0]['clientContextAutoIncr'];

                                                        deleteClientStimword(parmStimwordPositionAutoIncr, clientContextAutoIncr, parmClientContextError_OLD)
                                                                .then( ()  => { return deleteChildlessClientContext(clientContextAutoIncr, parmClientContextError_OLD);})
                                                                .then( val => { console.log('Done! ' + JSON.stringify(val)); return 0 })
                                                                ;

                                                                                                        /*
                                                                                                        .then( val => {
                                                                                                                        return deleteChildlessClientContext(clientContextAutoIncr, parmClientContextError_OLD);
                                                                                                                });
                                                                                                        */
                                                } else {
                                                        console.log('cannot find this one for delete!');
                                                }
                                        })
                        }
                }
        });

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
                        deleteChildlessClientContext(OLD)
                } else {
                        throw missing error
                }

        case   ( OLD NOT <blank> && NEW == <blank> )      {
                                                                //      make sure OLD exists ????
                DELETE clientStimword(OLD)
                deleteChildlessClientContext(OLD)
        }
*/

function selectClientContextStimword(clientContextError, clientSessionAutoIncr, stimwordPositionAutoIncr)       {

        console.log('                                   in selectClientContextStimword!');
        console.log('                                   in selectClientContextStimword!');
        console.log('clientContextError:       ' + clientContextError);
        console.log('clientSessionAutoIncr:    ' + clientSessionAutoIncr);
        console.log('stimwordPositionAutoIncr: ' + stimwordPositionAutoIncr);
        console.log('                                   in selectClientContextStimword!');
        console.log('                                   in selectClientContextStimword!');
                                                                                                                                        /*
                                                                                                                                        let stimwordPositionAutoIncrFlag;
                                                                                                                                        switch (true)   {
                                                                                                                                        case  ( typeof stimwordPositionAutoIncr == 'undefined' )        :
                                                                                                                                                stimwordPositionAutoIncrFlag    =       true                            ;
                                                                                                                                        case  ( typeof stimwordPositionAutoIncr == 'number' )           :
                                                                                                                                                stimwordPositionAutoIncrFlag    =       false                           ;
                                                                                                                                        }
                                                                                                                                        */

                                                        //      https://stackify.dev/136700-knex-js-how-to-select-columns-from-multiple-tables
                                                        //      https://stackoverflow.com/questions/65413824/multiple-count-and-left-joins-in-mysql-node-using-knex
                                                        //      https://editor.datatables.net/manual/nodejs/conditions
        return knex
                                                                                //.count          ('* as clientContextStimwordCount')
                .select         ('clientContext.clientContextAutoIncr')
                .from           ('clientStimword')
                .innerJoin      ('clientContext', 'clientContext.clientContextAutoIncr', 'clientStimword.clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientContextError'            : clientContextError            })
                .andWhere       ({'clientContext.clientSessionAutoIncr'         : clientSessionAutoIncr         })
                .andWhere       ( (val) =>      {
                                        val.where       (       {       'clientStimword.stimwordPositionAutoIncr'       :       stimwordPositionAutoIncr        }       )
                                        val.orWhereRaw  (               '(true = ?)'                                    ,       stimwordPositionAutoIncr                )
                                })
                                                                                                //.then( val => { console.log('inside of returnClientContextCount()! ' + JSON.stringify(val)); return val[0]; } )
                ;
                                /*
                                        SELECT clientContext.clientContextAutoIncr
                                        FROM clientStimword
                                        INNER JOIN clientContext
                                        ON clientContext.clientContextAutoIncr = clientStimword.clientContextAutoIncr
                                        WHERE 1
                                        AND clientContext.clientSessionAutoIncr = 2349
                                        AND clientContext.clientContextError   = 'def'
                                        AND ( clientStimword.stimwordPositionAutoIncr = 285 OR true = true )
                                */
}


function selectClientContext(clientContextError, clientSessionAutoIncr, contextAutoIncr)        {
                                                //      https://stackoverflow.com/questions/21979388/get-count-result-with-knex-js-bookshelf-js
                                                //      https://stackoverflow.com/questions/53751587/knex-js-or-inside-where
                                                //      https://stackoverflow.com/questions/54407751/how-to-add-two-bind-params-in-knex/54422388
                                                //      https://stackoverflow.com/questions/47464078/mysql-insert-with-multiple-selects-with-differing-number-of-returned-columns
                                                //      https://stackoverflow.com/questions/30945104/db-raw-with-more-than-one-paremter-with-knex
        return knex
                .from           ('clientContext')
                .select         ('clientContext.clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientContextError'    : clientContextError            })
                .andWhere       ({'clientContext.clientSessionAutoIncr' : clientSessionAutoIncr         })
                .andWhere       ({'clientContext.contextAutoIncr'       : contextAutoIncr               })
                ;
}


function insertClientContext(val, clientContextError, contextAutoIncr, clientSessionAutoIncr)   {

        let insertClientContextParms =
                {       'clientContextError'                    :       clientContextError
                ,       'contextAutoIncr'                       :       contextAutoIncr
                ,       'clientSessionAutoIncr'                 :       clientSessionAutoIncr
                ,       'clientContextErrorSpeakingCount'       :       0
                ,       'frequency'                             :       ''
                ,       'clientContextErrorNotes'               :       null
                }
                ;
        console.log('parms: ' + JSON.stringify(insertClientContextParms));

        return knex.raw(insertClientContextStatement, insertClientContextParms);
}

function insertClientStimword(clientContextAutoIncr, stimwordPositionAutoIncr, clientStimwordNotes)     {

        let insertClientStimwordParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'stimwordPositionAutoIncr'              :       stimwordPositionAutoIncr
                ,       'clientStimwordNotes'                   :       clientStimwordNotes
                }
                ;
        console.log('parms: ' + JSON.stringify(insertClientStimwordParms));

        return knex.raw(insertClientStimwordStatement, insertClientStimwordParms);
}


function returnContextAutoIncr(stimwordPositionAutoIncr)        {
                                                        //      https://stackoverflow.com/questions/48558183/knex-select-result-return-to-a-variable
        return knex.from('stimwordPosition')
                .select('contextAutoIncr')
                .where ({ 'stimwordPositionAutoIncr': stimwordPositionAutoIncr })
                .then( val => { console.log('bbbbbbb returnContextAutoIncr value is: ' + JSON.stringify(val[0])); return val[0]; } )
                ;
}


function updateClientStimword   (parmObject)    {

console.log('inside of  updateClientStimword!');
//                                                                                                              (       clientContextAutoIncrOld        /* 1 */
//                                                                                                              ,       clientContextAutoIncrNew        /* 2 */
//                                                                                                              ,       stimwordPositionAutoIncr        /* 3 */
//                                                                                                              ,       clientContextErrorOld           /* 4 */
//                                                                                                              ,       clientContextErrorNew           /* 5 */
//                                                                                                              ,       clientStimwordNotes             /* 6 */
//                                                                                                              )       {
//
/*

                                                                                console.log('clientContextAutoIncrOld:');
                                                                                console.log(typeof clientContextAutoIncrOld);
                                                                                console.log(clientContextAutoIncrOld);

                                                                                console.log('clientContextAutoIncrNew:');
                                                                                console.log(typeof clientContextAutoIncrNew);
                                                                                console.log(clientContextAutoIncrNew);

                                                                                console.log('stimwordPositionAutoIncr:');
                                                                                console.log(typeof stimwordPositionAutoIncr);
                                                                                console.log(stimwordPositionAutoIncr);
                                                                                p
                                                                                console.log('clientContextErrorOld:');
                                                                                console.log(typeof clientContextErrorOld);
                                                                                console.log(clientContextErrorOld);

                                                                                console.log('clientContextErrorNew:');
                                                                                console.log(typeof clientContextErrorNew);
                                                                                console.log(clientContextErrorNew);

                                                                                console.log('clientStimwordNotes:');
                                                                                console.log(typeof clientStimwordNotes);
                                                                                console.log(clientStimwordNotes);


                                                                                        console.log(clientContextAutoIncrOld, clientContextAutoIncrNew, stimwordPositionAutoIncr, clientContextErrorOld, clientContextErrorNew, clientStimwordNotes)    ;
                                                                                        console.log(clientContextAutoIncrOld, clientContextAutoIncrNew, stimwordPositionAutoIncr, clientContextErrorOld, clientContextErrorNew, clientStimwordNotes)    ;
                                                                                //undefined 285 abc def my client stimword notes undefined
                                                                                                                */
console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
console.log('JSON.stringify(parmObject):');
console.log(typeof parmObject);
console.log(JSON.stringify(parmObject));
console.log(JSON.stringify(parmObject));

console.log('parmObject.stimwordPositionAutoIncr:');
console.log(parmObject.stimwordPositionAutoIncr);

console.log('parmObject.clientContextAutoIncr_OLD:');
console.log(parmObject.clientContextAutoIncr_OLD);

console.log('parmObject.clientContextAutoIncr_NEW:');
console.log(parmObject.clientContextAutoIncr_NEW);

console.log('parmObject.clientContextError_OLD:');
console.log(parmObject.clientContextError_OLD);

console.log('parmObject.clientContextError_NEW:');
console.log(parmObject.clientContextError_NEW);

console.log('parmObject.clientStimwordNotes:');
console.log(parmObject.clientStimwordNotes);



        let updateClientStimwordWhereParms =
                {       'stimwordPositionAutoIncr'      :       parmObject.stimwordPositionAutoIncr
                ,       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_OLD
                ,       'clientContextError'            :       parmObject.clientContextError_OLD
                };

console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
console.log('JSON.stringify(updateClientStimwordWhereParms):');
console.log(JSON.stringify(updateClientStimwordWhereParms));

/*
yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
JSON.stringify(updateClientStimwordWhereParms):
{"clientContextAutoIncr":3043070}
*/



        let updateClientStimwordUpdateParms =
                {       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_NEW
                ,       'clientContextError'            :       parmObject.clientContextError_NEW
                ,       'clientStimwordNotes'           :       parmObject.clientStimwordNotes
                };

console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
console.log('JSON.stringify(updateClientStimwordUpdateParms):');
console.log(JSON.stringify(updateClientStimwordUpdateParms));

        return knex
                .from('clientStimword')
                .where(updateClientStimwordWhereParms)
                .update(updateClientStimwordUpdateParms)
                ;

                                        /*
                                        knex('books')
                                          .where('published_date', '<', 2000)
                                          .update({
                                            status: 'archived',
                                            thisKeyIsSkipped: undefined
                                          })
                                        */
}

function deleteClientStimword(stimwordPositionAutoIncr, clientContextAutoIncr, clientContextError)      {
        let deleteClientStimwordParms =
                {       'stimwordPositionAutoIncr'      :       stimwordPositionAutoIncr
                ,       'clientContextAutoIncr'         :       clientContextAutoIncr
                ,       'clientContextError'            :       clientContextError
                };
        return knex
                .from('clientStimword')
                .where(deleteClientStimwordParms)
                .delete()
                ;
}


function deleteChildlessClientContext(clientContextAutoIncr, clientContextError)        {
        let deleteClientContextParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'clientContextError'                    :       clientContextError
                ,       'clientContextErrorNotes'               :       null
                ,       'frequency'                             :       ''
                ,       'clientContextErrorSpeakingCount'       :       0
                };
console.log(JSON.stringify(deleteClientContextParms));
console.log(JSON.stringify(deleteClientContextParms));
console.log(JSON.stringify(deleteClientContextParms));
console.log(JSON.stringify(deleteClientContextParms));
console.log(JSON.stringify(deleteClientContextParms));
        return knex
                .from('clientContext')
                .where(deleteClientContextParms)
                .delete()
                ;
                                                                                                        /*
                                                                                                        if      (       clientContext.clientContextErrorNotes(OLD)      blank?
                                                                                                                &&      clientContext.clientContextFrequency            blank?
                                                                                                                &&      clientContext.clientContextErrorSpeakingCount   zero?
                                                                                                                &&      clientContext(OLD) [clientStimword]             childless?
                                                                                                                )
                                                                                                        {
                                                                                                                                //DELETE clientContext(OLD)
                                                                                                        }
                                                                                                        */
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
        ,               \`clientContextError\`
        ,               \`clientContextErrorSpeakingCount\`
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
                ,               :clientContextError
                ,               :clientContextErrorSpeakingCount
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
                //   can we use \` on RETURNING variable????????????????????????????//
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
        ,       \`stimwordPageNbr\`
        ,       \`stimwordLineNbr\`
        ,       \`stimwordWord\`
        ,       \`stimwordPositionNbr\`
        ,       \`stimwordPositionSetting\`
        ,       \`clientStimwordNotes\`
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
                ,       \`stimwordPosition\`.\`stimwordPageNbr\`
                ,       \`stimwordPosition\`.\`stimwordLineNbr\`
                ,       \`stimwordPosition\`.\`stimwordWord\`
                ,       \`stimwordPosition\`.\`stimwordPositionNbr\`
                ,       \`stimwordPosition\`.\`stimwordPositionSetting\`
                ,       :clientStimwordNotes
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
                //   can we use \` on RETURNING variable????????????????????????????//
};





/*






*/


//      mariadb  --host=localhost --user=knexUser  --password=knexPassword    knexDb    ;
//      mariadb  --host=localhost --user=kenxUser  --password=knexPassword    comptonTransAnlys

/*
function firstPromise(promiseInput)     {
        console.log('parameter passed into first promise: ' + promiseInput);
        return  knex.raw("SELECT VERSION()")    ;
}
function secondPromise(promiseInput)    {
        console.log('result of first promise into second promise: ' + JSON.stringify(promiseInput));
        return ('second promise added to promiseInput. ' + promiseInput);
}
/*
firstPromise('promise input!')
        .then(secondPromise)
        .catch(console.log('error!'))
        ;
*/


                                                                                                                /*
                                                                                                                const myArgs = process.argv.slice(2);
                                                                                                                console.log('myArgs: ', myArgs);

                                                                                                                console.log('start:');
                                                                                                                console.log(myArgs[0].clientSessionAutoIncr);
                                                                                                                console.log(myArgs[0].clientPositionAutoIncr);
                                                                                                                console.log(JSON.parse(myArgs[0]));

                                                                                                                console.log(
                                                                                                                        parmClientSessionAutoIncr
                                                                                                                ,       parmStimwordPositionAutoIncr
                                                                                                                ,       parmClientContextError_OLD
                                                                                                                ,       parmClientContextError_NEW
                                                                                                                ,       parmClientStimwordNotes
                                                                                                                );

                                                                                                                */


/*
firstPromise('promise input!')
        .then(  (response)      =>      {       console.log     ('response from firstPromise: ' + response)     ;
                                                return response                                                 ;
                                        }                                                                               )
        .then(  (newResponse)   =>      console.log     ('ending! ' + newResponse)                                      )
        .then(  ()              =>      knex.destroy()                                                                  )
        .then(  ()              =>      secondPromise('stuff into second promise')
                                                .then((result) => { console.log('calling second promise: ' + result); return (result);} )       )
        .then(  (lastResponse)  =>      console.log     ('last response: ' + lastResponse)                              )
        .catch( (error)         =>      console.log     ('error! ' + error)                                             )
        ;


        if  ( NEW != <blank> )      {
                if  ( clientStimwordCount(NEW) == 0 )   {
                        if  ( clientContext(NEW) NOT exists )   {
                            INSERT clientContext(NEW)
                        }
                        if  ( NEW != <blank> && OLD == <blank> ) {
                                INSERT clientStimword(NEW)
                        } else {
                                if  ( clientStimwordCount(OLD) EXISTS ) {
                                        MODIFY clientStimword(OLD) to clientStimword(NEW)
                                }
                                deleteChildlessClientContext(OLD)
                        }
                } else {        // duplicate!!
                        throw dup error
                }
        } else if  ( OLD  != <blank> && NEW == <blank> )  {
                                                                //      make sure OLD exists ????
                DELETE clientStimword(OLD)
                deleteChildlessClientContext(OLD)
        }

                                                                /*
                                                                const firstPromise = ( promiseInput )   =>      {
                                                                        return new Promise((resolve, reject) => {
                                                                                console.log('parameter passed into promise: ' + promiseInput);

                                                                                knex.raw("SELECT VERSION()")
                                                                                .then(
                                                                                    (version) => {      console.log     ('inside:  ' + version[0][0]["VERSION()"] );
                                                                                                        resolve         ('outside: ' + version[0][0]["VERSION()"] );
                                                                                                }
                                                                                ).catch(
                                                                                        (err) => { reject(err); }
                                                                                )
                                                                        })
                                                                }

                                                                const secondPromise = ( input ) =>              {
                                                                        return new Promise (    (resolve, reject) => {
                                                                                resolve (input) ;
                                                                        })
                                                                }
*/
[root@localhost knex]#





===== 2022-02-12

[root@localhost knex]# clear
[root@localhost knex]# cat  clientStimword.js

//       node  clientStimword.js  '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 284, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def", "clientStimwordNotes" : "my client stimword notes"}'

//      contextAutoIncr = 74 when stimwordPosition is 283/284
//      contextAutoIncr = 56 when stimwordPosition is 285   !!

console.log(process.argv)       ;

var     myArgs                          = JSON.parse(process.argv.slice(2)[0])  ;
const   parmClientSessionAutoIncr       = myArgs.clientSessionAutoIncr          ;
const   parmStimwordPositionAutoIncr    = myArgs.stimwordPositionAutoIncr       ;
const   parmClientContextError_OLD      = myArgs.clientContextError_OLD         ;
const   parmClientContextError_NEW      = myArgs.clientContextError_NEW         ;
const   parmClientStimwordNotes         = myArgs.clientStimwordNotes            ;

const knexConnectOptions = {
  client: 'mysql',
  debug: true,
  connection: 'mysql://knexUser:knexPassword@localhost:3306/comptonTransAnlys'
};

const knex = require('knex')(knexConnectOptions);

                                //      https://javascript.info/promise-basics
                                //      https://stackoverflow.com/questions/35318442/how-to-pass-parameter-to-a-promise-function
                                //      https://stackoverflow.com/questions/33257412/how-to-handle-the-if-else-in-promise-then?rq=1





const   insertClientContextStatement =  returnInsertClientContextStatement();

const   insertClientStimwordStatement   = returnInsertClientStimwordStatement();


console.log('Starting run.');

console.log('000000 calling returnContextAutoIncr using: ' + parmStimwordPositionAutoIncr);

returnContextAutoIncr(parmStimwordPositionAutoIncr)
        .then( val =>   {
                let contextAutoIncr = val.contextAutoIncr ;

                switch(true)    {

                                        /*

                                                OLD is blank,   NEW is filled in

                                        */

                        case ( parmClientContextError_OLD  == ''  &&    parmClientContextError_NEW != ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_NEW, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {

                                                let clientStimwordCount = val.length ;
                                                if  ( clientStimwordCount == 0 )        {
                                                        selectClientContext(parmClientContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  {
                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                                        return  returnArray;
                                                                                } else {
                                                                                        return insertClientContext(val, parmClientContextError_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                                                }
                                                                        })
                                                                .then( val =>  {
                                                                        let clientContextAutoIncr;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                console.log('ERROR!');
                                                                                console.log(JSON.stringify(val));
                                                                                return 0;
                                                                        }
                                                                        insertClientStimword(clientContextAutoIncr, parmStimwordPositionAutoIncr, parmClientStimwordNotes)
                                                                                .then( val => { console.log(JSON.stringify(val));});
                                                                });
                                                } else {
                                                        console.log('duplicate error!  returning....');
                                                        return 0;
                                                }

                                        })                                                      // end selectClientContextStimword(NEW)
                                        .catch( err => { console.log(err); return 0; })
                                        ;
                                break;  // should NEVER get here.....????
                        }

                                        /*

                                                OLD is filled in,   NEW is filled in

                                        */

                        case ( parmClientContextError_OLD  != ''  &&    parmClientContextError_NEW != ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {

                                                let clientStimwordCount = val.length;
                                                if  ( clientStimwordCount == 1 )        {


                                                        let clientContextAutoIncr_OLD = val[0]['clientContextAutoIncr'];

                                                        selectClientContext(parmClientContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  {
                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                                        return  returnArray;
                                                                                } else {
                                                                                        return insertClientContext(val, parmClientContextError_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                                                }
                                                                        })

                                                                .then( val =>  {

                                                                        let clientContextAutoIncr_NEW;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr_NEW = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                console.log('ERROR!');
                                                                                console.log(JSON.stringify(val));
                                                                                return 0;
                                                                        }

                                                                        let updateClientStimwordParms =
                                                                                                        {       'clientContextAutoIncr_OLD'     :       clientContextAutoIncr_OLD
                                                                                                        ,       'clientContextAutoIncr_NEW'     :       clientContextAutoIncr_NEW
                                                                                                        ,       'stimwordPositionAutoIncr'      :       parmStimwordPositionAutoIncr
                                                                                                        ,       'clientContextError_OLD'        :       parmClientContextError_OLD
                                                                                                        ,       'clientContextError_NEW'        :       parmClientContextError_NEW
                                                                                                        ,       'clientStimwordNotes'           :       parmClientStimwordNotes
                                                                                                        }
                                                                                                        ;

                                                                        updateClientStimword    (updateClientStimwordParms)

                                                                                .then( val => { return selectClientContext(parmClientContextError_OLD, parmClientSessionAutoIncr, contextAutoIncr)})

                                                                                .then( val => {

                                                                                        let clientStimwordCount;
                                                                                        switch (true)
                                                                                        {
                                                                                        case    ( typeof val === 'number'                                                               ) :
                                                                                                clientStimwordCount = val                                       ;
                                                                                                break                                                           ;
                                                                                        case    ( typeof val === 'object'       &&  val.length == 0                                     ) :
                                                                                                clientStimwordCount = 0                                         ;
                                                                                                break                                                           ;
                                                                                        case    ( typeof val === 'object'       &&  val[0]['clientContextStimwordCount'] === 'numeric'  ) :
                                                                                                clientStimwordCount = val[0]['clientContextStimwordCount']      ;
                                                                                                break                                                           ;
                                                                                        default:
                                                                                                console.log('error! ' + JSON.stringify(val));
                                                                                        }

                                                                                        if  ( clientStimwordCount == 0 )        {
                                                                                                deleteChildlessClientContext(clientContextAutoIncr_OLD, parmClientContextError_OLD)
                                                                                                        .then( val => { console.log('delete result: ' + JSON.stringify(val)); return 0} )
                                                                                                        ;
                                                                                        } else {
                                                                                                console.log('skipping delete clientContext, found at least one child!');
                                                                                                return 0;
                                                                                        }
                                                                                });
                                                                })

                                                } else {
                                                        console.log('rejecting, cannot find ' + parmClientContextError_OLD );
                                                        return 0;
                                                }
                                        })                                              // end selectClientContextStimword(OLD)
                                break;  // should NEVER get here.....????
                        }

                                        /*

                                                OLD is filled in,   NEW is BLANK!

                                        */

                        case ( parmClientContextError_OLD  != ''  &&    parmClientContextError_NEW == ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {

                                                let clientStimwordCount = val.length;
                                                if  ( clientStimwordCount == 1 )        {

                                                        let clientContextAutoIncr = val[0]['clientContextAutoIncr'];

                                                        deleteClientStimword(parmStimwordPositionAutoIncr, clientContextAutoIncr, parmClientContextError_OLD)
                                                                .then( ()  => { return deleteChildlessClientContext(clientContextAutoIncr, parmClientContextError_OLD);})
                                                                .then( val => { console.log('Done! ' + JSON.stringify(val)); return 0 })
                                                                ;

                                                                                                        /*
                                                                                                        .then( val => {
                                                                                                                        return deleteChildlessClientContext(clientContextAutoIncr, parmClientContextError_OLD);
                                                                                                                });
                                                                                                        */
                                                } else {
                                                        console.log('cannot find this one for delete!');
                                                }
                                        })
                        }
                }
        });

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
                        deleteChildlessClientContext(OLD)
                } else {
                        throw missing error
                }

        case   ( OLD NOT <blank> && NEW == <blank> )      {
                                                                //      make sure OLD exists ????
                DELETE clientStimword(OLD)
                deleteChildlessClientContext(OLD)
        }
*/

function selectClientContextStimword(clientContextError, clientSessionAutoIncr, stimwordPositionAutoIncr)       {

        console.log('                                   in selectClientContextStimword!');
        console.log('                                   in selectClientContextStimword!');
        console.log('clientContextError:       ' + clientContextError);
        console.log('clientSessionAutoIncr:    ' + clientSessionAutoIncr);
        console.log('stimwordPositionAutoIncr: ' + stimwordPositionAutoIncr);
        console.log('                                   in selectClientContextStimword!');
        console.log('                                   in selectClientContextStimword!');

                                                        //      https://stackify.dev/136700-knex-js-how-to-select-columns-from-multiple-tables
                                                        //      https://stackoverflow.com/questions/65413824/multiple-count-and-left-joins-in-mysql-node-using-knex
        return knex
                                                                                //.count          ('* as clientContextStimwordCount')
                .select         ('clientContext.clientContextAutoIncr')
                .from           ('clientStimword')
                .innerJoin      ('clientContext', 'clientContext.clientContextAutoIncr', 'clientStimword.clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientContextError'            : clientContextError            })
                .andWhere       ({'clientContext.clientSessionAutoIncr'         : clientSessionAutoIncr         })
                .andWhere       ({'clientStimword.stimwordPositionAutoIncr'     : stimwordPositionAutoIncr      })
                                                                                                //.then( val => { console.log('inside of returnClientContextCount()! ' + JSON.stringify(val)); return val[0]; } )
                ;
                                /*
                                        SELECT clientContext.clientContextAutoIncr
                                        FROM clientStimword
                                        INNER JOIN clientContext
                                        ON clientContext.clientContextAutoIncr = clientStimword.clientContextAutoIncr
                                        WHERE 1
                                        AND clientContext.clientSessionAutoIncr = 2349
                                        AND clientStimword.stimwordPositionAutoIncr = 285
                                        AND clientContext.clientContextError   = 'def'
                                */
}


function selectClientContext(clientContextError, clientSessionAutoIncr, contextAutoIncr)        {
                                                //      https://stackoverflow.com/questions/21979388/get-count-result-with-knex-js-bookshelf-js
                                                //      https://stackoverflow.com/questions/53751587/knex-js-or-inside-where
                                                //      https://stackoverflow.com/questions/54407751/how-to-add-two-bind-params-in-knex/54422388
                                                //      https://stackoverflow.com/questions/47464078/mysql-insert-with-multiple-selects-with-differing-number-of-returned-columns
                                                //      https://stackoverflow.com/questions/30945104/db-raw-with-more-than-one-paremter-with-knex
        return knex
                .from           ('clientContext')
                .select         ('clientContext.clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientContextError'    : clientContextError            })
                .andWhere       ({'clientContext.clientSessionAutoIncr' : clientSessionAutoIncr         })
                .andWhere       ({'clientContext.contextAutoIncr'       : contextAutoIncr               })
                ;
}


function insertClientContext(val, clientContextError, contextAutoIncr, clientSessionAutoIncr)   {

        let insertClientContextParms =
                {       'clientContextError'                    :       clientContextError
                ,       'contextAutoIncr'                       :       contextAutoIncr
                ,       'clientSessionAutoIncr'                 :       clientSessionAutoIncr
                ,       'clientContextErrorSpeakingCount'       :       0
                ,       'frequency'                             :       ''
                ,       'clientContextErrorNotes'               :       null
                }
                ;
        console.log('parms: ' + JSON.stringify(insertClientContextParms));

        return knex.raw(insertClientContextStatement, insertClientContextParms);
}

function insertClientStimword(clientContextAutoIncr, stimwordPositionAutoIncr, clientStimwordNotes)     {

        let insertClientStimwordParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'stimwordPositionAutoIncr'              :       stimwordPositionAutoIncr
                ,       'clientStimwordNotes'                   :       clientStimwordNotes
                }
                ;
        console.log('parms: ' + JSON.stringify(insertClientStimwordParms));

        return knex.raw(insertClientStimwordStatement, insertClientStimwordParms);
}


function returnContextAutoIncr(stimwordPositionAutoIncr)        {
                                                        //      https://stackoverflow.com/questions/48558183/knex-select-result-return-to-a-variable
        return knex.from('stimwordPosition')
                .select('contextAutoIncr')
                .where ({ 'stimwordPositionAutoIncr': stimwordPositionAutoIncr })
                .then( val => { console.log('bbbbbbb returnContextAutoIncr value is: ' + JSON.stringify(val[0])); return val[0]; } )
                ;
}


function updateClientStimword   (parmObject)    {

console.log('inside of  updateClientStimword!');
//                                                                                                              (       clientContextAutoIncrOld        /* 1 */
//                                                                                                              ,       clientContextAutoIncrNew        /* 2 */
//                                                                                                              ,       stimwordPositionAutoIncr        /* 3 */
//                                                                                                              ,       clientContextErrorOld           /* 4 */
//                                                                                                              ,       clientContextErrorNew           /* 5 */
//                                                                                                              ,       clientStimwordNotes             /* 6 */
//                                                                                                              )       {
//
/*

                                                                                console.log('clientContextAutoIncrOld:');
                                                                                console.log(typeof clientContextAutoIncrOld);
                                                                                console.log(clientContextAutoIncrOld);

                                                                                console.log('clientContextAutoIncrNew:');
                                                                                console.log(typeof clientContextAutoIncrNew);
                                                                                console.log(clientContextAutoIncrNew);

                                                                                console.log('stimwordPositionAutoIncr:');
                                                                                console.log(typeof stimwordPositionAutoIncr);
                                                                                console.log(stimwordPositionAutoIncr);
                                                                                p
                                                                                console.log('clientContextErrorOld:');
                                                                                console.log(typeof clientContextErrorOld);
                                                                                console.log(clientContextErrorOld);

                                                                                console.log('clientContextErrorNew:');
                                                                                console.log(typeof clientContextErrorNew);
                                                                                console.log(clientContextErrorNew);

                                                                                console.log('clientStimwordNotes:');
                                                                                console.log(typeof clientStimwordNotes);
                                                                                console.log(clientStimwordNotes);


                                                                                        console.log(clientContextAutoIncrOld, clientContextAutoIncrNew, stimwordPositionAutoIncr, clientContextErrorOld, clientContextErrorNew, clientStimwordNotes)    ;
                                                                                        console.log(clientContextAutoIncrOld, clientContextAutoIncrNew, stimwordPositionAutoIncr, clientContextErrorOld, clientContextErrorNew, clientStimwordNotes)    ;
                                                                                //undefined 285 abc def my client stimword notes undefined
                                                                                                                */
console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
console.log('JSON.stringify(parmObject):');
console.log(typeof parmObject);
console.log(JSON.stringify(parmObject));
console.log(JSON.stringify(parmObject));

console.log('parmObject.stimwordPositionAutoIncr:');
console.log(parmObject.stimwordPositionAutoIncr);

console.log('parmObject.clientContextAutoIncr_OLD:');
console.log(parmObject.clientContextAutoIncr_OLD);

console.log('parmObject.clientContextAutoIncr_NEW:');
console.log(parmObject.clientContextAutoIncr_NEW);

console.log('parmObject.clientContextError_OLD:');
console.log(parmObject.clientContextError_OLD);

console.log('parmObject.clientContextError_NEW:');
console.log(parmObject.clientContextError_NEW);

console.log('parmObject.clientStimwordNotes:');
console.log(parmObject.clientStimwordNotes);



        let updateClientStimwordWhereParms =
                {       'stimwordPositionAutoIncr'      :       parmObject.stimwordPositionAutoIncr
                ,       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_OLD
                ,       'clientContextError'            :       parmObject.clientContextError_OLD
                };

console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
console.log('JSON.stringify(updateClientStimwordWhereParms):');
console.log(JSON.stringify(updateClientStimwordWhereParms));

/*
yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
JSON.stringify(updateClientStimwordWhereParms):
{"clientContextAutoIncr":3043070}
*/



        let updateClientStimwordUpdateParms =
                {       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_NEW
                ,       'clientContextError'            :       parmObject.clientContextError_NEW
                ,       'clientStimwordNotes'           :       parmObject.clientStimwordNotes
                };

console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
console.log('JSON.stringify(updateClientStimwordUpdateParms):');
console.log(JSON.stringify(updateClientStimwordUpdateParms));

        return knex
                .from('clientStimword')
                .where(updateClientStimwordWhereParms)
                .update(updateClientStimwordUpdateParms)
                ;

                                        /*
                                        knex('books')
                                          .where('published_date', '<', 2000)
                                          .update({
                                            status: 'archived',
                                            thisKeyIsSkipped: undefined
                                          })
                                        */
}

function deleteClientStimword(stimwordPositionAutoIncr, clientContextAutoIncr, clientContextError)      {
        let deleteClientStimwordParms =
                {       'stimwordPositionAutoIncr'      :       stimwordPositionAutoIncr
                ,       'clientContextAutoIncr'         :       clientContextAutoIncr
                ,       'clientContextError'            :       clientContextError
                };
        return knex
                .from('clientStimword')
                .where(deleteClientStimwordParms)
                .delete()
                ;
}


function deleteChildlessClientContext(clientContextAutoIncr, clientContextError)        {
        let deleteClientContextParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'clientContextError'                    :       clientContextError
                ,       'clientContextErrorNotes'               :       null
                ,       'frequency'                             :       ''
                ,       'clientContextErrorSpeakingCount'       :       0
                };
console.log(JSON.stringify(deleteClientContextParms));
console.log(JSON.stringify(deleteClientContextParms));
console.log(JSON.stringify(deleteClientContextParms));
console.log(JSON.stringify(deleteClientContextParms));
console.log(JSON.stringify(deleteClientContextParms));
        return knex
                .from('clientContext')
                .where(deleteClientContextParms)
                .delete()
                ;
                                                                                                        /*
                                                                                                        if      (       clientContext.clientContextErrorNotes(OLD)      blank?
                                                                                                                &&      clientContext.clientContextFrequency            blank?
                                                                                                                &&      clientContext.clientContextErrorSpeakingCount   zero?
                                                                                                                &&      clientContext(OLD) [clientStimword]             childless?
                                                                                                                )
                                                                                                        {
                                                                                                                                //DELETE clientContext(OLD)
                                                                                                        }
                                                                                                        */
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
        ,               \`clientContextError\`
        ,               \`clientContextErrorSpeakingCount\`
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
                ,               :clientContextError
                ,               :clientContextErrorSpeakingCount
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
                //   can we use \` on RETURNING variable????????????????????????????//
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
        ,       \`stimwordPageNbr\`
        ,       \`stimwordLineNbr\`
        ,       \`stimwordWord\`
        ,       \`stimwordPositionNbr\`
        ,       \`stimwordPositionSetting\`
        ,       \`clientStimwordNotes\`
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
                ,       \`stimwordPosition\`.\`stimwordPageNbr\`
                ,       \`stimwordPosition\`.\`stimwordLineNbr\`
                ,       \`stimwordPosition\`.\`stimwordWord\`
                ,       \`stimwordPosition\`.\`stimwordPositionNbr\`
                ,       \`stimwordPosition\`.\`stimwordPositionSetting\`
                ,       :clientStimwordNotes
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
                //   can we use \` on RETURNING variable????????????????????????????//
};





/*






*/


//      mariadb  --host=localhost --user=knexUser  --password=knexPassword    knexDb    ;
//      mariadb  --host=localhost --user=kenxUser  --password=knexPassword    comptonTransAnlys

/*
function firstPromise(promiseInput)     {
        console.log('parameter passed into first promise: ' + promiseInput);
        return  knex.raw("SELECT VERSION()")    ;
}
function secondPromise(promiseInput)    {
        console.log('result of first promise into second promise: ' + JSON.stringify(promiseInput));
        return ('second promise added to promiseInput. ' + promiseInput);
}
/*
firstPromise('promise input!')
        .then(secondPromise)
        .catch(console.log('error!'))
        ;
*/


                                                                                                                /*
                                                                                                                const myArgs = process.argv.slice(2);
                                                                                                                console.log('myArgs: ', myArgs);

                                                                                                                console.log('start:');
                                                                                                                console.log(myArgs[0].clientSessionAutoIncr);
                                                                                                                console.log(myArgs[0].clientPositionAutoIncr);
                                                                                                                console.log(JSON.parse(myArgs[0]));

                                                                                                                console.log(
                                                                                                                        parmClientSessionAutoIncr
                                                                                                                ,       parmStimwordPositionAutoIncr
                                                                                                                ,       parmClientContextError_OLD
                                                                                                                ,       parmClientContextError_NEW
                                                                                                                ,       parmClientStimwordNotes
                                                                                                                );

                                                                                                                */


/*
firstPromise('promise input!')
        .then(  (response)      =>      {       console.log     ('response from firstPromise: ' + response)     ;
                                                return response                                                 ;
                                        }                                                                               )
        .then(  (newResponse)   =>      console.log     ('ending! ' + newResponse)                                      )
        .then(  ()              =>      knex.destroy()                                                                  )
        .then(  ()              =>      secondPromise('stuff into second promise')
                                                .then((result) => { console.log('calling second promise: ' + result); return (result);} )       )
        .then(  (lastResponse)  =>      console.log     ('last response: ' + lastResponse)                              )
        .catch( (error)         =>      console.log     ('error! ' + error)                                             )
        ;


        if  ( NEW != <blank> )      {
                if  ( clientStimwordCount(NEW) == 0 )   {
                        if  ( clientContext(NEW) NOT exists )   {
                            INSERT clientContext(NEW)
                        }
                        if  ( NEW != <blank> && OLD == <blank> ) {
                                INSERT clientStimword(NEW)
                        } else {
                                if  ( clientStimwordCount(OLD) EXISTS ) {
                                        MODIFY clientStimword(OLD) to clientStimword(NEW)
                                }
                                deleteChildlessClientContext(OLD)
                        }
                } else {        // duplicate!!
                        throw dup error
                }
        } else if  ( OLD  != <blank> && NEW == <blank> )  {
                                                                //      make sure OLD exists ????
                DELETE clientStimword(OLD)
                deleteChildlessClientContext(OLD)
        }

                                                                /*
                                                                const firstPromise = ( promiseInput )   =>      {
                                                                        return new Promise((resolve, reject) => {
                                                                                console.log('parameter passed into promise: ' + promiseInput);

                                                                                knex.raw("SELECT VERSION()")
                                                                                .then(
                                                                                    (version) => {      console.log     ('inside:  ' + version[0][0]["VERSION()"] );
                                                                                                        resolve         ('outside: ' + version[0][0]["VERSION()"] );
                                                                                                }
                                                                                ).catch(
                                                                                        (err) => { reject(err); }
                                                                                )
                                                                        })
                                                                }

                                                                const secondPromise = ( input ) =>              {
                                                                        return new Promise (    (resolve, reject) => {
                                                                                resolve (input) ;
                                                                        })
                                                                }
*/
[root@localhost knex]#








=====  2022-02-11


//       node  clientStimword.js  '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 284, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def", "clientStimwordNotes" : "my client stimword notes"}'

//      contextAutoIncr = 74 when stimwordPosition is 283/284
//      contextAutoIncr = 56 when stimwordPosition is 285   !!

console.log(process.argv)       ;

var     myArgs                          = JSON.parse(process.argv.slice(2)[0])  ;
const   parmClientSessionAutoIncr       = myArgs.clientSessionAutoIncr          ;
const   parmStimwordPositionAutoIncr    = myArgs.stimwordPositionAutoIncr       ;
const   parmClientContextError_OLD      = myArgs.clientContextError_OLD         ;
const   parmClientContextError_NEW      = myArgs.clientContextError_NEW         ;
const   parmClientStimwordNotes         = myArgs.clientStimwordNotes            ;

const knexConnectOptions = {
  client: 'mysql',
  debug: true,
  connection: 'mysql://knexUser:knexPassword@localhost:3306/comptonTransAnlys'
};

const knex = require('knex')(knexConnectOptions);

                                //      https://javascript.info/promise-basics
                                //      https://stackoverflow.com/questions/35318442/how-to-pass-parameter-to-a-promise-function
                                //      https://stackoverflow.com/questions/33257412/how-to-handle-the-if-else-in-promise-then?rq=1





const   insertClientContextStatement =  returnInsertClientContextStatement();

const   insertClientStimwordStatement   = returnInsertClientStimwordStatement();


console.log('Starting run.');

console.log('000000 calling returnContextAutoIncr using: ' + parmStimwordPositionAutoIncr);

returnContextAutoIncr(parmStimwordPositionAutoIncr)
        .then( val =>   {
                let contextAutoIncr = val.contextAutoIncr ;

                switch(true)    {

                                        /*

                                                OLD is blank,   NEW is filled in

                                        */

                        case ( parmClientContextError_OLD  == ''  &&    parmClientContextError_NEW != ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_NEW, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {

                                                let clientStimwordCount = val.length ;
                                                if  ( clientStimwordCount == 0 )        {
                                                        selectClientContext(parmClientContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  {
                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                                        return  returnArray;
                                                                                } else {
                                                                                        return insertClientContext(val, parmClientContextError_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                                                }
                                                                        })
                                                                .then( val =>  {
                                                                        let clientContextAutoIncr;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                console.log('ERROR!');
                                                                                console.log(JSON.stringify(val));
                                                                                return 0;
                                                                        }
                                                                        insertClientStimword(clientContextAutoIncr, parmStimwordPositionAutoIncr, parmClientStimwordNotes)
                                                                                .then( val => { console.log(JSON.stringify(val));});
                                                                });
                                                } else {
                                                        console.log('duplicate error!  returning....');
                                                        return 0;
                                                }

                                        })                                                      // end selectClientContextStimword(NEW)
                                        .catch( err => { console.log(err); return 0; })
                                        ;
                                break;  // should NEVER get here.....????
                        }

                                        /*

                                                OLD is filled in,   NEW is filled in

                                        */

                        case ( parmClientContextError_OLD  != ''  &&    parmClientContextError_NEW != ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {

                                                let clientStimwordCount = val.length;
                                                if  ( clientStimwordCount == 1 )        {


                                                        let clientContextAutoIncr_OLD = val[0]['clientContextAutoIncr'];

                                                        selectClientContext(parmClientContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  {
                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                                        return  returnArray;
                                                                                } else {
                                                                                        return insertClientContext(val, parmClientContextError_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                                                }
                                                                        })

                                                                .then( val =>  {

                                                                        let clientContextAutoIncr_NEW;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr_NEW = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                console.log('ERROR!');
                                                                                console.log(JSON.stringify(val));
                                                                                return 0;
                                                                        }

                                                                        let updateClientStimwordParms =
                                                                                                        {       'clientContextAutoIncr_OLD'     :       clientContextAutoIncr_OLD
                                                                                                        ,       'clientContextAutoIncr_NEW'     :       clientContextAutoIncr_NEW
                                                                                                        ,       'stimwordPositionAutoIncr'      :       parmStimwordPositionAutoIncr
                                                                                                        ,       'clientContextError_OLD'        :       parmClientContextError_OLD
                                                                                                        ,       'clientContextError_NEW'        :       parmClientContextError_NEW
                                                                                                        ,       'clientStimwordNotes'           :       parmClientStimwordNotes
                                                                                                        }
                                                                                                        ;

                                                                        updateClientStimword    (updateClientStimwordParms)

                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                .then( val => { console.log('about to run selectClientContextStimword!'); return selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)})
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                                                                                // ?????????????????????????????????????????????????????
                                                                                .then( val => {

                                                                                        let clientStimwordCount;
                                                                                        switch (true)
                                                                                        {
                                                                                        case    ( typeof val === 'number'                                                               ) :
                                                                                                clientStimwordCount = val                                       ;
                                                                                                break                                                           ;
                                                                                        case    ( typeof val === 'object'       &&  val.length == 0                                     ) :
                                                                                                clientStimwordCount = 0                                         ;
                                                                                                break                                                           ;
                                                                                        case    ( typeof val === 'object'       &&  val[0]['clientContextStimwordCount'] === 'numeric'  ) :
                                                                                                clientStimwordCount = val[0]['clientContextStimwordCount']      ;
                                                                                                break                                                           ;
                                                                                        default:
                                                                                                console.log('error! ' + JSON.stringify(val));
                                                                                        }

                                                                                        if  ( clientStimwordCount == 0 )        {
                                                                                                deleteChildlessClientContext(clientContextAutoIncr_OLD, parmClientContextError_OLD)
                                                                                                        .then( val => { console.log('delete result: ' + JSON.stringify(val)); return 0} )
                                                                                                        ;
                                                                                        } else {
                                                                                                return 0;
                                                                                        }
                                                                                });
                                                                })

                                                } else {
                                                        console.log('rejecting, cannot find ' + parmClientContextError_OLD );
                                                        return 0;
                                                }
                                        })                                              // end selectClientContextStimword(OLD)
                                break;  // should NEVER get here.....????
                        }

                                        /*

                                                OLD is filled in,   NEW is BLANK!

                                        */

                        case ( parmClientContextError_OLD  != ''  &&    parmClientContextError_NEW == ''        )       :
                        {
                                selectClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {

                                                let clientStimwordCount = val.length;
                                                if  ( clientStimwordCount == 1 )        {

                                                        let clientContextAutoIncr = val[0]['clientContextAutoIncr'];

                                                        deleteClientStimword(parmStimwordPositionAutoIncr, clientContextAutoIncr, parmClientContextError_OLD)
                                                                .then( ()  => { return deleteChildlessClientContext(clientContextAutoIncr, parmClientContextError_OLD);})
                                                                .then( val => { console.log('Done! ' + JSON.stringify(val)); return 0 })
                                                                ;

                                                                                                        /*
                                                                                                        .then( val => {
                                                                                                                        return deleteChildlessClientContext(clientContextAutoIncr, parmClientContextError_OLD);
                                                                                                                });
                                                                                                        */
                                                } else {
                                                        console.log('cannot find this one for delete!');
                                                }
                                        })
                        }
                }
        });

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
                        deleteChildlessClientContext(OLD)
                } else {
                        throw missing error
                }

        case   ( OLD NOT <blank> && NEW == <blank> )      {
                                                                //      make sure OLD exists ????
                DELETE clientStimword(OLD)
                deleteChildlessClientContext(OLD)
        }
*/

function selectClientContextStimword(clientContextError, clientSessionAutoIncr, stimwordPositionAutoIncr)       {

        console.log('                                   in selectClientContextStimword!');
        console.log('                                   in selectClientContextStimword!');
        console.log('clientContextError:       ' + clientContextError);
        console.log('clientSessionAutoIncr:    ' + clientSessionAutoIncr);
        console.log('stimwordPositionAutoIncr: ' + stimwordPositionAutoIncr);
        console.log('                                   in selectClientContextStimword!');
        console.log('                                   in selectClientContextStimword!');

                                                        //      https://stackify.dev/136700-knex-js-how-to-select-columns-from-multiple-tables
                                                        //      https://stackoverflow.com/questions/65413824/multiple-count-and-left-joins-in-mysql-node-using-knex
        return knex
                                                                                //.count          ('* as clientContextStimwordCount')
                .select         ('clientContext.clientContextAutoIncr')
                .from           ('clientStimword')
                .innerJoin      ('clientContext', 'clientContext.clientContextAutoIncr', 'clientStimword.clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientContextError'            : clientContextError            })
                .andWhere       ({'clientContext.clientSessionAutoIncr'         : clientSessionAutoIncr         })
                .andWhere       ({'clientStimword.stimwordPositionAutoIncr'     : stimwordPositionAutoIncr      })
                                                                                                //.then( val => { console.log('inside of returnClientContextCount()! ' + JSON.stringify(val)); return val[0]; } )
                ;
                                /*
                                        SELECT clientContext.clientContextAutoIncr
                                        FROM clientStimword
                                        INNER JOIN clientContext
                                        ON clientContext.clientContextAutoIncr = clientStimword.clientContextAutoIncr
                                        WHERE 1
                                        AND clientContext.clientSessionAutoIncr = 2349
                                        AND clientStimword.stimwordPositionAutoIncr = 285
                                        AND clientContext.clientContextError   = 'def'
                                */
}


function selectClientContext(clientContextError, clientSessionAutoIncr, contextAutoIncr)        {
                                                //      https://stackoverflow.com/questions/21979388/get-count-result-with-knex-js-bookshelf-js
                                                //      https://stackoverflow.com/questions/53751587/knex-js-or-inside-where
                                                //      https://stackoverflow.com/questions/54407751/how-to-add-two-bind-params-in-knex/54422388
                                                //      https://stackoverflow.com/questions/47464078/mysql-insert-with-multiple-selects-with-differing-number-of-returned-columns
                                                //      https://stackoverflow.com/questions/30945104/db-raw-with-more-than-one-paremter-with-knex
        return knex
                .from           ('clientContext')
                .select         ('clientContext.clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientContextError'    : clientContextError            })
                .andWhere       ({'clientContext.clientSessionAutoIncr' : clientSessionAutoIncr         })
                .andWhere       ({'clientContext.contextAutoIncr'       : contextAutoIncr               })
                ;
}


function insertClientContext(val, clientContextError, contextAutoIncr, clientSessionAutoIncr)   {

        let insertClientContextParms =
                {       'clientContextError'                    :       clientContextError
                ,       'contextAutoIncr'                       :       contextAutoIncr
                ,       'clientSessionAutoIncr'                 :       clientSessionAutoIncr
                ,       'clientContextErrorSpeakingCount'       :       0
                ,       'frequency'                             :       ''
                ,       'clientContextErrorNotes'               :       null
                }
                ;
        console.log('parms: ' + JSON.stringify(insertClientContextParms));

        return knex.raw(insertClientContextStatement, insertClientContextParms);
}

function insertClientStimword(clientContextAutoIncr, stimwordPositionAutoIncr, clientStimwordNotes)     {

        let insertClientStimwordParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'stimwordPositionAutoIncr'              :       stimwordPositionAutoIncr
                ,       'clientStimwordNotes'                   :       clientStimwordNotes
                }
                ;
        console.log('parms: ' + JSON.stringify(insertClientStimwordParms));

        return knex.raw(insertClientStimwordStatement, insertClientStimwordParms);
}


function returnContextAutoIncr(stimwordPositionAutoIncr)        {
                                                        //      https://stackoverflow.com/questions/48558183/knex-select-result-return-to-a-variable
        return knex.from('stimwordPosition')
                .select('contextAutoIncr')
                .where ({ 'stimwordPositionAutoIncr': stimwordPositionAutoIncr })
                .then( val => { console.log('bbbbbbb returnContextAutoIncr value is: ' + JSON.stringify(val[0])); return val[0]; } )
                ;
}


function updateClientStimword   (parmObject)    {

console.log('inside of  updateClientStimword!');
//                                                                                                              (       clientContextAutoIncrOld        /* 1 */
//                                                                                                              ,       clientContextAutoIncrNew        /* 2 */
//                                                                                                              ,       stimwordPositionAutoIncr        /* 3 */
//                                                                                                              ,       clientContextErrorOld           /* 4 */
//                                                                                                              ,       clientContextErrorNew           /* 5 */
//                                                                                                              ,       clientStimwordNotes             /* 6 */
//                                                                                                              )       {
//
/*

                                                                                console.log('clientContextAutoIncrOld:');
                                                                                console.log(typeof clientContextAutoIncrOld);
                                                                                console.log(clientContextAutoIncrOld);

                                                                                console.log('clientContextAutoIncrNew:');
                                                                                console.log(typeof clientContextAutoIncrNew);
                                                                                console.log(clientContextAutoIncrNew);

                                                                                console.log('stimwordPositionAutoIncr:');
                                                                                console.log(typeof stimwordPositionAutoIncr);
                                                                                console.log(stimwordPositionAutoIncr);
                                                                                p
                                                                                console.log('clientContextErrorOld:');
                                                                                console.log(typeof clientContextErrorOld);
                                                                                console.log(clientContextErrorOld);

                                                                                console.log('clientContextErrorNew:');
                                                                                console.log(typeof clientContextErrorNew);
                                                                                console.log(clientContextErrorNew);

                                                                                console.log('clientStimwordNotes:');
                                                                                console.log(typeof clientStimwordNotes);
                                                                                console.log(clientStimwordNotes);


                                                                                        console.log(clientContextAutoIncrOld, clientContextAutoIncrNew, stimwordPositionAutoIncr, clientContextErrorOld, clientContextErrorNew, clientStimwordNotes)    ;
                                                                                        console.log(clientContextAutoIncrOld, clientContextAutoIncrNew, stimwordPositionAutoIncr, clientContextErrorOld, clientContextErrorNew, clientStimwordNotes)    ;
                                                                                //undefined 285 abc def my client stimword notes undefined
                                                                                                                */
console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
console.log('JSON.stringify(parmObject):');
console.log(typeof parmObject);
console.log(JSON.stringify(parmObject));
console.log(JSON.stringify(parmObject));

console.log('parmObject.stimwordPositionAutoIncr:');
console.log(parmObject.stimwordPositionAutoIncr);

console.log('parmObject.clientContextAutoIncr_OLD:');
console.log(parmObject.clientContextAutoIncr_OLD);

console.log('parmObject.clientContextAutoIncr_NEW:');
console.log(parmObject.clientContextAutoIncr_NEW);

console.log('parmObject.clientContextError_OLD:');
console.log(parmObject.clientContextError_OLD);

console.log('parmObject.clientContextError_NEW:');
console.log(parmObject.clientContextError_NEW);

console.log('parmObject.clientStimwordNotes:');
console.log(parmObject.clientStimwordNotes);



        let updateClientStimwordWhereParms =
                {       'stimwordPositionAutoIncr'      :       parmObject.stimwordPositionAutoIncr
                ,       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_OLD
                ,       'clientContextError'            :       parmObject.clientContextError_OLD
                };

console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
console.log('JSON.stringify(updateClientStimwordWhereParms):');
console.log(JSON.stringify(updateClientStimwordWhereParms));

/*
yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
JSON.stringify(updateClientStimwordWhereParms):
{"clientContextAutoIncr":3043070}
*/



        let updateClientStimwordUpdateParms =
                {       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_NEW
                ,       'clientContextError'            :       parmObject.clientContextError_NEW
                ,       'clientStimwordNotes'           :       parmObject.clientStimwordNotes
                };

console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
console.log('JSON.stringify(updateClientStimwordUpdateParms):');
console.log(JSON.stringify(updateClientStimwordUpdateParms));

        return knex
                .from('clientStimword')
                .where(updateClientStimwordWhereParms)
                .update(updateClientStimwordUpdateParms)
                ;

                                        /*
                                        knex('books')
                                          .where('published_date', '<', 2000)
                                          .update({
                                            status: 'archived',
                                            thisKeyIsSkipped: undefined
                                          })
                                        */
}

function deleteClientStimword(stimwordPositionAutoIncr, clientContextAutoIncr, clientContextError)      {
        let deleteClientStimwordParms =
                {       'stimwordPositionAutoIncr'      :       stimwordPositionAutoIncr
                ,       'clientContextAutoIncr'         :       clientContextAutoIncr
                ,       'clientContextError'            :       clientContextError
                };
        return knex
                .from('clientStimword')
                .where(deleteClientStimwordParms)
                .delete()
                ;
}


function deleteChildlessClientContext(clientContextAutoIncr, clientContextError)        {
        let deleteClientContextParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'clientContextError'                    :       clientContextError
                ,       'clientContextErrorNotes'               :       null
                ,       'frequency'                             :       ''
                ,       'clientContextErrorSpeakingCount'       :       0
                };
console.log(JSON.stringify(deleteClientContextParms));
console.log(JSON.stringify(deleteClientContextParms));
console.log(JSON.stringify(deleteClientContextParms));
console.log(JSON.stringify(deleteClientContextParms));
console.log(JSON.stringify(deleteClientContextParms));
        return knex
                .from('clientContext')
                .where(deleteClientContextParms)
                .delete()
                ;
                                                                                                        /*
                                                                                                        if      (       clientContext.clientContextErrorNotes(OLD)      blank?
                                                                                                                &&      clientContext.clientContextFrequency            blank?
                                                                                                                &&      clientContext.clientContextErrorSpeakingCount   zero?
                                                                                                                &&      clientContext(OLD) [clientStimword]             childless?
                                                                                                                )
                                                                                                        {
                                                                                                                                //DELETE clientContext(OLD)
                                                                                                        }
                                                                                                        */
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
        ,               \`clientContextError\`
        ,               \`clientContextErrorSpeakingCount\`
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
                ,               :clientContextError
                ,               :clientContextErrorSpeakingCount
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
                //   can we use \` on RETURNING variable????????????????????????????//
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
        ,       \`stimwordPageNbr\`
        ,       \`stimwordLineNbr\`
        ,       \`stimwordWord\`
        ,       \`stimwordPositionNbr\`
        ,       \`stimwordPositionSetting\`
        ,       \`clientStimwordNotes\`
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
                ,       \`stimwordPosition\`.\`stimwordPageNbr\`
                ,       \`stimwordPosition\`.\`stimwordLineNbr\`
                ,       \`stimwordPosition\`.\`stimwordWord\`
                ,       \`stimwordPosition\`.\`stimwordPositionNbr\`
                ,       \`stimwordPosition\`.\`stimwordPositionSetting\`
                ,       :clientStimwordNotes
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
                //   can we use \` on RETURNING variable????????????????????????????//
};





/*






*/


//      mariadb  --host=localhost --user=knexUser  --password=knexPassword    knexDb    ;
//      mariadb  --host=localhost --user=kenxUser  --password=knexPassword    comptonTransAnlys

/*
function firstPromise(promiseInput)     {
        console.log('parameter passed into first promise: ' + promiseInput);
        return  knex.raw("SELECT VERSION()")    ;
}
function secondPromise(promiseInput)    {
        console.log('result of first promise into second promise: ' + JSON.stringify(promiseInput));
        return ('second promise added to promiseInput. ' + promiseInput);
}
/*
firstPromise('promise input!')
        .then(secondPromise)
        .catch(console.log('error!'))
        ;
*/


                                                                                                                /*
                                                                                                                const myArgs = process.argv.slice(2);
                                                                                                                console.log('myArgs: ', myArgs);

                                                                                                                console.log('start:');
                                                                                                                console.log(myArgs[0].clientSessionAutoIncr);
                                                                                                                console.log(myArgs[0].clientPositionAutoIncr);
                                                                                                                console.log(JSON.parse(myArgs[0]));

                                                                                                                console.log(
                                                                                                                        parmClientSessionAutoIncr
                                                                                                                ,       parmStimwordPositionAutoIncr
                                                                                                                ,       parmClientContextError_OLD
                                                                                                                ,       parmClientContextError_NEW
                                                                                                                ,       parmClientStimwordNotes
                                                                                                                );

                                                                                                                */


/*
firstPromise('promise input!')
        .then(  (response)      =>      {       console.log     ('response from firstPromise: ' + response)     ;
                                                return response                                                 ;
                                        }                                                                               )
        .then(  (newResponse)   =>      console.log     ('ending! ' + newResponse)                                      )
        .then(  ()              =>      knex.destroy()                                                                  )
        .then(  ()              =>      secondPromise('stuff into second promise')
                                                .then((result) => { console.log('calling second promise: ' + result); return (result);} )       )
        .then(  (lastResponse)  =>      console.log     ('last response: ' + lastResponse)                              )
        .catch( (error)         =>      console.log     ('error! ' + error)                                             )
        ;


        if  ( NEW != <blank> )      {
                if  ( clientStimwordCount(NEW) == 0 )   {
                        if  ( clientContext(NEW) NOT exists )   {
                            INSERT clientContext(NEW)
                        }
                        if  ( NEW != <blank> && OLD == <blank> ) {
                                INSERT clientStimword(NEW)
                        } else {
                                if  ( clientStimwordCount(OLD) EXISTS ) {
                                        MODIFY clientStimword(OLD) to clientStimword(NEW)
                                }
                                deleteChildlessClientContext(OLD)
                        }
                } else {        // duplicate!!
                        throw dup error
                }
        } else if  ( OLD  != <blank> && NEW == <blank> )  {
                                                                //      make sure OLD exists ????
                DELETE clientStimword(OLD)
                deleteChildlessClientContext(OLD)
        }

                                                                /*
                                                                const firstPromise = ( promiseInput )   =>      {
                                                                        return new Promise((resolve, reject) => {
                                                                                console.log('parameter passed into promise: ' + promiseInput);

                                                                                knex.raw("SELECT VERSION()")
                                                                                .then(
                                                                                    (version) => {      console.log     ('inside:  ' + version[0][0]["VERSION()"] );
                                                                                                        resolve         ('outside: ' + version[0][0]["VERSION()"] );
                                                                                                }
                                                                                ).catch(
                                                                                        (err) => { reject(err); }
                                                                                )
                                                                        })
                                                                }

                                                                const secondPromise = ( input ) =>              {
                                                                        return new Promise (    (resolve, reject) => {
                                                                                resolve (input) ;
                                                                        })
                                                                }





=====  2022-02-10



//       node  clientStimword.js  '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 284, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def", "clientStimwordNotes" : "my client stimword notes"}'

//      contextAutoIncr = 74 when stimwordPosition is 283/284
//      contextAutoIncr = 56 when stimwordPosition is 285   !!

console.log(process.argv)       ;

var     myArgs                          = JSON.parse(process.argv.slice(2)[0])  ;
const   parmClientSessionAutoIncr       = myArgs.clientSessionAutoIncr          ;
const   parmStimwordPositionAutoIncr    = myArgs.stimwordPositionAutoIncr       ;
const   parmClientContextError_OLD      = myArgs.clientContextError_OLD         ;
const   parmClientContextError_NEW      = myArgs.clientContextError_NEW         ;
const   parmClientStimwordNotes         = myArgs.clientStimwordNotes            ;

const knexConnectOptions = {
  client: 'mysql',
  debug: true,
  connection: 'mysql://knexUser:knexPassword@localhost:3306/comptonTransAnlys'
};

const knex = require('knex')(knexConnectOptions);

                                //      https://javascript.info/promise-basics
                                //      https://stackoverflow.com/questions/35318442/how-to-pass-parameter-to-a-promise-function
                                //      https://stackoverflow.com/questions/33257412/how-to-handle-the-if-else-in-promise-then?rq=1





const   insertClientContextStatement =  returnInsertClientContextStatement();

const   insertClientStimwordStatement   = returnInsertClientStimwordStatement();


console.log('Starting run.');

console.log('000000 calling returnContextAutoIncr using: ' + parmStimwordPositionAutoIncr);

returnContextAutoIncr(parmStimwordPositionAutoIncr)
        .then( val =>   {
                let contextAutoIncr = val.contextAutoIncr ;

                switch(true)    {
                        case ( parmClientContextError_OLD  == ''  &&    parmClientContextError_NEW != ''        )       :
                        {
                                countClientContextStimword(parmClientContextError_NEW, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {

                                                let clientStimwordCount = val[0]['clientContextStimwordCount'] ;
                                                if  ( clientStimwordCount == 0 )        {
                                                        selectClientContext(parmClientContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  {
                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                                        return  returnArray;
                                                                                } else {
                                                                                        return insertClientContext(val, parmClientContextError_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                                                }
                                                                        })
                                                                .then( val =>  {
                                                                        let clientContextAutoIncr;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                console.log('ERROR!');
                                                                                console.log(JSON.stringify(val));
                                                                                return 0;
                                                                        }
                                                                        insertClientStimword(clientContextAutoIncr, parmStimwordPositionAutoIncr, parmClientStimwordNotes)
                                                                                .then( val => { console.log(JSON.stringify(val));});
                                                                });
                                                } else {
                                                        console.log('duplicate error!  returning....');
                                                        return 0;
                                                }

                                        })                                                      // end countClientContextStimword(NEW)
                                        .catch( err => { console.log(err); return 0; })
                                        ;
                                break;  // should NEVER get here.....????
                        }

                        case ( parmClientContextError_OLD  != ''  &&    parmClientContextError_NEW != ''        )       :
                        {
                                countClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {
                                                let clientStimwordCount = val[0]['clientContextStimwordCount'] ;
                                                if  ( clientStimwordCount == 1 )        {

                                                        selectClientContext(parmClientContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  {
                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                                                                                        return  returnArray;
                                                                                } else {
                                                                                        return insertClientContext(val, parmClientContextError_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                                                                                }
                                                                        })

                                                                .then( val =>  {

                                                                        let clientContextAutoIncr;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                console.log('ERROR!');
                                                                                console.log(JSON.stringify(val));
                                                                                return 0;
                                                                        }

                                                                        updateClientStimword    (       clientContextAutoIncr
                                                                                                ,       parmStimwordPositionAutoIncr
                                                                                                ,       parmClientContextError_OLD
                                                                                                ,       parmClientContextError_NEW
                                                                                                ,       parmClientStimwordNotes
                                                                                                )
                                                                                .then(countClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr))
                                                                                .then( val => {
console.log('00000000000000');
console.log(JSON.stringify(val));
console.log(JSON.stringify(val));
console.log(JSON.stringify(val));
console.log(JSON.stringify(val));
console.log(JSON.stringify(val));
console.log(typeof val);
console.log(typeof val);
console.log(typeof val);
console.log('00000000000000');
                                                                                        let clientStimwordCount;
                                                                                        if  (typeof val === 'number')   {
console.log('11111111');
                                                                                                clientStimwordCount = val;
                                                                                        } else if  ( typeof val === 'array' &&  val[0]['clientContextStimwordCount'] === 'numeric' ) {
                                                                                                clientStimwordCount = val[0]['clientContextStimwordCount'];
console.log('222222222');
                                                                                        } else {
console.log('error!');
console.log('error!');
                                                                                        }

                                                                                        if  ( clientStimwordCount == 0 )        {
console.log('3333333');
                                                                                                deleteChildlessClientContext(parmClientSessionAutoIncr, parmClientContextError_OLD)
                                                                                                .then( val => { console.log('delete result: ' + JSON.stringify(val)); return 0} );
                                                                                        } else {
console.log('44444444444444444444444444444');
                                                                                                return 0;
                                                                                        }
                                                                                });
                                                                })

                                                } else {
                                                        console.log('rejecting, cannot find ' + parmClientContextError_OLD );
                                                        return 0;
                                                }
                                        })                                              // end countClientContextStimword(OLD)
                                break;  // should NEVER get here.....????
                        }

                        case ( parmClientContextError_OLD  != ''  &&    parmClientContextError_NEW == ''        )       :
                        {
                                console.log ('OLD is filled in, NEW is blank, DELETE clientStimword~!');
                                deleteClientStimword(clientContextAutoIncr, parmClientContextErrror_OLD)
                                .then(countClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr))
                                .then( val => {
                                                let clientStimwordCount = val[0]['clientStimwordCount'] ;
                                                if  ( clientStimwordCount == 0 )        {
                                                        deleteChildlessClientContext(clientContextAutoIncr, parmClientContextError_OLD);
                                                } else {
                                                        return 0;
                                                }
                                        });
                        }
                }
        });

/*
GET contextAutoIncr using stimwordPosition(clientContextAutoIncr)

        switch(true)
        case   ( OLD == <blank> && NEW NOT <blank> )      {
                if  ( countClientContextStimword(NEW) == 0 )    {
                        if  ( clientContext(NEW) NOT exists )   {
                            INSERT clientContext(NEW)
                        }
                        INSERT clientStimword(NEW)
                } else {        // duplicate!!
                        throw dup error
                }
        case   ( OLD NOT <blank> && NEW NOT <blank> )      {

                if  ( countClientContextStimword(OLD) == 1 )    {
                        if  ( clientContext(NEW) NOT exists )   {
                            INSERT clientContext(NEW)
                        }

                        MODIFY clientStimword(OLD) to clientStimword(NEW)
                        deleteChildlessClientContext(OLD)
                } else {
                        throw missing error
                }

        case   ( OLD NOT <blank> && NEW == <blank> )      {
                                                                //      make sure OLD exists ????
                DELETE clientStimword(OLD)
                deleteChildlessClientContext(OLD)
        }
*/

function countClientContextStimword(clientContextError, clientSessionAutoIncr, stimwordPositionAutoIncr)        {

        console.log('in countClientContextStimword!');
        console.log('clientContextError:       ' + clientContextError);
        console.log('clientSessionAutoIncr:    ' + clientSessionAutoIncr);
        console.log('stimwordPositionAutoIncr: ' + stimwordPositionAutoIncr);
console.log('hopefully HERE comes next....');
                                                        //      https://stackify.dev/136700-knex-js-how-to-select-columns-from-multiple-tables
                                                        //      https://stackoverflow.com/questions/65413824/multiple-count-and-left-joins-in-mysql-node-using-knex
        return knex
                .count          ('* as clientContextStimwordCount')
                .from('clientStimword')
                .innerJoin('clientContext', 'clientContext.clientContextAutoIncr', 'clientStimword.clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientContextError'            : clientContextError            })
                .andWhere       ({'clientContext.clientSessionAutoIncr'         : clientSessionAutoIncr         })
                .andWhere       ({'clientStimword.stimwordPositionAutoIncr'     : stimwordPositionAutoIncr      })
                                                                                                //.then( val => { console.log('inside of returnClientContextCount()! ' + JSON.stringify(val)); return val[0]; } )
                ;
                                /*
                                        SELECT COUNT(*)
                                        FROM clientStimword
                                        INNER JOIN clientContext
                                        ON clientContext.clientContextAutoIncr = clientStimword.clientContextAutoIncr
                                        WHERE 1
                                        AND clientContext.clientSessionAutoIncr = 2349
                                        AND clientStimword.stimwordPositionAutoIncr = 285
                                        AND clientContext.clientContextError   = 'def'
                                */
}


function selectClientContext(clientContextError, clientSessionAutoIncr, contextAutoIncr)        {
                                                //      https://stackoverflow.com/questions/21979388/get-count-result-with-knex-js-bookshelf-js
                                                //      https://stackoverflow.com/questions/53751587/knex-js-or-inside-where
                                                //      https://stackoverflow.com/questions/54407751/how-to-add-two-bind-params-in-knex/54422388
                                                //      https://stackoverflow.com/questions/47464078/mysql-insert-with-multiple-selects-with-differing-number-of-returned-columns
                                                //      https://stackoverflow.com/questions/30945104/db-raw-with-more-than-one-paremter-with-knex
        return knex
                .from           ('clientContext')
                .select         ('clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientContextError'    : clientContextError            })
                .andWhere       ({'clientContext.clientSessionAutoIncr' : clientSessionAutoIncr         })
                .andWhere       ({'clientContext.contextAutoIncr'       : contextAutoIncr               })
                ;
}


function insertClientContext(val, clientContextError, contextAutoIncr, clientSessionAutoIncr)   {

        let insertClientContextParms =
                {       'clientContextError'                    :       clientContextError
                ,       'contextAutoIncr'                       :       contextAutoIncr
                ,       'clientSessionAutoIncr'                 :       clientSessionAutoIncr
                ,       'clientContextErrorSpeakingCount'       :       0
                ,       'frequency'                             :       ''
                ,       'clientContextErrorNotes'               :       null
                }
                ;
        console.log('parms: ' + JSON.stringify(insertClientContextParms));

        return knex.raw(insertClientContextStatement, insertClientContextParms);
}

function insertClientStimword(clientContextAutoIncr, stimwordPositionAutoIncr, clientStimwordNotes)     {

        let insertClientStimwordParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'stimwordPositionAutoIncr'              :       stimwordPositionAutoIncr
                ,       'clientStimwordNotes'                   :       clientStimwordNotes
                }
                ;
        console.log('parms: ' + JSON.stringify(insertClientStimwordParms));

        return knex.raw(insertClientStimwordStatement, insertClientStimwordParms);
}


function returnContextAutoIncr(stimwordPositionAutoIncr)        {
                                                        //      https://stackoverflow.com/questions/48558183/knex-select-result-return-to-a-variable
        return knex.from('stimwordPosition')
                .select('contextAutoIncr')
                .where ({ 'stimwordPositionAutoIncr': stimwordPositionAutoIncr })
                .then( val => { console.log('bbbbbbb returnContextAutoIncr value is: ' + JSON.stringify(val[0])); return val[0]; } )
                ;
}

function updateClientStimword(clientContextAutoIncr, stimwordPositionAutoIncr, clientContextError_OLD, clientContextError_NEW, clientStimwordNotes)     {
        console.log('IN updateClientStimword!');
        console.log(clientContextAutoIncr, stimwordPositionAutoIncr, clientContextError_OLD, clientContextError_NEW, clientStimwordNotes)       ;

        let updateClientStimwordWhereParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'stimwordPositionAutoIncr'              :       stimwordPositionAutoIncr
                ,       'clientContextError'                    :       clientContextError_OLD
                };
        let updateClientStimwordUpdateParms =
                {       'clientContextError'                    :       clientContextError_NEW
                ,       'clientStimwordNotes'                   :       clientStimwordNotes
                };
        return knex
                .from('clientStimword')
                .where(updateClientStimwordWhereParms)
                .update(updateClientStimwordUpdateParms)
                ;

                                        /*
                                        knex('books')
                                          .where('published_date', '<', 2000)
                                          .update({
                                            status: 'archived',
                                            thisKeyIsSkipped: undefined
                                          })
                                        */
}

function deleteChildlessClientContext(clientSessionAutoIncr, clientContextError)        {
        let deleteClientContextParms =
                {       'clientSessionAutoIncr'                 :       clientSessionAutoIncr
                ,       'clientContextError'                    :       clientContextError
                ,       'clientContextErrorNotes'               :       null
                ,       'frequency'                             :       ''
                ,       'clientContextErrorSpeakingCount'       :       0
                };
        return knex
                .from('clientContext')
                .where(deleteClientContextParms)
                .delete()
                ;
                                                                                                        /*
                                                                                                        if      (       clientContext.clientContextErrorNotes(OLD)      blank?
                                                                                                                &&      clientContext.clientContextFrequency            blank?
                                                                                                                &&      clientContext.clientContextErrorSpeakingCount   zero?
                                                                                                                &&      clientContext(OLD) [clientStimword]             childless?
                                                                                                                )
                                                                                                        {
                                                                                                                                //DELETE clientContext(OLD)
                                                                                                        }
                                                                                                        */
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
        ,               \`clientContextError\`
        ,               \`clientContextErrorSpeakingCount\`
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
                ,               :clientContextError
                ,               :clientContextErrorSpeakingCount
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
                //   can we use \` on RETURNING variable????????????????????????????//
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
        ,       \`stimwordPageNbr\`
        ,       \`stimwordLineNbr\`
        ,       \`stimwordWord\`
        ,       \`stimwordPositionNbr\`
        ,       \`stimwordPositionSetting\`
        ,       \`clientStimwordNotes\`
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
                ,       \`stimwordPosition\`.\`stimwordPageNbr\`
                ,       \`stimwordPosition\`.\`stimwordLineNbr\`
                ,       \`stimwordPosition\`.\`stimwordWord\`
                ,       \`stimwordPosition\`.\`stimwordPositionNbr\`
                ,       \`stimwordPosition\`.\`stimwordPositionSetting\`
                ,       :clientStimwordNotes
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
                //   can we use \` on RETURNING variable????????????????????????????//
};





/*






*/


//      mariadb  --host=localhost --user=knexUser  --password=knexPassword    knexDb    ;
//      mariadb  --host=localhost --user=kenxUser  --password=knexPassword    comptonTransAnlys

/*
function firstPromise(promiseInput)     {
        console.log('parameter passed into first promise: ' + promiseInput);
        return  knex.raw("SELECT VERSION()")    ;
}
function secondPromise(promiseInput)    {
        console.log('result of first promise into second promise: ' + JSON.stringify(promiseInput));
        return ('second promise added to promiseInput. ' + promiseInput);
}
/*
firstPromise('promise input!')
        .then(secondPromise)
        .catch(console.log('error!'))
        ;
*/


                                                                                                                /*
                                                                                                                const myArgs = process.argv.slice(2);
                                                                                                                console.log('myArgs: ', myArgs);

                                                                                                                console.log('start:');
                                                                                                                console.log(myArgs[0].clientSessionAutoIncr);
                                                                                                                console.log(myArgs[0].clientPositionAutoIncr);
                                                                                                                console.log(JSON.parse(myArgs[0]));

                                                                                                                console.log(
                                                                                                                        parmClientSessionAutoIncr
                                                                                                                ,       parmStimwordPositionAutoIncr
                                                                                                                ,       parmClientContextError_OLD
                                                                                                                ,       parmClientContextError_NEW
                                                                                                                ,       parmClientStimwordNotes
                                                                                                                );

                                                                                                                */


/*
firstPromise('promise input!')
        .then(  (response)      =>      {       console.log     ('response from firstPromise: ' + response)     ;
                                                return response                                                 ;
                                        }                                                                               )
        .then(  (newResponse)   =>      console.log     ('ending! ' + newResponse)                                      )
        .then(  ()              =>      knex.destroy()                                                                  )
        .then(  ()              =>      secondPromise('stuff into second promise')
                                                .then((result) => { console.log('calling second promise: ' + result); return (result);} )       )
        .then(  (lastResponse)  =>      console.log     ('last response: ' + lastResponse)                              )
        .catch( (error)         =>      console.log     ('error! ' + error)                                             )
        ;


        if  ( NEW != <blank> )      {
                if  ( clientStimwordCount(NEW) == 0 )   {
                        if  ( clientContext(NEW) NOT exists )   {
                            INSERT clientContext(NEW)
                        }
                        if  ( NEW != <blank> && OLD == <blank> ) {
                                INSERT clientStimword(NEW)
                        } else {
                                if  ( clientStimwordCount(OLD) EXISTS ) {
                                        MODIFY clientStimword(OLD) to clientStimword(NEW)
                                }
                                deleteChildlessClientContext(OLD)
                        }
                } else {        // duplicate!!
                        throw dup error
                }
        } else if  ( OLD  != <blank> && NEW == <blank> )  {
                                                                //      make sure OLD exists ????
                DELETE clientStimword(OLD)
                deleteChildlessClientContext(OLD)
        }

                                                                /*
                                                                const firstPromise = ( promiseInput )   =>      {
                                                                        return new Promise((resolve, reject) => {
                                                                                console.log('parameter passed into promise: ' + promiseInput);

                                                                                knex.raw("SELECT VERSION()")
                                                                                .then(
                                                                                    (version) => {      console.log     ('inside:  ' + version[0][0]["VERSION()"] );
                                                                                                        resolve         ('outside: ' + version[0][0]["VERSION()"] );
                                                                                                }
                                                                                ).catch(
                                                                                        (err) => { reject(err); }
                                                                                )
                                                                        })
                                                                }

                                                                const secondPromise = ( input ) =>              {
                                                                        return new Promise (    (resolve, reject) => {
                                                                                resolve (input) ;
                                                                        })
                                                                }
*/






=====  2022-02-09


//       node  clientStimword.js  '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 284, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def", "clientStimwordNotes" : "my client stimword notes"}'

//      contextAutoIncr = 74 when stimwordPosition is 283/284
//      contextAutoIncr = 56 when stimwordPosition is 285   !!

console.log(process.argv)       ;

var     myArgs                          = JSON.parse(process.argv.slice(2)[0])  ;
const   parmClientSessionAutoIncr       = myArgs.clientSessionAutoIncr          ;
const   parmStimwordPositionAutoIncr    = myArgs.stimwordPositionAutoIncr       ;
const   parmClientContextError_OLD      = myArgs.clientContextError_OLD         ;
const   parmClientContextError_NEW      = myArgs.clientContextError_NEW         ;
const   parmClientStimwordNotes         = myArgs.clientStimwordNotes            ;

const knexConnectOptions = {
  client: 'mysql',
  debug: true,
  connection: 'mysql://knexUser:knexPassword@localhost:3306/comptonTransAnlys'
};

const knex = require('knex')(knexConnectOptions);

                                //      https://javascript.info/promise-basics
                                //      https://stackoverflow.com/questions/35318442/how-to-pass-parameter-to-a-promise-function
                                //      https://stackoverflow.com/questions/33257412/how-to-handle-the-if-else-in-promise-then?rq=1





const   insertClientContextStatement =  returnInsertClientContextStatement();

const   insertClientStimwordStatement   = returnInsertClientStimwordStatement();


console.log('Starting run.');

console.log('000000 calling returnContextAutoIncr using: ' + parmStimwordPositionAutoIncr);

returnContextAutoIncr(parmStimwordPositionAutoIncr)
        .then( val =>   {
                let contextAutoIncr = val.contextAutoIncr ;

                switch(true)    {
                        case ( parmClientContextError_OLD  == ''  &&    parmClientContextError_NEW != ''        )       :
                        {
                                countClientContextStimword(parmClientContextError_NEW, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {

console.log('returning from countClientContextStimword using NEW value: ' + parmClientContextError_NEW);

                                                let clientStimwordCount = val[0]['clientStimwordCount'] ;
                                                if  ( clientStimwordCount == 0 )        {
                                                        selectClientContext(parmClientContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  { return insertClientContext(val, parmClientContextError_NEW, contextAutoIncr, parmClientSessionAutoIncr);})
                                                                .then( val =>  {
                                                                        let clientContextAutoIncr;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                console.log('ERROR!');
                                                                                console.log(JSON.stringify(val));
                                                                                return 0;
                                                                        }
                                                                        insertClientStimword(clientContextAutoIncr, parmStimwordPositionAutoIncr, parmClientStimwordNotes)
                                                                                .then( val => { console.log(JSON.stringify(val));});
                                                                });
                                                } else {
                                                        console.log('duplicate error!  returning....');
                                                        return 0;
                                                }

                                        })                                                      // end countClientContextStimword(NEW)
                                        .catch( err => { console.log(err); return 0; })
                                        ;
                                break;  // should NEVER get here.....????
                        }

                        case ( parmClientContextError_OLD  != ''  &&    parmClientContextError_NEW != ''        )       :
                        {
                                countClientContextStimword(parmClientContextError_OLD, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                        .then( val =>   {

                                                let clientStimwordCount = val[0]['clientStimwordCount'] ;
                                                if  ( clientStimwordCount == 1 )        {

                                                        selectClientContext(parmClientContextError_OLD, parmClientSessionAutoIncr, contextAutoIncr)
                                                                .then( val =>  { return insertClientContext(val, parmClientContextError_OLD, contextAutoIncr, parmClientSessionAutoIncr);})
                                                                .then( val =>  {

                                                                        let clientContextAutoIncr;
                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                                                                                clientContextAutoIncr = val[0][0]['clientContextAutoIncr'];
                                                                        } else {
                                                                                console.log('ERROR!');
                                                                                console.log(JSON.stringify(val));
                                                                                return 0;
                                                                        }

                                                                        updateClientStimword    (       parmClientSessionAutoIncr
                                                                                                ,       clientContextAutoIncr
                                                                                                ,       parmStimwordPositionAutoIncr
                                                                                                ,       parmClientContextError_OLD
                                                                                                ,       parmClientContextError_NEW
                                                                                                ,       parmClientStimwordNotes
                                                                                                )
                                                                                .then(deleteChildlessClientContext(clientContextAutoIncr, parmClientContextError_OLD))
                                                                                .then( () => { return 0; });
                                                                })

                                                } else {
                                                        console.log('rejecting, cannot find ' + parmClientContextError_OLD );
                                                        return 0;
                                                }
                                        })                                              // end countClientContextStimword(OLD)
                                break;  // should NEVER get here.....????
                        }

                        case ( parmClientContextError_OLD  != ''  &&    parmClientContextError_NEW == ''        )       :
                        {
                                console.log ('OLD is filled in, NEW is blank, DELETE clientStimword~!');
                                deleteClientStimword(parmClientContextErrror_OLD)       ;
                                deleteChildlessClientContext(parmClientContextErrror_OLD)       ;
                                return 0;;
                        }
                }
        });


function updateClientStimword(clientSessionAutoIncr, clientContextAutoIncr, stimwordPositionAutoIncr, clientContextError_OLD, clientContextError_NEW, clientStimwordNotes)      {
        console.log('IN updateClientStimword!');
        console.log(clientSessionAutoIncr, clientContextAutoIncr, stimwordPositionAutoIncr, clientContextError_OLD, clientContextError_NEW, clientStimwordNotes)        ;
        return true;
}

function deleteChildlessClientContext(clientContextAutoIncr, clientContextError)        {
        console.log('IN deleteChildlessClientContext!');
        console.log(clientContextAutoIncr, clientContextError)  ;
        return true;
}



/*
GET contextAutoIncr using stimwordPosition(clientContextAutoIncr)

        switch(true)
        case   ( OLD == <blank> && NEW NOT <blank> )      {
                if  ( countClientContextStimword(NEW) == 0 )    {
                        if  ( clientContext(NEW) NOT exists )   {
                            INSERT clientContext(NEW)
                        }
                        INSERT clientStimword(NEW)
                } else {        // duplicate!!
                        throw dup error
                }
        case   ( OLD NOT <blank> && NEW NOT <blank> )      {

                if  ( countClientContextStimword(OLD) == 1 )    {
                        if  ( clientContext(NEW) NOT exists )   {
                            INSERT clientContext(NEW)
                        }

                        MODIFY clientStimword(OLD) to clientStimword(NEW)
                        deleteChildlessClientContext(OLD)
                } else {
                        throw missing error
                }

        case   ( OLD NOT <blank> && NEW == <blank> )      {
                                                                //      make sure OLD exists ????
                DELETE clientStimword(OLD)
                deleteChildlessClientContext(OLD)
        }
*/

function countClientContextStimword(clientContextError, clientSessionAutoIncr, stimwordPositionAutoIncr)        {

        console.log('in countClientContextStimword!');
        console.log('clientContextError:       ' + clientContextError);
        console.log('clientSessionAutoIncr:    ' + clientSessionAutoIncr);
        console.log('stimwordPositionAutoIncr: ' + stimwordPositionAutoIncr);
console.log('hopefully HERE comes next....');
                                                        //      https://stackify.dev/136700-knex-js-how-to-select-columns-from-multiple-tables
                                                        //      https://stackoverflow.com/questions/65413824/multiple-count-and-left-joins-in-mysql-node-using-knex
        return knex
                .count          ('* as clientStimwordCount')
                .from('clientStimword')
                .innerJoin('clientContext', 'clientContext.clientContextAutoIncr', 'clientStimword.clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientContextError'            : clientContextError            })
                .andWhere       ({'clientContext.clientSessionAutoIncr'         : clientSessionAutoIncr         })
                .andWhere       ({'clientStimword.stimwordPositionAutoIncr'     : stimwordPositionAutoIncr      })
                                                                                                //.then( val => { console.log('inside of returnClientContextCount()! ' + JSON.stringify(val)); return val[0]; } )
                ;
                                /*
                                        SELECT COUNT(*)
                                        FROM clientStimword
                                        INNER JOIN clientContext
                                        ON clientContext.clientContextAutoIncr = clientStimword.clientContextAutoIncr
                                        WHERE 1
                                        AND clientContext.clientSessionAutoIncr = 2349
                                        AND clientStimword.stimwordPositionAutoIncr = 285
                                        AND clientContext.clientContextError   = 'def'
                                */
}


function selectClientContext(clientContextError, clientSessionAutoIncr, contextAutoIncr)        {
                                                //      https://stackoverflow.com/questions/21979388/get-count-result-with-knex-js-bookshelf-js
                                                //      https://stackoverflow.com/questions/53751587/knex-js-or-inside-where
                                                //      https://stackoverflow.com/questions/54407751/how-to-add-two-bind-params-in-knex/54422388
                                                //      https://stackoverflow.com/questions/47464078/mysql-insert-with-multiple-selects-with-differing-number-of-returned-columns
                                                //      https://stackoverflow.com/questions/30945104/db-raw-with-more-than-one-paremter-with-knex
        return knex
                .from           ('clientContext')
                .select         ('clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientContextError'    : clientContextError            })
                .andWhere       ({'clientContext.clientSessionAutoIncr' : clientSessionAutoIncr         })
                .andWhere       ({'clientContext.contextAutoIncr'       : contextAutoIncr               })
                ;
}


function insertClientContext(val, clientContextError, contextAutoIncr, clientSessionAutoIncr)   {

        if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                let returnArray = [ val ];      // funky way to "match" what the insert returns!
                return  returnArray;
        } else {
                let insertClientContextParms =
                        {       'clientContextError'                    :       clientContextError
                        ,       'contextAutoIncr'                       :       contextAutoIncr
                        ,       'clientSessionAutoIncr'                 :       clientSessionAutoIncr
                        ,       'clientContextErrorSpeakingCount'       :       0
                        ,       'frequency'                             :       ''
                        ,       'clientContextErrorNotes'               :       null
                        }
                        ;
                console.log('parms: ' + JSON.stringify(insertClientContextParms));

                return knex.raw(insertClientContextStatement, insertClientContextParms);
        }
}

function insertClientStimword(clientContextAutoIncr, stimwordPositionAutoIncr, clientStimwordNotes)     {

console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
console.log((clientContextAutoIncr));
console.log((stimwordPositionAutoIncr));
console.log((clientStimwordNotes));
console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

        let insertClientStimwordParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'stimwordPositionAutoIncr'              :       stimwordPositionAutoIncr
                ,       'clientStimwordNotes'                   :       clientStimwordNotes
                }
                ;
        console.log('parms: ' + JSON.stringify(insertClientStimwordParms));

        return knex.raw(insertClientStimwordStatement, insertClientStimwordParms);
}


function nextPromise(result)    {
        console.log('my nextPromise: ' + result.contextAutoIncr);
}

function returnContextAutoIncr(stimwordPositionAutoIncr)        {
                                                        //      https://stackoverflow.com/questions/48558183/knex-select-result-return-to-a-variable
        console.log('aaaaaa  parameter passed into returnContextAutoIncr promise using stimwordPositionAutoIncr : ' + stimwordPositionAutoIncr);
        return knex.from('stimwordPosition')
                .select('contextAutoIncr')
                .where ({ 'stimwordPositionAutoIncr': stimwordPositionAutoIncr })
                .then( val => { console.log('bbbbbbb returnContextAutoIncr value is: ' + JSON.stringify(val[0])); return val[0]; } )
                ;
        console.log('3333 end of returnContextAutoIncr function!');
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
        ,               \`clientContextError\`
        ,               \`clientContextErrorSpeakingCount\`
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
                ,               :clientContextError
                ,               :clientContextErrorSpeakingCount
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
                //   can we use \` on RETURNING variable????????????????????????????//
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
        ,       \`stimwordPageNbr\`
        ,       \`stimwordLineNbr\`
        ,       \`stimwordWord\`
        ,       \`stimwordPositionNbr\`
        ,       \`stimwordPositionSetting\`
        ,       \`clientStimwordNotes\`
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
                ,       \`stimwordPosition\`.\`stimwordPageNbr\`
                ,       \`stimwordPosition\`.\`stimwordLineNbr\`
                ,       \`stimwordPosition\`.\`stimwordWord\`
                ,       \`stimwordPosition\`.\`stimwordPositionNbr\`
                ,       \`stimwordPosition\`.\`stimwordPositionSetting\`
                ,       :clientStimwordNotes
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
                //   can we use \` on RETURNING variable????????????????????????????//
};





/*




function deleteChildlessClientContext(clientContextAutoIncr)    {
        if      (       clientContext.clientContextErrorNotes(OLD)      blank?
                &&      clientContext.clientContextFrequency            blank?
                &&      clientContext.clientContextErrorSpeakingCount   zero?
                &&      clientContext(OLD) [clientStimword]             childless?
                )
        {
            DELETE clientContext(OLD)
        }

}


*/


//      mariadb  --host=localhost --user=knexUser  --password=knexPassword    knexDb    ;
//      mariadb  --host=localhost --user=kenxUser  --password=knexPassword    comptonTransAnlys

/*
function firstPromise(promiseInput)     {
        console.log('parameter passed into first promise: ' + promiseInput);
        return  knex.raw("SELECT VERSION()")    ;
}
function secondPromise(promiseInput)    {
        console.log('result of first promise into second promise: ' + JSON.stringify(promiseInput));
        return ('second promise added to promiseInput. ' + promiseInput);
}
/*
firstPromise('promise input!')
        .then(secondPromise)
        .catch(console.log('error!'))
        ;
*/


                                                                                                                /*
                                                                                                                const myArgs = process.argv.slice(2);
                                                                                                                console.log('myArgs: ', myArgs);

                                                                                                                console.log('start:');
                                                                                                                console.log(myArgs[0].clientSessionAutoIncr);
                                                                                                                console.log(myArgs[0].clientPositionAutoIncr);
                                                                                                                console.log(JSON.parse(myArgs[0]));

                                                                                                                console.log(
                                                                                                                        parmClientSessionAutoIncr
                                                                                                                ,       parmStimwordPositionAutoIncr
                                                                                                                ,       parmClientContextError_OLD
                                                                                                                ,       parmClientContextError_NEW
                                                                                                                ,       parmClientStimwordNotes
                                                                                                                );

                                                                                                                */


/*
firstPromise('promise input!')
        .then(  (response)      =>      {       console.log     ('response from firstPromise: ' + response)     ;
                                                return response                                                 ;
                                        }                                                                               )
        .then(  (newResponse)   =>      console.log     ('ending! ' + newResponse)                                      )
        .then(  ()              =>      knex.destroy()                                                                  )
        .then(  ()              =>      secondPromise('stuff into second promise')
                                                .then((result) => { console.log('calling second promise: ' + result); return (result);} )       )
        .then(  (lastResponse)  =>      console.log     ('last response: ' + lastResponse)                              )
        .catch( (error)         =>      console.log     ('error! ' + error)                                             )
        ;


        if  ( NEW != <blank> )      {
                if  ( clientStimwordCount(NEW) == 0 )   {
                        if  ( clientContext(NEW) NOT exists )   {
                            INSERT clientContext(NEW)
                        }
                        if  ( NEW != <blank> && OLD == <blank> ) {
                                INSERT clientStimword(NEW)
                        } else {
                                if  ( clientStimwordCount(OLD) EXISTS ) {
                                        MODIFY clientStimword(OLD) to clientStimword(NEW)
                                }
                                deleteChildlessClientContext(OLD)
                        }
                } else {        // duplicate!!
                        throw dup error
                }
        } else if  ( OLD  != <blank> && NEW == <blank> )  {
                                                                //      make sure OLD exists ????
                DELETE clientStimword(OLD)
                deleteChildlessClientContext(OLD)
        }

                                                                /*
                                                                const firstPromise = ( promiseInput )   =>      {
                                                                        return new Promise((resolve, reject) => {
                                                                                console.log('parameter passed into promise: ' + promiseInput);

                                                                                knex.raw("SELECT VERSION()")
                                                                                .then(
                                                                                    (version) => {      console.log     ('inside:  ' + version[0][0]["VERSION()"] );
                                                                                                        resolve         ('outside: ' + version[0][0]["VERSION()"] );
                                                                                                }
                                                                                ).catch(
                                                                                        (err) => { reject(err); }
                                                                                )
                                                                        })
                                                                }

                                                                const secondPromise = ( input ) =>              {
                                                                        return new Promise (    (resolve, reject) => {
                                                                                resolve (input) ;
                                                                        })
                                                                }
*/



====  2022-02-08



//       node  clientStimword.js  '{"clientSessionAutoIncr" : 2349, "stimwordPositionAutoIncr" : 284, "clientContextError_OLD" :"abc", "clientContextError_NEW" : "def", "clientStimwordNotes" : "my client stimword notes"}'

//      contextAutoIncr = 74 when stimwordPosition is 283/284
//      contextAutoIncr = 56 when stimwordPosition is 285   !!

console.log(process.argv)       ;

var     myArgs                          = JSON.parse(process.argv.slice(2)[0])  ;
const   parmClientSessionAutoIncr       = myArgs.clientSessionAutoIncr          ;
const   parmStimwordPositionAutoIncr    = myArgs.stimwordPositionAutoIncr       ;
const   parmClientContextError_OLD      = myArgs.clientContextError_OLD         ;
const   parmClientContextError_NEW      = myArgs.clientContextError_NEW         ;
const   parmClientStimwordNotes         = myArgs.clientStimwordNotes            ;

const knexConnectOptions = {
  client: 'mysql',
  debug: true,
  connection: 'mysql://knexUser:knexPassword@localhost:3306/comptonTransAnlys'
};

const knex = require('knex')(knexConnectOptions);

                                //      https://javascript.info/promise-basics
                                //      https://stackoverflow.com/questions/35318442/how-to-pass-parameter-to-a-promise-function
                                //      https://stackoverflow.com/questions/33257412/how-to-handle-the-if-else-in-promise-then?rq=1





const   insertClientContextStatement =  returnInsertClientContextStatement();

const   insertClientStimwordStatement   = returnInsertClientStimwordStatement();


console.log('Starting run.');

console.log('000000 calling returnContextAutoIncr using: ' + parmStimwordPositionAutoIncr);

returnContextAutoIncr(parmStimwordPositionAutoIncr)
        .then( val =>   {
                let contextAutoIncr = val.contextAutoIncr ;

                if  ( parmClientContextError_NEW != ''  )       {

                        countClientStimword(parmClientContextError_NEW, parmClientSessionAutoIncr, parmStimwordPositionAutoIncr)
                                .then( val =>   {
                                                                                                                                                        /*
                                                                                                                                                        console.log('NEW NEW NEW NEW NEW');
                                                                                                                                                        console.log(JSON.stringify(val))        ;
                                                                                                                                                        console.log('NEW NEW NEW NEW NEW');
                                                                                                                                                        */
                                        let clientStimwordCount = val[0]['clientStimwordCount'] ;
                                        if  ( clientStimwordCount == 0 )        {
                                                selectClientContext(parmClinetContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                                                        .then( val =>  { return insertClientContext(val, contextAutoIncr);})
                                                        .then( val =>  {
                                                                let clientContextAutoIncr;
                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                                        clientContextAutoIncr = val[0]['clientContextAutoIncr'];
                                                                } else if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr')){
                                                                        clientContextAutoIncr = val[0][0]['clientContextAutoIncr'];
                                                                } else {
                                                                        console.log('ERROR!');
                                                                        console.log(JSON.stringify(val));
                                                                        return 0;
                                                                }
                                                                if  ( parmClientContextError_OLD == '' && parmClientContextError_NEW != ''      )       {
                                                                        console.log('old is blank! INSERT OPERATION ');
                                                                        insertClientStimword(clientContextAutoIncr)
                                                                                .then( val => { console.log(JSON.stringify(val));});
                                                                } else {
                                                                        console.log('MODIFY OPERATION old is NOT blank! ' + parmClientContextError_OLD );
                                                                        deleteChildlessClientContext(parmClientContextErrror_OLD)       ;
                                                                }
                                                        });
                                        } else {
                                                console.log('duplicate error!  returning....');
                                                return 0;
                                        }

                                })
                                .catch( err => { console.log(err); return 0; })
                                ;

                } else if  ( parmClientContextError_OLD != '' && parmClientContextError_NEW == '' ) {
                        console.log ('OLD is filled in, NEW is blank, DELETE clientStimword~!');
                        deleteClientStimword(parmClientContextErrror_OLD)       ;
                        deleteChildlessClientContext(parmClientContextErrror_OLD)       ;
                }

        });


/*
GET contextAutoIncr using stimwordPosition(clientContextAutoIncr)

        if  ( NEW != <blank> )      {
                if  ( clientStimwordCount(NEW) == 0 )   {
                        if  ( clientContext(NEW) NOT exists )   {
                            INSERT clientContext(NEW)
                        }
                        if  ( NEW != <blank> && OLD == <blank> ) {
                                INSERT clientStimword(NEW)
                        } else {
                                MODIFY clientStimword(OLD) to clientStimword(NEW)
                                deleteChildlessClientContext(OLD)
                        }
                } else {        // duplicate!!
                        throw dup error
                }
        } else if  ( OLD  != <blank> && NEW == <blank> )  {
                                                                //      make sure OLD exists ????
                DELETE clientStimword(OLD)
                deleteChildlessClientContext(OLD)
        }
*/

function countClientStimword(clientContextError, clientSessionAutoIncr, stimwordPositionAutoIncr)       {

        console.log('in countClientStimword!');
        console.log('clientContextError: ' + clientContextError);
        console.log('clientSessionAutoIncr: ' + clientSessionAutoIncr);
        console.log('stimwordPositionAutoIncr: ' + stimwordPositionAutoIncr);
                                                        //      https://stackify.dev/136700-knex-js-how-to-select-columns-from-multiple-tables
                                                        //      https://stackoverflow.com/questions/65413824/multiple-count-and-left-joins-in-mysql-node-using-knex
        return knex
                .count          ('* as clientStimwordCount')
                .from('clientStimword')
                .innerJoin('clientContext', 'clientContext.clientContextAutoIncr', 'clientStimword.clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientContextError'            : clientContextError            })
                .andWhere       ({'clientContext.clientSessionAutoIncr'         : clientSessionAutoIncr         })
                .andWhere       ({'clientStimword.stimwordPositionAutoIncr'     : stimwordPositionAutoIncr      })
                                                                                                //.then( val => { console.log('inside of returnClientContextCount()! ' + JSON.stringify(val)); return val[0]; } )
                ;
                                /*
                                        SELECT COUNT(*)
                                        FROM clientStimword
                                        INNER JOIN clientContext
                                        ON clientContext.clientContextAutoIncr = clientStimword.clientContextAutoIncr
                                        WHERE 1
                                        AND clientContext.clientSessionAutoIncr = 2349
                                        AND clientStimword.stimwordPositionAutoIncr = 285
                                        AND clientContext.clientContextError   = 'def'
                                */
}


function selectClientContext(clientContextError, clientSessionAutoIncr, contextAutoIncr)        {
                                                //      https://stackoverflow.com/questions/21979388/get-count-result-with-knex-js-bookshelf-js
                                                //      https://stackoverflow.com/questions/53751587/knex-js-or-inside-where
                                                //      https://stackoverflow.com/questions/54407751/how-to-add-two-bind-params-in-knex/54422388
                                                //      https://stackoverflow.com/questions/47464078/mysql-insert-with-multiple-selects-with-differing-number-of-returned-columns
                                                //      https://stackoverflow.com/questions/30945104/db-raw-with-more-than-one-paremter-with-knex
        var contextAutoIncr = parmContextAutoIncr       ;
        return knex
                .from           ('clientContext')
                .select         ('clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContext.clientContextError'    : clientContextError            })
                .andWhere       ({'clientContext.clientSessionAutoIncr' : clientSessionAutoIncr         })
                .andWhere       ({'clientContext.contextAutoIncr'       : ContextAutoIncr               })
                ;
}


function insertClientContext(val, contextAutoIncr)      {

        if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                return  val;
        } else {
                let insertClientContextParms =
                        {       'clientContextError'                    :       parmClientContextError_NEW
                        ,       'contextAutoIncr'                       :       contextAutoIncr
                        ,       'clientSessionAutoIncr'                 :       parmClientSessionAutoIncr
                        ,       'clientContextErrorSpeakingCount'       :       0
                        ,       'frequency'                             :       ''
                        ,       'clientContextErrorNotes'               :       null
                        }
                        ;
                console.log('parms: ' + JSON.stringify(insertClientContextParms));

                return knex.raw(insertClientContextStatement, insertClientContextParms);
        }
}

function insertClientStimword(clientContextAutoIncr)    {

console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
console.log(JSON.stringify(clientContextAutoIncr));
console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

        let insertClientStimwordParms =
                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                ,       'stimwordPositionAutoIncr'              :       parmStimwordPositionAutoIncr
                ,       'clientStimwordNotes'                   :       parmClientStimwordNotes
                }
                ;
        console.log('parms: ' + JSON.stringify(insertClientStimwordParms));

        return knex.raw(insertClientStimwordStatement, insertClientStimwordParms);
}


function nextPromise(result)    {
        console.log('my nextPromise: ' + result.contextAutoIncr);
}

function returnContextAutoIncr(stimwordPositionAutoIncr)        {
                                                        //      https://stackoverflow.com/questions/48558183/knex-select-result-return-to-a-variable
        console.log('aaaaaa  parameter passed into returnContextAutoIncr promise using stimwordPositionAutoIncr : ' + stimwordPositionAutoIncr);
        return knex.from('stimwordPosition')
                .select('contextAutoIncr')
                .where ({ 'stimwordPositionAutoIncr': stimwordPositionAutoIncr })
                .then( val => { console.log('bbbbbbb returnContextAutoIncr value is: ' + JSON.stringify(val[0])); return val[0]; } )
                ;
        console.log('3333 end of returnContextAutoIncr function!');
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
        ,               \`clientContextError\`
        ,               \`clientContextErrorSpeakingCount\`
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
                ,               :clientContextError
                ,               :clientContextErrorSpeakingCount
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
                //   can we use \` on RETURNING variable????????????????????????????//
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
        ,       \`stimwordPageNbr\`
        ,       \`stimwordLineNbr\`
        ,       \`stimwordWord\`
        ,       \`stimwordPositionNbr\`
        ,       \`stimwordPositionSetting\`
        ,       \`clientStimwordNotes\`
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
                ,       \`stimwordPosition\`.\`stimwordPageNbr\`
                ,       \`stimwordPosition\`.\`stimwordLineNbr\`
                ,       \`stimwordPosition\`.\`stimwordWord\`
                ,       \`stimwordPosition\`.\`stimwordPositionNbr\`
                ,       \`stimwordPosition\`.\`stimwordPositionSetting\`
                ,       :clientStimwordNotes
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
                //   can we use \` on RETURNING variable????????????????????????????//
};





/*




function deleteChildlessClientContext(clientContextAutoIncr)    {
        if      (       clientContext.clientContextErrorNotes(OLD)      blank?
                &&      clientContext.clientContextFrequency            blank?
                &&      clientContext.clientContextErrorSpeakingCount   zero?
                &&      clientContext(OLD) [clientStimword]             childless?
                )
        {
            DELETE clientContext(OLD)
        }

}


*/


//      mariadb  --host=localhost --user=knexUser  --password=knexPassword    knexDb    ;
//      mariadb  --host=localhost --user=kenxUser  --password=knexPassword    comptonTransAnlys

/*
function firstPromise(promiseInput)     {
        console.log('parameter passed into first promise: ' + promiseInput);
        return  knex.raw("SELECT VERSION()")    ;
}
function secondPromise(promiseInput)    {
        console.log('result of first promise into second promise: ' + JSON.stringify(promiseInput));
        return ('second promise added to promiseInput. ' + promiseInput);
}
/*
firstPromise('promise input!')
        .then(secondPromise)
        .catch(console.log('error!'))
        ;
*/


                                                                                                                /*
                                                                                                                const myArgs = process.argv.slice(2);
                                                                                                                console.log('myArgs: ', myArgs);

                                                                                                                console.log('start:');
                                                                                                                console.log(myArgs[0].clientSessionAutoIncr);
                                                                                                                console.log(myArgs[0].clientPositionAutoIncr);
                                                                                                                console.log(JSON.parse(myArgs[0]));

                                                                                                                console.log(
                                                                                                                        parmClientSessionAutoIncr
                                                                                                                ,       parmStimwordPositionAutoIncr
                                                                                                                ,       parmClientContextError_OLD
                                                                                                                ,       parmClientContextError_NEW
                                                                                                                ,       parmClientStimwordNotes
                                                                                                                );

                                                                                                                */


/*
firstPromise('promise input!')
        .then(  (response)      =>      {       console.log     ('response from firstPromise: ' + response)     ;
                                                return response                                                 ;
                                        }                                                                               )
        .then(  (newResponse)   =>      console.log     ('ending! ' + newResponse)                                      )
        .then(  ()              =>      knex.destroy()                                                                  )
        .then(  ()              =>      secondPromise('stuff into second promise')
                                                .then((result) => { console.log('calling second promise: ' + result); return (result);} )       )
        .then(  (lastResponse)  =>      console.log     ('last response: ' + lastResponse)                              )
        .catch( (error)         =>      console.log     ('error! ' + error)                                             )
        ;

*/

                                                                /*
                                                                const firstPromise = ( promiseInput )   =>      {
                                                                        return new Promise((resolve, reject) => {
                                                                                console.log('parameter passed into promise: ' + promiseInput);

                                                                                knex.raw("SELECT VERSION()")
                                                                                .then(
                                                                                    (version) => {      console.log     ('inside:  ' + version[0][0]["VERSION()"] );
                                                                                                        resolve         ('outside: ' + version[0][0]["VERSION()"] );
                                                                                                }
                                                                                ).catch(
                                                                                        (err) => { reject(err); }
                                                                                )
                                                                        })
                                                                }

                                                                const secondPromise = ( input ) =>              {
                                                                        return new Promise (    (resolve, reject) => {
                                                                                resolve (input) ;
                                                                        })
                                                                }
                                                                */

