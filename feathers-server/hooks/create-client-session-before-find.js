#!  /bin/bash
#
#
#      create-client-session-before-find.js    2026-022


##   create the feathers service using tcl/expect


export hookName='client-session'                                                                                     ;

export serviceType='regular'                                                                                               ;

expect <(cat <<'END_OF_GENERATE_APP'
        #       generates a feathers service


                ## debugging:  exp_internal 1                   ;
        set timeout -1                                                                                                  ;

        set UPARROW     \x1B\[A                                                                                         ;
        set DOWNARROW   \x1B\[B                                                                                         ;
        set SPACE       \x20                                                                                            ;
        set RETURN      \x0d                                                                                            ;

              #npx feathers generate hook   --name  shit --type regular
        spawn npx feathers generate hook   --name  $env(hookName)         --type $env(serviceType)                      ;


expect eof

END_OF_GENERATE_APP
)       ## end of feathers generate app





sed --in-place  --file=-  ./src/hooks/${hookName}.js   <<END_OF_SED ;
/console.log..Running hook .* on $.context\.path}\.\${context\.method}.*/a                                              \\
        context.params.query = {                // added by mark                                                        \\
          ...context.params.query               // added by mark                                                        \\
        }                                       // added by mark                                                        \\
        return context;                                                                                                 \\


END_OF_SED


sed --in-place  --expression='s/^       find: \\[],$/      find: [clientSessionBeforeFind],';/    \\
         /home/mark/my-new-app/src/services/${hookName}/${hookName}.js                         ;

exit  ;

#
        #expect -re ".* What kind of hook is it.*"                                                                       ;
        #send -- "${DOWNARROW}${RETURN}"                                                                                  ;
        #expect -re ".*Does this service require authentication.*"                                                       ;
        #send -- "n${RETURN}"                                                                                           ;
        ##expect -re ".*Which schema definition format do you want to use.*"                                              ;
        ##send -- "${RETURN}"                                                                                             ;
