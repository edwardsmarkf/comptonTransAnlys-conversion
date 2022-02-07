

====  2022-02-07

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

                        selectClientContext(contextAutoIncr)
                                .then( val =>  { return insertClientContext(val, contextAutoIncr);})            //.then(insertClientContext)
                                .then( val =>  {
                                        let clientContextAutoIncr;
                                        if  ( val.length && val[0].hasOwnProperty('clientContextAutoIncr'))             {
                                                clientContextAutoIncr = val[0]['clientContextAutoIncr'];
                                        } else if  ( val[0].length && val[0][0].hasOwnProperty('clientContextAutoIncr')){
                                                clientContextAutoIncr = val[0][0]['clientContextAutoIncr'];
                                        } else {
                                                console.log('ERROR!');
                                                console.log(JSON.stringify(val));
                                        }
                                        if  ( parmClientContextError_OLD == ''  )       {
                                                console.log('old is NOT blank! ' + parmClientContextError_OLD );
                                                insertClientStimword(clientContextAutoIncr)
                                                        .then( val => { console.log(JSON.stringify(val));});
                                        } else {
                                                console.log('old is blank! ');
                                        }
                                });

                } else {
                        console.log ('is blank!');
                }

        });


/*
GET contextAutoIncr using stimwordPosition(clientContextAutoIncr)

    if  ( NEW != <blank> )      {
        if  ( clientContext(NEW) NOT exists )   {
            INSERT clientContext(NEW)
        }
        if  ( OLD == <blank> ) {
            INSERT clientStimword(NEW)
        } else {
            MODIFY clientStimword(OLD) to clientStimword(NEW)
            deleteBlankClientContext(OLD)
        }
    } else {
        DELETE clientStimword(OLD)
        deleteBlankClientContext(OLD)
    }
*/


function selectClientContext(parmContextAutoIncr)       {
                                                //      https://stackoverflow.com/questions/21979388/get-count-result-with-knex-js-bookshelf-js
                                                //      https://stackoverflow.com/questions/53751587/knex-js-or-inside-where
                                                //      https://stackoverflow.com/questions/54407751/how-to-add-two-bind-params-in-knex/54422388
                                                //      https://stackoverflow.com/questions/47464078/mysql-insert-with-multiple-selects-with-differing-number-of-returned-columns
                                                //      https://stackoverflow.com/questions/30945104/db-raw-with-more-than-one-paremter-with-knex
        var contextAutoIncr = parmContextAutoIncr       ;
        return knex.from('clientContext')
                .select         ('clientContextAutoIncr')
                .where          (true)
                .andWhere       ({'clientContextError'          : parmClientContextError_NEW    })
                .andWhere       ({'clientSessionAutoIncr'       : parmClientSessionAutoIncr     })
                .andWhere       ({'contextAutoIncr'             : parmContextAutoIncr           })
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




function deleteBlankClientContext(clientContextAutoIncr)        {
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
