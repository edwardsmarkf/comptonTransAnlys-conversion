#!  /bin/bash
#
#
#      create-client-context-before-find.js    2026-022


##   create the feathers service using tcl/expect


export serviceName='client-stimword'                                                                                     ;

export serviceType='regular'                                                                                               ;

expect <(cat <<'END_OF_GENERATE_APP'
        #       generates a feathers service

        set timeout -1                                                                                                  ;

        set UPARROW     \x1B\[A                                                                                         ;
        set DOWNARROW   \x1B\[B                                                                                         ;
        set SPACE       \x20                                                                                            ;
        set RETURN      \x0d                                                                                            ;

        spawn npx feathers generate hook   --name  $env(serviceName)         --type $env(serviceType)   ;

        expect -re ".*Does this service require authentication.*"                                                       ;
        send -- "n${RETURN}"                                                                                            ;

        expect -re ".*Which schema definition format do you want to use.*"                                              ;
        send -- "${RETURN}"                                                                                             ;

expect eof

END_OF_GENERATE_APP
)       ## end of feathers generate app




sed --in-place  --expression='s/^       find: [],$/      find: [clientContextBeforeFind],';;   /home/mark/my-new-app/src/services/client-context/client-context.js
