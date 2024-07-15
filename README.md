# Transfer money app

# To seed data before using (create user with email - admin@test.com and password - 122313)
```bash
npm run seed:run
```


## To run
```bash
npm install
// For dev environment
npm run start:dev
// For production mode
npm run build
npm run start:prod
```

## To run using docker
```bash
docker compose up
```

## To build docker container based on Dockerfile
```bash
docker built -t [username]/[imagename] .
```

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
