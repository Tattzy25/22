import { test, expect } from '@playwright/test';

test.describe('Automation Builder', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the automation section using hash routing
    await page.goto('/#automation');
    await page.waitForLoadState('networkidle');
  });

  test('should load automation builder interface', async ({ page }) => {
    // Check if main elements are present
    await expect(page.locator('text=Automation Builder')).toBeVisible();
    await expect(page.locator('text=Create AI workflows with drag-and-drop automation')).toBeVisible();

    // Check for toolbox, canvas, and properties panel
    await expect(page.locator('[data-testid="toolbox"]')).toBeVisible();
    await expect(page.locator('[data-testid="canvas"]')).toBeVisible();
    await expect(page.locator('[data-testid="properties-panel"]')).toBeVisible();
  });

  test('should allow adding nodes from toolbox', async ({ page }) => {
    // Find and click on a node type in the toolbox
    const toolbox = page.locator('[data-testid="toolbox"]');
    await expect(toolbox).toBeVisible();

    // Click on the first available node type (adjust selector as needed)
    const firstNodeType = toolbox.locator('[data-testid="node-type"]').first();
    await firstNodeType.click();

    // Verify node appears on canvas
    const canvas = page.locator('[data-testid="canvas"]');
    await expect(canvas.locator('[data-testid="automation-node"]')).toHaveCount(1);
  });

  test('should allow selecting and editing nodes', async ({ page }) => {
    // First add a node
    const toolbox = page.locator('[data-testid="toolbox"]');
    const firstNodeType = toolbox.locator('[data-testid="node-type"]').first();
    await firstNodeType.click();

    // Click on the node to select it
    const node = page.locator('[data-testid="automation-node"]').first();
    await node.click();

    // Check if properties panel shows node details
    const propertiesPanel = page.locator('[data-testid="properties-panel"]');
    await expect(propertiesPanel.locator('text=Properties')).toBeVisible();
  });

  test('should allow canvas interactions', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]');

    // Test canvas click (should deselect any selected nodes)
    await canvas.click();

    // Verify no node is selected
    const propertiesPanel = page.locator('[data-testid="properties-panel"]');
    await expect(propertiesPanel.locator('text=No node selected')).toBeVisible();
  });

  test('should allow saving automation', async ({ page }) => {
    // Set automation name
    const nameInput = page.locator('input[placeholder="Automation name"]');
    await nameInput.fill('Test Automation');

    // Click save button
    const saveButton = page.locator('button:has-text("Save")');
    await saveButton.click();

    // Check for success message or confirmation
    await expect(page.locator('text=Automation saved')).toBeVisible();
  });

  test('should allow running automation', async ({ page }) => {
    // Add a simple node first
    const toolbox = page.locator('[data-testid="toolbox"]');
    const firstNodeType = toolbox.locator('[data-testid="node-type"]').first();
    await firstNodeType.click();

    // Click run button
    const runButton = page.locator('button:has-text("Run")');
    await runButton.click();

    // Check for running state or completion
    await expect(page.locator('text=Running automation')).toBeVisible();
  });

  test('should handle canvas zoom and pan', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]');

    // Test zoom in (Ctrl + scroll or zoom buttons if available)
    await page.keyboard.down('Control');
    await canvas.hover();
    await page.mouse.wheel(0, -100);
    await page.keyboard.up('Control');

    // Test zoom out
    await page.keyboard.down('Control');
    await page.mouse.wheel(0, 100);
    await page.keyboard.up('Control');

    // Canvas should still be functional
    await expect(canvas).toBeVisible();
  });

  test('should support keyboard shortcuts', async ({ page }) => {
    // Test delete key for selected nodes
    const toolbox = page.locator('[data-testid="toolbox"]');
    const firstNodeType = toolbox.locator('[data-testid="node-type"]').first();
    await firstNodeType.click();

    const node = page.locator('[data-testid="automation-node"]').first();
    await node.click();

    // Press delete key
    await page.keyboard.press('Delete');

    // Node should be removed
    await expect(page.locator('[data-testid="automation-node"]')).toHaveCount(0);
  });
});