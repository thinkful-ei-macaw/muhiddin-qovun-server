# Qovun Server

The app will eventually help connect Uzbek-Americans, people interested in Uzbek tradition and/or communities
and help organize events and meetups, although the app is at the beginning stage right now.

Live: https://www.qovun.com/

## Screenshots

![Screenshots](https://github.com/thinkful-ei-macaw/muhiddin-qovun-server/blob/master/screenshot.png)

## Technologies

  HTML, CSS, React, NodeJS, Express, PostgreSQL


## Setting Up

- Install dependencies: `npm install`
- Create development and test databases: `createdb qovun`, `createdb qovun-test`
- Create database user: `createuser qovun`
- Grant privileges to new user in `psql`:
  - `GRANT ALL PRIVILEGES ON DATABASE qovun TO qovun`
  - `GRANT ALL PRIVILEGES ON DATABASE "qovun-test" TO qovun`
- Prepare environment file: `cp example.env .env`
- Replace values in `.env` with your custom values.
- Bootstrap development database: `npm run migrate`
- Bootstrap test database: `npm run migrate:test`

### Configuring Postgres

For tests involving time to run properly, your Postgres database must be configured to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
    - OS X, Homebrew: `/usr/local/var/postgres/postgresql.conf`
2. Uncomment the `timezone` line and set it to `UTC` as follows:

```
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```

## Sample Data

- To seed the database for development: `psql -U qovun -d qovun -a -f seeds/seed.qovun_tables.sql`
- To clear seed data: `psql -U qovun -d qovun -a -f seeds/trunc.qovun_tables.sql`

## Scripts

- Start application for development: `npm run dev`
- Run tests: `npm test`
