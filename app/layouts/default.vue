<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900">
    <UHeader>
      <!-- Izquierda -->
      <template #left>
        <NuxtLink to="/">
          LABREMOTE
          <!-- Logo modo claro -->
          <!-- <img src="/logo-light.png" alt="Logo Tienda" class="w-28 h-auto block dark:hidden" />
          <img src="/logo-dark.png" alt="Logo Tienda" class="w-28 h-auto hidden dark:block" /> -->
        </NuxtLink>
      </template>

      <!-- Menú central -->
      <UNavigationMenu :items="items" variant="link" />

      <!-- Derecha -->
      <template #right>
        <UColorModeButton />

        <!-- 🔴 NO LOGUEADO -->
        <NuxtLink v-if="!isLogged" to="/login" class="px-4 py-2 bg-blue-600 text-white rounded-xl">
          Login
        </NuxtLink>

        <!-- 🟢 LOGUEADO -->
        <div v-else class="relative">

          <!-- AVATAR -->
          <button @click="toggleProfile">
            <img :src="user?.avatar_url || 'https://i.pravatar.cc/40'" class="w-10 h-10 rounded-full border" />
          </button>

          <!-- DROPDOWN -->
          <div v-if="profileOpen"
            class="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg  z-50">
            <!-- USER INFO -->
            <div class="px-4 py-3 border-b">
              <p class="text-sm font-semibold">{{ user?.name }}</p>
              <p class="text-xs text-gray-400">{{ user?.email }}</p>
            </div>

            <!-- LINKS -->
            <NuxtLink to="/dashboard" class="block px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
              Dashboard
            </NuxtLink>

            <NuxtLink to="/profile" class="block px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
              Perfil
            </NuxtLink>

            <div class="border-t"></div>

            <!-- LOGOUT -->
            <button @click="logout"
              class="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
              Cerrar sesión
            </button>
          </div>
        </div>
      </template>

      <!-- Menú móvil -->
      <template #body>
        <UNavigationMenu :items="mobileMenuItems" orientation="vertical" class="-mx-2.5" />

        <USeparator class="my-6" />

        <UButton label="Sign in" color="neutral" variant="subtle" to="/login" leading-icon="i-lucide-log-in" block
          class="mb-3" />


      </template>
    </UHeader>

    <main class="items-center justify-center py-4">
      <slot />
    </main>

    <!-- Componente del carrito -->
    <CartDrawer />

    <footer class="bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-center py-6">
      © 2025 Ricen Store. Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>

const { user, isLogged, initAuth, logout } = useAuth()

const profileOpen = ref(false)

onMounted(() => {
  initAuth()
})

const toggleProfile = () => {
  profileOpen.value = !profileOpen.value
}
// Menú de navegación
const items = [
  {
    label: 'Nosotros',
    to: '/about',
    icon: 'i-lucide-users'
  },
  {
    label: 'Documentación',
    to: '/documentation',
    icon: 'i-lucide-book-open'
  },

  {
    label: 'Blog',
    to: '/blog',
    icon: 'i-lucide-book'
  },

]

// Menú móvil (incluye el badge de favoritos)
const mobileMenuItems = computed(() => {
  return items.map(item => ({
    ...item,
    label: item.badge
      ? `${item.label} (${item.badge})`
      : item.label
  }))
})


</script>