# 手机端适配 · 2026-10-29

## 本轮微调

在原有样式后加载 `mobile/refinements.css`，仅在 ≤768px 生效，保留原版图片、配色、光效与桌面布局。

- 导航仍为悬浮胶囊，展开为六行纵向菜单，含首页、当前页标记、遮罩关闭、Escape 与焦点循环；触控区域至少 44px。
- 手机主标题约 30px（首页品牌 32–38px）、区块标题 24–26px、正文约 14px；表单输入保留 16px，避免手机聚焦自动放大。
- 首页价值卡片按内容自然展开，点击可收起，手机不再自动切换或在卡片内滚动。视频保留，可跳过开场。
- 产品装配改为轻扫、点击图层、前后按钮与进度条切换，不再通过长段页面滚动控制；切换图层不移动整页。
- 商务场景、媒体报道延续原版卡片，改为横向触控展台；职位分类横向滚动，岗位随整页滚动，避免列表与页脚重叠。
- 招聘首屏文字不依赖入场动画，减少动画时仍完整显示。

本轮验证：本地 Edge 触屏模拟中，六页分别检查 320、360、390、430、600、768px，共 36 种页面/宽度组合，无页面横向溢出、内容区嵌套纵向滚动或招聘页脚重叠；另检查 320/768px 英文布局。已验证图层横扫与纵向手势区分、进度条不移动整页、型号键盘切换、菜单遮罩/Escape、手动展开、开场跳过、职位筛选/弹窗和 FAQ。1440×900 桌面六页主要区块位置与尺寸与本轮修改前一致，手机放大回桌面无移动视图残留。以上是浏览器模拟，未进行 iOS/Android 实机测试，未提交表单。

以下为上一版资源与设计记录；其中滚动驱动装配、固定高度价值卡片等已由本轮行为替代。

## 上一版记录

适用宽度：≤768px。桌面原有排版与原始图片保留；可在 `mobile/preview.html` 中预览全部六个页面。

## 设计

- 首页：保留自动静音视频开场，可跳过、重播；结束后淡入竖版星空主视觉。特色、探索和终端演进使用手势展台，技术指标合并为深色玻璃网格，可展开细节。
- 产品：悬浮机器人与呼吸光圈、紧凑指标网格、随页面自然滚动的八层装配演示（支持倒序拆解和拖动进度条）、五场景横向展台、T1 Ultra / Pro / T1 参数切换与扫描光效。
- 商务：双列价值与场景矩阵，保留光效、环形背景，单列表单和折叠问答。
- 关于：公司足迹横向展台、三列资产指标、双列媒体卡片。
- 招聘 / 联系：单列职位、可滚动详情弹窗、直接拨号与社交链接。
- 公共：触控导航、中英文、页脚完整展示、安全区留白、减少动态效果偏好。

## 图片

手机专用生成图：`mobile/images/hero-portrait.webp`。
生成方式：内置 image_gen 编辑，参考 `background/黑色底.png`，原图未覆盖。
其他图片仅转码压缩到 `mobile/images/`，不重新生成新闻照片或产品技术图。47 张移动副本共约 2.2 MB，原图约 58.7 MB；通过 picture 的媒体条件选择移动资源，桌面继续使用原图。首页视频在桌面与手机均保留；不支持自动播放时提供播放按钮。移动端使用系统字体，避免等待桌面 CDN 字体。

最终生成提示词：

> Use case: identity-preserve. Edit this website hero image into a premium PORTRAIT 9:16 mobile website background, 1024x1792 or similar portrait. Keep the exact same single Chinese companion robot doll, its recognisable face, black hair, white wing-like hair ornaments, red and cream layered traditional costume, natural woven silk fabric, pose with both palms raised, body proportions and round black display plinth. Recompose only: place full robot and plinth centered horizontally in the LOWER 62% of canvas, from about y=39% to y=94%, with feet and entire plinth visible, modest edge margins. Upper 35% must be empty deep navy-black negative space for HTML headline, no bright stars behind headline. Preserve dark near-black sci-fi atmosphere with delicate blue luminous stars, faint circuit constellations and subtle blue floor rings becoming brighter toward lower half. Elegant restrained blue starlight, realistic physical miniature product photography, high fabric fidelity. NO TEXT, NO letters, NO logo, NO watermark, no extra robots or props. This is mobile-only marketing background, not a UI screenshot.

## 验证

本地 Chromium / Edge 手机视口：320、390、430、768px，六个页面无页面级横向溢出或脚本异常。已验证菜单、型号切换、图层切换、场景05、中英文、宽屏恢复、常见问题、表单字号、职位弹窗及社交链接。1440px 桌面各区块位置与尺寸与修改前一致。

这是浏览器视口模拟测试，未替代 iOS Safari / Android 实机验收。表单未发送，不改变现有表单服务。
