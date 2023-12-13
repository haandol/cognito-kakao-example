# cognito-kakao-integration-example

> NOTE: According to the [link](https://devtalk.kakao.com/t/openid-connect-oidc-id-token-payload-email/122501), Kakao supports OIDC (OpenID Connect) now. This repository is still works fine but it is not the best practice to integrate Kakao Auth to Cognito anymore IMHO.

This repository is an example code for creating Amazon Cognito user via Kakaotalk signin

Deploying this cdk will provision below resources on you AWS Account.

![](/img/architecture.png)

## Signup

![](/img/signup.png)

## Signin

![](/img/signin.png)

# Prerequisites

- awscli
- Nodejs 16+
- AWS Account and Locally configured AWS credential

# Installation

this repository consists of 2 parts

- **infra** - provision AWS resources such as Cognito UserPool, ApiGateway, etc.
- **web** - run Nextjs web service on locally to test Kakao signin

## Infra

1. Install project dependencies

```bash
$ cd infra
$ npm i
```

2. Install cdk in global context and run `cdk bootstrap` if you did not initailize cdk yet.

```bash
$ npm i -g aws-cdk@2.100.0
$ cdk bootstrap
```

3. open [**/infra/config/dev.toml**](infra/config/dev.toml) and replace values for your environment

4. copy `dev.toml` file under infra folder with name `.toml`

```bash
$ cp config/dev.toml .toml
```

5. Deploy CDK Stacks on AWS

```bash
$ cdk deploy "*" --require-approval never
```

## Web

1. visit [Kakao Developer Console](https://developers.kakao.com/console/app) and create your app

> Cognito requires user email to register user, so you should add email to scope on Kakao Login
> ![](/img/app_email.png)

2. register web platform url with `http://localhost:3000`

![](/img/kakao1.png)

3. enable `Kakao Login` and set redirect uri with `http://localhost:3000`

![](/img/kakao2.png)

4. copy `Javascript Key` and `REST API Key` on your app summary page

5. open [**/web/lib/interfaces/config.ts**](web/lib/interfaces/config.ts) and edit below variables:

- AmplifyConfig.UserPoolId - check out your AWS console or output of `cdk deploy` at infra
- AmplifyConfig.UserPoolWebClientId - check out your AWS console or output of `cdk deploy` at infra
- ApiHash - check out your AWS console or output of `cdk deploy` at infra
- IdentityProvider.Kakao.AppKey - paste `Javascript Key` at [Kakao Developer Console](https://developers.kakao.com/console/app)
- IdentityProvider.Kakao.ApiKey - paste `REST API Key` at [Kakao Developer Console](https://developers.kakao.com/console/app)

6. Install dependencies

```bash
$ cd web
$ npm i
```

# Usage

1. run dev server

```bash
$ cd web
$ npm run dev
```

2. visit http://localhost:3000 and click kakao login button

3. login at redirected kakako page

4. alert should be displayed (open browser console to find the access token received from Kakaotalk)

5. visit **Amazon Cognito UserPool** console page

6. user and group should be created

![](/img/user.png)

# Cleanup

destroy provisioned cloud resources

```bash
$ cd infra
$ cdk destroy "*"
```
