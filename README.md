# cognito-kakao-integration-example

This repository is an example code for creating Amazon Cognito user via kakaotalk signin

Deploying this cdk will provision below architeture on you AWS Account.

> If you are using CDK version 1.x, please use [cdkv1 branch](https://github.com/haandol/cognito-kakao-example/tree/cdkv1)

![](/img/architecture.png)

## Signup

![](/img/signup.png)

## Signin

![](/img/signin.png)

# Prerequisites

- awscli
- Nodejs 14.x+
- AWS Account and Locally configured AWS credential

# Installation

this repository consists of 2 parts

- **infra** - provision AWS resources such as Cognito UserPool, ApiGateway, etc.
- **web** - run Nextjs web service on locally to test Kakao signin

## Infra

Install project dependencies

```bash
$ cd infra
$ npm i
```

Install cdk in global context and run `cdk init` if you did not initailize cdk yet.

```bash
$ npm i -g aws-cdk
$ cdk bootstrap
```

Deploy CDK Stacks on AWS

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

4. copy `Javascript Key` on your app summary page

5. open [**config.ts**](web/lib/interfaces/config.ts) and edit below variables:

- AmplifyConfig.UserPoolId - check out console or output of `cdk deploy` at infra
- AmplifyConfig.UserPoolWebClientId - check out console or output of `cdk deploy` at infra
- ApiHash - check out console or output of `cdk deploy` at infra
- IdentityProvider.Kakao.AppKey - paste `Javascript Key` at Kakao Developer Console

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

4. alert should be displayed

5. visit **Amazon Cognito UserPool** console page

6. user and group should be created

![](/img/user.png)

# Cleanup

destroy provisioned cloud resources

```bash
$ cd infra
$ cdk destroy "*"
```
