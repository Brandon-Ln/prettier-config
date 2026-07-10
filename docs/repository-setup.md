# 仓库与 npm 发布设置

## GitHub 仓库

1. 创建公开仓库 `Brandon-Ln/prettier-config`，并将默认分支设为 `main`。
2. 开启 squash merge，并要求 squash 的提交标题符合 Conventional Commits。
3. 保护 `main`：要求通过 Pull Request 合并、要求 `quality` 检查通过、要求分支保持最新，并禁止直接 push。

## 首次发布 npm 包

npm Trusted Publishing 必须在 npm 上已经存在该包后才能配置。因此首次发布仅执行以下一次：

1. 创建一个短期、细粒度的 npm automation token，仅授予发布 `@brandle/prettier-config` 的权限。
2. 将它保存为 GitHub `npm` Environment 中名为 `NPM_TOKEN` 的 secret。
3. Release Please 创建对应的 `vX.Y.Z` tag 后，从 `main` 手动运行 `Publish package`。
4. 在 npm 包设置中配置 Trusted Publisher：选择 GitHub Actions，owner 填 `Brandon-Ln`，repository 填 `prettier-config`，workflow 填 `publish.yml`，environment 填 `npm`，允许操作选择 `npm publish`。
5. 选择 **Require two-factor authentication and disallow tokens**，然后删除 GitHub secret，并撤销首发用的 token。

完成首发后，工作流只会使用 OIDC 发布。不要再向仓库添加长期有效的 npm 发布 token。

## 发布一个新版本

1. 将符合 Conventional Commits 的代码提交合并到 `main`。
2. 合并 Release Please 自动创建的版本 Pull Request。
3. 在下一次提交进入 `main` 前，打开 **Actions → Publish package → Run workflow**，选择 `main`，并输入 `publish` 确认。

工作流会拒绝以下情况：仓库不符、分支不符、事件类型不符、提交不对应版本 tag、版本已发布，或质量检查失败。
