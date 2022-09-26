#!/bin/bash

DOCKER_HOST=ssh://ubuntu@qa.cares-disi.gicsandbox.org ./platform-linux "$1" -c="git@github.com:jembi/cares-on-platform.git" -c="git@github.com:jembi/disi-on-platform.git" --env-file="./.env.qa" cares-on-platform disi-on-platform monitoring
