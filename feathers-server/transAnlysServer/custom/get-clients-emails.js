

import { readFile } from 'fs/promises';        /* added by mark */


export class  getClientsEmails {
  constructor(options) {
    this.options = options;
  }

  async getClientsEmails(_params) {
        
        const fs = require('fs');
        const knexClient = this.app.get('mysqlClient');

        const voiceFileDirectory        =       '/home/mark/voicefiles/'        ;


                /* first look in the Mariadb clientMaster table */                           /*process.cwd() +*/
        const clientMasterSqlStatement = await readFile(   './src/sql/clientMasterEmail.sql'   , 'utf8');
        let  clientMasterEmailJSON      =  await knexClient.raw( clientMasterSqlStatement , params.query   );

        let clientMasterEmailObj        = JSON.parse(clientMasterEmailJSON[0][0]['JSON_OBJECTAGG']);
        clientMasterEmailJSON           = null;

        let clientMasterEmailKeys       = Object.keys(clientMasterEmailObj);



                        /* now check the clients directory (email address) for any Eval_ voicefiles */

        const rootDirName       =       voiceFileDirectory
                        +       params.query['TEACHER_EMAIL']
                        +       '/'
                        ;

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

//const clientMasterEmailSql =
//`
//       SELECT
//            JSON_OBJECTAGG(\`clientMaster\`.\`clientMasterEmail\`,  \`clientMaster\`.\`clientMasterSpecLanguage\`   ) 'JSON_OBJECTAGG'
//        FROM    \`clientMaster\`
//        WHERE   1
//        AND     \`layoutName\`          =  :LAYOUT_NAME
//        AND     \`teacherEmail\`        =  :TEACHER_EMAIL
//        ;
`;
