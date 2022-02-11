//https://stackoverflow.com/questions/38906359/create-a-global-variable-in-typescript

// declare module NodeJS {
//   interface Global {
//     consoleMessage: (message: string) => void
//   }
// }

// xx[.d].ts
declare global {
  var myConsole: (message: string) => void;
}

export {};
