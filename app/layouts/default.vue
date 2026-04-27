<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900">

    <!-- HEADER GLOBAL -->
    <AppHeader />

    <!-- CONTENIDO -->
    <main class="flex-1 py-4">
      <slot />
    </main>

    <!-- FOOTER -->
    <footer class="text-center py-6 text-gray-500 bg-gray-100 dark:bg-gray-900">
      © 2026 LABREMOTE
    </footer>

  </div>
</template>