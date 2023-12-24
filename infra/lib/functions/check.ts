import * as awsLambda from 'aws-lambda';

export const handler = async (
  event: awsLambda.APIGatewayProxyEventV2WithJWTAuthorizer,
  context: any
): Promise<awsLambda.APIGatewayProxyResultV2> => {
  console.log(JSON.stringify(event, null, 2));

  return {
    statusCode: 200,
    body: event.requestContext.authorizer.jwt.claims.sub as string,
  };
};
