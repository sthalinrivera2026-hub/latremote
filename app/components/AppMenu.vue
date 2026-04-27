<script setup lang="ts">
const { menuItems } = useMenu()
</script>

<template>
    <nav class="flex items-center gap-6">
        <NuxtLink v-for="item in menuItems" :key="item.to" :to="item.to"
            class="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition font-medium"
            active-class="text-blue-500 border-b-2 border-blue-500 pb-1">
            <UIcon :name="item.icon" class="w-4 h-4" />
            {{ item.label }}
        </NuxtLink>
    </nav>
</template>