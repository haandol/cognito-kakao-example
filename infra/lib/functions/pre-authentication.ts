import * as awsLambda from 'aws-lambda'

export const handler = async (event: awsLambda.PreAuthenticationTriggerEvent, context: any): Promise<awsLambda.PreAuthenticationTriggerEvent>  => {
  console.log(JSON.stringify(event, null, 2))

  const { userAttributes, validationData } = event.request
  if (userAttributes && userAttributes['custom:provider'] === 'Kakao') {
    if (!(validationData && validationData.sub === userAttributes.sub)) {
      throw Error('Kakao user can not sigin with email')
    }
  }
  return event
}