# PM2-Monitor

该项目是自己为团队打造的CI系统监控部分，本仓库仅包含前端部分，后端暂未开源，移除业务代码后将进行开源。

### 预览图
<img src="https://pacez.github.io/images/CI_MONITOR.png" />

### 服务器端
1. 基于PM2 4.X版本开发。主要使用nodejs + shell脚本。

### 前端
1. 使用create-react-app脚手架创建，基于antd 4.x开发。

### 功能：
1. PM2进程列表管理：启、停、重启、删除、日志查看
1. 服务器重启，
1. 服务器性能监控
1. CI分支管理
1. CI构建任务管理，构建日志查看