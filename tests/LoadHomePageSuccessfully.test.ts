
import { test } from "@playwright/test";
import { loadHomePageSuccessfully } from "./fixtures/common";

test("should load the ParaBank homepage successfully", async ({ page }) => {
    await loadHomePageSuccessfully(page);
});