<script setup lang="ts">
import Downloader from "./components/Downloader.vue";
import { reactive, ref } from "vue";

const globalData = reactive({ value: "http://shipin.cdxyhpx.com/sv/3bba3a21-18926843f74/3bba3a21-18926843f74.mp4" });
const setGlobalData = (obj: any) => {
  globalData.value = obj.value;
}

const url = ref("");
const actionflow_id = ref("39b8c22f-5d78-446b-a046-a2967986da5c")
const writeXlsxFileConfig = '{"objects":[{"content":"zion中测试"}],"schema":[{"column":"测试标题","type":"String","value":"item => item.content"}]}';

</script>

<template>
  <Downloader source="http://shipin.cdxyhpx.com/sv/3bba3a21-18926843f74/3bba3a21-18926843f74.mp4"
    vid="a175d6b01b4271ee80980764b3ec0102" playauth="" :writeXlsxFileConfig="writeXlsxFileConfig" :course_log_pk="0" />
</template>

<style>
#app{
  height: 60vh;
}
</style>
