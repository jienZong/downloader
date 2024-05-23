// mdapi.config.js,放在项目根目录（node_modules同级目录下）
export default {
	// 回调链接调用框架自定义行为
	"callback_url": "https://zion-app.functorz.com/Y5GGXyqOA5K/zero/L6ARjmeyKwy/callback/8c6be54d-2123-412c-b90b-303f1a24ca8d",

	//zion项目信息配置,配置url、actionflow_id、actionflow_version后会走前端直连方式
	//"url": "https://zion-app.functorz.com/Y5GGXyqOA5K/zero/L6ARjmeyKwy/api/graphql-v2",

	// 配置权限管理后可传入headers信息来支持调用制定接口
	"headers": {
		"authorization": ""
	},

	// mdapi框架自定义行为actionflowId
	//"actionflow_id": "5e5e155d-7b3c-4771-bf94-ceb597cbb666",

	// mdapi框架自定义行为行为版本号,未配置则调用最新部署的版本号，一般在system?.actionflow_version中配置
	//"actionflow_version": 0,

	//会自动追加到payload中的客户端数据
	"client_data": {
		"secret":"",//开发者密钥
		//内置框架自定义行为执行密码，mdapi执行内置的框架自定义行为时会与system.actionflow_pwd进行比对验证
		"actionflow_pwd": "",
		// 统一token,mdapi在dataToToken中会取payload?.client_data.token为默认值
		"token": ""

		// ...支持更多自定义配置
	},

	// 可以不配置，不配置时默认会根据环境执行环境检测判断
	//"env": "H5", //1.MP-WEIXIN 2.H5 3.NODE
	
	"isClog":true,//发送请求时是否在控制台打印日志

	// server配置参数,用于调试，一般无需变动
	"server_port": 3020,
	"server_root": "http://localhost"
}