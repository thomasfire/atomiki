# atomiki
アトミキ - Rework of Atoms The Game - small game, where you find atoms by tracing the electrons.


## Original game

The original game can be found on [SourceForge](https://sourceforge.net/projects/atomsthegame/) (one of the mistakes from my youth). 
The code there... well, I’ve come a long way since then, but it still works perfectly on Oracle JRE.


## Build and run

Install JDK 21 and NodeJS 20 on your preferred platform and then:

```shell
git clone https://github.com/thomasfire/atomiki.git
cd atomiki/
nano src/main/resources/application.properties # edit the configuration 
cd app
npm install
npm run build
cd ..
sh mvnw -B package --file pom.xml
sh mvnw spring-boot:run
```
