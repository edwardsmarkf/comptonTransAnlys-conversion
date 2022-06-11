no need for fixStinwordPosition.bsh anymore!

mariadb --verbose < ./fixStimwordPosition/fixStimwordPosition.sql ;

npm install knex ; npm install mysql;

node .fixStimwordPosition/fixStimwordPosition.js > ./temp.sql ;

mariadb --verbose ./temp.sql ;

###   rm -verbose ./temp.sql ;
