# 仓库与 npm 发布设置

## GitHub 仓库

1. 使用公开仓库 `Brandon-Ln/prettier-config`，默认分支为 `main`。
2. 维护者可以直接推送到 `main`；Pull Request 只在需要协作或审查时使用。
3. 为 `main` 保留防删除和防强推保护，并允许维护者绕过规则；不要强制 Pull Request 或状态检查门禁。

`pnpm install` 会通过 `simple-git-hooks` 安装本地 `commit-msg` hook，使用 Commitlint 校验 Conventional Commits。`quality` 工作流会在 `main` push 与 Pull Request 时执行 `pnpm verify`，并在 Pull Request 中再次校验提交信息；直接开发 `main` 由本地 hook 把关。

## npm Trusted Publishing

在 npm 包设置中配置 Trusted Publisher：选择 GitHub Actions，owner 填 `Brandon-Ln`，repository 填 `prettier-config`，workflow 填 `publish.yml`，environment 填 `npm`，允许操作选择 `npm publish`。

发布工作流通过 OIDC 获取短期凭证，不需要长期 npm token。删除遗留的 `NPM_TOKEN` GitHub secret；不要再添加新的发布 token。

## 发布新版本

1. 使用 Node 20.19 或更高版本，切换到最新的 `main`，并确认工作区干净。
2. 运行 `pnpm release`，在交互提示中选择 patch、minor 或 major。
3. 确认后，Bumpp 会根据 Conventional Commits 重建 `CHANGELOG.md`、执行 `pnpm verify`，并将版本文件、锁文件与 changelog 一同写入 `chore(release): vX.Y.Z` 提交，再创建和推送 `vX.Y.Z` tag。
4. `v*` tag 会自动触发 `Publish package`：验证包、通过 OIDC 发布到 npm，并创建没有说明和附件的同名 GitHub Release。

不要手动运行 `npm publish`，也不使用 Release Please、版本 Pull Request 或手动触发发布工作流。
