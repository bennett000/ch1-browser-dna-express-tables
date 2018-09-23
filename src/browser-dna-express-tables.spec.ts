import { isObject, noop } from '@ch1/utility';
import { fingerprintStore } from './browser-dna-express-tables';

describe('Browser DNA Express tables', () => {
  let mockDb: any;
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockDb = {};
    mockReq = {};
    mockRes = {};
  });

  describe('fingerprintStore', () => {
    it('calls next', done => {
      fingerprintStore(mockDb)(mockReq, mockRes, () => {
        expect(true).toBe(true);
        done();
      });
    });
  });
});
