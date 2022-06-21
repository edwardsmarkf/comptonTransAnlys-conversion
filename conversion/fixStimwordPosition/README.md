no need for fixStimwordPosition.bsh anymore!

mariadb --verbose < ./fixStimwordPosition.sql ;

npm install knex ; npm install mysql;

node ./fixStimwordPosition.js > ./temp.sql ;

mariadb --verbose comptonTransAnlys < ./temp.sql ;

rm -verbose ./temp.sql ;
