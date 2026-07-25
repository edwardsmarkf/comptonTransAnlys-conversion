#!  /bin/bash
#
#
#      create-client-context-before-find.js    2026-022


##   create the feathers service using tcl/expect


export hookName='client-stimword'                                                                                     ;

export serviceType='regular'                                                                                               ;

expect <(cat <<'END_OF_GENERATE_APP'
        #       generates a feathers service

        set timeout -1                                                                                                  ;

        set UPARROW     \x1B\[A                                                                                         ;
        set DOWNARROW   \x1B\[B                                                                                         ;
        set SPACE       \x20                                                                                            ;
        set RETURN      \x0d                                                                                            ;

        spawn npx feathers generate hook   --name  $env(hookName)         --type $env(serviceType)   ;

        expect -re ".* What kind of hook is it.*"                                                                       ;
        sed -- "${DOWNARROW}${RETURN}"                                                                                  ;

        expect -re ".*Does this service require authentication.*"                                                       ;
        send -- "n${RETURN}"                                                                                            ;

        expect -re ".*Which schema definition format do you want to use.*"                                              ;
        send -- "${RETURN}"                                                                                             ;

expect eof

END_OF_GENERATE_APP
)       ## end of feathers generate app


sed --in-place  --file=-  ./src/hooks/${hookName}.js   <<END_OF_SED ;
/console.log..Running hook .* on $.context\.path}\.\${context\.method}.*/c                                            \\
        const knexClient =   context.app.get('mysqlClient') ;                                                           \\
                                                                                                                        \\
        const query = context.service.createQuery(context.params) ;                                                     \\
                                                                                                                        \\
        // https://knexjs.org/guide/query-builder.html#knex                                                             \\
        query   .clear  ('select')  // remove ALL existing columns from queryBuilder                                    \\
                .select (       { 'contextAutoIncr'             : 'contextAutoIncr'                             }       \\
                        ,       knexClient.raw('CONCAT(\`contextPosition\` , "-" , \`soundPhoneme\`) AS positionSound')     \\
                        ,       { 'frequency'                   : 'frequency'                                   }       \\
                        ,       { 'clientContextErrorSound'     : 'clientContextErrorSound'                     }       \\
                        ,       { 'clientContextErrorCount'     : 'clientContextErrorCount'                     }       \\
                        ,       { 'clientContextErrorNotes'     : 'clientContextErrorNotes'                     }       \\
                        ,       { 'clientContextAutoIncr'       : 'clientContextAutoIncr'                       }       \\
                        )                                                                                               \\
                .orderBy('contextAutoIncr')                                                                             \\
                ;                                                                                                       \\
                                                                                                                        \\
        context.params.knex = query ;                                                                                   \\
                                                                                                                        \\
        return context;                                                                                                 \\

END_OF_SED


sed --in-place  --expression='s/^       find: [],$/      find: [clientContextBeforeFind],';/    \\
         /home/mark/my-new-app/src/services/client-context/client-context.js                         ;

exit  ;

#
