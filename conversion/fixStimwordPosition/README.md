
now call ./fixStimwordPosition/fixStimwordPosition.bsh through the 00_master.bsh



mariadb --verbose < ./fixStimwordPosition.sql ;

npm install knex ; npm install mysql;

node ./fixStimwordPosition.js > ./temp.sql ;

mariadb --verbose comptonTransAnlys < ./temp.sql ;

rm -verbose ./temp.sql ;

################################################NOW OBSOLETE -- fixStimwordPosition.bsh
