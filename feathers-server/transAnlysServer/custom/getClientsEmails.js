/*
     getClientsEmails.js    -- 2026-08-09

*/


import { readFile } from 'fs/promises';    // needed to read the sql statement.


export class  getClientsEmails {
  constructor(app) {
    this.app = app;
  }

  async getClientsEmails(_params) {
        
        const currentApp = this.app || _params.app;  // suggested by google-AI  2026-08-09

        const knexClient = currentApp.get('mysqlClient');

        const voiceFileDirectory        =       '/home/mark/voicefiles/'        ;


                /* first look in the Mariadb clientMaster table */ 
        const clientMasterSqlStatement = await readFile( './src/sql/clientMasterEmail.sql'   , 'utf8');
       
        let  clientMasterEmailJSON      =  await knexClient.raw( clientMasterSqlStatement , _params.query   );

        let clientMasterEmailObj        = JSON.parse(clientMasterEmailJSON[0][0]['JSON_OBJECTAGG']);
        clientMasterEmailJSON           = null;

        let clientMasterEmailKeys       = Object.keys(clientMasterEmailObj);



                        /* now check the clients directory (email address) for any Eval_ voicefiles */

        const rootDirName    =       voiceFileDirectory
                             +       _params.query['TEACHER_EMAIL']
                             +       '/'
                             ;

        console.log('Looking up: ' + rootDirName);

        let directoryNames = [];
                                //      https://www.geeksforgeeks.org/node-js-fs-readdirsync-method/
        for ( const clientEmailObj of fs.readdirSync(rootDirName, { withFileTypes: true }) )    {
                if  ( clientEmailObj.isDirectory() ) {  // isDirectory() seems to wrok with 'isFileTypes: true'  ( ;-)
                        const clientDirectory = (rootDirName + '/' + clientEmailObj.name + '/' );
                        if  (  fs.readdirSync(clientDirectory).filter(file => file.startsWith('Eval_')).length ) {
                                                                                        // only look for Eval_ prefix
                                directoryNames.push(clientEmailObj.name);
                        }
                }
        }


                        /* remove any client directory name (email) that has a corrsponding entry in the clientMaster table */

                                //      https://www.techiedelight.com/find-difference-between-two-arrays-in-javascript/
        let untranscribedEmail = directoryNames.filter(x => !clientMasterEmailKeys.includes(x));
        directoryNames = null;  // free up a bit of space


                        /* convert clientMasterEmail to an object for smart-html-elements   */

        let clientMasterReturnObj = new Array();
        for (const element of clientMasterEmailKeys.sort() )
        {
                clientMasterReturnObj.push      (       {       'group'         :       'Transcribed Emails'
                                                        ,       'label'         :       element
                                                        ,       'value'         :       JSON.stringify(
                                                                                                {       'email'         :       element
                                                                                                ,       'language'      :       clientMasterEmailObj[element]
                                                                                                }
                                                                                        )
                                                        }
                                                )
        };
        clientMasterEmailObj    = null;
        clientMasterEmailKeys   = null;



                        /* convert untranscribed emails to an object for smart-html-elements   */
        let untranscribedEmailObj = new Array();
        for (const element of untranscribedEmail.sort() )
        {
                untranscribedEmailObj.push      (       {       'group' :       'Untranscribed Emails'
                                                        ,       'label' :       element
                                                        ,       'value' :       JSON.stringify({ 'email' : element })
                                                        }
                                                )
        };
        untranscribedEmail = null;




                        /* return the results */
        let returnArray = [];
        if  ( untranscribedEmailObj.length )    {
                returnArray =   [       ...untranscribedEmailObj
                                ,       ...clientMasterReturnObj
                                ]
                                ;
        } else {
                returnArray =   clientMasterReturnObj
        }

        return returnArray;
  };
};
