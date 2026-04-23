<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue"

const route = useRoute()
const lab = useLabStore()
const { user, isLogged, initAuth, logout } = useAuth()

const profileOpen = ref(false)

onMounted(() => {
    lab.init()
    initAuth()
})

onUnmounted(() => {
    lab.stop()
})

// ---------- FORMAT ----------
const formatTime = (s: number | null) => {
    if (s === null) return "0:00"
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, "0")}`
}

// ---------- MENU ----------
const items = computed(() => [
    { label: "Esquematico", to: "/schematic", icon: "i-lucide-file-text" },
    { label: "Docs", to: "/docs", icon: "i-lucide-book-open" },
    {
        label: "Camara",
        to: "/camera",
        icon: "i-lucide-camera",
        disabled: !lab.hasAccess
    },
    {
        label: "IOS Jetson",
        to: "/ios-jetson-nano",
        icon: "i-lucide-cpu",
        disabled: !lab.hasAccess
    }
])

const mobileMenuItems = computed(() =>
    items.value.map(i => ({ ...i }))
)

// ---------- REDIRECT ----------
watch(
    () => lab.session,
    (s) => {
        const restricted = ["/camera", "/ios-jetson-nano"]
        if (!s && restricted.includes(route.path)) {
            navigateTo("/schematic")
        }
    },
    { immediate: true }
)

const goToQueue = () => navigateTo("/student")

const toggleProfile = () => {
    profileOpen.value = !profileOpen.value
}
</script>

<template>
    <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900">

        <!-- HEADER -->
        <UHeader>
            <template #left>
                <NuxtLink to="/">LABREMOTE</NuxtLink>
            </template>

            <UNavigationMenu :items="items" variant="link" />

            <template #right>
                <UColorModeButton />

                <!-- 🔴 NO LOGUEADO -->
                <NuxtLink v-if="!isLogged" to="/login" class="px-4 py-2 bg-blue-600 text-white rounded-xl">
                    Login
                </NuxtLink>

                <!-- 🟢 LOGUEADO -->
                <div v-else class="relative">

                    <!-- AVATAR -->
                    <button @click="toggleProfile">
                        <img :src="user?.avatar_url || 'https://i.pravatar.cc/40'"
                            class="w-10 h-10 rounded-full border" />
                    </button>

                    <!-- DROPDOWN -->
                    <div v-if="profileOpen"
                        class="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border z-50">
                        <!-- USER -->
                        <div class="px-4 py-3 border-b">
                            <p class="text-sm font-semibold">{{ user?.name }}</p>
                            <p class="text-xs text-gray-400">{{ user?.email }}</p>
                        </div>

                        <!-- LINKS -->
                        <NuxtLink to="/student"
                            class="block px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                            Dashboard
                        </NuxtLink>

                        <NuxtLink to="/profile"
                            class="block px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                            Perfil
                        </NuxtLink>

                        <div class="border-t"></div>

                        <!-- LOGOUT -->
                        <button @click="logout"
                            class="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </template>

            <template #body>
                <UNavigationMenu :items="mobileMenuItems" orientation="vertical" class="-mx-2.5" />

                <USeparator class="my-6" />

                <UButton label="Sign in" color="neutral" variant="subtle" to="/login" block />
            </template>
        </UHeader>

        <!-- 🔥 STATUS GLOBAL -->
        <div class="bg-gray-800 px-4 py-2 text-sm flex justify-between items-center">

            <div class="flex gap-2 items-center">
                <span v-if="lab.session" class="text-green-400">
                    🟢 Sesión activa
                </span>

                <span v-else-if="lab.queue" class="text-yellow-400">
                    ⏳ En cola (#{{ lab.queue?.position ?? "-" }})
                </span>
                <div v-else>
                    <!-- estado -->
                    <span class="flex items-center gap-2">
                        ⚪ Sin sesión
                    </span>
                    <!-- CTA -->
                    <button @click="goToQueue"
                        class="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                        Reservar laboratorio
                    </button>
                </div>


            </div>

            <div v-if="lab.session" class="font-mono text-green-300">
                ⏱ {{ formatTime(lab.timeLeft) }}
            </div>
        </div>

        <!-- CONTENT -->
        <main class="py-4">
            <slot />
        </main>

        <!-- FOOTER -->
        <footer class="bg-gray-100 dark:bg-gray-900 text-gray-500 text-center py-6">
            © 2025 LabRemote
        </footer>

    </div>
</template>