
the html  is here:    https://comptonpeslonline.com/newTranscriptionInterface/transcription.html


 find  /home/mark/original/feathers/src   -type f -newermt "2023-05-29"  -name  '*.js'  -exec  ls -l  {}  \;  | sed -e 's/^.*mark mark //' | sort  -n -r
