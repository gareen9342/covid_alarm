// Type definitions for mocha 1.9.0
// Project: http://visionmedia.github.io/mocha/
// Definitions by: Kazi Manzur Rashid <https://github.com/kazimanzurrashid/>
// DefinitelyTyped: https://github.com/borisyankov/DefinitelyTyped

// 참고한 깃헙 링크 : https://github.com/varju/typescript-node-mocha-example/blob/master/ts-definitions/mocha/mocha.d.ts

interface Mocha {
  setup(options: MochaSetupOptions);

  run(callback: () => void);
}

interface MochaSetupOptions {
  slow: number;
  timeout: number;
  ui: string;
}

declare var describe: {
  (description: string, spec: () => void): void;
  only(description: string, spec: () => void): void;
  skip(description: string, spec: () => void): void;
  timeout(ms: number);
}

declare var it: {
  (expectation: string, assertion?: () => void): void;
  (expectation: string, assertion?: (done: (error?: Error) => void) => void): void;
  only(expectation: string, assertion?: () => void): void;
  only(expectation: string, assertion?: (done: (error?: Error) => void) => void): void;
  skip(expectation: string, assertion?: () => void): void;
  skip(expectation: string, assertion?: (done: (error?: Error) => void) => void): void;
  timeout(ms: number);
};

declare function before(action: () => void): void;

declare function before(action: (done: (failReason?) => void) => void): void;

declare function after(action: () => void): void;

declare function after(action: (done: (failReason?) => void) => void): void;

declare function beforeEach(action: () => void): void;

declare function beforeEach(action: (done: (failReason?) => void) => void): void;

declare function afterEach(action: () => void): void;

declare function afterEach(action: (done: (failReason?) => void) => void): void;
