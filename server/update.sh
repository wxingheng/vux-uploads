#!/usr/bin/expect -f
set timeout -1
set password PAsscloud
# spawn scp -r ./dist/. passcloud@192.168.110.75:/nginx/html/fed/hoslink-daas/.
spawn scp -r ./public/. passcloud@192.168.110.75:/nginx/html/fed/fed-node-upload/.
expect "*assword:*"
send "$password\r"
interact
