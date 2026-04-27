<template>
    <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">

        <!-- HEADER GLOBAL (mismo componente) -->
        <AppHeader />
        <LabStatusBar />
        <div class="flex flex-1">

            <!-- SIDEBAR (opcional futuro) -->
            <!-- <aside class="w-64 hidden md:block border-r dark:border-gray-800">
                <AppMenu :items="menuItems" />
            </aside> -->


            <!-- CONTENIDO -->
            <main class="flex-1 p-4">
                <slot />
            </main>

        </div>

    </div>
</template>

<script setup lang="ts">
const { menuItems } = useMenu()
</script>