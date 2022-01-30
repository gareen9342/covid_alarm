export class CoronaData {
  totalCase: string = "";
  totalCaseBefore: string = "";
  nowCase: string = "";
  updateTime: string = "";

  /**
   * @param {string} totalCase: 전체 확진자수
   * @param {string} totalCaseBefore: 전날 확진자수
   * @param {string} nowCase: 현재 확진자수
   * @param {string} updateTime: 기준 업데이트 시간
   */
  constructor(totalCase: string, totalCaseBefore: string, nowCase: string, updateTime: string) {
    this.totalCase = totalCase
    this.totalCaseBefore = totalCaseBefore
    this.nowCase = nowCase;
    this.updateTime = updateTime
  }

}