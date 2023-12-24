// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    public: {
      api: '', // TODO: replace with actual api gateway url
    },
  },
  imports: {
    dirs: ['stores'],
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
});
