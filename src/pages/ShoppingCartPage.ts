import { Page } from "@playwright/test";

export class ShoppingCartPage {
    constructor(private page:Page) {}

    private cart = "#topcartlink  .cart-label";
    // private productAddedNotification  = "";
    private serviceTerms = "input#termsofservice";
    private checkoutButtonText = "Checkout";

    async goToCart() {
        await this.page.locator(this.cart).click();
    }

    async checkout() {
        await this.page.locator(this.serviceTerms).click();
        await this.page.getByRole('button', { name: this.checkoutButtonText}).click();
    }
}