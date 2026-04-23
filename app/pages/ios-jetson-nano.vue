<script setup lang="ts">

definePageMeta({
  layout: "student",
  roles: ["student", "docente"],
  middleware: ["lab"]
})
const vncUrl = "https://sao-process-entertaining-default.trycloudflare.com/vnc.html";
const camUrl = "https://triangle-perception-monte-trek.trycloudflare.com/cam/";
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white p-6">


    <!-- CONTENEDOR PRINCIPAL -->
    <div class="relative bg-gray-900 rounded-2xl border border-gray-800 shadow-lg overflow-hidden">

      <!-- VNC GRANDE -->
      <div class="p-3 border-b border-gray-800 flex justify-between">
        <span class="font-semibold">Jetson Nano (Escritorio Remoto)</span>
        <span class="text-green-400 text-xs">● Online</span>
      </div>

      <iframe :src="vncUrl" class="w-full h-[80vh]" frameborder="0" allow="autoplay; fullscreen"></iframe>

      <!-- 🎥 CAMARA OVERLAY -->
      <div
        class="absolute bottom-4 right-4 w-[280px] h-[180px] bg-black rounded-xl overflow-hidden border border-gray-700 shadow-2xl">

        <div class="absolute top-1 left-2 text-xs text-red-400 z-10">
          ● REC
        </div>

        <iframe :src="camUrl" class="w-full h-full" frameborder="0" allow="autoplay"></iframe>
      </div>

    </div>



  </div>
</template>