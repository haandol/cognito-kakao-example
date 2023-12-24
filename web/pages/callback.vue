<template>
  <div> callback page </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const { accessToken } = storeToRefs(authStore)

onMounted(() => {
  if (route.hash) {
    route.hash.split('&').forEach((item) => {
      const [key, value] = item.split('=')
      if (key === '#access_token') {
        accessToken.value = value
        router.push('/')
      }
    })
  }
})
</script>