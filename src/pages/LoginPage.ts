import { Page } from "@playwright/test";
import { baseURL } from "../hooks/config";

export class LoginPage {
    constructor(private page:Page) {}

    private labelEmailId = "Email:";
    private labelPassword = "Password:";
    private loginButton = "Log in";

    async open(url: string) {
    await this.page.goto(`${baseURL}${url}`);
  }

  async enterEmail(username: string) {
    await this.page.getByLabel(this.labelEmailId).fill(username);
  }

  async enterPassword(password: string) {
    await this.page.getByLabel(this.labelPassword).fill(password);
  }

  async clickLogin() {
    await this.page.getByRole('button', { name: this.loginButton }).click();
  }

  async login(username: string, password: string) {
    await this.enterEmail(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

}