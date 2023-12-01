<template>
  <div @click="download" style="height: 100%;display: flex;justify-content: center;align-items: center;">
    {{ show_text || "下载" }}
  </div>
</template>
<script>
import writeXlsxFile from 'write-excel-file'
import zionMdapi from "zion-mdapi";
export default {
  name: "Downloader",
  props: ["globalData", "show_text", "task_pk", "objects", "schema", "filename", "url", "actionflow_id"],
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
      let data = {
        objects: this.objects || [],
        schema: this.schema || [],
        filename: this.filename || 'file.xlsx'
      }
      if (!data?.schema || data?.schema?.length == 0) {
        data = await this.queryDownloadTaskInfo();
      }
      await writeXlsxFile(data?.objects || [], {
        schema: data?.schema || [],
        fileName: data?.filename || 'file.xlsx'
      })
    },
    // 获取下载任务信息
    async queryDownloadTaskInfo() {
      const { data, msg, status } = await this.mdapi.callActionflow({
        actionflow_name: "获取下载任务信息",
        payload: {
          task_pk: this.task_pk
        }
      }).catch(e => { return { data: {}, msg: e?.message || e, status: "失败" } })

      if (status !== "成功") {
        console.error(msg, data)
      }

      const { schema = [{
        column: '第一列',
        type: "String",
        value: "item => item.name"
      }], objects = [{ name: "测试第一列内容" }], filename = 'file.xlsx' } = data;
      schema.forEach(item => {
        if (item?.type) {
          item.type = eval(item.type)
        }
        if (item?.value) {
          item.value = eval(item.value)
        }
      });
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
