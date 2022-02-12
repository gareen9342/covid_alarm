import {Injectable} from "@decorators/di";
import logger from "../logger/winston"
import puppeteer, {Browser, Page} from "puppeteer";
import {CoronaData} from "../dto/CoronaData";

class Puppeteer {

  private _browser: Browser | undefined;
  private _page: Page | undefined;

  constructor() {
  }

  set browser(value: Browser | undefined) {
    this._browser = value;
  }

  get browser(): Browser | undefined {
    return this._browser;
  }

  set page(value: Page | undefined) {
    this._page = value;
  }

  get page(): Page | undefined {
    return this._page;
  }

  async launchBrowserAndNewPage() {

    const browser = await puppeteer.launch({
      headless: true // 브라우저 없이 크롬을 실행함
    });

    if (browser) {
      this.browser = browser;
    }
    return this // 한번에 체이닝 하려고 이렇게 함. 생성자안에 넣으려고 했는데 프로미스 생성자를 쓸 수 없어서...

  }

  async goToPage(pageURL: string, waitselector: string) {
    if (!this.browser) {
      throw new Error("browser is not defined")
    }
    this.page = await this.browser.newPage();
    await this.page?.goto(pageURL);
    await this.page?.waitForSelector(waitselector);
  }

  async getTextContent(DOMName: string): Promise<string> {

    let textContent = ""

    if (this.page) {
      const domHandle = await this.page.$(DOMName)
      textContent = await this.page.evaluate(el => el.textContent, domHandle)
    } else {
      throw new Error("page is not ready")
    }

    return textContent
  }

  async closeBrowser() {
    this.browser?.close();
  }
}

@Injectable()
export default class CrawlingCoronaDataService {

  /**
   * Puppeteer 를 이용한 크롤링.
   * Puppeteer 클래스는 위에 따로 구현했음. 해당 디펜던시의 기능을 좀 더 간편하게 쓸 수 있도록 재구성했다.
   * @returns {Promise<CoronaData>}
   */
  async crawlingBrowserAndReturnCoronaData() {
    try {
      logger.info(`start get corona data with crawling web site :: http://ncov.mohw.go.kr/`)

      const puppeteer = await new Puppeteer().launchBrowserAndNewPage()
      await puppeteer.goToPage("http://ncov.mohw.go.kr/", ".occur_graph");

      const totalPatient = await puppeteer.getTextContent(".liveToggleOuter .occur_num>div:nth-child(2)")
      const liveDate = await puppeteer.getTextContent(".liveToggleOuter .occurrenceStatus .title1 .livedate")
      const yesterdayPatient = await puppeteer.getTextContent(".liveToggleOuter .occur_graph tbody tr:first-child td:nth-of-type(4)>span")

      const coronaData = new CoronaData(totalPatient, yesterdayPatient, liveDate)

      logger.info(`result data from API = totalPatien ${JSON.stringify(coronaData)}`)

      await puppeteer.closeBrowser();

      return coronaData;
    } catch (err) {
      throw err;
    }
  }
}