const chalk = require("chalk");

class Logger {
  constructor(command) {
    this.command = ` ${command} `;
    this.prefix = {
      info: ` ${chalk.black.bgBlue(this.command)} `,
      warning: ` ${chalk.black.bgYellow(this.command)} `,
      success: ` ${chalk.black.bgGreen(this.command)} `,
      error: ` ${chalk.black.bgRed(this.command)} `,
    };
  }
  info(...messages) {
    console.log(`${this.prefix.info} ${chalk.blue(messages.join(""))}`);
  }
  warning(...messages) {
    console.log(`${this.prefix.warning} ${chalk.yellow(messages.join(""))}`);
  }
  success(...messages) {
    console.log(`${this.prefix.success} ${chalk.green(messages.join(""))}`);
  }
  error(...messages) {
    console.log(`${this.prefix.error} ${chalk.red(messages.join(""))}`);
  }
  newLine() {
    console.log();
  }
}

module.exports = {
  Logger,
};
