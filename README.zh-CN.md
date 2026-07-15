# @brandlen/prettier-config

[English](README.md) | 简体中文

个人使用的、面向 Web 项目的共享 [Prettier](https://prettier.io/) 配置。

它只使用 Prettier 3 的内置语言支持，因此可直接格式化 JavaScript、TypeScript、Vue SFC、JSON、CSS 与 Markdown；不为这些语言安装额外 parser 或插件。

## 安装

```bash
pnpm add -D prettier @brandlen/prettier-config
```

在项目的 `package.json` 中引用：

```json
{
  "prettier": "@brandlen/prettier-config",
  "scripts": {
    "format": "prettier . --write",
    "format:check": "prettier . --check"
  }
}
```

若项目需要个别覆盖，使用 ESM 配置文件：

```js
import base from '@brandlen/prettier-config'

/** @type {import('prettier').Config} */
export default {
  ...base,
  proseWrap: 'always',
}
```

## 格式化风格

- Markdown 保留作者已有的段落换行；代码块仍按对应的内置 parser 格式化。
- 不配置 `parser`，由 Prettier 按文件扩展名选择 parser。

共享配置将 `printWidth` 固定为 100；`tabWidth`、`useTabs` 与 `endOfLine` 有意不在本包定义，以便 Prettier 读取每个项目自己的 `.editorconfig`。

可将包内的 `editorconfig` 作为项目根目录的 `.editorconfig` 起点：

```bash
cp node_modules/@brandlen/prettier-config/editorconfig .editorconfig
```

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
max_line_length = 80
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

## 忽略文件

Prettier 会自动读取项目根目录的 `.gitignore` 与 `.prettierignore`。为使 CLI、CI 和编辑器都遵循同一规则，请将本包的 `ignore` 文件复制为消费者项目根目录的 `.prettierignore`，再追加项目专属规则：

```bash
cp node_modules/@brandlen/prettier-config/ignore .prettierignore
```

模板默认忽略各包管理器 lockfile、依赖目录、构建产物、缓存、source map 和压缩文件。不会通过安装脚本自动修改你的项目。

## 开发与发布

维护者可以直接开发 `main`；Pull Request 仅用于协作。运行基于 Bumpp 的发布命令需要 Node 20.19 或更高版本。提交前运行：

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm verify
```

`pnpm install` 会安装仓库本地的 `commit-msg` hook。提交信息必须遵循 [Conventional Commits](https://www.conventionalcommits.org/)，例如 `feat: add shared config`；Pull Request 也会在 CI 中接受相同校验。

从最新且干净的 `main` 分支发布：

```bash
pnpm release
```

交互式命令会选择 SemVer 版本、根据 Conventional Commits 重建 `CHANGELOG.md`、执行 `pnpm verify`、创建一个发布提交和 `vX.Y.Z` tag，然后推送它们。tag 会触发 GitHub Actions，通过 npm Trusted Publishing 发布，并创建一个无说明的 GitHub Release 页面。不要手动运行 `npm publish`。

所需的 GitHub 和 npm 设置见[仓库设置说明](docs/repository-setup.md)。
