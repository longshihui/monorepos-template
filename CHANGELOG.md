# 1.5.0 (2022-01-28)

### Bug Fixes

- **金格:** 完善和服务器端交互的逻辑 ([bfa2079](http://192.168.0.66/frontGroup/office-npapi/commits/bfa207920966974ee65a1b98b767c710205f47a1))
- **金格:** 修复金格在 chrome 和 firefox 下崩溃的问题 ([7d874e5](http://192.168.0.66/frontGroup/office-npapi/commits/7d874e5d1c0307627e08e8d068f3080e5ae518fb))
- 修复基于文件格式无法正确选择插件的问题 ([10334d7](http://192.168.0.66/frontGroup/office-npapi/commits/10334d78e88cd38294aa4c39704aea133842e451))
- **render-vue:** 补充当 fileType 和 usePlugin 变化时，重新选择插件的逻辑 ([852b076](http://192.168.0.66/frontGroup/office-npapi/commits/852b076a6e02f2871eac77a77e4b071428d6ae2e))
- **render-vue:** 修复代理执行方法无法拦截错误的问题 ([9319e69](http://192.168.0.66/frontGroup/office-npapi/commits/9319e69511f8c435867b3f3a5507aa73c41071d9))
- **render-vue:** 修复 render 函数解析不正确的问题 ([10653ef](http://192.168.0.66/frontGroup/office-npapi/commits/10653eff71523926d21f77358f371dba96db4255))

### Features

- 补充插件的初始化代码 ([31dda22](http://192.168.0.66/frontGroup/office-npapi/commits/31dda2294c01c7b8ea993e182744f29b7d3d49a9))
- 分离出通用的方法类型 ([9d91823](http://192.168.0.66/frontGroup/office-npapi/commits/9d918238ab6a97d5b34207f9317814c21a1fe1e9))
- **金格:** 完善插件本地调试环境，完善金格是否受浏览器支持，以及正常的初始化 ([caa5c33](http://192.168.0.66/frontGroup/office-npapi/commits/caa5c333f4b2417b8b1861cf72faeef0b9dd4840))
- **金格:** 新增书签预设，完善插入公文域操作 ([2548bfd](http://192.168.0.66/frontGroup/office-npapi/commits/2548bfd217c693a44b0473484ed72ca13ba561b6))
- **数科:** 精细化数科的打开服务端文件，和保存文件至服务端时动作是否完成的关键帧 ([ab5fa0a](http://192.168.0.66/frontGroup/office-npapi/commits/ab5fa0a4797fe5b98a9eeea15cb013ebf8a5fb0f))
- **数科:** 完成数科的浏览器支持检测算法 ([6db3be0](http://192.168.0.66/frontGroup/office-npapi/commits/6db3be0336bcfc31b2af325bbd3bfe34984ebb1d))
- 完成 WPS 插件的类型定义重构 ([a56174f](http://192.168.0.66/frontGroup/office-npapi/commits/a56174fef8f4b4e556b37f6fa3f1e01ab7b5459c))
- 新增金格的类型定义 ([b36a855](http://192.168.0.66/frontGroup/office-npapi/commits/b36a8554cc9a21e3f259f7dbfd1e3fb352ec3005))
- 新增 render、render-vue，用于处理插件的渲染逻辑 ([12898fd](http://192.168.0.66/frontGroup/office-npapi/commits/12898fd14907fdf55d700e4271b44a64be4f334b))
- 转换 wps 和数科代码完成 ([7f73bf1](http://192.168.0.66/frontGroup/office-npapi/commits/7f73bf128ca48c9776e6f6c7ab9dcfacbdbc6b9d))
- **core:** 调整类型变化，render execMethod 方法新增条件执行 ([843fc5d](http://192.168.0.66/frontGroup/office-npapi/commits/843fc5debfb570bebd87dcba7996a92af43ac105))
- **core:** 更新随机 dom 选择器 id 的算法 ([11afa30](http://192.168.0.66/frontGroup/office-npapi/commits/11afa301b61ff5e7e1179f1b9492f922b1ace6c7))
- **invoker:** 条件执行同一个条件可同时指定多个插件下生效，when 配置项可以是 string[] ([4267b55](http://192.168.0.66/frontGroup/office-npapi/commits/4267b553d2709adc34cb91893e5e3aca9c3047c1))
- **kinggrid:** 完成远程操作文件部分预设的代码 ([92bbece](http://192.168.0.66/frontGroup/office-npapi/commits/92bbece807f3ced90b01a7d62323244ae562f847))
- **plugin:** 初始化和销毁钩子支持 Promise，新增 event emitter 插件可以利用其来进行相关事件的维护工作 ([f432aef](http://192.168.0.66/frontGroup/office-npapi/commits/f432aefe22c8bfa944be525a5947460e6e57fc37))
- **render-vue:** 新增初始化事件 ([0ea7507](http://192.168.0.66/frontGroup/office-npapi/commits/0ea750778e5ec89d9758dfef2f9e19a2202f3066))
- **render:** 补充执行方法的代理 ([4ab8096](http://192.168.0.66/frontGroup/office-npapi/commits/4ab809672e09001e63a88e264e2ec285d358dbef))
- **render:** 新增插件名枚举 ([4496dd3](http://192.168.0.66/frontGroup/office-npapi/commits/4496dd3e9055a3dc5d735744f59ad0e22dbc78e2))
