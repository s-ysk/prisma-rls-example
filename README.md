# Prisma x RLS(PostgreSQL) example

## Quick start

1. Clone and enter to this repo.
   1. `git close https://github.com/s-ysk/prisma-rls-example.git`
   1. `cd prisma-rls-example`
2. Install essentials.
   1. `yarn`
3. Run DB.
   1. `docker-compose -f docker/docker-compose.yaml up`
4. Add RLS user to the DB.
   1. `sh ./script/setup_db_client.sh`
5. Setup DB tables.
   1. `yarn prisma migrate deploy`
6. Try RLS example.
   1. `yarn run tsx --no-cache ./src/index.ts`
