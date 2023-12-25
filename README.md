# cognito-kakao-integration-example

This repository is an example code for creating Amazon Cognito user via Kakaotalk OIDC

Deploying this cdk will provision below resources on you AWS Account.

![](/img/architecture.png)

# Prerequisites

- awscli
- Nodejs 16+
- AWS Account and Locally configured AWS credential

# Installation

this repository consists of 2 parts

- **infra** - provision AWS resources such as Cognito UserPool, ApiGateway, etc.
- **web** - run NuxtJS web service on locally to test Kakao signin

## Setup Kakao

1. visit [Kakao Developer Console](https://developers.kakao.com/console/app) and create your app

2. register web platform url with `http://localhost:3000`

![](/img/kakao1.png)

3. visit `Kakao Login` menu and enable both `Kakao Login Activation` and `OpenID Connect Activation`

![](/img/kakao2.png)

> NOTE: on the same page, you should change redirect uri to cognito callback url, like `https://DOMAIN_NAME.auth.ap-northeast-2.amazoncognito.com/oauth2/idpresponse`. We will get to that later in this doc.

4. visit `Security` menu and generate `Client secret code` and copy the code.

5. visit `API Keys` menu and copy `REST API Key`

## Setup Infra

1. Install project dependencies

```bash
$ cd infra
$ npm i
```

2. Install cdk in global context and run `cdk bootstrap` if you did not initailize cdk yet.

```bash
$ npm i -g aws-cdk@2.116.1
$ cdk bootstrap
```

3. open [**/infra/config/dev.toml**](infra/config/dev.toml) and replace values for your environment

```toml
[auth]
clientId="kakaotalk REST API Key"
clientSecret="kakaotalk Client secret code"
```

4. copy `dev.toml` file under infra folder with name `.toml`

```bash
$ cp config/dev.toml .toml
```

5. Deploy CDK Stacks on AWS

```bash
$ cdk deploy "*" --require-approval never
```

## Finalize setup Kakao

- visit `Kakao Login` menu and change `Redirect URI` to cognito callback url. 
- it looks like `https://DOMAIN_NAME.auth.ap-northeast-2.amazoncognito.com/oauth2/idpresponse`
- you can find the `DOMAIN_NAME` on the output of `cdk deploy` command or on `App Integration` Section at Cognito Web Console

![redirec uri](/img/kakao_redirect_uri.png)

![cognito app integration](/img/cognito_app_integration.png)

## Setup Web

> config values are displayed on the console after cdk deployment.

1. Open [amplifyconfig.ts](./amplifyconfig.ts) and update the following values:

```ts
DomainName; // replace with actual cognito domain address
AuthConfig.Cognito.userPoolId; // cognito userpoolid
AuthConfig.Cognito.userPoolClientId; // cognito clientid
```

2. Open [nuxt.config.ts](./nuxt.config.ts) and update the following values:

```ts
runtimeConfig.public.api; // replace with actual api gateway endpoint
```

3. Install dependencies

```bash
$ cd web
$ yarn install
```

# Test run

1. run dev server

```bash
$ cd web
$ yarn dev
```

2. visit http://localhost:3000 and click kakao login button

3. login at redirected kakako page

4. click `check` button to check your cognito user id (sub)

5. visit **Amazon Cognito UserPool** console page

6. user and group should be created

![](/img/user.png)

# Cleanup

destroy provisioned cloud resources

```bash
$ cd infra
$ cdk destroy "*"
```
