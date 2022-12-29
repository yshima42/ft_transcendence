#!/bin/bash

set -eux

# Case: E: Unable to acquire the dpkg frontend lock (/var/lib/dpkg/lock-frontend), is another process using it?
# sudo rm /var/lib/apt/lists/lock
# sudo rm /var/lib/dpkg/lock
# sudo rm /var/lib/dpkg/lock-frontend

# Update Browser
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo apt update
sudo apt install google-chrome-stable firefox

# For Running docker command without sudo
sudo adduser $USER docker

sudo reboot
