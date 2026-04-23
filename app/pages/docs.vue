<script setup lang="ts">

definePageMeta({
    layout: "student",
    roles: ["student", "docente"]
})
const docs = [
    { title: 'Introducción', to: '/docs/intro' },
    { title: 'Uso de la cámara', to: '/docs/camera' },
    { title: 'Control de dispositivos', to: '/docs/devices' }
]
</script>

<template>
    <div class="max-w-5xl mx-auto py-16 px-6">

        <h1 class="text-3xl font-bold mb-6">Documentación</h1>

        <div class="grid md:grid-cols-2 gap-6">
            <NuxtLink v-for="doc in docs" :key="doc.to" :to="doc.to"
                class="block p-6 bg-gray-900 rounded-xl border border-gray-800 hover:bg-gray-800 transition">
                <h2 class="font-semibold text-lg">{{ doc.title }}</h2>
                <p class="text-sm text-gray-400 mt-2">
                    Ver documentación
                </p>
            </NuxtLink>
        </div>

    </div>
</template>