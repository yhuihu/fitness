# 健身计划制定器（微信小程序）

基于 **Vant Weapp** 组件库的健身计划小程序，支持计划制定、组间休息倒计时与本地缓存。

## 功能

- 计划制定：计划名称、循环时长、训练项（组数 / 组间休息），支持编辑与删除
- 训练模式：按顺序执行训练项，自动组间倒计时，可跳过休息
- 设置：查看当前计划，一键清除缓存
- 数据缓存：所有计划数据保存在微信本地存储，退出或重新登录后自动恢复

## 目录结构

```
miniprogram/
├── app.js                  # 全局数据与本地缓存
├── app.json                # 页面注册与 tabBar
├── app.wxss                # 全局样式
├── project.config.json     # 项目配置（已关闭 npm 构建）
├── sitemap.json
├── icon/                   # tabBar 图标
├── vant-weapp/             # 已内置的 Vant Weapp 组件库
└── pages/
    ├── index/              # 计划制定
    ├── train/              # 训练模式
    └── setting/            # 设置
```

## 使用

1. 用微信开发者工具导入本目录（`fitness-app/miniprogram/`）
2. 直接编译运行，无需执行 npm 构建
3. 在「计划制定」页添加训练项，在「训练模式」页开始训练

## 说明

- UI 组件使用 Vant Weapp 1.11.7，已复制到 `vant-weapp/`，通过 `/vant-weapp/...` 引用
- 为避免依赖外网字体与图片，页面未使用 Vant 的图标字体和空状态图片
- 数据缓存键：`fitness_plan_data`、`fitness_plan_name`、`fitness_cycle_duration`
