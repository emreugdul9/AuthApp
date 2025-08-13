describe('Simple Tests', () => {
  test('basic math works', () => {
    expect(2 + 2).toBe(4);
  });

  test('true is true', () => {
    expect(true).toBe(true);
  });

  test('localStorage exists in jsdom', () => {
    expect(localStorage).toBeDefined();
  });

  test('string operations work', () => {
    const greeting = 'Hello';
    const name = 'World';
    expect(greeting + ' ' + name).toBe('Hello World');
  });

  test('array operations work', () => {
    const numbers = [1, 2, 3];
    numbers.push(4);
    expect(numbers.length).toBe(4);
    expect(numbers).toContain(3);
  });

  test('object operations work', () => {
    const user = { name: 'John', age: 30 };
    user.email = 'john@example.com';
    expect(user.name).toBe('John');
    expect(user).toHaveProperty('email');
  });

  test('async operations work', async () => {
    const promise = Promise.resolve('success');
    const result = await promise;
    expect(result).toBe('success');
  });
});
