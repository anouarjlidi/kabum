# KaBuM!
A remake of the popular Brazilian e-commerce [website](https://www.kabum.com.br/).

## Requirements
- [Symfony base requirements](https://symfony.com/doc/current/reference/requirements.html)
- [Composer](https://getcomposer.org/)
- [Yarn](https://yarnpkg.com/)

You will likely need to install `php-mbstring`, `php-xml` and `php-intl`. The application will complain if any extension is missing.

## Instructions
Install dependencies
```
composer install
yarn install
```

Build the assets
```
yarn encore dev
```

Create the `.env.local` file and configure it as needed
```
DATABASE_URL=mysql://db_user:db_password@127.0.0.1:3306/database_name
APP_ENV=dev
```

Create the database you specified in the last step and execute the doctrine migrations
```
$ php bin/console doctrine:migrations:migrate
```

You can add an administrator user with the command:
```
php bin/console app:create-admin <username> <password>
```

## Recommendations
- Use the `UTC` timezone in your PHP configuration. Localized time will be generated from UTC time as configured by the user or automatically detected by client-side scripting.

## Security
The `var` directory in any Symfony web app comes with 777 permission to ensure PHP will be able to write to it. You can improve the security of this directory by changing its GID to the same user that the web server is running as; or, if applicable, the PHP-FPM process, and then remove "others" write permission. For example, on a Debian based system it will look like this:
```
UID | GID
doug:www-data
```

After that, you may remove "others" write permission. Just be sure that the group can write to `var`.
```
chmod -R g+w var
chmod -R o-w var
```

## License
Copyright 2019 Douglas Silva (0x9fd287d56ec107ac)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
