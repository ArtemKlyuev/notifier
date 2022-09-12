import { areEqualObjects } from '../utils';

describe('useNotifier', () => {
  describe('utils', () => {
    describe('areEqualObjects', () => {
      it('should return true if objects are equal', () => {
        const obj1 = {
          autoRemove: true,
          autoRemoveTimeout: 5000,
        };

        const obj2 = {
          autoRemove: true,
          autoRemoveTimeout: 5000,
        };

        expect(areEqualObjects(obj1, obj2)).toBe(true);
      });

      it('should return false if objects are not equal', () => {
        const obj1 = {
          autoRemove: false,
          autoRemoveTimeout: 5000,
        };

        const obj2 = {
          autoRemove: true,
          autoRemoveTimeout: 5000,
        };

        expect(areEqualObjects(obj1, obj2)).toBe(false);
      });

      it('should return false if objects have different amoutn of keys ', () => {
        const obj1 = {
          autoRemove: false,
          autoRemoveTimeout: 5000,
          persist: false,
        };

        const obj2 = {
          autoRemove: true,
          autoRemoveTimeout: 5000,
        };

        expect(areEqualObjects(obj1, obj2)).toBe(false);
      });
    });
  });
});
