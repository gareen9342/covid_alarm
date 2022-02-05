import {Injectable} from "@decorators/di";
import puppeteer, {Browser} from "puppeteer";

class Puppeteer {

  private _browser: Browser | undefined;

  constructor() {
  }

  set browser(value: Browser | undefined) {
    this._browser = value;
  }

  get browser(): Browser | undefined {
    return this._browser;
  }

  async launchBrowser() {
    this._browser = await puppeteer.launch({
      headless: true // 브라우저 없이 크롬을 실행함
    });
    return this // 한번에 체이닝 하려고 이렇게 함. 생성자안에 넣으려고 했는데 프로미스 생성자를 쓸 수 없어서...
  }

  async goToPage(pageURL: string) {
    const page = await this.browser?.newPage();
    page?.goto(pageURL);
  }

  async closeBrowser() {
    this._browser?.close();
  }
}

@Injectable()
export default class CrawlingCoronaDataService {


  async crawlingBrowser() {
    try {
      const puppeteer = await new Puppeteer().launchBrowser()
      await puppeteer.goToPage("asdf");

      await puppeteer.closeBrowser();
    } catch (err) {
      throw err;
    }

  }

}