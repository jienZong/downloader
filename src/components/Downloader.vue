<template>
  <div  style="height: 100%;display: flex;justify-content: center;align-items: center;"
    :style="style" @click="downloadExcel()">
    {{ show_text || "导出excel" }}
  </div>
</template>
<script setup lang="ts" name="Downloader">
import { ref, defineProps, onMounted } from 'vue';
import writeXlsxFile from 'write-excel-file'
import zionMdapi from "zion-mdapi";
// 定义子组件向父组件传值/事件
const props = defineProps({
  //全局参数
  globaldata:{
    type: [Object, String],
    default:""
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
});
//定义变量
const mdapi = ref<any>({});
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
//定义导出行为
const downloadExcel = async () => {
  //1.获取导出行为配置
  const excelData = props.actionflow_name ? await queryDownloadTaskInfo() : typeof props.writeXlsxFileConfig === 'string' ? JSON.parse(props.writeXlsxFileConfig) : props.writeXlsxFileConfig;
  if (typeof excelData.objects === 'string') excelData.objects = JSON.parse(excelData.objects);
  if (typeof excelData.schema === 'string') excelData.schema = JSON.parse(excelData.schema);
  excelData.schema = excelData.schema.map((res: any) => {
    return {
      column: res.column,
      type: eval(res.type),
      value: eval(res.value)
    }
  })
  console.log(excelData);
  //2.导出
  writeXlsxFile(excelData.objects, {
    schema: excelData.schema,
    fileName: props.file_name
  });
}
const queryDownloadTaskInfo = async () => {
  const { data, msg, status } = await mdapi.value.callActionflow({
    actionflow_name: props.actionflow_name,
    payload: props.actionflow_payload
  }).catch((e: any) => { return { data: {}, msg: e?.message || e, status: "失败" } });
  if (status !== "成功") console.error(msg, data);
  // 返回结构 {schema:[],objects:[]}
  return data
}

onMounted(() => {
  //zionMdapi框架初始化
  mdapi.value = zionMdapi.init({
    callback_url: props.callback_url,
    env: "H5"
  })
})

</script>