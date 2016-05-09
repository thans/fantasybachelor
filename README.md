Fantasy Bachelor
===========

Tore and Mitchell live with 8 other guys. We all enjoy playing fantasy football and having people over to watch The Bachelor with. What if we could combine the fun for fantasy football with The Bachelor? Well, we decided to do just that by creating the Fantasy Bachelor over winter break in 2013. This is a hack project (and therefore lacks a lot of comments in the code and has lots of bugs).

Visit it live at http://fantasybach.com



Developer Setup
===============

### Step 1: Setup Node and npm

Follow the instructions at http://nodejs.org/ for getting started with node and npm.

Then from the project root, run:
```
npm install
```

### Step 2: Setup SASS and Compass

Install SASS and Compass using (make sure you have installed Ruby):

```
gem update --system && gem install sass && gem install compass
```

### Step 2: Setup Bower

Bower is a client side asset manager. It will automatically download the client side javascript dependencies.

Install and setup Bower using:

```
npm install -g bower
bower install
```

### Setp 3: Setup Grunt

Grunt is a javascript task runner (comparable to Ant). It will do everything needed to get the app ready to start up!

Install Grunt using:

```
npm install -g grunt-cli
```

### Step 4: Get config file

Ask @MixMasterMitch for a config file. Place the config file in the ```/config``` folder.


### Step 5: Setup a Local Database

Create a local sql database such as with MAMP. http://www.mamp.info/en/downloads/

Name the database ```fantasyBach```

Ask @MixMasterMitch for a dump of the database, and import it.

Make sure that the config file you got in step 4 has the correct settings to match your local database.

### Step 6: Setup Aliases

I recommend you setup some aliases in your .bash_profile (or applicable script file), like the following:

```
# Fantasy Bachelor
export FANTASYBACH_HOME=~/Documents/GitHub/fantasybachelor
alias fb-home='cd $FANTASYBACH_HOME'
alias fb-dev='fb-home ; NODE_ENV=development grunt build:development'
alias fb-prod='fb-home ; export NODE_ENV=production; grunt build:production; node build/server/server'
```

Then you can just run ```fb-dev``` to start up the app. The grunt tasks should run and start up a browser with a debug console
and the app homepage. After the console page loads, advance the debugger. Then when the console displays ```Listening on port 8000``` refresh the app homepage.
Grunt will be watching for changes to any of the src files and automatically update the build directory.

brew install pkg-config cairo libpng jpeg giflib
