# Odoo
## Python
Install Python:
```
sudo apt install pyenv
pyenv install 3.12
pyenv local 3.12
python --version #[Should show python 3.12]
```
## Python Env
Install Python venv
```
sudo apt install venv
python3.12 -m venv .venv #[.venv is the environment name, can be set anything]
source .venv/bin/activate
```
## Install Requirements
First install C compilers
```
sudo apt update
sudo apt install libpq-dev python3-dev
```
---
```
pip install -r requirements.txt
```

---


[![Build Status](https://runbot.odoo.com/runbot/badge/flat/1/master.svg)](https://runbot.odoo.com/runbot)
[![Tech Doc](https://img.shields.io/badge/master-docs-875A7B.svg?style=flat&colorA=8F8F8F)](https://www.odoo.com/documentation/master)
[![Help](https://img.shields.io/badge/master-help-875A7B.svg?style=flat&colorA=8F8F8F)](https://www.odoo.com/forum/help-1)


## Getting started with Odoo

For a standard installation please follow the [Setup instructions](https://www.odoo.com/documentation/master/administration/install/install.html)
from the documentation.

To learn the software, we recommend the [Odoo eLearning](https://www.odoo.com/slides),
or [Scale-up, the business game](https://www.odoo.com/page/scale-up-business-game).
Developers can start with [the developer tutorials](https://www.odoo.com/documentation/master/developer/howtos.html).

## Security

If you believe you have found a security issue, check our [Responsible Disclosure page](https://www.odoo.com/security-report)
for details and get in touch with us via email.
