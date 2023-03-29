const list_one = template => {
  const { Netall, columns, buttons } = template
  const exportCurType = Object.values(Netall?.currentType ?? {})
  let columnsNum = 3
  const tableColumns = columnsNum ? generateTableColumnsNum(columnsNum) : generateTableColumns(columns)
  return `<script lang="tsx" setup>
  import { formOptions, CustomFilterConf} from '../list'
  import { useList } from '@xm-fe/xm-pc-base'
  import { TableColumnProps } from 'ant-design-vue';
  ${generateImports(Netall, exportCurType)}
  const { dataSource, onSearch, handleTableChange, pagination, loading, reload } = useList(${Netall && Netall.Function})

  const tableColumns: TableColumnProps<${Netall && Netall.Res}>[] =
   [${tableColumns}]

  </script>
  <template>
    <SListCard>
    <SCustomFilter
      :loading="loading"
      :customConfigList="CustomFilterConf"
      :formOptions="formOptions"
      :onSearch="onSearch"
    />
      <a-table
        rowKey="id"
        :dataSource="dataSource"
        :columns="tableColumns"
        :pagination="pagination"
        :loading="loading"
        :scroll="{ x: 500 }"
        @change="handleTableChange"
      />
    </SListCard>
  </template>
  `
}
const list_two = template => {
  const { Netall, columns, buttons, columnsNum } = template
  const exportCurType = Object.values(Netall?.currentType ?? {})
  const tableColumns = columnsNum ? generateTableColumnsNum(columnsNum) : generateTableColumns(columns)

  return `<script lang="tsx" setup>
  import { formOptions, CustomFilterConf} from '../list'
  import { useList } from '@xm-fe/xm-pc-base'
  import { TableColumnProps } from 'ant-design-vue';
  ${generateImports(Netall, exportCurType)}
  const { dataSource, onSearch, handleTableChange, pagination, loading, reload } = useList(${Netall && Netall.Function})

  const tableColumns: TableColumnProps<${Netall && Netall.Res}>[] =
  [${tableColumns}]
  </script>
  <template>
    <SListCard>
    <SCustomFilter
      :loading="loading"
      :customConfigList="CustomFilterConf"
      :formOptions="formOptions"
      :onSearch="onSearch"
    />
    ${buttonsHtml(buttons)}
      <a-table
        rowKey="id"
        :dataSource="dataSource"
        :columns="tableColumns"
        :pagination="pagination"
        :loading="loading"
        :scroll="{ x: 500 }"
        @change="handleTableChange"
      />
    </SListCard>
  </template>
  `
}
// 这个是需要的模版
const list = template => {
  const { Netall, columns, buttons, columnsNum, container } = template
  const exportCurType = Object.values(Netall?.currentType ?? {})
  const tableColumns = columnsNum ? generateTableColumnsNum(columnsNum) : generateTableColumns(columns)
  //一级标签内容
  const TabMenu = container.includes('TabMenu') ? generateTabMenu(template.TabMenuNum) : ''
  //二级标签内容
  const SubTabMenu = container.includes('SubTabMenu') ? generateSubTabMenu(template.SubTabMenuNum) : ''
  // 标题卡片
  const Title = container.includes('Title') ? `title=""` : ''
  // 标题按钮
  // const TitleButton = container.includes('TitleButton') ? generateButton('TitleButton', template.TitleButtonNum) : ''
  // //Toolbar 左按钮
  // const TableLeftButton = container.includes('TableLeftButton')
  //   ? generateButton('TableLeftButton', template.TableLeftButtonNum)
  //   : ''
  // //Toolbar 右按钮
  // const TableRightButton = container.includes('TableRightButton')
  //   ? generateButton('TableRightButton', template.TableRightButtonNum)
  //   : ''
  const [TitleButton, TableLeftButton, TableRightButton] = ['TitleButton', 'TableLeftButton', 'TableRightButton']
    // .filter(type => container.includes(type))
    .map(type => (container.includes(type) ? generateButton(type, template[`${type}Num`]) : undefined))
  const buttonscript = `
  ${TitleButton?.script || ''}
  ${TableLeftButton?.script || ''}
  ${TableRightButton?.script || ''}
  `
  // .replaceAll('\n  ', '\n')

  const TableToolbar = generateTableToolbar(TableLeftButton, TableRightButton) || ''
  return `<script lang="tsx" setup>
  import { ref } from 'vue';
  //import { formOptions, CustomFilterConf} from '../list'
  import { useList } from '@xm-fe/xm-pc-base'
  import { TableColumnProps } from 'ant-design-vue';
  ${generateImports(Netall, exportCurType)}
  const { dataSource, onSearch, handleTableChange, pagination, loading, reload } = useList(${Netall && Netall.Function})
  ${TabMenu && TabMenu.script}
  ${SubTabMenu && SubTabMenu.script}
  const tableColumns: TableColumnProps<${Netall && (Netall.importRes || Netall.Res)}>[] =
  [${tableColumns || ''}]
   ${buttonscript || ''}
   ${generateSCustomFilterScript()}
  </script>
  <template>
   ${TabMenu && TabMenu.html}
  <CardLayout ${Title}>
   ${(TitleButton && TitleButton.html) || ''}
    <SCustomFilter
      :loading="loading"
      :customConfigList="CustomFilterConf"
      :formOptions="formOptions"
      :onSearch="onSearch"
    />
  ${SubTabMenu && SubTabMenu.html}
   ${TableToolbar}
      <a-table
        rowKey="id"
        :dataSource="dataSource"
        :columns="tableColumns"
        :pagination="pagination"
        :loading="loading"
        :scroll="{ x: 500 }"
        @change="handleTableChange"
      />
    </CardLayout>
  </template>

  <style lang="scss" scoped>
  </style>

  `
}

function generateTableColumns(columns) {
  return (
    columns &&
    columns.map(item => {
      return `{
      title: '${item}',
      dataIndex: '',
    }`
    })
  )
}
function generateTableColumnsNum(n) {
  let columns = ''
  for (let i = 0; i < n; i++) {
    columns =
      columns +
      `{ title: '',
      dataIndex: '',
    },`
  }

  return columns
}
function buttonsHtml(buttons) {
  return buttons
    ? buttons
        .map((item, index) => {
          const buttonClass = index > 0 ? 'ml-10' : ''
          return `<a-button class="${buttonClass}" type="primary" @click=" ">${item}</a-button>\n`
        })
        .join('')
    : ''
}

function generateImports(Netall, exportCurType) {
  let imports = ''

  if (exportCurType.length > 0) {
    const result = exportCurType.filter(item => item !== undefined && item != 'any')
    imports += ` import { ${result.join()} } from '${Netall.filePath.replace('.ts', '')}';\n `
  }
  if (Netall && Netall.extraImport) {
    imports += Netall.extraImport.map(item => ` ${item};\n`).join('')
  }
  return imports
}
function generateSubTabMenu(defaultNumber) {
  const num = defaultNumber || 1

  const tabItems = new Array(num).fill({ label: '', value: '' })
  const script = `//#region 二级标签
  const activeKey = ref();
  const tabSubItem = ${JSON.stringify(tabItems, null, 2)};
//#endregion  
  `
  const html = `<a-tabs v-model:activeKey="activeKey">
  <a-tab-pane v-for="item in tabSubItem" :key="item.value" :tab="item.label" />
</a-tabs> `

  return { script, html }
}
function generateTabMenu(defaultNumber) {
  const num = defaultNumber || 1

  const tabItems = new Array(num).fill({ label: '', value: '' })
  const script = `//#region 一级标签
  const TabKey = ref();
  const tabItem = ${JSON.stringify(tabItems, null, 2)};
  //#endregion
  `

  const html = `<div class="card_common_style mb-20">
    <a-tabs v-model:activeKey="TabKey">
      <a-tab-pane v-for="item in tabItem" :key="item.value" :tab="item.label" />
    </a-tabs>
  </div>`

  const style = `
  .card_common_style {
    padding: 0 20px;
    border-radius: 8px;
    background-color: $listCardBgColor;

    :deep(.ant-tabs-top > .ant-tabs-nav) {
      margin-bottom: 0;
    }
  }
  `

  return { script, html, style }
}

function generateTitleButton(buttonNumber) {
  const num = buttonNumber || 1
  const buttonArray = Array.from({ length: num }, (_, i) => i + 1)
  const buttonsTemplateItems = buttonArray.map(num => {
    return `<a-button @click="titbtn${num}Handle">${num}</a-button>`
  })
  const buttonsScriptItems = buttonArray.map(num => {
    return `const titbtn${num}Handle=()=>{}`
  })
  const template = `<template #button>
    ${buttonsTemplateItems.join('\n')}
  </template>
  `
  const script = ` ${buttonsScriptItems.join('\n')}`
  return { template, script }
}
function generateTableLeftButton(buttonNumber) {
  const num = buttonNumber || 1
  const buttonArray = Array.from({ length: num }, (_, i) => i + 1)
  const buttonsTemplateItems = buttonArray.map(num => {
    return `<a-button @click="Leftbtn${num}Handle">${num}</a-button>`
  })
  const buttonsScriptItems = buttonArray.map(num => {
    return `const Leftbtn${num}Handle=()=>{}`
  })
  const template = `<template #button>
    ${buttonsTemplateItems.join('\n')}
  </template>
  `
  const script = ` ${buttonsScriptItems.join('\n')}`
  return { template, script }
}
function generateTableRightButton(buttonNumber) {
  const num = buttonNumber || 1
  const buttonArray = Array.from({ length: num }, (_, i) => i + 1)
  const buttonsTemplateItems = buttonArray.map(num => {
    return `<a-button @click="Rightbtn${num}Handle">${num}</a-button>`
  })
  const buttonsScriptItems = buttonArray.map(num => {
    return `const Rightbtn${num}Handle=()=>{}`
  })
  const template = `<template #button>
    ${buttonsTemplateItems.join('\n')}
  </template>
  `
  const script = ` ${buttonsScriptItems.join('\n')}`
  return { template, script }
}
//合并一下
function generateButton(type, buttonNumber) {
  // console.log(`generateButton called with type: ${type}, buttonNumber: ${buttonNumber}`)
  const num = buttonNumber || 1
  const buttonArray = Array.from({ length: num }, (_, i) => i + 1)
  let buttonType = ''
  switch (type) {
    case 'TitleButton':
      buttonType = 'titbtn'
      break
    case 'TableLeftButton':
      buttonType = 'Leftbtn'
      break
    case 'TableRightButton':
      buttonType = 'Rightbtn'
      break
    default:
      return ''
  }
  const buttonsTemplateItems = buttonArray.map(num => {
    return `<a-button @click="${buttonType}${num}Handle">${num}</a-button>`
  })
  const buttonsScriptItems = buttonArray.map(num => {
    return `const ${buttonType}${num}Handle=()=>{}`
  })
  let html = ''
  if (type === 'TitleButton') {
    html = `<template #button>
    ${buttonsTemplateItems.join('\n')}
  </template>
  `
  } else {
    html = buttonsTemplateItems.join('\n')
  }
  const script = ` ${buttonsScriptItems.join('\n')}`
  return { html, script }
}
function generateTableToolbar(LeftButton, RightButton) {
  const lefthtml = LeftButton?.html
    ? `<div style="text-align: left">
  ${LeftButton.html}
  </div>`
    : ''
  const righthtml = RightButton?.html
    ? `
  <div style="text-align: right">
  ${RightButton.html}
  </div>`
    : ''
  if (lefthtml || righthtml) {
    return `<div class="table-toolbar">
  ${lefthtml}
  ${righthtml}
  </div>
  `
  } else return ''
}

function generateSCustomFilterScript() {
  return `const formOptions = [
    {
      preset: CustomFilterConf.type.key,
      placeholder: '报价类型',
      key: 'quotaType',
    },
    {
      preset: CustomFilterConf.status.key,
      placeholder: '报价单状态',
      key: 'status',
    },
  ]
  const CustomFilterConf = {
    status: {
      key: 'status',
      placeholder: '报价单状态',
      base: selectBase,
      optionsFn: GetQuotationStateList,
    },
    type: {
      key: 'type',
      placeholder: '报价类型',
      base: selectBase,
      optionsFn: GetQuotaTypeList,
    },
  }`
}
module.exports = {
  list_one,
  list_two,
  list,
}
