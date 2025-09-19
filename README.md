# 现代农历日历

一个美观、现代的 Web 日历应用，结合公历、农历及中国法定节假日信息，可直接在浏览器中查看节日、调休和节气提示。

## 功能亮点

- 📅 6×7 月视图：跨月日期自动淡化，悬停即可查看完整日期与节假日说明
- 🌙 农历支持：依赖 `solarlunar` 实时计算农历、节日及节气，初一自动展示农历月份
- 🏖️ 节假日同步：懒加载请求 [timor.tech](https://timor.tech/api/holiday/year/) 的国务院放假安排，并区分调休补班
- ⚡ 快捷交互：提供上一月 / 下一月切换、年份月份下拉和“一键回到今天”
- 🧊 现代视觉：玻璃拟态风格暗色主题，突出法定假日、调休及当天标记
- 📱 PWA 能力：支持离线访问与安装到桌面，自动更新最新版本

## 技术栈

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 7](https://vitejs.dev/) 作为开发服务器与构建工具
- [Day.js](https://day.js.org/) 负责日期计算和本地化
- [solarlunar](https://www.npmjs.com/package/solarlunar) 完成公农历互转
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) 构建 Service Worker 与 manifest

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发（默认端口 5173）
npm run dev

# 生产构建输出到 dist/
npm run build

# 预览构建产物
npm run preview
```

> 提示：首次进入页面会根据当前年份自动加载节假日数据，如需查看其他年份，只需切换至对应月份或年份即可。

## 可用脚本

- `npm run dev`：启动开发服务器（支持热更新与 PWA 开发模式）
- `npm run build`：产出面向生产环境的静态资源
- `npm run preview`：使用本地静态服务器预览构建结果

## 项目结构

```
calendar/
├─ public/            # 静态资源（PWA 图标、manifest 等）
├─ src/
│  ├─ components/     # UI 组件（主日历视图等）
│  ├─ hooks/          # 自定义数据与状态管理 hooks
│  ├─ types/          # TypeScript 类型声明
│  ├─ utils/          # 工具方法（Day.js 配置等）
│  ├─ App.tsx         # 页面主体
│  └─ main.tsx        # React 入口
├─ index.html         # SPA 入口模板
├─ package.json       # 依赖与脚本
└─ vite.config.ts     # Vite 与 PWA 配置
```

## 节假日数据说明

- 数据来源：`https://timor.tech/api/holiday/year/{year}`
- 每个年份只请求一次，并使用内存缓存避免重复调用
- 假期信息会在单元格中以标签显示，调休日会以“调休”标记并展示对应参考假期
- 请求失败时会在界面底部提示，可刷新或切换月份重新触发

## PWA 支持

- 默认启用自动更新的 Service Worker，首次打开需要联网同步缓存
- 支持离线访问与“安装到桌面”，移动端会使用 `public/icons/` 中的自定义图标
- 开发环境同样启用 PWA 模式，方便验证缓存与更新逻辑

## 部署到 GitHub Pages

仓库内置 `.github/workflows/deploy.yml`，在 `main` 分支推送后会自动：
- 使用 Node.js 20 执行 `npm ci`
- 构建产物并上传到 GitHub Pages
- 将 `dist/` 内容发布到 Pages 环境

`vite.config.ts` 中的 `base` 被设置为生产环境下的 `/calendar/`，若部署到其他路径，请相应修改 `base`、PWA manifest 的 `scope` 与 `start_url`。

---

MIT License © 2025
