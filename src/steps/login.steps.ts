import { Given, When, Then } from "@cucumber/cucumber";
import { ICustomWorld } from "../hooks/custom-world";
import { emailLogin, passwordLogin } from "../hooks/config";

Given('I open DemoWebShop Login page', async function (this: ICustomWorld) {
    await this.pages!.login.open("/login");
    await this.pages!.login.login( `${emailLogin}`, `${passwordLogin}`);
})

Then('I go to books page', async function (this: ICustomWorld) {
    await this.pages!.books.open("/books");
})

Then('I add books to cart', async function (this: ICustomWorld) {
    await this.pages!.books.addBooksToCart();
})

Then('I go to cart and checkout', async function (this: ICustomWorld) {
    await this.pages!.shoppingCart.goToCart();
    await this.pages!.shoppingCart.checkout();
})

Then('I enter information on checkout page and confirm the Order', async function (this: ICustomWorld) {
    await this.pages!.checkoutPage.enterBillingDetails();
    await this.pages!.checkoutPage.enterShippingDetails();
    await this.pages!.checkoutPage.enterShippingMethod("Next Day");
    await this.pages!.checkoutPage.enterPaymentMethod("Cash On Delivery");
    await this.pages!.checkoutPage.enterPaymentInformation();
    await this.pages!.checkoutPage.orderConfirmation();
})