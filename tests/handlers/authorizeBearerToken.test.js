import jsonwebtoken from 'jsonwebtoken';
import { handler } from '../../src/handlers/authorizeBearerToken';
import config from '../../src/config';

config.swsSecret = 'thisisnotasecret';

jest.mock('@soundws/service-libs/src/logger');

describe('authorizeBearerToken', () => {
  describe('when no token is provided', () => {
    it('returns a deny policy', async () => {
      const response = await handler({});
      expect(response.policyDocument.Statement[0].Effect).toBe('Deny');
    });
  });

  describe('when an invalid token is provided', () => {
    it('returns a deny policy', async () => {
      const response = await handler({
        authorizationToken: 'invalidtoken',
      });
      expect(response.policyDocument.Statement[0].Effect).toBe('Deny');
    });
  });

  describe('when the audience claim doesnt match', () => {
    it('returns a deny policy', async () => {
      const token = jsonwebtoken.sign({}, config.swsSecret, { audience: 'nooooo.sound.ws' });

      const response = await handler({
        authorizationToken: token,
      });
      expect(response.policyDocument.Statement[0].Effect).toBe('Deny');
    });
  });

  describe('when a valid token is provided', () => {
    it('returns a Allow policy', async () => {
      const token = jsonwebtoken.sign({}, config.swsSecret, { audience: 'api.sound.ws' });

      const response = await handler({
        authorizationToken: token,
      });
      expect(response.policyDocument.Statement[0].Effect).toBe('Allow');
    });
  });
});
