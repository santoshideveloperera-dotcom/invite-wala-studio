const { test, expect } = require("@playwright/test");

test.describe("Invite Wala invitation gallery", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#templateGrid .template-card")).toHaveCount(12);
  });

  test("PV-01: tapping a design opens the selected invitation preview", async ({ page }) => {
    const firstCard = page.locator("#templateGrid .template-card").first();
    const cardDescription = await firstCard.locator(".card-info p").innerText();

    await firstCard.locator(".play-pill").click();

    await expect(page.locator("#previewModal")).toHaveClass(/open/);
    await expect(page.locator("#previewModal .phone")).toBeVisible();
    await expect(page.locator("#previewModal #pNames")).toContainText("Aarav");
    await expect(page.locator("#previewModal #pStoryTitle")).toBeVisible();
    await expect(page.locator("#previewModal #pCover")).toBeVisible();
    const description = cardDescription.split(" · ").slice(2).join(" · ");
    await expect(page.locator("#pStory")).toContainText(description);
  });

  test("PV-02: invitation sections scroll inside the phone mockup", async ({ page }) => {
    await page.locator("#templateGrid .template-card").first().click();
    const phoneScreen = page.locator("#phoneScreen");

    await expect(page.locator("#previewModal")).toHaveClass(/open/);
    await expect(phoneScreen.locator(".invite-page")).toHaveCount(5);

    const dimensions = await phoneScreen.evaluate(el => ({
      clientHeight: el.clientHeight,
      scrollHeight: el.scrollHeight
    }));
    expect(dimensions.scrollHeight).toBeGreaterThan(dimensions.clientHeight);

    await phoneScreen.evaluate(el => { el.scrollTop = el.scrollHeight; });
    await expect.poll(() => phoneScreen.evaluate(el => el.scrollTop))
      .toBeGreaterThan(0);
    await expect.poll(() => phoneScreen.evaluate(el => (
      el.scrollTop + el.clientHeight >= el.scrollHeight - 2
    ))).toBe(true);
  });

  test("PV-03: closing the preview restores page scrolling", async ({ page }) => {
    await page.locator("#templateGrid .template-card").first().click();
    await page.locator("#closePreview").click();

    await expect(page.locator("#previewModal")).not.toHaveClass(/open/);
    await expect.poll(() => page.locator("body").evaluate(el => getComputedStyle(el).overflow))
      .not.toBe("hidden");
  });

  test("PV-04: Escape closes the preview", async ({ page }) => {
    await page.locator("#templateGrid .template-card").first().click();
    await page.keyboard.press("Escape");
    await expect(page.locator("#previewModal")).not.toHaveClass(/open/);
  });

  test("PV-05: keyboard activation opens a design preview", async ({ page }) => {
    const card = page.locator("#templateGrid .template-card").first();
    await card.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#previewModal")).toHaveClass(/open/);
  });

  test("LM-01: load-more reveals the complete 50-design catalogue without duplicates", async ({ page }) => {
    const cards = page.locator("#templateGrid .template-card");
    const loadMore = page.locator("#loadMore");

    await expect(cards).toHaveCount(12);
    await expect(loadMore).toBeVisible();

    await loadMore.click();
    await expect(cards).toHaveCount(24);

    await loadMore.click();
    await expect(cards).toHaveCount(36);

    await loadMore.click();
    await expect(cards).toHaveCount(48);

    await loadMore.click();
    await expect(cards).toHaveCount(50);
    await expect(loadMore).toBeHidden();

    const ids = await cards.evaluateAll(elements => elements.map(el => el.dataset.id));
    expect(new Set(ids).size).toBe(50);
  });

  test("LM-02: a newly loaded design also opens its preview", async ({ page }) => {
    await page.locator("#loadMore").click();
    const newlyLoadedCard = page.locator("#templateGrid .template-card").nth(12);
    const cardDescription = await newlyLoadedCard.locator(".card-info p").innerText();

    await newlyLoadedCard.locator(".play-pill").click();

    await expect(page.locator("#previewModal")).toHaveClass(/open/);
    const description = cardDescription.split(" · ").slice(2).join(" · ");
    await expect(page.locator("#pStory")).toContainText(description);
  });

  test("RG-01: gallery initializes without page errors", async ({ page }) => {
    const pageErrors = [];
    page.on("pageerror", error => pageErrors.push(error.message));
    await page.reload();
    await expect(page.locator("#templateGrid .template-card")).toHaveCount(12);
    expect(pageErrors).toEqual([]);
  });
});
