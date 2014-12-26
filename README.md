Fantasy Bachelor
===========

Tore and Mitchell live with 8 other guys. We all enjoy playing fantasy football and having people over to watch The Bachelor with. What if we could combine the fun for fantasy football with The Bachelor? Well, we decided to do just that by creating the Fantasy Bachelor over winter break in 2013. This is a hack project (and therefore lacks a lot of comments in the code and has lots of bugs).

Visit it live at http://fantasybach.com



Developer Setup
===============

### Step 1: Setup Node and npm

Follow the instructions at http://nodejs.org/ for getting started with node and npm.

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
npm install -g grunt
```

### Setp 4: Setup Aliases

I recommend you setup some aliases in your .bash_profile (or applicable script file), like the following:

```
# Fantasy Bachelor
export FANTASYBACH_HOME=~/Documents/GitHub/fantasybachelor
alias fb-home='cd $FANTASYBACH_HOME'
alias fb='fb-home ; RDS_USERNAME=root RDS_PASSWORD=root RDS_HOSTNAME=127.0.0.1 RDS_DATABASE=fantasyBach RDS_PORT=8889 RDS_PROTOCOL=mysql NODE_ENV=development TZ=America/Los_Angeles grunt debug'
```

Then you can just run ```fb``` to start up the app.
