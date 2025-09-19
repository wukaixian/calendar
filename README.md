# 现代农历日历

一个美观、现代的 Web 日历应用，结合公历、农历及中国法定节假日信息，可直接在浏览器中查看节日、调休和节气。

## 功能特性

- 📅 6 × 7 月视图：支持跨月日期淡化展示，日历 hover 时提供详细提示。
- 🌙 农历支持：使用 `solarlunar` 显示农历日期、节日与节气，并在初一显示农历月。
- 🏖️ 节假日同步：自动从 [timor.tech](https://timor.tech/api/holiday/year/) 获取国务院法定节假日数据，包含调休补班信息。
- ⚡ 快速切换：支持上下月切换、回到今天的快捷按钮。
- 🧊 现代视觉：基于玻璃拟态风格的暗色主题，包含节假日、调休、今日等醒目标记。

## 技术栈

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 7](https://vitejs.dev/) 作为构建与开发服务器
- [Day.js](https://day.js.org/) 处理日期逻辑（含中文本地化）
- [solarlunar](https://www.npmjs.com/package/solarlunar) 进行公农历转换

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发（默认端口 5173）
npm run dev

# 生产构建输出到 dist/
npm run build

# 本地预览生产构建
npm run preview
```

启动开发服务器后，按终端提示访问本地地址（通常为 `http://localhost:5173/`）。首次进入页面会自动加载当前年份的节假日数据，如需切换年份，只需跳转至目标月份。

## 项目结构

```
modern-lunar-calendar/
├─ src/
│  ├─ components/       # UI 组件
│  ├─ hooks/            # 数据获取与状态管理
│  ├─ types/            # TypeScript 类型声明
│  ├─ utils/            # 工具方法（如 dayjs 封装）
│  ├─ App.tsx           # 应用入口视图
│  └─ main.tsx          # React 挂载点
├─ index.html           # SPA 入口
├─ package.json         # 项目依赖与脚本
└─ vite.config.ts       # Vite 配置
```

## 节假日数据说明

- 数据来源：`https://timor.tech/api/holiday/year/{year}`。
- 请求按年份懒加载，并在内存中缓存，避免重复请求。
- 调休日会以“调休”标签展示，并在 tooltip 中说明对应假期与方向。
- 如遇请求失败，界面会在节假日提示区反馈错误，可刷新重试。

## 浏览器兼容性

- 目标为现代浏览器（Chrome、Edge、Firefox、Safari 最新版本）。
- 主要依赖 CSS Grid、`backdrop-filter` 等特性；低版本浏览器可能退化或不支持。

## PWA 支持

- 内置 Service Worker 自动缓存构建产物，联网时会在后台获取最新版本。
- 支持离线访问与桌面安装，可通过浏览器的“安装应用/添加到主屏幕”完成安装。
- iOS 与 Android 将使用 `public/icons/` 中的自定义图标与主题色，建议在真机环境验证显示效果。

## 后续可扩展方向

1. 新增年视图、待办事项或日程管理模块。
2. 支持节假日数据的导出/导入与跨设备同步。
3. 增加自定义节日/提醒的本地存储功能。

---

MIT License © 2025

