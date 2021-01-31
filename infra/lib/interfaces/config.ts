export namespace App {
  const Namespace = 'KakaoAuthDemo'

  enum DeployStage {
    DEV = 'Dev',
    PROD = 'Prod',
  }
  const Stage = DeployStage.DEV

  export const Context = {
    ns: Namespace,
    stage: Stage,
  }
}

export namespace Stack {
  const Account = '929831892372'
  const Region = 'ap-northeast-2'

  export const Props = {
    env: {
      account: Account,
      region: Region,
    }
  }
}

export namespace IdentityProvider {
  export const RedirectUri = 'http://localhost:3000'
}