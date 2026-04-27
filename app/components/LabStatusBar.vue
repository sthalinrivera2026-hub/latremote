<script setup lang="ts">
const lab = useLabStore()

const goToQueue = () => navigateTo('/student')

const formatTime = (seconds: number | null) => {
    if (seconds === null) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
    <div
        class="bg-gray-100 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 px-4 py-2 text-sm flex flex-wrap justify-between items-center gap-2">
        <!-- Estado izquierdo -->
        <div class="flex items-center gap-3 flex-wrap">
            <!-- Sesión activa -->
            <UBadge v-if="lab.session" color="success" variant="subtle" class="gap-1.5">
                <UIcon name="i-lucide-play-circle" class="w-3.5 h-3.5" />
                Sesión activa
            </UBadge>

            <!-- En cola -->
            <UBadge v-else-if="lab.queue" color="warning" variant="subtle" class="gap-1.5">
                <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
                En cola ({{ lab.queue.position }})
            </UBadge>

            <!-- Sin conexión -->
            <div v-else class="flex items-center gap-2">
                <span class="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <UIcon name="i-lucide-wifi-off" class="w-3.5 h-3.5" />
                    Sin sesión
                </span>
                <UButton color="primary" size="xs" icon="i-lucide-log-in" label="Reservar laboratorio"
                    @click="goToQueue" />
            </div>
        </div>

        <!-- Tiempo restante -->
        <div v-if="lab.session"
            class="font-mono text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-md flex items-center gap-1.5">
            <UIcon name="i-lucide-hourglass" class="w-3.5 h-3.5" />
            {{ formatTime(lab.timeLeft) }}
        </div>
    </div>
</template>