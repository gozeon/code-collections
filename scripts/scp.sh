#!/usr/bin/expect -f

# chmod +x scp.sh
# ./scp.sh
spawn scp -r ./dist root@IP:/var/www/html

expect {
  -re ".*es.*o.*" {
    exp_send "yes\r"
    exp_continue
  }
  -re ".*sword.*" {
    exp_send "PASSWORD\r"
  }
}
interact
