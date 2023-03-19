<script lang="tsx" setup>
  import { ref } from 'vue';
  //import { formOptions, CustomFilterConf} from '../list'
  import { useList } from '@xm-fe/xm-pc-base'
  import { CardLayout } from '@xm-fe/xm-pc-base'
  import { TableColumnProps } from 'ant-design-vue';
  
  const { dataSource, onSearch, handleTableChange, pagination, loading, reload } = useList(undefined)
  
  
  const tableColumns: TableColumnProps<undefined>[] =
  []
   
  
  
  
  
   const formOptions = [
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
  }
  </script>
  <template>
   
  <CardLayout >
   
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
    </CardLayout>
  </template>

  <style lang="scss" scoped>
  
  </style>

  