export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string>('');

  return {
    accessToken,
  };
});
