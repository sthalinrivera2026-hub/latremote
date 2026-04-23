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

        <!-- Botón de favoritos -->


        <!-- Botón del carrito -->


        <!-- Botón móvil (solo icono) -->
        <UButton icon="i-lucide-log-in" color="neutral" variant="ghost" to="/login" class="lg:hidden" />

        <!-- Botón Iniciar sesión con icono -->
        <UButton label="Sign in" color="neutral" variant="outline" to="/login" leading-icon="i-lucide-log-in"
          class="hidden lg:inline-flex" />

        <!-- Botón Registrarse con icono -->
        <UButton label="Sign up" color="primary" to="/signup" leading-icon="i-lucide-user-plus"
          trailing-icon="i-lucide-arrow-right" class="hidden lg:inline-flex" />
      </template>

      <!-- Menú móvil -->
      <template #body>
        <UNavigationMenu :items="mobileMenuItems" orientation="vertical" class="-mx-2.5" />

        <USeparator class="my-6" />

        <UButton label="Sign in" color="neutral" variant="subtle" to="/login" leading-icon="i-lucide-log-in" block
          class="mb-3" />

        <UButton label="Sign up" color="primary" to="/signup" leading-icon="i-lucide-user-plus" block />
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


// Menú de navegación
const items = [
  {
    label: 'Nosotros',
    to: '/about',
    icon: 'i-lucide-users'
  },
  {
    label: 'Docs',
    to: '/docs',
    icon: 'i-lucide-book-open'
  },

  {
    label: 'Contacto',
    to: '/contact',
    icon: 'i-lucide-mail'
  },
  // {
  //   label: 'Categorias',
  //   to: '/catalog/categories',
  //   icon: 'i-lucide-flame'
  // }
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