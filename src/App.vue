<script setup lang="ts">
import Downloader from "./components/Downloader.vue";

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
