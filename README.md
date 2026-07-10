# @brandlen/prettier-config

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

## 固定格式化风格

- Markdown 保留作者已有的段落换行；代码块仍按对应的内置 parser 格式化。
- 不配置 `parser`，由 Prettier 按文件扩展名选择 parser。

`printWidth`、`tabWidth`、`useTabs` 与 `endOfLine` 有意不在本包定义，以便 Prettier 读取每个项目自己的 `.editorconfig`。

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

## 发布与贡献

提交和 squash merge 标题使用 [Conventional Commits](https://www.conventionalcommits.org/)；Release Please 将据此创建版本 PR 与 CHANGELOG。

`pnpm install` 会自动安装本项目的 `commit-msg` Git hook。之后每次执行 `git commit`，Commitlint 都会立即校验消息；例如 `feat: add shared config` 有效，`update files` 会被拒绝。CI 仍会在 Pull Request 中再次校验，避免 hook 被跳过。

本仓库没有本地发布命令。`prepublishOnly` 只允许 `Brandon-Ln/prettier-config` 的 `main` 分支中、手动触发的 GitHub Actions 发布工作流执行发布。完整设置见 [docs/repository-setup.md](docs/repository-setup.md)。

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm verify
```
