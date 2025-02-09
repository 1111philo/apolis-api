import { router, event, setEvent, logEvent } from '#src/utils';
import * as authRoutes from './auth';
import {
  customMessageForgotPassword,
  customMessageSignUp,
  customMessageUpdateUserAttribute,
  postConfirmationConfirmForgotPassword,
  postConfirmationConfirmSignUp,
  preSignUpSignUp,
} from './cognito';
import * as internalRoutes from './internal';
import * as publicRoutes from './public';
import * as scheduledRoutes from './scheduled';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

let verifier;
if (process.env.NODE_ENV === 'development') {
  verifier = {
    verify: async (token: string) => {
      return {
        'cognito:username': 'test',
        'cognito:groups': ['admin'],
      };
    },
  };
} else {
  verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.USER_POOL_ID,
    tokenUse: 'id',
    clientId: process.env.WEB_CLIENT_ID,
  });
}

export const authRouter = async () => {
  try {
    const claims = await verifier.verify(
      event.headers.authorization.replace('Bearer ', '')
    );
    const updatedEvent = setEvent({ ...event, claims });
    logEvent(updatedEvent);
    return router(authRoutes);
  } catch (err) {
    console.log(err);
    return 'Your authorization token is invalid';
  }
};

export const cognitoRouter = async () => {
  logEvent(event);

  if (event.triggerSource === 'PreSignUp_SignUp') {
    return preSignUpSignUp();
  } else if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
    return postConfirmationConfirmSignUp();
  } else if (event.triggerSource === 'CustomMessage_SignUp') {
    return customMessageSignUp();
  } else if (event.triggerSource === 'CustomMessage_UpdateUserAttribute') {
    return customMessageUpdateUserAttribute();
  } else if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    return customMessageForgotPassword();
  } else if (event.triggerSource === 'PostConfirmation_ConfirmForgotPassword') {
    return postConfirmationConfirmForgotPassword();
  } else {
    return event;
  }
};

export const internalRouter = async () => {
  logEvent(event);
  return router(internalRoutes);
};

export const publicRouter = async () => {
  logEvent(event);
  return router(publicRoutes);
};

export const scheduledRouter = async () => {
  logEvent(event);
  return router(scheduledRoutes);
};
