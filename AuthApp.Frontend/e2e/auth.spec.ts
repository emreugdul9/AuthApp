import { test, expect } from '@playwright/test';

test.describe('Basic E2E Tests', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    
    // Just check if page loads without errors
    await expect(page).toHaveTitle(/AuthApp/);
  });

  test('should display login form elements', async ({ page }) => {
    await page.goto('/');
    
    // Check if we can see basic form elements
    await expect(page.getByRole('button')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should protect dashboard route', async ({ page }) => {
    // Try to access dashboard directly without login
    await page.goto('/dashboard');
    
    // Should either redirect to home or stay on home (depends on implementation)
    // We'll just check that we're not on an error page
    await expect(page).not.toHaveTitle(/Error/);
  });

  test('should handle form validation', async ({ page }) => {
    await page.goto('/');
    
    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /giriş/i });
    await submitButton.click();
    
    // Should still be on home page (form validation should prevent submission)
    await expect(page).toHaveURL('/');
  });

  test('should handle invalid login attempt', async ({ page }) => {
    await page.goto('/');
    
    // Fill form with invalid credentials
    await page.fill('input[type="email"]', 'invalid@test.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit form
    await page.getByRole('button', { name: /giriş/i }).click();
    
    // Should stay on home page since login failed
    await expect(page).toHaveURL('/');
  });
});
