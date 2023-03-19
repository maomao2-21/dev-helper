<template>
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 8 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
 
        <a-form-item
        label="你的项目路径"
        name="projectPath"
        :rules="[{ required: true, message: 'Please input your projectPath!' }]"
      >
        <a-input v-model:value="formState.projectPath" placeholder="请输入绝对路径"/>
      </a-form-item> 
    
    <a-row justify="center">

      <a-button type="primary" html-type="submit">提交</a-button>

      </a-row>
    </a-form>
  </template>
  <script lang="ts">
  import { defineComponent, reactive } from 'vue';
import router from '../../router';
  
  interface FormState {
    projectPath: string; 
  }
  export default defineComponent({
    setup() {
      const formState = reactive<FormState>({
        projectPath: '',
      });
      const onFinish = (values: any) => {
        console.log('Success:', values);
  router.push({ name: 'home' ,query: { projectPath:values.projectPath}})

      };
  
      const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };
      return {
        formState,
        onFinish,
        onFinishFailed,
      };
    },
  });
  </script>