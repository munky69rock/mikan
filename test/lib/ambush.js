import { should } from 'chai';
import { describe, it, beforeEach } from 'mocha';

import Storage from '../support/mock_storage.js';
import Ambush from '../../lib/ambush.js';

should();
let ambush;
let storage;

describe('Ambush', () => {
  beforeEach(() => {
    storage = new Storage();
    ambush = new Ambush(storage);
    ambush.save = ambush._save;
  }); 

  describe('#load', () => {
    beforeEach(() => {
      storage.save({
        toUser: ['fromUser', 'message']
      });
      ambush.load();
    });

    it('should not be empty', () => {
      ambush.isEmpty().should.be.false;
    });
  });
});

