<script setup lang="ts">
definePageMeta({
    layout: "student",
    roles: ["student", "docente"]
})
type Hotspot = {
    path: string
    label: string
    position: string
    color: string
}

const go = (path: string) => navigateTo(path)

const hotspots: Hotspot[] = [
    {
        path: '/ios-jetson-nano',
        label: 'Jetson',
        position: 'top-[44%] left-[7%] w-[19%] h-[44%]',
        color: 'hover:bg-blue-500'
    },
    {
        path: '/raspberry-pi',
        label: 'Raspberry Pi',
        position: 'top-[18%] left-[50%] w-[18%] h-[20%]',
        color: 'hover:bg-green-500'
    },
    {
        path: '/esp32',
        label: 'ESP32',
        position: 'top-[30%] left-[72%] w-[20%] h-[17%]',
        color: 'hover:bg-yellow-500'
    },
    {
        path: '/arduino-r3',
        label: 'Arduino R3',
        position: 'top-[58%] left-[76%] w-[18%] h-[24%]',
        color: 'hover:bg-red-500'
    },
    {
        path: '/camera',
        label: 'Cámara',
        position: 'top-[30%] left-[38%] w-[10%] h-[20%]',
        color: 'hover:bg-purple-500'
    }
]
</script>

<template>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <h1 class="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
            Esquema del Sistema IoT
        </h1>

        <div class="relative max-w-7xl mx-auto">
            <!-- Imagen optimizada -->
            <img src="/images/schematic-v1.png" alt="Esquema IoT" loading="lazy"
                class="w-full rounded-xl shadow-lg select-none" />

            <!-- Hotspots dinámicos -->
            <button v-for="(h, i) in hotspots" :key="i" @click="go(h.path)" :aria-label="h.label"
                class="absolute opacity-0 hover:opacity-0 transition cursor-pointer" :class="[h.position, h.color]" />
        </div>
    </div>
</template>