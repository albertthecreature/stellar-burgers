import { test, expect } from '@playwright/test';

const INGREDIENTS_HAR = 'tests/hars/ingredients.har';
const ORDER_HAR = 'tests/hars/order.har';

const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';
const MOCK_ORDER_NUMBER = 12345;

const FAKE_ACCESS_TOKEN = 'test-access-token';
const FAKE_REFRESH_TOKEN = 'test-refresh-token';

const addIngredient = async (
  page: import('@playwright/test').Page,
  name: string
) => {
  await page
    .locator('li')
    .filter({ hasText: name })
    .getByRole('button', { name: 'Добавить' })
    .click();
};

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR(INGREDIENTS_HAR, {
    url: '**/api/**',
    update: false
  });

  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Соберите бургер' })
  ).toBeVisible();
});

test.describe('Страница конструктора бургера', () => {
  test.describe('Добавление ингредиентов в конструктор', () => {
    test('Добавляет булку в конструктор', async ({ page }) => {
      await addIngredient(page, BUN_NAME);

      await expect(page.getByText(`${BUN_NAME} (верх)`)).toBeVisible();
      await expect(page.getByText(`${BUN_NAME} (низ)`)).toBeVisible();
    });

    test('Добавляет начинку в конструктор', async ({ page }) => {
      await addIngredient(page, MAIN_NAME);

      const constructor = page.locator('section').filter({
        has: page.getByRole('button', { name: 'Оформить заказ' })
      });

      await expect(constructor.getByText(MAIN_NAME)).toBeVisible();
    });
  });

  test.describe('Модальное окно ингредиента', () => {
    test('Открывает модальное окно с данными выбранного ингредиента', async ({
      page
    }) => {
      await page.getByRole('link', { name: BUN_NAME }).click();

      const modal = page.locator('#modals');

      await expect(
        modal.getByRole('heading', { name: 'Детали ингредиента' })
      ).toBeVisible();
      await expect(
        modal.getByRole('heading', { name: BUN_NAME, exact: true })
      ).toBeVisible();
      await expect(modal.getByText('Калории, ккал')).toBeVisible();
      await expect(modal.getByText('420')).toBeVisible();
    });

    test('Закрывает модальное окно по клику на крестик', async ({ page }) => {
      await page.getByRole('link', { name: BUN_NAME }).click();

      await expect(
        page.getByRole('heading', { name: 'Детали ингредиента' })
      ).toBeVisible();

      await page.locator('#modals').getByRole('button').click();

      await expect(
        page.getByRole('heading', { name: 'Детали ингредиента' })
      ).not.toBeVisible();
    });

    test('Закрывает модальное окно по клику на оверлей', async ({ page }) => {
      await page.getByRole('link', { name: BUN_NAME }).click();

      await expect(
        page.getByRole('heading', { name: 'Детали ингредиента' })
      ).toBeVisible();

      await page.mouse.click(5, 5);
      await expect(
        page.getByRole('heading', { name: 'Детали ингредиента' })
      ).not.toBeVisible();
    });
  });

  test.describe('Создание заказа', () => {
    test.beforeEach(async ({ page, context }) => {
      await page.routeFromHAR(ORDER_HAR, {
        url: '**/api/**',
        update: false
      });

      await context.addCookies([
        {
          name: 'accessToken',
          value: FAKE_ACCESS_TOKEN,
          domain: 'localhost',
          path: '/'
        }
      ]);

      await page.addInitScript((token) => {
        localStorage.setItem('refreshToken', token);
      }, FAKE_REFRESH_TOKEN);

      await page.goto('/');
      await expect(
        page.getByRole('heading', { name: 'Соберите бургер' })
      ).toBeVisible();
    });

    test('Оформляет заказ, показывает номер заказа и очищает конструктор', async ({
      page
    }) => {
      await addIngredient(page, BUN_NAME);
      await addIngredient(page, MAIN_NAME);

      await page.getByRole('button', { name: 'Оформить заказ' }).click();

      await expect(
        page.getByRole('heading', { name: String(MOCK_ORDER_NUMBER) })
      ).toBeVisible();
      await expect(page.getByText('идентификатор заказа')).toBeVisible();

      await expect(page.getByText('Выберите булки').first()).toBeVisible();
      await expect(page.getByText('Выберите начинку')).toBeVisible();

      await page.locator('#modals').getByRole('button').click();

      await expect(
        page.getByRole('heading', { name: String(MOCK_ORDER_NUMBER) })
      ).not.toBeVisible();
    });
  });
});
