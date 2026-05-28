<script setup lang="ts">
import type { AccountLoginDto } from '#/openapi-types.ts'
import type { SchemaFormExpose } from '@/components/common/schema-form/types/base.ts'
import type { DefineSchema } from '@/components/common/schema-form/types/common.ts'
import { reactive } from 'vue'
import renderIcon from '@/hooks/components/render-icon.ts'
import { rememberMeCache } from '@/store/caches.ts'
import useAuthStore from '@/store/modules/auth'
import OtherLogins from '@/views/auth/components/OtherLogins.vue'

const authStore = useAuthStore()

const { RenderUnoIcon } = renderIcon()
const [loading, setLoading] = useToggle()
const formRef = useTemplateRef<SchemaFormExpose>('formRef')
const router = useRouter()

// 其他操作
const otherOperations = reactive([
  {
    name: '手机号登录',
    path: '/auth/phoneLogin',
  },
  {
    name: '二维码登录',
    path: '/auth/qRCodeLogin',
  },
  {
    name: '注册',
    path: '/auth/register',
  },
])

const form = reactive<AccountLoginDto>({
  account: 'admin',
  password: '$2a$10$N9qo8uLOickgx2ZMRZoMye',
  rememberMe: rememberMeCache.get() || false,
})

const schema = ref<DefineSchema<AccountLoginDto>[]>([
  {
    field: 'account',
    component: 'input',
    componentProps: {
      size: 'large',
      placeholder: '请输入用户名',
    },
    componentContent: {
      prefix: () => RenderUnoIcon('i-ant-design:user-outlined'),
    },
    rules: {
      message: '请输入账号',
      required: true,
    },
  },
  {
    field: 'password',
    component: 'input',
    componentProps: {
      size: 'large',
      type: 'password',
      placeholder: '请输入密码',
    },
    componentContent: {
      prefix: () => RenderUnoIcon('i-ant-design:lock-outlined'),
    },
    rules: {
      message: '请输入密码',
      required: true,
    },
  },
  {
    slot: 'action',
  },
  {
    slot: 'submit',
  },
])

async function handleLogin() {
  await formRef.value?.validate()
  setLoading(true)
  await authStore.loginByAccount(form).finally(() => setLoading(false))
}

function handleRememberMe() {
  console.log(form.rememberMe)
  rememberMeCache.set(form.rememberMe ?? false)
}
</script>

<template>
  <div class="flex flex-col h-full justify-center">
    <h1 class="text-[24px] mb-[24px]">
      Hi 欢迎回来👋
    </h1>
    <schema-form
      ref="formRef"
      v-model:schema="schema"
      :show-label="false"
      :model="form"
      :show-actions="false"
    >
      <template #action>
        <n-flex
          class="mb-4"
          align="center"
          justify="space-between"
        >
          <n-checkbox v-model:checked="form.rememberMe" @update:checked="handleRememberMe">
            记住密码
          </n-checkbox>
          <span class="text-primary cursor-pointer">忘记密码？</span>
        </n-flex>
      </template>
      <template #submit>
        <n-button
          :loading="loading"
          block
          size="large"
          type="primary"
          @click="handleLogin"
        >
          登录
        </n-button>
      </template>
    </schema-form>
    <n-flex
      class="mt-[24px] w-full"
      justify="space-between"
    >
      <n-button
        v-for="item in otherOperations"
        :key="item.path"
        type="primary"
        tertiary
        class="flex-1 flex-shrink"
        @click="router.push(item.path)"
      >
        {{ item.name }}
      </n-button>
    </n-flex>
    <OtherLogins />
  </div>
</template>

<style scoped lang="scss">

</style>
