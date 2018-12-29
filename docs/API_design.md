# API 设计文档

本文档规定了服务端需要实现，客户端可以使用的所有 API 请求的路径、请求格式和功能。

请注意：**服务器的登录状态维护由 Cookie & Session 技术实现，请确保您的客户端支持并已启动了 Cookie 支持**。

## /user/sign_up

- 请求类型：**POST**
- 功能介绍：

  接收用户填入的用户名和密码，并尝试将其加入数据库中。如果已经存在相同的用户名，则返回一个错误提示。否则返回确认信息。

- 数据字段：

  |字段名|字段含义|
  |-|-|
  |username|申请注册的用户名|
  |password|申请注册的用户密码（建议使用明文密码经过哈希算法处理后的结果）|

- 响应示例：

  - 注册成功的响应信息：

    ```json
    {
      "status": "OK"
    }
    ```
  
  - 注册失败的响应信息：

    ```json
    {
      "status": "Failed",
      "message": "This username has been occupied."
    }
    ```

## /user/login

- 请求类型：**POST**
- 功能简介：

  接收用户填入的用户名和密码，尝试与数据库内的账户信息进行匹配。如果成功，则返回确认信息，否则返回错误信息。

- 数据字段：

  |字段名|字段含义|
  |-|-|
  |username|尝试登陆的用户名|
  |password|尝试登陆的用户密码|

- 响应示例：

  - 登陆成功的响应信息：

    ```json
    {
      "status": "OK"
    }
    ```

  - 登录失败的响应信息：

    ```json
    {
      "status": "Failed",
      "message": "Username does not exist or invalid password"
    }
    ```

## /user/update

- 请求类型：**POST**
- 功能简介：

  更新用户信息，并返回确认信息。若不存在该用户或密码验证错误，则返回错误信息。**更新成功后登录状态将会被清除。**

- 数据字段：

    |字段名|字段含义|
  |-|-|
  |username|更新信息的用户名|
  |oldPassword|用户的旧密码|
  |password|用户的新密码|

- 响应示例：

  - 注册成功的响应信息：

    ```json
    {
      "status": "OK"
    }
    ```
  
  - 注册失败的响应信息：

    ```json
    {
      "status": "Failed",
      "message": "Invalid password."
    }
    ```


## /user/logout

- 请求类型：**GET**
- 功能简介：
  
  尝试登出当前账户，并返回确认信息，若未登录则返回错误信息。

- 数据字段：

  **无**

- 响应示例：

  - 登出成功的响应信息：

  ```json
  {
    "status": "OK"
  }
  ```

  - 登出失败的响应信息：

  ```json
  {
    "status": "Failed",
    "message": "You've not signed in yet"
  }
  ```

## /data/get_time

- 请求类型：**GET**
- 功能简介：

  尝试获取当前用户数据在服务器的最近更新时间，若未登录则返回错误信息。

- 数据字段：

  **无**

- 响应示例：

  - 获取成功的响应信息：

  ```json
  {
    "status": "OK",
    "time": 12121909
  }
  ```

  - 获取失败的响应信息：

  ```json
  {
    "status": "Failed",
    "message": "You've not signed in yet"
  }
  ```

## /data/put

- 请求类型：**POST**
- 功能简介：

  尝试使用本地数据覆盖服务器上的数据记录，若未登录则返回错误信息。

- 数据字段：

  ```json
  {
    data: {
      // Data JSON you want to save to the server
    }
  }
  ```

- 响应示例：

  - 上传成功的响应信息：

  ```json
  {
    "status": "OK"
  }
  ```

  - 上传失败的响应信息：

  ```json
  {
    "status": "Failed",
    "message": "You've not signed in yet"
  }
  ```

## /data/get

- 请求类型：**GET**
- 功能简介：

  尝试获取当前用户在服务器保存的最新数据，若未登录则返回错误信息。

- 数据字段：

  **无**

- 响应示例：

  - 获取成功的响应信息：

  ```json
  {
    "status": "OK",
    "data": {
      // Data JSON you saved at server
    }
  }
  ```

  - 获取失败的响应信息：

  ```json
  {
    "status": "Failed",
    "message": "You've not signed in yet"
  }
  ```