<script setup lang="ts">
import type { DefineSchema } from '@/components/common/schema-form/types/common.ts'
import { reactive } from 'vue'
import RouterConstant from '@/constant/router'
import OtherLogins from '@/views/auth/components/OtherLogins.vue'

const [loading] = useToggle()
const router = useRouter()

const form = reactive({
  username: undefined,
  password: undefined,
  phone: undefined,
  verificationCode: undefined,
})

const schema = reactive<DefineSchema<typeof form>[]>([
  {
    field: 'username',
    component: 'input',
    componentProps: {
      placeholder: '请输入用户名',
    },
    rule: {
      message: '请输入账号',
      required: true,
    },
  },
  {
    field: 'password',
    component: 'input',
    componentProps: {
      type: 'password',
      placeholder: '请输入密码',
    },
    rule: {
      message: '请输入密码',
      required: true,
    },
  },
  {
    field: 'phone',
    component: 'input',
    componentProps: {
      placeholder: '请输入手机号',
    },
    rule: 'phone',
  },
  {
    contentSlot: 'verificationCode',
    rule: {
      trigger: 'blur',
      message: '请输入验证码',
      required: true,
    },
  },
  {
    slot: 'submit',
  },
])
function handleLogin() {

}
</script>

<template>
  <div class="flex flex-col h-full justify-center">
    <h1 class="mb-[24px]">
      注册🖖
    </h1>
    <schema-form
      :model="form"
      :show-label="false"
      hide-action-button
      :schema="schema"
    >
      <template #verificationCode>
        <n-input-group>
          <n-input v-model:value="form.verificationCode" placeholder="请输入验证码" />
          <n-button type="primary" tertiary>
            发生验证码
          </n-button>
        </n-input-group>
      </template>
      <template #submit>
        <n-button
          :loading="loading"
          block
          size="large"
          type="primary"
          @click="handleLogin"
        >
          注册
        </n-button>
      </template>
    </schema-form>
    <n-button
      class="mt-[24px]"
      type="primary"
      tertiary
      block
      @click="router.push(RouterConstant.LOGIN_PATH)"
    >
      账号密码登录
    </n-button>
    <OtherLogins />
  </div>
</template>

<style scoped lang="scss">

</style>
