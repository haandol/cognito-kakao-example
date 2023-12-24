# Kakaotalk OIDC login Demo

## Setup

Open [amplifyconfig.ts](./amplifyconfig.ts) and update the following values:

```ts
AuthConfig.Cognito.userPoolId; // cognito userpoolid
AuthConfig.Cognito.userPoolClientId; // cognito clientid
AuthConfig.Cognito.loginWith.oauth.domain; // replace with actual cognito domain address
```

Open [nuxt.config.ts](./nuxt.config.ts) and update the following values:

```ts
runtimeConfig.public.api; // replace with actual api gateway endpoint
```

Install dependencies:

```bash
yarn install
```

## Run Server

Start the development server on `http://localhost:3000`:

```bash
# yarn
yarn dev
```
