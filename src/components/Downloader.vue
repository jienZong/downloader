<template>
  <div @click="download" style="height: 100%;display: flex;justify-content: center;align-items: center;">
    {{ show_text || "导出excel" }}
  </div>
</template>
<script>
import writeXlsxFile from 'write-excel-file'
import zionMdapi from "zion-mdapi";
export default {
  name: "Downloader",
  props: ["globalData", "show_text", "task_pk", "actionflow_name", "task_config", "download_config", "filename", "url", "actionflow_id"],
  data() {
    return {
      mdapi: null,
    }
  },
  mounted() {
    console.log("props:", this.$props);
    this.initMadpi();

  },

  methods: {
    async download() {
      let data;
      if (this.actionflow_name) {
        data = await this.queryDownloadTaskInfo();
      } else {
        data = {
          objects: this?.download_config?.objects,
          schema: this?.download_config?.schema,
          filename: this.filename || 'test.xlsx'
        }
      }

      if (!data?.schema) {
        data.schema = [{
          column: '测试标题',
          type: "String",
          value: "item => item.content"
        }]
        if (!data?.objects) {
          data.objects = [{ content: "测试内容xxx" }]
        }
      }

      data.schema.forEach(item => {
        if (item?.type) {
          item.type = eval(item.type)
        }
        if (item?.value) {
          item.value = eval(item.value)
        }
      });

      await writeXlsxFile(data?.objects, {
        schema: data?.schema,
        fileName: data?.filename
      })
    },
    // 获取下载任务信息
    async queryDownloadTaskInfo() {
      const { data, msg, status } = await this.mdapi.callActionflow({
        actionflow_name: this.actionflow_name,
        payload: {
          task_config: this.task_config,
          task_pk: this.task_pk
        }
      }).catch(e => { return { data: {}, msg: e?.message || e, status: "失败" } })

      if (status !== "成功") {
        console.error(msg, data)
      }

      const { schema = [], objects = [], filename } = data;

      return {
        schema,
        objects,
        filename
      }
    },

    // 初始化mdapi
    initMadpi() {
      this.mdapi = zionMdapi.init({
        url: this.url,
        actionflow_id: this.actionflow_id,
        env: "H5"
      })
    }
  }
}
</script>
<style></style>
