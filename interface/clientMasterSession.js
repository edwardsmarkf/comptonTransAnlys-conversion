[root@localhost knex]# clear
[root@localhost knex]# cat    clientMasterSession.js
/*      clientMasterSession.js

        to run:
                node  clientMasterSession.js  '{"layoutName":"PESL", "teacherAutoIncr" : 385, "teacherEmail" : "info@englishwithoutaccent.com", "clientMasterEmail" : "12yukos@gmail.com", "sessionName" : "Time1"  }'
*/

'use strict';

var     myArgs                  = JSON.parse(process.argv.slice(2)[0])  ;
const   parmTeacherEmail        = myArgs.teacherEmail                   ;
const   parmTeacherAutoIncr     = myArgs.teacherAutoIncr                        ;
const   parmClientMasterEmail   = myArgs.clientMasterEmail              ;
const   parmLayoutName          = myArgs.layoutName                     ;
const   parmSessionName         = myArgs.SessionName                    ;

                                                                //      mariadb  --host=localhost --user=kenxUser  --password=knexPassword    comptonTransAnlys
const knexConnectOptions =
        {       'client'        :       'mysql'
        ,       'debug'         :       false
        ,       'connection'    :       'mysql://knexUser:knexPassword@localhost:3306/comptonTransAnlys'
        };

const knex = require('knex')(knexConnectOptions);

                                //const   insertClientMasterStatement    =       returnInsertClientContextStatement()    ;
                                //const   insertClientStimwordStatement   =       returnInsertClientStimwordStatement()   ;

returnClientMasterAutoIncr(parmTeacherEmail, parmClientMasterEmail, parmLayoutName)
        .then( val =>   {
                if  ( typeof val == 'object' && val.length > 0 )                {
                        console.log('existing client!' + val[0].clientMasterAutoIncr);
                        exitScript(0, 'good exit!'    ,  val);
                } else {
                        console.log('new client!');
                        returnClientMasterInsert(parmTeacherEmail, parmTeacherAutoIncr, parmClientMasterEmail, parmLayoutName)
                        .then ( val =>  {
                                exitScript(0, 'good exit!'    ,  val);
                        })
                }
        })
        .catch( err =>  {
                        exitScript(0, 'Bad selectClientMaster'    ,  err);
        })
        ;

function returnClientMasterInsert(teacherEmail, teacherAutoIncr, clientMasterEmail, layoutName) {
        let insertObj = {       'teacherEmail'          :       teacherEmail
                        ,       'teacherAutoIncr'       :       teacherAutoIncr
                        ,       'clientMasterEmail'     :       clientMasterEmail
                        ,       'layoutName'            :       layoutName
                        ,
                        }
                        ;
        return knex.from('clientMaster')
                .insert(insertObj)
                .then( val => { return val; } )
                ;
}

function returnClientMasterAutoIncr(teacherEmail, clientMasterEmail, layoutName)        {
        let insertObj = {       'teacherEmail'          :       teacherEmail
                        ,       'clientMasterEmail'     :       clientMasterEmail
                        ,       'layoutName'            :       layoutName
                        ,
                        }
                        ;
        return knex.from('clientMaster')
                .where          ( true, '=', true)
                .andWhere       (insertObj)
                .select ('clientMasterAutoIncr')
                .then( val => { return val; } )
                ;
}




                /*
                /*
                /*                let clientMasterAutoIncr = val.contextAutoIncr ;
                /*              let clientMasterSessionCount = val.length ;
                /*              if  ( clientMasterSessionCount == 0 )        {
                /*
                /*                switch(true)    {
                /*
                /*                                        /*
                /*                                                OLD is blank,   NEW is filled in
                /*                                        */
                /*
                /*                        case ( parmClientContextError_OLD  == ''  &&    parmClientContextError_NEW > '' )       :
                /*                        {
                /*                                selectClientContextStimword(parmClientSessionAutoIncr, parmStimwordPositionAutoIncr, true)
                /*                                        .then( val =>   {
                /*
                /*                                                let clientMasterSessionCount = val.length ;
                /*                                                if  ( clientMasterSessionCount == 0 )        {
                /*                                                        selectClientContext(parmClientContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                /*                                                                .then( val =>  {
                /*                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                /*                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                /*                                                                                        return  returnArray;
                /*                                                                                } else {
                /*                                                                                        return insertClientContext(val, parmClientContextError_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                /*                                                                                }
                /*                                                                        })
                /*                                                                .then( val =>  {
                /*                                                                        let clientContextAutoIncr;
                /*                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                /*                                                                                clientContextAutoIncr = val[0][0]['clientContextAutoIncr'];
                /*                                                                        } else {
                /*                                                                                exitScript(0, 'Bad clientContextAutoIncr on insert!', val);
                /*                                                                        }
                /*                                                                        insertClientStimword(clientContextAutoIncr, parmStimwordPositionAutoIncr, parmClientStimwordNotes)
                /*                                                                                .then(  val =>  {
                /*                                                                                        exitScript(1, 'Successful insert.', val[0]);    //       val[0][0]['clientMasterSessionAutoIncr']);
                /*                                                                                });
                /*                                                                })
                /*                                                                .catch( err =>  {
                /*                                                                        exitScript      (       0
                /*                                                                                        ,       (`Cannot find selectClientContext!  parmClientContextError_NEW: ${parmClientContextError_NEW},  \
                /*                                                                                                parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  \
                /*                                                                                                contextAutoIncr: ${contextAutoIncr}.\
                /*                                                                                                `).replace(/t/g, '')
                /*                                                                                        ,       err
                /*                                                                                        )
                /*                                                                                        ;
                /*                                                                })
                /*                                                                ;
                /*                                                } else {
                /*                                                        exitScript      (       0
                /*                                                                        ,       (`Duplicate insert!  \
                /*                                                                                parmClientContextError_NEW: ${parmClientContextError_NEW},  \
                /*                                                                                parmClientAutoIncr: ${parmClientSessionAutoIncr},  \
                /*                                                                                parmStimwordPositionAutoIncr ${parmStimwordPositionAutoIncr},  \
                /*                                                                                stimword count: ${clientMasterSessionCount}.\
                /*                                                                                `).replace(/\t/g, '' )
                /*                                                                        )
                /*                                                                        ;
                /*                                                }
                /*
                /*                                        })                                                      // end selectClientContextStimword(NEW)
                /*                                        .catch( err =>  {
                /*                                                exitScript(0, 'Cannot do selectClientContextStimword on insert!', err);
                /*                                        })
                /*                                        ;
                /*                                break;  // should NEVER get here.....????
                /*                                exitScript(0, 'Somehow got past the INSERT break point?');
                /*                        }
                /*
                /*
                /*                                        /*
                /*                                                OLD is filled in,   NEW is filled in
                /*                                        */
                /*
                /*                        case ( parmClientContextError_OLD  > ''  &&     parmClientContextError_NEW > '' )       :
                /*                        {
                /*                                selectClientContextStimword(parmClientSessionAutoIncr, parmStimwordPositionAutoIncr, parmClientContextError_OLD)
                /*                                        .then( val =>   {
                /*                                                let clientMasterSessionCount = val.length;
                /*                                                if  ( clientMasterSessionCount == 1 )        {
                /*
                /*
                /*                                                        let clientContextAutoIncr_OLD = val[0]['clientContextAutoIncr'];
                /*
                /*                                                        selectClientContext(parmClientContextError_NEW, parmClientSessionAutoIncr, contextAutoIncr)
                /*                                                                .then( val =>  {
                /*                                                                                if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                /*                                                                                        let returnArray = [ val ];      // funky way to "match" what the insert returns!
                /*                                                                                        return  returnArray;
                /*                                                                                } else {
                /*                                                                                        return insertClientContext(val, parmClientContextError_NEW, contextAutoIncr, parmClientSessionAutoIncr);
                /*                                                                                }
                /*                                                                        })
                /*
                /*                                                                .then( val =>  {
                /*                                                                        let clientContextAutoIncr_NEW;
                /*                                                                        if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr'))       {
                /*                                                                                clientContextAutoIncr_NEW = val[0][0]['clientContextAutoIncr'];
                /*                                                                        } else {
                /*                                                                                exitScript      (       0
                /*                                                                                                ,       (`Error on insertClientContext! \
                /*                                                                                                        parmClientContextError_NEW: ${parmClientContextError_NEW},  \
                /*                                                                                                        contextAutoIncr: ${contextAutoIncr},  \
                /*                                                                                                        parmClientSessionAutoIncr: ${parmClientSessionAutoIncr}.\
                /*                                                                                                        `).replace(/\t/g, '')
                /*                                                                                                ,       val
                /*                                                                                                )
                /*                                                                                                ;
                /*                                                                        }
                /*
                /*                                                                        let updateClientStimwordParms =
                /*                                                                                                        {       'clientContextAutoIncr_OLD'     :       clientContextAutoIncr_OLD
                /*                                                                                                        ,       'clientContextAutoIncr_NEW'     :       clientContextAutoIncr_NEW
                /*                                                                                                        ,       'stimwordPositionAutoIncr'      :       parmStimwordPositionAutoIncr
                /*                                                                                                        ,       'clientContextError_OLD'        :       parmClientContextError_OLD
                /*                                                                                                        ,       'clientContextError_NEW'        :       parmClientContextError_NEW
                /*                                                                                                        ,       'clientStimwordNotes'           :       parmClientStimwordNotes
                /*                                                                                                        }
                /*                                                                                                        ;
                /*
                /*                                                                        updateClientStimword    (updateClientStimwordParms)
                /*                                                                                .then( () =>    { return deleteChildlessClientContext(contextAutoIncr, clientContextAutoIncr_OLD, parmClientContextError_OLD) })
                /*                                                                                .then( val =>   {
                /*                                                                                        exitScript(1, 'Successful update of clientStimword.', val);
                /*                                                                                })
                /*                                                                                ;
                /*                                                                })
                /*                                                                .catch( err =>  {
                /*                                                                        exitScript      (       0
                /*                                                                                        ,       (`Bad selectClientContext on update attempt!  \
                /*                                                                                                parmClientContextError_NEW: ${parmClientContextError_NEW},  \
                /*                                                                                                parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  \
                /*                                                                                                contextAutoIncr: ${contextAutoIncr}.\
                /*                                                                                                `).replace(/\t/g, '')
                /*                                                                                        ,       err
                /*                                                                                        )
                /*                                                                                        ;
                /*                                                                })
                /*
                /*                                                } else {
                /*                                                        exitScript      (       0
                /*                                                                        ,       (`Rejecting! cannot find  \
                /*                                                                                parmClientContextError_OLD: ${parmClientContextError_OLD},  \
                /*                                                                                parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  \
                /*                                                                                parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}.\
                /*                                                                                `).replace(/\t/g, '')
                /*                                                                        ,       val
                /*                                                                        )
                /*                                                                        ;
                /*                                                }
                /*                                        })                                              // end selectClientContextStimword(OLD)
                /*                                break;  // should NEVER get here.....????
                /*                                exitScript(0, 'Somehow got past the UPDATE break point?');
                /*                        }
                /*
                /*
                /*                                        /*
                /*                                                OLD is filled in,   NEW is BLANK!
                /*                                        */
                /*
                /*                        case ( parmClientContextError_OLD  > ''  &&     parmClientContextError_NEW == ''        )       :
                /*                        {
                /*                                selectClientContextStimword(parmClientSessionAutoIncr, parmStimwordPositionAutoIncr, parmClientContextError_OLD)
                /*                                        .catch( err =>  {
                /*                                                        exitScript      (       0
                /*                                                                        ,       (`selectClientContextStimnword select failed!  \
                /*                                                                                selectCparmClientContextError_OLD: ${parmClientContextError_OLD},  \
                /*                                                                                parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  \
                /*                                                                                parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}.\
                /*                                                                                `).replace(/\t/g, '')
                /*                                                                        ,       err
                /*                                                                        )
                /*                                                                        ;
                /*                                        })
                /*                                        .then( val =>   {
                /*
                /*                                                let clientMasterSessionCount = val.length;
                /*
                /*                                                if  ( clientMasterSessionCount == 1 )        {
                /*
                /*                                                        let clientContextAutoIncr = val[0]['clientContextAutoIncr'];
                /*
                /*                                                        deleteClientStimword(parmStimwordPositionAutoIncr, clientContextAutoIncr, parmClientContextError_OLD)
                /*                                                                .then( () =>    { return deleteChildlessClientContext(contextAutoIncr, clientContextAutoIncr, parmClientContextError_OLD) })
                /*                                                                .then( val =>   {
                /*                                                                        exitScript(1, 'Successful delete of clientMasterSession.', val);
                /*                                                                })
                /*                                                                .catch  ( err =>        { exitScript(0, 'Failed deleteClientStimword! - error message:', err); })
                /*                                                                ;
                /*                                                } else {
                /*                                                        exitScript      (       0
                /*                                                                        ,       (`Cannot find   \
                /*                                                                                parmClientContextError_OLD: ${parmClientContextError_OLD},  \
                /*                                                                                 to delete!  \
                /*                                                                                parmClientSessionAutoIncr: ${parmClientSessionAutoIncr},  \
                /*                                                                                parmStimwordPositionAutoIncr: ${parmStimwordPositionAutoIncr}.\
                /*                                                                                `).replace(/\t/g, '')
                /*                                                                        )
                /*                                                                        ;
                /*                                                }
                /*                                        })
                /*                                        ;
                /*                                break;  // should NEVER get here.....????
                /*                                exitScript(0, 'Somehow got past the DELETE break point?');
                /*                        }
                /*
                /*
                /*
                /*
                /*
                /*                        default :       {
                /*                                exitScript      (       -1
                /*                                                ,       (`Bad processing!  Attempted  \
                /*                                                        parmClientContextError_OLD: ${parmClientContextError_OLD},  \
                /*                                                        parmClientContextError_NEW: ${parmClientContextError_NEW}.\
                /*                                                        `).replace(/\t/g, '')
                /*                                                )
                /*                                                ;
                /*                        }
                /*                }

                /*
                /*GET contextAutoIncr using stimwordPosition(clientContextAutoIncr)
                /*        switch(true)
                /*        case   ( OLD == <blank> && NEW NOT <blank> )      {
                /*                if  ( selectClientContextStimword(NEW) == 0 )   {
                /*                        if  ( clientContext(NEW) NOT exists )   {
                /*                            INSERT clientContext(NEW)
                /*                        }
                /*                        INSERT clientStimword(NEW)
                /*                } else {        // duplicate!!
                /*                        throw dup error
                /*                }
                /*        case   ( OLD NOT <blank> && NEW NOT <blank> )      {
                /*                if  ( selectClientContextStimword(OLD) == 1 )   {
                /*                        if  ( clientContext(NEW) NOT exists )   {
                /*                            INSERT clientContext(NEW)
                /*                        }
                /*                        MODIFY clientStimword(OLD) to clientStimword(NEW)
                /*                        deleteChildlessClientContext    (OLD)
                /*                } else {
                /*                        throw missing error
                /*                }
                /*        case   ( OLD NOT <blank> && NEW == <blank> )      {
                /*                                                                //      make sure OLD exists ????
                /*                DELETE clientStimword(OLD)
                /*                deleteChildlessClientContext    (OLD)
                /*        }
                /*
                /*function selectClientContextStimword(clientSessionAutoIncr, stimwordPositionAutoIncr, clientContextError)       {
                /*
                /*                                                        //      https://stackify.dev/136700-knex-js-how-to-select-columns-from-multiple-tables
                /*                                                        //      https://stackoverflow.com/questions/65413824/multiple-count-and-left-joins-in-mysql-node-using-knex
                /*                                                        //      https://editor.datatables.net/manual/nodejs/conditions
                /*        let clientContextErrorFlag;
                /*
                /*        if  ( typeof clientContextError == 'boolean' )  {
                /*                clientContextErrorFlag  = clientContextError    ;
                /*        } else if ( typeof clientContextError == 'number' )   {
                /*                clientContextErrorFlag  = false ;
                /*        } else {
                /*                clientContextErrorFlag  = false ;
                /*        }
                /*
                /*        return knex
                /*                .select         ('clientContext.clientContextAutoIncr')
                /*                .from           ('clientStimword')
                /*                .innerJoin      ('clientContext', 'clientContext.clientContextAutoIncr', 'clientStimword.clientContextAutoIncr')
                /*                .where          (true)
                /*                .andWhere       (       {       'clientContext.clientSessionAutoIncr'           : clientSessionAutoIncr
                /*                                        ,       'clientStimword.stimwordPositionAutoIncr'       : stimwordPositionAutoIncr
                /*                                        }
                /*                                )
                /*                .andWhere       ( val =>        {
                /*                                        val.where       (       {       'clientContext.clientContextError'              :       clientContextError              }       )
                /*                                        val.orWhereRaw  (               '(true = ?)'                                    ,       clientContextErrorFlag                  )
                /*                                })
                /*                ;
                /*                                /*
                /*                                        SELECT clientContext.clientContextAutoIncr
                /*                                        FROM clientStimword
                /*                                        INNER JOIN clientContext
                /*                                        ON clientContext.clientContextAutoIncr = clientStimword.clientContextAutoIncr
                /*                                        WHERE 1
                /*                                        AND clientContext.clientSessionAutoIncr = 2349
                /*                                        AND clientContext.clientContextError   = 'def'
                /*                                        AND ( clientStimword.stimwordPositionAutoIncr = 285 OR true = true )
                /*                                */
                /*}
                /*
                /*
                /*function selectClientContext(clientContextError, clientSessionAutoIncr, contextAutoIncr)        {
                /*                                                //      https://stackoverflow.com/questions/21979388/get-count-result-with-knex-js-bookshelf-js
                /*                                                //      https://stackoverflow.com/questions/53751587/knex-js-or-inside-where
                /*                                                //      https://stackoverflow.com/questions/54407751/how-to-add-two-bind-params-in-knex/54422388
                /*                                                //      https://stackoverflow.com/questions/47464078/mysql-insert-with-multiple-selects-with-differing-number-of-returned-columns
                /*                                                //      https://stackoverflow.com/questions/30945104/db-raw-with-more-than-one-paremter-with-knex
                /*        return knex
                /*                .from           ('clientContext')
                /*                .select         ('clientContext.clientContextAutoIncr')
                /*                .where          (true)
                /*                .andWhere       (       {       'clientContext.clientContextError'      : clientContextError
                /*                                        ,       'clientContext.clientSessionAutoIncr'   : clientSessionAutoIncr
                /*                                        ,       'clientContext.contextAutoIncr'         : contextAutoIncr
                /*                                        }
                /*                                )
                /*                ;
                /*}
                /*
                /*
                /*function insertClientContext(val, clientContextError, contextAutoIncr, clientSessionAutoIncr)   {
                /*
                /*        let insertClientContextParms =
                /*                {       'clientContextError'                    :       clientContextError
                /*                ,       'contextAutoIncr'                       :       contextAutoIncr
                /*                ,       'clientSessionAutoIncr'                 :       clientSessionAutoIncr
                /*                ,       'clientContextSpeakingErrors'           :       0
                /*const parmClientMasterEmail           = myArgs.clientMasterEmail              ;
                /*                ,       'frequency'                             :       ''
                /*                ,       'clientContextErrorNotes'               :       null
                /*                }
                /*                ;
                /*
                /*        return knex.raw(insertClientMasterStatement, insertClientContextParms);
                /*}
                /*
                /*function insertClientStimword(clientContextAutoIncr, stimwordPositionAutoIncr, clientStimwordNotes)     {
                /*
                /*        let insertClientStimwordParms =
                /*                {       'clientContextAutoIncr'                 :       clientContextAutoIncr
                /*                ,       'stimwordPositionAutoIncr'              :       stimwordPositionAutoIncr
                /*                ,       'clientStimwordNotes'                   :       clientStimwordNotes
                /*                }
                /*                ;
                /*        return knex.raw(insertClientStimwordStatement, insertClientStimwordParms);
                /*}
                /*
                /*
                */

                /*
                /*function updateClientStimword   (parmObject)    {
                /*
                /*
                /* try this:  (2022-04-01 )     https://www.sitepoint.com/community/t/promises-feedback/384246/3
                /* function updateClientStimword( {  stimwordPositionAutoIncr
                /*                                   , clientContextAutoIncr_OLD
                /*                                   , clientContextError_OLD
                /*                                   , clientContextAutoIncr_NEW
                /*                                   , clientContextError_NEW
                /*                                   , clientStimwordNotes
                /*                                   }
                /*                                )
                /*       {
                /*
                /*        let updateClientStimwordWhereParms =
                /*                {       'stimwordPositionAutoIncr'      :       parmObject.stimwordPositionAutoIncr
                /*                ,       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_OLD
                /*                ,       'clientContextError'            :       parmObject.clientContextError_OLD
                /*                };
                /*
                /*        let updateClientStimwordUpdateParms =
                /*                {       'clientContextAutoIncr'         :       parmObject.clientContextAutoIncr_NEW
                /*                ,       'clientContextError'            :       parmObject.clientContextError_NEW
                /*                ,       'clientStimwordNotes'           :       parmObject.clientStimwordNotes
                /*                };
                /*
                /*        return knex
                /*                .from('clientStimword')
                /*                .where(updateClientStimwordWhereParms)
                /*                .update(updateClientStimwordUpdateParms)
                /*                ;
                /*}
                /*
                /*function deleteClientStimword(stimwordPositionAutoIncr, clientContextAutoIncr, clientContextError)      {
                /*        let deleteClientStimwordParms =
                /*                {       'stimwordPositionAutoIncr'      :       stimwordPositionAutoIncr
                /*                ,       'clientContextAutoIncr'         :       clientContextAutoIncr
                /*                ,       'clientContextError'            :       clientContextError
                /*                };
                /*        return knex
                /*                .from('clientStimword')
                /*                .where(deleteClientStimwordParms)
                /*                .delete()
                /*                ;
                /*}


                /*function deleteChildlessClientContext(contextAutoIncr, clientContextAutoIncr, clientContextError)       {
                /*        let deleteClientContextParms =
                /*                {       'contextAutoIncr'                       :       contextAutoIncr
                /*                ,       'clientContextAutoIncr'                 :       clientContextAutoIncr
                /*                ,       'clientContextError'                    :       clientContextError
                /*                ,       'clientContextErrorNotes'               :       null
                /*                ,       'frequency'                             :       ''
                /*                ,       'clientContextSpeakingErrors'           :       0
                /*                };
                /*        return knex
                /*                .from('clientContext')
                /*                .delete()
                /*                .where(deleteClientContextParms)
                /*                .andWhere('clientContextAutoIncr', 'NOT IN',
                /*                        knex    .select('clientContextAutoIncr')
                /*                                .from('clientStimword')
                /*                                .where({ 'clientContextAutoIncr'        :       clientContextAutoIncr   })
                /*                )
                /*                ;
                /*}
                */


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

                /*function returnInsertClientContextStatement()   {
                /*
                /*let returnVar =
                /*        `
                /*        INSERT INTO \`clientContext\`
                /*        (               \`layoutName\`
                /*        ,               \`teacherEmail\`
                /*        ,               \`clientMasterEmail\`
                /*        ,               \`sessionName\`
                /*        ,               \`clientSessionAutoIncr\`
                /*        ,               \`soundPhoneme\`
                /*        ,               \`contextPosition\`
                /*        ,               \`contextAutoIncr\`
                /*        ,               \`clientContextError\`
                /*        ,               \`clientContextSpeakingErrors\`
                /*        ,               \`frequency\`
                /*        ,               \`clientContextErrorNotes\`
                /*        )
                /*        (       SELECT  \`clientSession\`.\`layoutName\`
                /*                ,               \`clientSession\`.\`teacherEmail\`
                /*                ,               \`clientSession\`.\`clientMasterEmail\`
                /*                ,               \`clientSession\`.\`sessionName\`
                /*                ,               \`clientSession\`.\`clientSessionAutoIncr\`
                /*                ,               \`context\`.\`soundPhoneme\`
                /*                ,               \`context\`.\`contextPosition\`
                /*                ,               \`context\`.\`contextAutoIncr\`
                /*                ,               :clientContextError
                /*                ,               :clientContextSpeakingErrors
                /*                ,               :frequency
                /*                ,               :clientContextErrorNotes
                /*                FROM    \`clientSession\`
                /*                INNER JOIN              \`context\`
                /*                        ON              1
                /*                        AND             \`context\`.\`contextAutoIncr\`         = :contextAutoIncr
                /*                        AND             \`clientSession\`.\`layoutName\`        = \`context\`.\`layoutName\`
                /*                WHERE   1
                /*                AND     \`clientSession\`.\`clientSessionAutoIncr\`             = :clientSessionAutoIncr
                /*        )
                /*        RETURNING \`clientContextAutoIncr\`
                /*        ;
                /*        `;
                /*    return returnVar;
                /*};
                /*
                /*
                /*function        returnInsertClientStimwordStatement()   {
                /*
                /*let returnVar =
                /*        `
                /*        INSERT INTO \`clientStimword\`
                /*        (       \`layoutName\`
                /*        ,       \`teacherEmail\`
                /*        ,       \`clientMasterEmail\`
                /*        ,       \`sessionName\`
                /*        ,       \`soundPhoneme\`
                /*        ,       \`contextPosition\`
                /*        ,       \`clientContextError\`
                /*        ,       \`stimwordPageNbr\`
                /*        ,       \`stimwordLineNbr\`
                /*        ,       \`stimwordWord\`
                /*        ,       \`stimwordPositionNbr\`
                /*        ,       \`stimwordPositionSetting\`
                /*        ,       \`clientStimwordNotes\`
                /*        ,       \`clientContextAutoIncr\`
                /*        ,       \`stimwordPositionAutoIncr\`
                /*        )
                /*        (       SELECT  \`clientContext\`.\`layoutName\`
                /*                ,       \`clientContext\`.\`teacherEmail\`
                /*                ,       \`clientContext\`.\`clientMasterEmail\`
                /*                ,       \`clientContext\`.\`sessionName\`
                /*                ,       \`stimwordPosition\`.\`soundPhoneme\`
                /*                ,       \`stimwordPosition\`.\`contextPosition\`
                /*                ,       \`clientContext\`.\`clientContextError\`
                /*                ,       \`stimwordPosition\`.\`stimwordPageNbr\`
                /*                ,       \`stimwordPosition\`.\`stimwordLineNbr\`
                /*                ,       \`stimwordPosition\`.\`stimwordWord\`
                /*                ,       \`stimwordPosition\`.\`stimwordPositionNbr\`
                /*                ,       \`stimwordPosition\`.\`stimwordPositionSetting\`
                /*                ,       :clientStimwordNotes
                /*                ,       \`clientContext\`.\`clientContextAutoIncr\`
                /*                ,       \`stimwordPosition\`.\`stimwordPositionAutoIncr\`
                /*                FROM    \`clientContext\`
                /*                INNER JOIN      \`stimwordPosition\`
                /*                        ON      1
                /*                        AND     \`stimwordPosition\`.\`stimwordPositionAutoIncr\`       = :stimwordPositionAutoIncr
                /*                        AND     \`clientContext\`.\`layoutName\`                        = \`stimwordPosition\`.\`layoutName\`
                /*                WHERE   1
                /*                AND             \`clientContext\`.\`clientContextAutoIncr\`             = :clientContextAutoIncr
                /*        )
                /*        RETURNING \`clientStimwordAutoIncr\`
                /*        `;
                /*    return returnVar;
                /*};
                */
[root@localhost knex]#
