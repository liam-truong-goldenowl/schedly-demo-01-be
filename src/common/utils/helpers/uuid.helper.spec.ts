import { customAlphabet } from 'nanoid';

import { UUIDHelper } from './uuid.helper';

jest.mock('nanoid', () => ({
  customAlphabet: jest.fn(),
}));

describe('UUIDHelper', () => {
  const mockCustomAlphabet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (customAlphabet as jest.Mock).mockReturnValue(mockCustomAlphabet);
  });

  describe('generate', () => {
    it('should call customAlphabet with correct character set and length', async () => {
      const expectedCharacterSet =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const expectedLength = 8;
      const mockUuid = 'abCD12ef';

      mockCustomAlphabet.mockReturnValue(mockUuid);

      const result = await UUIDHelper.generate();

      expect(customAlphabet).toHaveBeenCalledWith(
        expectedCharacterSet,
        expectedLength,
      );
      expect(mockCustomAlphabet).toHaveBeenCalled();
      expect(result).toBe(mockUuid);
    });

    it('should return a string of expected format', async () => {
      const mockUuid = 'XyZaBcDe';
      mockCustomAlphabet.mockReturnValue(mockUuid);

      const result = await UUIDHelper.generate();

      expect(typeof result).toBe('string');
      expect(result).toBe(mockUuid);
    });

    it('should propagate errors from customAlphabet', async () => {
      const error = new Error('Generation error');
      mockCustomAlphabet.mockImplementation(() => {
        throw error;
      });

      await expect(UUIDHelper.generate()).rejects.toThrow('Generation error');
    });
  });
});
