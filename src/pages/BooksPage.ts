import { expect, Page } from "@playwright/test";
import { baseURL } from "../hooks/config";

export class BooksPage {
    constructor(private page:Page) {}

    private bookList = ".product-grid > .item-box";
    private availableBooks = "Add to cart";
    private closeNotification = "#bar-notification .close";

    private cartSuccess = "The product has been added to your";

    async open(url: string) {
        await this.page.goto(`${baseURL}${url}`);
    }

    async addBooksToCart() {
        const listOfBooks = this.page.locator(this.bookList);
        const countBooks = await listOfBooks.count();

        for (let i=0; i<countBooks; i++) {
            const book = this.page.locator(this.bookList).nth(i);
            const addToCart = book.locator("input[value='Add to cart']");
            if (await addToCart.count() > 0) {
                await addToCart.click();
                const loader = this.page.locator('.ajax-loading-block-window');
                // Ajax loader appears which restricts the add to cart button so trying to ignore the timeout error if it is too fast.
                await loader.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
                await loader.waitFor({ state: 'hidden', timeout: 15000 });
                await expect(this.page.getByText(this.cartSuccess)).toBeVisible();
                await this.page.locator(this.closeNotification).click();
            }
        }
    }
}