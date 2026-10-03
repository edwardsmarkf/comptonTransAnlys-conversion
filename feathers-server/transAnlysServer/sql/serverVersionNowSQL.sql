#
##   http://192.168.100.117:3030/knex-generic-raw/?knexSQL=serverVersionNowSQL&param=test
#
SELECT  VERSION()  "Server Version"
  ,     NOW()      "Server Time"
  ,     :param     "Parameter Test "
  ;
