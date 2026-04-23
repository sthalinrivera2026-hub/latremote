<script setup lang="ts">
definePageMeta({
    layout: "student",
    roles: ["student", "docente"],
    middleware: ["lab"]
})
const camUrl = "https://triangle-perception-monte-trek.trycloudflare.com/cam/";
</script>

<template>
    <div class="min-h-screen bg-gray-950 text-white p-6">

        <div class="max-w-5xl mx-auto bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-800">

            <!-- HEADER -->
            <div class="flex justify-between items-center p-3 border-b border-gray-800">
                <span class="font-semibold">Cámara Jetson Nano</span>
                <span class="text-green-400 text-xs">● Stream activo</span>
            </div>

            <!-- VIDEO STREAM -->
            <div class="relative bg-black">
                <iframe :src="camUrl" class="w-full h-[75vh]" frameborder="0" allow="autoplay">
                </iframe>

                <!-- OVERLAY INFO -->
                <div class="absolute top-3 left-3 bg-black/60 px-3 py-1 rounded text-sm text-red-400">
                    ● Detección en tiempo real
                </div>
            </div>

        </div>

    </div>
</template>