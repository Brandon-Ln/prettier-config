// @ts-check

/**
 * @typedef {import('prettier').Config} Config
 */

/**
 * @type {Config}
 * @see {@link https://www.prettier.cn/docs/option-philosophy.html}
 */
module.exports = {
  semi: false,
  trailingComma: "none",
  proseWrap: "preserve",
  endOfLine: "lf",
  /**
   * 折行长度
   */
  printWidth: 150
}
