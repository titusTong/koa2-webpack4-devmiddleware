### 启动

安装node -v 8.11+

npm -v 5.6.0

    不使用webpackdevserver拆件，手动使用koa2来实现devserver的功能，适用于后端渲染型的spa，例如：SSR。

    这仅仅是个简单的架构，包含前端代码改动webpack自动打包热更新的功能，服务端代码不打包，服务端热更新交给nodemon。


开发环境:

`npm install` 安装依赖

`npm run dev` 启动DevServer

访问   http://localhost:8000

上线流程:

`npm run bulid` 打包部署

`node ./bin/www` 启动服务



