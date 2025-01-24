import { cognito, event } from '#src/utils';

export const login = async () => {
    const response = await cognito.initiateAuth({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: process.env.WEB_CLIENT_ID,
        AuthParameters: {
            USERNAME: event.queryStringParameters?.email ?? event.body?.email,
            PASSWORD: event.queryStringParameters?.password ?? event.body?.password,
        }
    });

    const { IdToken, AccessToken, RefreshToken } = response.AuthenticationResult;

    return { IdToken, AccessToken, RefreshToken }
}