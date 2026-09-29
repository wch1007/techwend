# 汤问致新 · 手机端预览

静态官网预览。手机宽度 ≤768px 自动应用手机端设计，桌面版保留原有布局。

## GitHub Pages

1. 打开仓库 **Settings → Pages**，将 **Build and deployment → Source** 设为 **GitHub Actions**。
2. 在 **Actions → Deploy TechWend preview to GitHub Pages** 中运行或重新运行工作流。
3. 发布成功后，用手机打开 `https://wch1007.github.io/techwend/`。

桌面模拟手机窗口：`https://wch1007.github.io/techwend/mobile/preview.html`。

后续推送到 `main` 自动更新 Pages。不修改正式域名，不包含 CNAME。

## 手机端设计

- 保留视频开场：自动静音播放、跳过、重播；结束后淡入竖版星空主视觉。
- 特色、探索、终端对比、生活场景和公司足迹合并为可手势滑动的展台。
- 紧凑指标网格、深色玻璃卡片、呼吸光圈、产品悬浮及扫描光效。
- 八层产品切换、三款参数、问答折叠、中英文、手机导航和联系链接。
- 独立移动 WebP 素材，响应式源图，不改桌面原图。尊重减少动画偏好。

关键文件：`mobile/mobile.css`、`mobile/mobile.js`、`mobile/images/`。

## 本地预览

在仓库根目录执行 `python -m http.server 4173`，访问 `http://127.0.0.1:4173/mobile/preview.html`。

发布内容仅包含公开网页及其素材。未包含商业计划书、内部参考、临时文件或工作区工具。
联系方式与表单沿用现有官网；静态 Pages 不提供新的后端表单服务。
