<script lang="ts" setup>
import { ref, reactive, toRaw, computed, onMounted } from 'vue'
import List from './list/index.vue'
const config = ref([
  {
    name: 'list',
    title: '列表页',
  },
])

const activeKey = ref('list')

const onClose = () => {
  visible.value = false
}

const visible = ref(false)
const showDrawer = () => {
  visible.value = true
}
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}
</script>

<template>
  <div class="flex" style="height: 100%">
    <a-tabs v-model:activeKey="activeKey" contentWrapperStyle="display:none" class="tabs" tabPosition="left" animated>
      <a-tab-pane v-for="item in config" :key="item.name" :tab="item.title" />
    </a-tabs>

    <List v-if="activeKey === 'list'" :layout="layout" />
  </div>
</template>

<style lang="scss" scoped>
.tabs {
  height: 100%;
  width: 20%;
}
.content {
  flex: 1;
}
.drawer-handle {
  padding: 15px;
  position: fixed;
  top: 300px;
  right: 10px;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
  pointer-events: auto;
  border-radius: 0;
}
</style>
