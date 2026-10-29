# 汤问致新 · 官网

汤问 TechWend 最新静态官网，包含电脑端与手机端。手机宽度 ≤768px 自动应用移动端布局。

## GitHub Pages

1. 打开仓库 **Settings → Pages**，将 **Build and deployment → Source** 设为 **GitHub Actions**。
2. 在 **Actions → Deploy TechWend preview to GitHub Pages** 中运行或重新运行工作流。
3. 发布成功后，用手机打开 `https://wch1007.github.io/techwend/`。

桌面模拟手机窗口：`https://wch1007.github.io/techwend/mobile/preview.html`。

后续推送到 `main` 自动更新 Pages。不修改正式域名，不包含 CNAME。

## 当前版本

- 已整合 0907 反馈及后续页面、文案、素材与布局调整。
- 首页视频开场自动播放，文字按既定时间浮现，手机端支持跳过开场。
- 功能价值、陪伴价值、生态价值支持悬停展开与自动轮播；图片、标题、内容框按顺序浮现，离开整页后再次进入可重新播放。
- 元素在首次绘制前设置动效初始状态，避免先展示最终态再浮现的闪烁。
- 电脑端采用相邻整屏平滑切换；手机版保留自然触控滚动和响应式素材，装配演示支持轻扫、点选图层和进度条操作。
- 手机端使用紧凑的悬浮导航与纵向菜单，普通主标题约 30px、区块标题 24–26px、正文约 14px；价值卡片手动展开，不自动轮播。
- 招聘页支持岗位筛选；手机端分类横向滑动、岗位随整页滚动，电脑端岗位区域与页脚同屏展示。
- 包含中英文切换、手机导航，支持系统减少动画偏好。

关键文件：页面根目录 HTML、`assets/css/feedback-0907.css`、`assets/css/element-motion.css`、`assets/js/element-motion.js`、`mobile/mobile.css`、`mobile/refinements.css`、`mobile/mobile.js`、`mobile/images/`。手机端适配和验证记录见 `mobile/README.md`。

## 本地预览

在仓库根目录执行 `python -m http.server 4173`，访问 `http://127.0.0.1:4173/mobile/preview.html`。

发布内容仅包含公开网页及其素材。未包含商业计划书、内部参考、临时文件或工作区工具。
联系方式与表单沿用现有官网；静态 Pages 不提供新的后端表单服务。
