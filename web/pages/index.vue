<template>
  <div v-if="!isLoggedin">
    <button @click="handleSignInClick">Signin with Kakaotalk</button>
  </div>
  <div v-else>
    <p>Your Sub: {{ sub }}</p>
    <button @click="handleSignOutClick">Signout with Kakaotalk</button>
    <button @click="handleCheckClick">Check URL</button>
  </div>
</template>

<script setup lang="ts">
import { AmplifyConfig } from '../amplifyconfig';
import { Amplify } from '@aws-amplify/core'
Amplify.configure(AmplifyConfig)
import { signInWithRedirect } from '@aws-amplify/auth';

const runtimeConfig = useRuntimeConfig()
const authStore = useAuthStore()
const { accessToken } = storeToRefs(authStore)

const sub = ref<string>('')

const isLoggedin = computed(() => {
  return accessToken.value.length > 0
})

async function handleSignInClick() {
  signInWithRedirect({
    provider: {
      custom: 'KakaotalkOIDC'
    }
  })
}

function handleSignOutClick() {
  accessToken.value = ''
}

async function handleCheckClick() {
  const res = await useFetch(`${runtimeConfig.public.api}/check`, {
    headers: {
      Authorization: `Bearer ${accessToken.value}`
    }
  })
  sub.value = res.data.value as string
}
</script>