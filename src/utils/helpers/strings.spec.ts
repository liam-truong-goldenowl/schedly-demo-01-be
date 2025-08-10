import { generateSlug } from '../strings';

describe('fullNameToSlug', () => {
  it('should convert a simple full name to a slug', () => {
    expect(generateSlug('John Doe')).toBe('john-doe');
  });

  it('should handle names with multiple spaces', () => {
    expect(generateSlug('Jane    Smith')).toBe('jane-smith');
  });

  it('should convert names with special characters', () => {
    expect(generateSlug("Élodie O'Connor")).toBe('elodie-oconnor');
  });

  it('should convert names with mixed case', () => {
    expect(generateSlug('Alice McDonald')).toBe('alice-mcdonald');
  });

  it('should handle names with hyphens and underscores', () => {
    expect(generateSlug('Mary-Jane O_Brien')).toBe('mary-jane-obrien');
  });

  it('should return an empty string for empty input', () => {
    expect(generateSlug('')).toBe('');
  });

  it('should convert Vietnamese names with diacritics to slug', () => {
    expect(generateSlug('Nguyễn Văn A')).toBe('nguyen-van-a');
    expect(generateSlug('Trần Thị Bích Ngọc')).toBe('tran-thi-bich-ngoc');
    expect(generateSlug('Đỗ Mạnh Cường')).toBe('do-manh-cuong');
  });

  it('should handle names with numbers', () => {
    expect(generateSlug('John Doe 2')).toBe('john-doe-2');
  });

  it('should handle names with leading and trailing spaces', () => {
    expect(generateSlug('  Anna Lee  ')).toBe('anna-lee');
  });

  it('should handle names with tabs and newlines', () => {
    expect(generateSlug('Tom\tSmith\n')).toBe('tom-smith');
  });

  it('should handle names with only special characters', () => {
    expect(generateSlug('!@#$%^&*()')).toBe('');
  });

  it('should handle names with non-Latin scripts', () => {
    expect(generateSlug('山田 太郎')).toBe('shan-tian-tai-lang'); // slugify transliterates some scripts
  });
});
