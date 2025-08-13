describe('LocalStorage Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('can set and get items from localStorage', () => {
    localStorage.setItem('test-key', 'test-value');
    const value = localStorage.getItem('test-key');
    expect(value).toBe('test-value');
  });

  test('can remove items from localStorage', () => {
    localStorage.setItem('remove-me', 'value');
    localStorage.removeItem('remove-me');
    const value = localStorage.getItem('remove-me');
    expect(value).toBeNull();
  });

  test('can store and retrieve JSON objects', () => {
    const user = { name: 'John', email: 'john@example.com' };
    localStorage.setItem('user', JSON.stringify(user));
    
    const retrievedUser = JSON.parse(localStorage.getItem('user'));
    expect(retrievedUser.name).toBe('John');
    expect(retrievedUser.email).toBe('john@example.com');
  });

  test('returns null for non-existent keys', () => {
    const value = localStorage.getItem('non-existent-key');
    expect(value).toBeNull();
  });
});
