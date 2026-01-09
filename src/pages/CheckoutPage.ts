import { Locator, Page } from "@playwright/test";

export class CheckoutPage {
    constructor(private page:Page) {}

    private country = "select#BillingNewAddress_CountryId";
    private province = "select#BillingNewAddress_StateProvinceId";
    private city = "#BillingNewAddress_City";
    private address1 = "#BillingNewAddress_Address1";
    private postalCode = "#BillingNewAddress_ZipPostalCode";
    private phoneNumber = "#BillingNewAddress_PhoneNumber";
    private billingAddressButton = "#billing-buttons-container input[title='Continue']";
    private billingAddressSelect = ".address-select";
    private shippingAddressSelect = "select#shipping-address-select";
    private shippingAddressButton = "#shipping-buttons-container input[title='Continue']";
    private shippingMethod = "#opc-shipping_method li";
    private shippingMethodButton = "#shipping-method-buttons-container input[value='Continue']";
    private paymentMethodButton = "#payment-method-buttons-container input[value='Continue']";
    private paymentInformationButton = "#payment-info-buttons-container input[value='Continue']";
    private confirmOrderButton = "#confirm-order-buttons-container input[value='Confirm']";

    async enterBillingDetails() {
        // wait for page to load. Required after moving from cart page to checkout page.
        await this.page.waitForLoadState('domcontentloaded'); 
        const addressSelect:Locator = this.page.locator(this.billingAddressSelect);
        if (await addressSelect.count() > 0 && await addressSelect.isVisible()) {
            console.log("inside if");
            await addressSelect.selectOption({index: 0});
            await this.page.locator(this.billingAddressButton).click();
        }
        else {
            console.log("inside else");
             await this.page.selectOption(this.country, {value: "2"});
             await this.page.selectOption(this.province, {value: "71"});
             await this.page.locator(this.city).fill("Scarborough");
             await this.page.locator(this.address1).fill("123 demo road");
             await this.page.locator(this.postalCode).fill("123 456");
             await this.page.locator(this.phoneNumber).fill("123456789");
             await this.page.locator(this.billingAddressButton).click();
        }
    }

    async enterShippingDetails() {
        await this.page.selectOption(this.shippingAddressSelect, {index: 0});
        await this.page.locator(this.shippingAddressButton).click();
    }

    async enterShippingMethod(shipMethod: string) {
        // const shippingMethodList:Locator = this.page.locator(this.shippingMethod);
        // const shippingMethodListCount:number = await shippingMethodList.count();
        // for (let i=0; i<shippingMethodListCount; i++){
        //     const shipMethodToChoose:Locator = shippingMethodList.nth(i);
        //     const shipMethodText:string = (await shipMethodToChoose.innerText()).trim()
        //     if (shipMethodText === shipMethod) {
        //         await shipMethodToChoose.locator('input[type="radio"]').click();
        //     }
        // }
        await this.page.getByLabel(new RegExp(shipMethod, 'i')).check();
        await this.page.locator(this.shippingMethodButton).click();
    }

    async enterPaymentMethod(paymentMethod: string) {
        await this.page.getByLabel(new RegExp(paymentMethod, 'i')).check();
        await this.page.locator(this.paymentMethodButton).click();
    }

    async enterPaymentInformation() {
        await this.page.locator(this.paymentInformationButton).click();
    }

    async orderConfirmation() {
        await this.page.locator(this.confirmOrderButton).click();
    }
}