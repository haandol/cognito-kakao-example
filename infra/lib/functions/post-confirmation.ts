import * as awsLambda from 'aws-lambda'

export const handler = async (event: awsLambda.PostConfirmationTriggerEvent, context: any): Promise<awsLambda.PostConfirmationTriggerEvent> => {
  console.log(event)
  return event
}