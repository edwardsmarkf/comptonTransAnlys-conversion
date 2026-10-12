/*
##   http://192.168.100.117:3030/knex-generic-raw/  QUESTION-MARK-CHARACTER  knexSQL=serverVersionNowSQL&param=testing
***/
SELECT  VERSION()  "Server Version"
  ,     NOW()      "Server Time"
  ,     :param     "  -  Parameter Test"
  ;
