import moment from 'moment';
import * as winston from "winston"

const path = require("path");
import mkdirp from 'mkdirp';
import fs from 'fs';

const enum log_level_e {
  LogLevelDebug = 'debug',
  LogLevelInfo = 'info',
  LogLevelError = 'error'
};

class logger_base {
  public static readonly kLogLevel: string = log_level_e.LogLevelDebug;
  public static readonly kMaxFileSize: number = 1024 * 1024 * 100; //100MB
  public static readonly kNumMaxFiles: number = 100; //로그파일 최대 100개
  public static readonly kFilename: string = 'mam_server.log';
  public static readonly kMaxFilenameLength: number = 20;
  //INFO: 로그 저장 폴더
  public static readonly kLogPath: string = './logs';
  //INFO: 프로젝트 최상위 폴더
  public static readonly kProjRootPath: string = path.join(__dirname, '..');
  //INFO: 파일이름만 출력할 경우 false, 경로까지 출력할 경우 true
  public static readonly kUseRelativePath: boolean = false;

  private readonly writer: winston.Logger;

  constructor() {
    this.makeLoggerFolder();

    this.writer = this.getLogger();
  }

  private makeLoggerFolder() {
    try {
      mkdirp.sync(logger_base.kLogPath);
    } catch (err: any) {
      console.error(`Create logger path FAILED; ${err.message}`);
      return;
    }

    console.info(`Create logger folder SUCCESS`);
  }

  private getTimeStampFormat(): string {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ').trim();
  }

  private getLogger() {
    if (this.writer !== undefined) {
      return this.writer;
    }

    return winston.createLogger({
      transports: [
        new winston.transports.File({
          filename: path.join(logger_base.kLogPath, './mam_server.log'),
          level: logger_base.kLogLevel,
          maxsize: logger_base.kMaxFileSize,
          maxFiles: logger_base.kNumMaxFiles,
          format: winston.format.printf(info => `${this.getTimeStampFormat()} [${info.level.toUpperCase()}] ${info.message}`),
          tailable: true //INFO: 최신 로그 파일의 이름이 항상 동일하게 유지됨 (직전 로그 파일은 가장 높은 번호의 파일)
        }),
        new winston.transports.Console({
          level: logger_base.kLogLevel,
          format: winston.format.printf(info => `${this.getTimeStampFormat()} [${info.level.toUpperCase()}] ${info.message}`)
        }),
      ]
    });
  }

  private createFinalMessage(message: string) {
    let stackInfo = this.getStackInfo(1);
    let filenameInfo: string = (logger_base.kUseRelativePath ? stackInfo?.relativePath : stackInfo?.file) as string;
    let finalMessage: string = `[${filenameInfo}:${stackInfo?.line}] ${message}`;
    return finalMessage;
  }

  public info(...args: any[]) {
    this.writer.info(this.createFinalMessage(this.getLogString(args)));
  }

  public warn(...args: any[]) {
    this.writer.warn(this.createFinalMessage(this.getLogString(args)));
  }

  public error(...args: any[]) {
    this.writer.error(this.createFinalMessage(this.getLogString(args)));
  }

  public debug(...args: any[]) {
    this.writer.debug(this.createFinalMessage(this.getLogString(args)));
  }

  private getLogString(args: any[]) {
    let resultStr: string = '';
    for (let i = 1; i < args.length; i++) {
      //INFO: 객체 타입
      if (typeof (args[i]) === 'object') {
        resultStr += JSON.stringify(args[i]) + '\t';
      } else {
        resultStr += args[i] + '\t';
      }
    }

    return args[0] + '\t' + resultStr;
  }

  /**
   * Parses and returns info about the call stack at the given index.
   */
  private getStackInfo(stackIndex: number) {
    // get call stack, and analyze it
    // get all file, method, and line numbers
    let stacklist = (new Error(undefined)).stack?.split('\n').slice(3);

    // stack trace format:
    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
    let stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
    let stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi

    let s = stacklist?.[stackIndex] || stacklist?.[0];
    if (s === undefined) {
      throw new Error();
    }
    s = s.toString();
    let sp = stackReg.exec(s) || stackReg2.exec(s)

    if (sp && sp.length === 5) {
      return {
        method: sp[1],
        relativePath: path.relative(logger_base.kProjRootPath, sp[2]),
        line: sp[3],
        pos: sp[4],
        file: path.basename(sp[2]),
        stack: stacklist?.join('\n')
      }
    }
  }
}

const loggerBase: logger_base = new logger_base();
export default loggerBase;