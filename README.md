# cares-disi
The combined repository to launch the CARES COVID custom package and DISI HIV custom package to the same environment.

## Deploying

This project can be deployed locally, and to a remote server. To deploy, ensure that you have the [Go CLI](https://github.com/openhie/package-starter-kit#package-start-kit) binary in the root folder. The Go CLI can be retrieved by running the script below

```sh
 ./get-cli
```
> The script above downloads three binaries - `instant-linux` for Linux OS, `instant-macos` for Mac OS and `instant.exe` for Windows OS

Once the Go CLI has been downloaded, run the following commands for deploying

```sh
 ./deploy-local                             [init|up|down|destroy] for local deployments
 
 DOCKER_HOST=ssh://<user@IP> ./deploy-qa.sh [init|up|down|destroy] for remote deployments
 ```
> A docker swarm should be initiated on the server being deployed to. Edit the deploy scripts to match your operating system.
