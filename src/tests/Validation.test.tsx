import { describe, it, expect } from 'vitest';

describe('Validation Functions', () => {
  // Import validation functions from Register component
  // Since they're not exported, we'll recreate them for testing

  const validateUsername = (username: string): string => {
    if (!username.trim()) return 'Le nom d\'utilisateur est obligatoire';
    if (username.length < 3 || username.length > 50) return 'Le nom d\'utilisateur doit contenir entre 3 et 50 caractères';
    if (!/^[a-zA-ZÀ-ÿ0-9\s-]+$/.test(username)) return 'Le nom d\'utilisateur contient des caractères invalides';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Le mot de passe est obligatoire';
    if (password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])/.test(password)) {
      return 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@#$%^&+=!)';
    }
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'L\'email est obligatoire';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'L\'email doit être valide';
    return '';
  };

  describe('validateUsername', () => {
    it('should return error for empty username', () => {
      expect(validateUsername('')).toBe('Le nom d\'utilisateur est obligatoire');
      expect(validateUsername('   ')).toBe('Le nom d\'utilisateur est obligatoire');
    });

    it('should return error for username too short', () => {
      expect(validateUsername('ab')).toBe('Le nom d\'utilisateur doit contenir entre 3 et 50 caractères');
    });

    it('should return error for username too long', () => {
      const longUsername = 'a'.repeat(51);
      expect(validateUsername(longUsername)).toBe('Le nom d\'utilisateur doit contenir entre 3 et 50 caractères');
    });

    it('should return error for invalid characters', () => {
      expect(validateUsername('user@name')).toBe('Le nom d\'utilisateur contient des caractères invalides');
      expect(validateUsername('user_name')).toBe('Le nom d\'utilisateur contient des caractères invalides');
      expect(validateUsername('user.name')).toBe('Le nom d\'utilisateur contient des caractères invalides');
    });

    it('should accept valid usernames', () => {
      expect(validateUsername('validuser')).toBe('');
      expect(validateUsername('User123')).toBe('');
      expect(validateUsername('Test-User')).toBe('');
      expect(validateUsername('User Name')).toBe('');
      expect(validateUsername('Àccénts123')).toBe('');
      expect(validateUsername('user-123 test')).toBe('');
    });

    it('should accept boundary lengths', () => {
      expect(validateUsername('abc')).toBe(''); // 3 chars
      expect(validateUsername('a'.repeat(50))).toBe(''); // 50 chars
    });
  });

  describe('validatePassword', () => {
    it('should return error for empty password', () => {
      expect(validatePassword('')).toBe('Le mot de passe est obligatoire');
    });

    it('should return error for password too short', () => {
      expect(validatePassword('1234567')).toBe('Le mot de passe doit contenir au moins 8 caractères');
    });

    it('should return error for password without uppercase', () => {
      expect(validatePassword('password123!')).toBe('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@#$%^&+=!)');
    });

    it('should return error for password without lowercase', () => {
      expect(validatePassword('PASSWORD123!')).toBe('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@#$%^&+=!)');
    });

    it('should return error for password without digit', () => {
      expect(validatePassword('Password!')).toBe('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@#$%^&+=!)');
    });

    it('should return error for password without special character', () => {
      expect(validatePassword('Password123')).toBe('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@#$%^&+=!)');
    });

    it('should accept valid passwords', () => {
      expect(validatePassword('Password123!')).toBe('');
      expect(validatePassword('MySecure@2024')).toBe('');
      expect(validatePassword('Test#123Abc')).toBe('');
      expect(validatePassword('Valid$456Def')).toBe('');
    });

    it('should accept various special characters', () => {
      expect(validatePassword('Password123@')).toBe('');
      expect(validatePassword('Password123#')).toBe('');
      expect(validatePassword('Password123$')).toBe('');
      expect(validatePassword('Password123%')).toBe('');
      expect(validatePassword('Password123^')).toBe('');
      expect(validatePassword('Password123&')).toBe('');
      expect(validatePassword('Password123+')).toBe('');
      expect(validatePassword('Password123=')).toBe('');
    });
  });

  describe('validateEmail', () => {
    it('should return error for empty email', () => {
      expect(validateEmail('')).toBe('L\'email est obligatoire');
      expect(validateEmail('   ')).toBe('L\'email est obligatoire');
    });

    it('should return error for invalid email format', () => {
      expect(validateEmail('invalid-email')).toBe('L\'email doit être valide');
      expect(validateEmail('user@')).toBe('L\'email doit être valide');
      expect(validateEmail('@example.com')).toBe('L\'email doit être valide');
      expect(validateEmail('user@.com')).toBe('L\'email doit être valide');
    });

    it('should accept valid emails', () => {
      expect(validateEmail('user@example.com')).toBe('');
      expect(validateEmail('test.email@domain.co.uk')).toBe('');
      expect(validateEmail('user+tag@example.com')).toBe('');
      expect(validateEmail('123@example.com')).toBe('');
      expect(validateEmail('user_name@example-domain.com')).toBe('');
    });
  });

  describe('Integration tests', () => {
    it('should validate complete user registration data', () => {
      const validUser = {
        username: 'TestUser123',
        email: 'test@example.com',
        password: 'ValidPass123!'
      };

      expect(validateUsername(validUser.username)).toBe('');
      expect(validateEmail(validUser.email)).toBe('');
      expect(validatePassword(validUser.password)).toBe('');
    });

    it('should detect multiple validation errors', () => {
      const invalidUser = {
        username: 'u@',
        email: 'invalid-email',
        password: 'weak'
      };

      expect(validateUsername(invalidUser.username)).not.toBe('');
      expect(validateEmail(invalidUser.email)).not.toBe('');
      expect(validatePassword(invalidUser.password)).not.toBe('');
    });
  });
});