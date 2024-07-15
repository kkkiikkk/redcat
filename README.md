# Transfer money app

# To seed data before using (create user with email - admin@test.com and password - 122313)
```bash
yarn seed:run
```


## To run
```bash
yarn install
// For dev environment
yarn start:dev
// For production mode
yarn run build
yarn run start:prod
```

## To run using docker
```bash
docker compose up
```

## To build docker container based on Dockerfile

### After starting app you can see swagger documentation following that path - /api/docs

### Env example backend
```env
PORT=3000
ACCESS_SECRET=access_token_secret
REFRESH_SECRET=refresh_token_secret
JWT_ACCESS_EXPIRE_TIME='10m'
JWT_REFRESH_EXPIRE_TIME='25m'
DB_LINK=postgres://user:password@localhost:5432/postgres
NODE_ENV=develop
COOKIE_MAX_AGE=90000000
```
