<template>
  <div style="height: 100%;display: flex;justify-content: center;align-items: center;" :style="style"
    @click="downloadExcel()">
    {{ show_text || "导出excel" }}
  </div>
</template>
<script>
import writeXlsxFile from 'write-excel-file'
import zionMdapi from "zion-mdapi";
export default {
  name: "Downloader",
  props: {
    //全局参数
    globaldata: {
      type: [Object, String],
      default: ""
    },
    // 导出配置
    writeXlsxFileConfig: {
      type: [Object, String],
      default: '{"objects":[{"content":"测试内容xxx"}],"schema":[{"column":"测试标题","type":"String","value":"item => item.content"}]}'
    },
    file_name: { type: String, default: "excel.xlsx" },
    // 导出按钮配置
    style: { type: String, default: "" }, // 样式
    show_text: { type: String, default: "导出excel" },
    // 导出行为配置
    callback_url: { type: String, default: "" },
    actionflow_name: { type: String, default: "" },
    actionflow_payload: { type: [Object, String], default: () => { return {} } },
  },
  data() {
    return {
      mdapi: null,
    }
  },
  methods: {
    async downloadExcel() {
      //1.获取导出行为配置
      const excelData = this.actionflow_name ? await this.queryDownloadTaskInfo() :
        (typeof this.writeXlsxFileConfig === 'string' && this.writeXlsxFileConfig ? JSON.parse(this.writeXlsxFileConfig) : this.writeXlsxFileConfig);
      if (typeof excelData.objects === 'string') excelData[`objects`] = JSON.parse(excelData.objects);
      if (typeof excelData.schema === 'string' ) excelData[`schema`] = JSON.parse(excelData.schema);
      excelData.schema = excelData.schema.map(res => {
        return {
          column: res.column,
          type: eval(res.type),
          value: eval(res.value)
        }
      })
      //2.导出
      const data = await writeXlsxFile(excelData.objects, {
        schema: excelData.schema,
        fileName: this.file_name
      });
      console.log(excelData, data);
    },
    async queryDownloadTaskInfo() {
      const { data, msg, status } = await this.mdapi.callActionflow({
        actionflow_name: this.actionflow_name,
        payload: this.actionflow_payload
      }).catch(e => { return { data: {}, msg: e?.message || e, status: "失败" } });
      if (status !== "成功") console.error(msg, data);
      // 返回结构 {schema:[],objects:[]}
      return data
    }
  },
  mounted() {
    console.log("props:", this.$props);
    //zionMdapi框架初始化
    this.mdapi = zionMdapi.init({
      callback_url: this.callback_url,
      env: "H5"
    })
  },
}
</script>