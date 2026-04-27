<template>
    <UHeader>

        <!-- LEFT -->
        <template #left>
            <NuxtLink to="/" class="font-bold">
                LABREMOTE
            </NuxtLink>
        </template>

        <!-- CENTER MENU -->
        <AppMenu :items="menuItems" />

        <!-- RIGHT AUTH (COMPONENTE SEPARADO) -->
        <template #right>
            <AppAuthMenu />
        </template>

    </UHeader>
</template>

<script setup lang="ts">
const { menuItems } = useMenu()
</script>