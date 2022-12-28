#!/bin/bash

set -eux

# Update Browser
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo apt update
sudo apt install google-chrome-stable firefox

# For Running docker command without sudo
sudo adduser $USER docker

sudo reboot