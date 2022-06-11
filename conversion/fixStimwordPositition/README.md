no need for fixStinwordPosition.bsh anymore!

mariadb --verbose < fixStimwordPosition.sql ;

npm install knex ; npm install mysql;

node fixStimwordPosition.js > ./temp.sql ;

mariadb --verbose ./temp.sql ;

rm -verbose ./temp.sql ;
