# 数据驱动简历网页

这是一个不依赖框架的模块化简历网站。页面结构与内容分离，后续修改个人信息时不需要反复编辑 HTML。

## 文件职责

- `index.html`：页面骨架，只保留可渲染的模块容器。
- `data.js`：唯一内容数据源，维护个人资料、模块标题、技能、工作数据、经历、作品、联系方式和导航。
- `script.js`：根据 `data.js` 渲染模块，并处理移动导航、滚动动画、鼠标粒子箭头和卡片交互。
- `styles.css`：页面布局、响应式样式和视觉效果。

## 如何更新内容

1. 打开 `data.js`。
2. 修改 `profile`、`sections`、`skills`、`metrics`、`experience`、`projects` 或 `contact` 中的内容。
3. 新增作品时，在 `projects` 数组中追加一个对象：

```js
{
  title: '新项目名称',
  description: '项目简介',
  category: '项目分类',
  url: 'https://example.com'
}
```

页面刷新后会自动生成对应内容。导航锚点也统一由 `navigation` 数组管理。

其中 `metrics` 负责“工作数据”模块的统计指标和图表标签，`sections` 负责各模块标题。页面 HTML 只负责提供模块容器，渲染逻辑统一在 `script.js` 中。

## 本地运行

可以直接打开 `index.html`，也可以在当前目录启动静态服务：

```bash
python -m http.server 4173
```

然后访问 `http://localhost:4173/index.html`。
