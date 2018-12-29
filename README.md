# SaltyFish_Server

本项目为咸鱼 App 的 Koa2 服务端。其负责和 MySQL 服务器进行交互，并处理用户登录和数据同步等逻辑。

## 使用指南

要部署本服务器，您首先需要安装 MySQL 客户端并且配置如下：

1. 启动 MySQL 后台服务器
2. 将 global/global.js 中的 `MYSQL_USERNAME` 和 `MYSQL_PASSWORD` 设置为您的 MySQL 账号和密码
3. 手动在终端中连接到 MySQL 控制台，并且执行指令：

  ```SQL
  CREATE DATABASE salty_fish;
  ```

然后，您需要安装本程序需要的依赖组件：

```bash
npm install
```

最后，您即可通过以下命令运行服务端程序：

```bash
node bin/index.js
```

### 常见错误

1. Error: 1251 - Client does not support authentication protocol requested by server; consider upgrading MySQL client

  请手动连接到您的 MySQL 控制台，并执行以下指令：

  ```SQL
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
  ```

  然后将 global/global.js 中的 `MYSQL_USERNAME` 和 `MYSQL_PASSWORD` 分别设置为 root 和 password。

1. Error: connect ECONNREFUSED 127.0.0.1:3306

  请先启动您的 MySQL 后台服务器

### 网页测试

为了方便您测试服务器是否正常运行，我们提供了一个测试用的网页客户端，如要启用，请将 bin/index.js 中 190-191 行的代码取消注释，然后重新运行服务端即可。然后您就可以在 [http://localhost:12192/test/index.html](http://localhost:12192/test/index.html) 处进行测试了。