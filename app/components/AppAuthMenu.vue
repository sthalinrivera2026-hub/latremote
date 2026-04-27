<script setup lang="ts">
const { user, isLogged, isLoading, initAuth, logout } = useAuth()

const profileOpen = ref(false)

onMounted(async () => {
    await initAuth()
})

// Opciones del menú desplegable para usuarios autenticados
const dropdownItems = computed(() => [
    [
        {
            label: user.value?.name || 'Usuario',
            icon: 'i-lucide-user',
            slot: 'account',
            class: 'pointer-events-none'
        },
        {
            label: user.value?.email,
            icon: 'i-lucide-mail',
            slot: 'email',
            class: 'pointer-events-none text-muted text-sm'
        }
    ],
    [
        {
            label: 'Dashboard',
            icon: 'i-lucide-layout-dashboard',
            to: '/dashboard'
        },
        {
            label: 'Perfil',
            icon: 'i-lucide-user-circle',
            to: '/profile'
        }
    ],
    [
        {
            label: 'Cerrar sesión',
            icon: 'i-lucide-log-out',
            color: 'error',
            onSelect: () => logout()
        }
    ]
])
</script>

<template>
    <div class="flex items-center gap-3">
        <UColorModeButton />

        <!-- Estado de carga -->
        <div v-if="isLoading" class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />

        <!-- Usuario no logueado -->
        <UButton v-else-if="!isLogged" to="/login" label="Login" color="primary" variant="solid" />

        <!-- Usuario logueado (dropdown con Nuxt UI) -->
        <UDropdownMenu v-else :items="dropdownItems" :content="{
            align: 'end',
            side: 'bottom',
            class: 'w-64'
        }">
            <UAvatar :src="user?.avatar_url || undefined" :alt="user?.name || 'Avatar'" size="md"
                class="cursor-pointer hover:ring-2 hover:ring-primary transition" />
        </UDropdownMenu>
    </div>
</template>