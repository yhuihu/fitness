# 健身计划制定器 - Android 项目

## 项目结构
```
fitness-app/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── AndroidManifest.xml          # 安卓清单文件
│   │   │   ├── java/com/example/fitnessapp/
│   │   │   │   └── MainActivity.java        # 主活动（包含所有业务逻辑）
│   │   │   ├── res/layout/
│   │   │   │   ├── activity_main.xml        # 主界面布局
│   │   │   │   ├── item_plan.xml            # 计划项列表项布局
│   │   │   │   └── dialog_plan_item.xml     # 计划项设置对话框布局
│   │   │   ├── res/values/strings.xml       # 字符串资源
│   │   │   ├── res/mipmap-hdpi/             # launcher图标
│   │   │   └── assets/
│   │   │       └── index.html               # HTML5版本（可直接在浏览器运行）
│   │   └── build.gradle                     # Gradle构建配置
│   └── build.gradle
├── settings.gradle
├── README.md
└── ...
```

## 功能特性

### 1. 自定义健身计划制定
- 用户自行输入计划名称
- 设置循环时长（分钟）
- 为每个计划项输入组数
- 为每个组设置组间休息时间（秒）

### 2. 每个计划项完整配置
- 输入每组做多少次练习（重复次数）
- 设置组间休息时间（配有倒计时功能）

### 3. 训练模式
- 循环播放所有计划项
- 组间倒计时功能
- 可选择跳过休息或继续训练

## 开发说明

### Android原生版本
1. **打开 Android Studio**
2. 选择 "Open" -> 打开 `fitness-app/` 目录
3. Android Studio 会自动同步 Gradle 配置
4. 连接 vivo x200 pro mini 设备或使用模拟器
5. 点击运行按钮 (绿色三角形)

### HTML5 版本（无需编译）
直接在手机浏览器中打开 `fitness-app/app/src/main/assets/index.html` 即可使用所有功能，无需安装任何应用。

## 注意事项
- HTML5 版本适合快速测试和在任何设备上使用
- Android 版本需要 Android Studio 环境和真机/模拟器
- 对于 vivo x200 pro mini，建议使用 Android Studio 的真机调试功能
- 建议在真机上测试倒计时功能的准确性