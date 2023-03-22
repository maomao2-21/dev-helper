<script lang="ts" setup>
import { FormInstance, message } from 'ant-design-vue'
import axios from 'axios'
import { onMounted, ref, toRaw, watch } from 'vue'
import { useRoute } from 'vue-router'

const formRef = ref<FormInstance>()
const route = useRoute()
// const plainOptions = ['新增', '导出', '导入', '下载']
const containerOptions = [
  {
    label: '一级标签',
    value: 'TabMenu',
  },
  {
    label: '二级标签',
    value: 'SubTabMenu',
  },
  {
    label: '标题',
    value: 'Title',
  },
  {
    label: '标题按钮',
    value: 'TitleButton',
  },
  {
    label: '表格左按钮',
    value: 'TableLeftButton',
  },
  {
    label: '表格右按钮',
    value: 'TableRightButton',
  },
]

interface Props {
  layout?: any
}
const props = defineProps<Props>()
let treeData = ref<any[]>([])
const selectedKeys = ref<string[]>([])
const model = ref({
  apiPath: '',
  outPath: '',
  columnsNum: undefined,
  TitleButtonNum: undefined,
  TableLeftButtonNum: undefined,
  TableRightButtonNum: undefined,
  TabMenuNum: undefined,
  SubTabMenuNum: undefined,
  container: [],
})
const onFinish = (values: any) => {
  formRef.value?.validateFields().then(async values => {
    const apiPath = values.apiPath || 'src/' + [...selectedKeys.value].pop()
    let data = {
      ...values,
      apiPath,
      listType: 'list',
      projectPath: route.query.projectPath,
    }
    const res = await axios.post('/fe-dev/clist', data)
    if (res.data.code === 200) {
      message.success('文件生成成功')
    } else {
      message.error(res.data.msg)
    }
  })
}
const getTreeData = async () => {
  const { data } = await axios.get('/fe-dev/apis/tree?projectPath=' + route.query.projectPath)
  if (data.code === 200) {
    treeData.value = data.data[0].children
  } else message.error(data.msg)
}
onMounted(() => {
  getTreeData()
})
const select = (a, b, c) => {
  console.log(a, b, c)
}
</script>

<template>
  <a-form
    ref="formRef"
    layout="vertical"
    :model="model"
    name="basic"
    v-bind="layout"
    autocomplete="off"
    @finish="onFinish"
  >
    <a-form-item name="container" label="你需要的容器">
      <a-checkbox-group v-model:value="model.container" :options="containerOptions" />
    </a-form-item>
    <a-form-item v-if="model.container.includes('TitleButton')" name="TitleButtonNum" label="标题栏按钮数">
      <a-input-number v-model:value="model.TitleButtonNum" :maxlength="10" showCount />
    </a-form-item>
    <a-form-item v-if="model.container.includes('TableLeftButton')" name="TableLeftButtonNum" label="表格左按钮数">
      <a-input-number v-model:value="model.TableLeftButtonNum" :maxlength="10" showCount />
    </a-form-item>
    <a-form-item v-if="model.container.includes('TableRightButton')" name="TableRightButtonNum" label="表格右按钮数">
      <a-input-number v-model:value="model.TableRightButtonNum" :maxlength="10" showCount />
    </a-form-item>
    <a-form-item v-if="model.container.includes('TabMenu')" name="TabMenuNum" label="一级标签数">
      <a-input-number v-model:value="model.TabMenuNum" :maxlength="10" showCount />
    </a-form-item>
    <a-form-item v-if="model.container.includes('SubTabMenu')" name="SubTabMenuNum" label="二级标签数">
      <a-input-number v-model:value="model.SubTabMenuNum" :maxlength="10" showCount />
    </a-form-item>
    <a-form-item name="apiPath" label="net文件路径">
      <a-textarea v-model:value="model.apiPath" placeholder="如src/apis/summerfarm-manage/api/activity/pageQNet.ts" />
    </a-form-item>
    <a-form-item label="net文件的路径 二选一">
      <a-cascader v-model:value="selectedKeys" :options="treeData" expandTrigger="hover" placeholder="Please select" />
    </a-form-item>
    <a-form-item name="outPath" label="文件生成的路径" required>
      <a-textarea v-model:value="model.outPath" placeholder="如src/index.vue" />
    </a-form-item>
    <a-form-item name="columnsNum" label="columns的列数">
      <a-input-number v-model:value="model.columnsNum" :maxlength="100" showCount />
    </a-form-item>
    <!-- <a-form-item name="buttons" label="按钮">
      <a-checkbox-group v-model:value="model.buttons" :options="plainOptions" />
    </a-form-item> -->
    <!-- <a-form-item label="net文件的路径 二选一">
      <a-tree v-model:selectedKeys="selectedKeys" showLine :treeData="treeData" @select="select" />
    </a-form-item> -->
    <a-row justify="center">
      <a-button type="primary" htmlType="submit">生成</a-button>
    </a-row>
  </a-form>
</template>

<style lang="scss" scoped>
.tabs {
  height: 100%;
  width: 20%;
}
</style>
