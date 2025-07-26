import { createPublicSlug } from './strings';

describe('fullNameToSlug', () => {
  it('should convert a simple full name to a slug', () => {
    expect(createPublicSlug('John Doe')).toBe('john-doe');
  });

  it('should handle names with multiple spaces', () => {
    expect(createPublicSlug('Jane    Smith')).toBe('jane-smith');
  });

  it('should convert names with special characters', () => {
    expect(createPublicSlug("Élodie O'Connor")).toBe('elodie-oconnor');
  });

  it('should convert names with mixed case', () => {
    expect(createPublicSlug('Alice McDonald')).toBe('alice-mcdonald');
  });

  it('should handle names with hyphens and underscores', () => {
    expect(createPublicSlug('Mary-Jane O_Brien')).toBe('mary-jane-obrien');
  });

  it('should return an empty string for empty input', () => {
    expect(createPublicSlug('')).toBe('');
  });

  it('should convert Vietnamese names with diacritics to slug', () => {
    expect(createPublicSlug('Nguyễn Văn A')).toBe('nguyen-van-a');
    expect(createPublicSlug('Trần Thị Bích Ngọc')).toBe('tran-thi-bich-ngoc');
    expect(createPublicSlug('Đỗ Mạnh Cường')).toBe('do-manh-cuong');
  });

  it('should handle names with numbers', () => {
    expect(createPublicSlug('John Doe 2')).toBe('john-doe-2');
  });

  it('should handle names with leading and trailing spaces', () => {
    expect(createPublicSlug('  Anna Lee  ')).toBe('anna-lee');
  });

  it('should handle names with tabs and newlines', () => {
    expect(createPublicSlug('Tom\tSmith\n')).toBe('tom-smith');
  });

  it('should handle names with only special characters', () => {
    expect(createPublicSlug('!@#$%^&*()')).toBe('');
  });

  it('should handle names with non-Latin scripts', () => {
    expect(createPublicSlug('山田 太郎')).toBe('shan-tian-tai-lang'); // slugify transliterates some scripts
  });
});
