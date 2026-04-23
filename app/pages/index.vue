<script setup lang="ts">
const goQueue = () => navigateTo("/dashboard")

</script>

<template>
    <div class="bg-gray-950 text-white">

        <!-- HERO -->
        <section class="min-h-screen flex items-center">
            <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

                <!-- TEXTO -->
                <div class="space-y-6">
                    <h1 class="text-4xl md:text-5xl font-bold leading-tight">
                        Laboratorio Remoto <span class="text-blue-500">IoT + IA</span>
                    </h1>

                    <p class="text-gray-400 text-lg">
                        Accede a hardware real desde la web. Controla dispositivos,
                        ejecuta prácticas y visualiza resultados en tiempo real.
                    </p>

                    <div class="flex gap-4">
                        <button @click="goQueue"
                            class="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold">
                            Empezar
                        </button>

                        <a href="#features" class="border border-gray-700 hover:border-gray-500 px-6 py-3 rounded-xl">
                            Ver más
                        </a>
                    </div>

                    <!-- STACK -->
                    <div class="flex flex-wrap gap-2 text-sm text-gray-400 pt-4">
                        <span class="bg-gray-800 px-3 py-1 rounded-lg">Jetson Nano</span>
                        <span class="bg-gray-800 px-3 py-1 rounded-lg">Raspberry Pi</span>
                        <span class="bg-gray-800 px-3 py-1 rounded-lg">Arduino</span>
                        <span class="bg-gray-800 px-3 py-1 rounded-lg">ESP32</span>
                    </div>
                </div>

                <!-- CAM -->
                <div class="relative">
                    <div class="absolute inset-0 bg-blue-600 blur-3xl opacity-20 rounded-2xl"></div>

                    <img src="/images/hero.png" alt="Hero" class="relative w-full h-[350px]">
                </div>

            </div>
        </section>

        <!-- FEATURES -->
        <section id="features" class="bg-gray-900 py-20">
            <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">

                <div class="bg-gray-800 p-6 rounded-2xl">
                    <h3 class="font-semibold text-lg mb-2">Acceso Remoto</h3>
                    <p class="text-gray-400 text-sm">
                        Controla dispositivos físicos desde cualquier lugar.
                    </p>
                </div>

                <div class="bg-gray-800 p-6 rounded-2xl">
                    <h3 class="font-semibold text-lg mb-2">Tiempo Real</h3>
                    <p class="text-gray-400 text-sm">
                        Video en vivo y respuesta inmediata del hardware.
                    </p>
                </div>

                <div class="bg-gray-800 p-6 rounded-2xl">
                    <h3 class="font-semibold text-lg mb-2">IA + IoT</h3>
                    <p class="text-gray-400 text-sm">
                        Procesamiento con Jetson y sensores conectados.
                    </p>
                </div>

            </div>
        </section>

    </div>
</template>