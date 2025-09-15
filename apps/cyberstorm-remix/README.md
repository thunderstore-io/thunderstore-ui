# How to setup and run Nimbus dev environment with local Thunderstore

## Preparations
This quide expects you to have setup your Thunderstore Django project for development on some level. Please setup the Thunderstore project before continuing.

## Setup nginx proxy for local data ingress/egress
1. Add the following to your hosts (on windows, google what how to achive same on other OS')
```
127.0.0.1 thunderstore.temp
127.0.0.1 new.thunderstore.temp
```

2. Boot up the nginx proxy with the following command; `docker compose -f tools/ts-dev-proxy/docker-compose.yml up`

3. Boot up your Thunderstore backend and ensure it's running in port 81 (it's normally 80). The following [line](https://github.com/thunderstore-io/Thunderstore/blob/f06b9b438ea6e990881e60339d34bde1a480d073/docker-compose.yml#L123) in your Thunderstore projects docker-compose, should be `- "127.0.0.1:81:8000"`

## Setup Nimbus for development

1. Clone the repo `git@github.com:thunderstore-io/thunderstore-ui.git`

2. Setup FontAwesome token. One way to do it is to add a `.npmrc` file with the following contents, under `thunderstore-ui/build-secrets/.npmrc`
```
@fortawesome:registry = "https://npm.fontawesome.com/"
//npm.fontawesome.com/:_authToken = YOUR_FA_TOKEN
```

3. Run `yarn install` first on the repo root (`thunderstore-ui` folder) and then again in the `thunderstore-ui/apps/cyberstorm-remix` folder.

4. Add `.env.development` and/or `.env.production` files. You can copy the `.env` file, rename and edit the values to your needs. Here's a example of the file contents:
```
VITE_SITE_URL=http://thunderstore.temp
VITE_BETA_SITE_URL=http://new.thunderstore.temp
VITE_API_URL=http://thunderstore.temp
VITE_COOKIE_DOMAIN=.thunderstore.temp
VITE_AUTH_BASE_URL=http://thunderstore.temp
VITE_AUTH_RETURN_URL=http://new.thunderstore.temp
```

5. Uncomment the following string to the `allowedHosts` list in `vite.config.ts` ([link](https://github.com/thunderstore-io/thunderstore-ui/blob/f69ca05f2fe51320768aa4b934d17e40060192b5/apps/cyberstorm-remix/vite.config.ts#L13-L17)): `".thunderstore.temp"`

6. Run the build/start server script or the dev server script

Build and start
```
yarn workspace @thunderstore/cyberstorm-remix build
yarn workspace @thunderstore/cyberstorm-remix start --port 3000 --host 0.0.0.0
```

Dev script
```
yarn workspace @thunderstore/cyberstorm-remix dev --port 3000 --host 0.0.0.0
```

## Finally
You should now have the fully local Nimbus dev environment setup and running in `http://new.thunderstore.temp` and the Django site should be running in `http://thunderstore.temp`. You might need to go to `http://new.thunderstore.temp/communities` as Nimbus doesn't have a landing page yet.

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
```
6. Run the Nimbus project normally
