#!/bin/bash

./platform-linux "$1" -c="git@github.com:jembi/cares-on-platform.git" -c="git@github.com:jembi/disi-on-platform.git" --dev --env-file="./.env.local" cares-on-platform disi-on-platform
