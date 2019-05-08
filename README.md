
# Prerequisites
Before you are ready to run Remote-works you will need additional software installed on your computer.

## Python
Download the latest 3.7 Windows installer from the Python download page and follow the instructions.

Make sure that “Add Python 3.7 to PATH” is checked.

Alternatively, make your life easier and install the latest Anaconda

## Node.js
Version 10 or later is required. Download the Windows installer from the Node.js downloads page.

Make sure that “Add to PATH” is selected.

## PostgreSQL
Remote-works needs PostgreSQL version 9.4 or above to work. Get the Windows installer from the project’s download page.

Make sure you keep track of the password you set for the administration account during installation.

## GTK+
Download the 64-bit Windows installer.

Make sure that “Set up PATH environment variable to include GTK+” is selected.

## Compilers
Please download and install the latest version of the Build Tools for Visual Studio.

# Installation
All commands need to be performed in either PowerShell or a Command Shell.

Clone the repository (replace the URL with your own fork where needed):

git clone https://github.com/tetyanaloskutova/remote-works.git
Enter the directory:

cd remote-works/
## Install all dependencies:

We strongly recommend creating a virtual environment before installing any Python packages.

python -m pip install -r requirements.txt
Set SECRET_KEY environment variable.

We try to provide usable default values for all of the settings. We’ve decided not to provide a default for SECRET_KEY as we fear someone would inevitably ship a project with the default value left in code.

$env:SECRET_KEY = "<mysecretkey>"
### Warning

Secret key should be a unique string only your team knows. Running code with a known SECRET_KEY defeats many of Django’s security protections, and can lead to privilege escalation and remote code execution vulnerabilities. Consult Django’s documentation for details.

### Create a PostgreSQL user:

Use the pgAdmin tool that came with your PostgreSQL installation to create a database user for your store.

Unless configured otherwise the store will use remote_works as both username and password. Remember to give your user the SUPERUSER privilege so it can create databases and database extensions.

### Create a PostgreSQL database

See PostgreSQL’s createdb command for details.

Note

Database name is extracted from the DATABASE_URL environment variable. If absent it defaults to remote_works.

### Prepare the database:

python manage.py migrate
Warning

This command will need to be able to create a database and some database extensions. If you get an error related to these make sure you’ve properly assigned your user SUPERUSER privileges.

## Install front-end dependencies:

npm install
Note

If this step fails go back and make sure you’re using new enough version of Node.js.

Prepare front-end assets:

npm run build-assets
Compile e-mails:

npm run build-emails
Start the development server:

python manage.py runserver


# Installation on Heroku
Or launch the demo on a free Heroku instance.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Login credentials: `admin@example.com`/`admin`
