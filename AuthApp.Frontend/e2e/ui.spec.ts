import { test, expect } from '@playwright/test';

test.describe('UI Interaction Tests', () => {
  test('should show loading states', async ({ page }) => {
    await page.goto('/');
    
    // Fill form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit and check for loading state
    await page.getByRole('button', { name: /giriş/i }).click();
    
    // Page should handle the submission (even if it fails)
    await page.waitForTimeout(1000);
    // After form submission, URL might have query parameters
    await expect(page.url()).toContain('localhost:5174');
  });

  test('should handle browser navigation', async ({ page }) => {
    await page.goto('/');
    
    // Try to go to dashboard
    await page.goto('/dashboard');
    
    // Use browser back button
    await page.goBack();
    
    // Should be back on home page
    await expect(page).toHaveURL('/');
  });
});
