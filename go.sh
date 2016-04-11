#!/bin/bash

source venv/bin/activate
sudo service postgresql restart
python manage.py runserver $IP:$PORT