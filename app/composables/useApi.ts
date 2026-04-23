export const useApi = () => {
  const config = useRuntimeConfig();

  const token = process.client
    ? localStorage.getItem("token")
    : null;

  const api = $fetch.create({
    baseURL: config.public.apiUrl,
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {}
  });

  return api;
};