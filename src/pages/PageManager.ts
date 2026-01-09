import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { BooksPage } from './BooksPage';
import { ShoppingCartPage } from './ShoppingCartPage';
import { CheckoutPage } from './CheckoutPage';

export class PageManager {
  constructor(private readonly page: Page) {}

   private _loginPage?: LoginPage;
   private _booksPage?: BooksPage;
   private _shoppingCartPage?: ShoppingCartPage;
   private _checkoutPage?: CheckoutPage;

   get login(): LoginPage {
    return this._loginPage ??= new LoginPage(this.page);
   }

   get books(): BooksPage {
    return this._booksPage ??= new BooksPage(this.page);
   }

   get shoppingCart(): ShoppingCartPage {
    return this._shoppingCartPage ??= new ShoppingCartPage(this.page);
   }

   get checkoutPage(): CheckoutPage {
    return this._checkoutPage ??= new CheckoutPage(this.page);
   }
  }