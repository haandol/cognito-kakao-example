import * as awsLambda from 'aws-lambda'

export const handler = async (event: awsLambda.PreSignUpTriggerEvent, context: any): Promise<awsLambda.PreSignUpTriggerEvent | {}>  => {
  console.log(JSON.stringify(event, null, 2))

  const { clientMetadata }  = event.request
  if (clientMetadata && clientMetadata.provider === 'Kakao') {
    event.response.autoConfirmUser = true
    event.response.autoVerifyEmail = true
  }

  return event
}