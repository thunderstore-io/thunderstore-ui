# How to setup and run Nimbus

**!!! Setup your preferred backend before these steps !!!**
1. Clone the repo `git@github.com:thunderstore-io/thunderstore-ui.git`

2. Setup FontAwesome token. One way to do it is to add a `.npmrc` file with the following contents, under `thunderstore-ui/build-secrets/.npmrc`
```
@fortawesome:registry = "https://npm.fontawesome.com/"
//npm.fontawesome.com/:_authToken = YOUR_FA_TOKEN
```

3. Run `yarn install` first on the repo root (`thunderstore-ui` folder) and then again in the `thunderstore-ui/apps/cyberstorm-remix` folder.

4. Add `.env.development` and/or `.env.production` files. You can copy the `.env` file, rename and edit the values to your needs. (For example `ENABLE_BROKEN_PAGES`) lets you see pages that are not enabled in production.

5. Run the dev script or the build and start script.

6. The project is now running in `localhost:3000`

Build and start
```
yarn workspace @thunderstore/cyberstorm-remix build
yarn workspace @thunderstore/cyberstorm-remix start --port 3000 --host 0.0.0.0
```

Dev script
```
yarn workspace @thunderstore/cyberstorm-remix dev --port 3000 --host 0.0.0.0
```

# How to setup ts-proxy as a backend for this project
**Keep in mind that when using the ts-proxy, the sessions and actions will be made against the actual production Thunderstore**

1. Open hosts file as administrator (`C:\Windows\System32\drivers\etc`) and add this `127.0.0.1 thunderstore.temp` there
2. Download and install Docker and docker-compose. For windows people, Docker for Windows should be enough.
3. Open up a terminal and navigate to `thunderstore-ui/tools/ts-proxy`
4. Run `docker compose up`
5. Add these to your `.env.development` or `.env.production`
```
PUBLIC_SITE_URL=http://thunderstore.temp
PUBLIC_API_URL=http://thunderstore.temp:81
PUBLIC_AUTH_URL=http://auth.thunderstore.temp:81
```
6. Run the Nimbus project normally
