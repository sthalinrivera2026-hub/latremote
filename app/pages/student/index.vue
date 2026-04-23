<script setup lang="ts">
definePageMeta({
    layout: "student",
    roles: ["student", "docente"]
})
// ---------- Tipado ----------
interface User { name: string; email: string; }
interface QueueStatus { position: number; }
interface Session { remaining: number; }
interface Notification { id: number; message: string; type: "info" | "error" | "success" | "warning"; }

// ---------- Estado ----------
const config = useRuntimeConfig();
const user = ref<User | null>(null);
const queue = ref<QueueStatus | null>(null);
const session = ref<Session | null>(null);
const loading = ref(false);
const localRemaining = ref<number | null>(null);
const notifications = ref<Notification[]>([]);
let pollingInterval: NodeJS.Timeout | null = null;
let countdownInterval: NodeJS.Timeout | null = null;
let nextNotificationId = 0;

// Control de aviso de 1 minuto
let hasWarnedOneMinute = false;

// ---------- API Helper ----------
const getApi = () => {
    const token = localStorage.getItem("token");
    return $fetch.create({
        baseURL: config.public.apiUrl,
        headers: { Authorization: `Bearer ${token}` }
    });
};

// ---------- Notificaciones ----------
function addNotification(message: string, type: Notification["type"] = "info") {
    const id = nextNotificationId++;
    notifications.value.push({ id, message, type });
    setTimeout(() => {
        notifications.value = notifications.value.filter(n => n.id !== id);
    }, 5000);
}

// ---------- Contador local ----------
function stopLocalCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = null;
    localRemaining.value = null;
}

function startLocalCountdown(initialSeconds: number) {
    stopLocalCountdown();
    localRemaining.value = initialSeconds;
    countdownInterval = setInterval(() => {
        if (localRemaining.value !== null && localRemaining.value > 0) {
            localRemaining.value -= 1;
            if (localRemaining.value === 0) {
                stopLocalCountdown();
                addNotification("⏰ Tu sesión ha terminado. Puedes volver a entrar en la cola.", "warning");
                loadStatus();
            }
        }
    }, 1000);
}

// 🔔 Aviso cuando falte 1 minuto
watch(localRemaining, (newValue) => {
    if (newValue !== null && newValue <= 60 && newValue > 0 && !hasWarnedOneMinute) {
        hasWarnedOneMinute = true;
        addNotification(
            "⚠️ ¡Queda 1 minuto de sesión! Por favor, guarda tu trabajo y cierra tus aplicaciones en la PC remota.",
            "warning"
        );
    }
    if (newValue !== null && newValue > 60) {
        hasWarnedOneMinute = false;
    }
});

// Sincronizar contador con la sesión
watch(session, (newSession) => {
    if (newSession && newSession.remaining > 0) {
        startLocalCountdown(newSession.remaining);
        hasWarnedOneMinute = false; // Resetear para nueva sesión
    } else {
        stopLocalCountdown();
    }
});

// ---------- Cargar estado ----------
async function loadStatus() {
    try {
        const api = getApi();
        const [queueData, sessionData] = await Promise.all([
            api("/queue/status").catch(() => null),
            api("/session/current").catch(() => null)
        ]);
        queue.value = queueData;
        session.value = sessionData;
        if (!sessionData && localRemaining.value !== null) {
            stopLocalCountdown();
            addNotification("La sesión ha expirado", "info");
        }
    } catch (error) {
        console.error(error);
        addNotification("Error al cargar el estado.", "error");
    }
}

// ---------- Unirse a cola ----------
async function joinQueue() {
    if (queue.value || session.value || loading.value) return;
    loading.value = true;
    try {
        const api = getApi();
        await api("/queue/join", { method: "POST" });
        addNotification("✅ Te has unido a la cola. Espera tu turno.", "success");
        await loadStatus();
    } catch (error: any) {
        addNotification(error?.data?.message || "No se pudo entrar a la cola", "error");
    } finally {
        loading.value = false;
    }
}

// ---------- Finalizar sesión manualmente ----------
async function endSession() {
    if (!session.value) return;
    try {
        const api = getApi();
        await api("/session/end", { method: "POST" });
        addNotification("Sesión finalizada manualmente", "info");
        await loadStatus();
    } catch (error) {
        addNotification("Error al finalizar la sesión", "error");
    }
}

// ---------- Formateo ----------
const formatTime = (seconds: number) => {
    if (!seconds && seconds !== 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
};

// ---------- Logout ----------
const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigateTo("/login");
};

// ---------- Ciclo de vida ----------
onMounted(() => {
    const stored = localStorage.getItem("user");
    if (stored) user.value = JSON.parse(stored);
    loadStatus();
    pollingInterval = setInterval(() => loadStatus(), 3000);
});

onUnmounted(() => {
    if (pollingInterval) clearInterval(pollingInterval);
    if (countdownInterval) clearInterval(countdownInterval);
});
</script>

<template>
    <div class="">

        <!-- Toasts -->
        <div class="fixed top-5 right-5 z-50 space-y-3">
            <div v-for="n in notifications" :key="n.id"
                class="px-5 py-3 rounded-xl shadow-xl text-sm font-medium backdrop-blur-md border transition-all animate-fade-in"
                :class="{
                    'bg-blue-600/90 border-blue-400': n.type === 'info',
                    'bg-red-600/90 border-red-400': n.type === 'error',
                    'bg-green-600/90 border-green-400': n.type === 'success',
                    'bg-yellow-500/90 border-yellow-300 text-black': n.type === 'warning'
                }">
                {{ n.message }}
            </div>
        </div>

        <!-- Menú -->


        <!-- CONTENIDO PRINCIPAL -->
        <div class=" mx-auto mt-6 space-y-6">

            <!-- GRID PRINCIPAL -->
            <div class="grid sm:grid-cols-2 gap-3">
                <!-- COLA -->
                <div class="bg-gray-800/40 border border-gray-700/60 rounded-xl p-3 space-y-2">

                    <!-- TITLE -->
                    <h2 class="text-xs font-semibold flex items-center gap-1.5 text-gray-200">
                        🚀 Cola
                    </h2>

                    <!-- QUEUE STATE -->
                    <div v-if="queue" class="space-y-0.5">
                        <p class="text-yellow-400 font-mono text-2xl font-bold leading-none">
                            #{{ queue.position }}
                        </p>
                        <p class="text-[11px] text-gray-400">
                            Mantén esta ventana abierta.
                        </p>
                    </div>

                    <!-- ACTIVE SESSION -->
                    <div v-else-if="session" class="flex items-center gap-1.5 text-green-400 text-xs font-medium">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                        Sesión activa
                    </div>

                    <!-- NOT CONNECTED -->
                    <div v-else class="space-y-2">
                        <p class="text-[11px] text-gray-400">
                            Sin conexión al sistema.
                        </p>

                        <button @click="joinQueue" :disabled="loading" class="w-full flex items-center justify-center gap-1
             bg-blue-600 hover:bg-blue-700 disabled:opacity-40
             transition rounded-lg py-1.5 text-xs font-medium">
                            <span v-if="loading" class="animate-spin">⏳</span>
                            Entrar a la cola
                        </button>
                    </div>

                </div>

                <!-- SESIÓN ACTIVA -->
                <div v-if="session"
                    class="bg-green-900/20 rounded-xl p-3 border border-green-700/60 flex items-center justify-between gap-2">
                    <div>
                        <h2 class="text-sm font-semibold flex items-center gap-1.5 mb-0.5">🟢 Sesión</h2>
                        <p class="text-2xl font-mono font-bold tracking-wide">{{ formatTime(localRemaining ??
                            session.remaining) }}</p>
                        <p class="text-gray-300 text-[11px]">restante</p>
                    </div>
                    <button @click="endSession"
                        class="bg-red-600/80 hover:bg-red-700 transition px-2.5 py-1.5 rounded-lg text-xs font-semibold shrink-0">
                        Finalizar
                    </button>
                </div>
            </div>

            <!-- SESIÓN INICIADA  -->
            <div v-if="session" class="rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                <div
                    class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-4 transition-colors">

                    <!-- HEADER COMPACTO -->
                    <div class="mb-5">
                        <h1 class="text-xl font-bold">Bienvenido al Laboratorio Remoto</h1>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Ya ingresaste correctamente. Puedes iniciar el laboratorio cuando estés listo.
                        </p>
                    </div>

                    <!-- GRID MENÚ (cards más compactas) -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <!-- Card 1 -->
                        <a href="/ios-jetson-nano"
                            class="rounded-xl p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow hover:shadow-md transition hover:scale-[1.01] flex items-start gap-3">
                            <div class="text-2xl">🧪</div>
                            <div>
                                <h2 class="font-semibold text-base">Iniciar Laboratorio</h2>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Accede al entorno remoto.</p>
                            </div>
                        </a>

                        <!-- Card 2 -->
                        <a href="/schematic"
                            class="rounded-xl p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow hover:shadow-md transition hover:scale-[1.01] flex items-start gap-3">
                            <div class="text-2xl">🔌</div>
                            <div>
                                <h2 class="font-semibold text-base">Esquemático</h2>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Revisa el esquema del laboratorio.
                                </p>
                            </div>
                        </a>
                    </div>

                    <!-- FOOTER COMPACTO -->
                    <div class="mt-6 text-center text-[11px] text-gray-400">
                        Laboratorio Remoto IoT • Interfaz simplificada
                    </div>

                </div>
            </div>
            <!-- ESTADO VACÍO -->
            <div v-else-if="!queue && !session" class="text-center py-16 text-gray-500">
                <p class="text-lg">
                    🔌 Inicia una sesión ingresando a la cola
                </p>
            </div>

        </div>
    </div>
</template>

<style scoped></style>