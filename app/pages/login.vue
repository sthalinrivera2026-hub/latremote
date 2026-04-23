<script setup lang="ts">
import { ref, onMounted } from "vue";

const config = useRuntimeConfig();

type AuthResponse = {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        avatar_url?: string;
        role: string;
    };
};

const isLoading = ref(false);
const error = ref<string | null>(null);



// ===== LOGIN =====
const loginWithGoogle = async (response: any) => {
    if (isLoading.value) return;

    isLoading.value = true;
    error.value = null;

    try {
        const res = await $fetch<AuthResponse>(
            `${config.public.apiBase || "http://localhost:4000"}/auth/google`,
            {
                method: "POST",
                body: { credential: response.credential },
            }
        );

        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        await navigateTo("/dashboard");

    } catch (e: any) {
        console.error(e);
        error.value = "Error al iniciar sesión";
    } finally {
        isLoading.value = false;
    }
};

// ===== GOOGLE INIT =====
onMounted(() => {

    const wait = setInterval(() => {
        if ((window as any).google?.accounts?.id) {
            clearInterval(wait);

            // @ts-ignore
            google.accounts.id.initialize({
                client_id: config.public.googleClientId,
                callback: loginWithGoogle,
            });

            // @ts-ignore
            google.accounts.id.renderButton(
                document.getElementById("googleBtn"),
                {
                    theme: "outline",
                    size: "large",
                    width: 260,
                }
            );
        }
    }, 100);
});
</script>

<template>
    <div class="min-h-screen flex items-center justify-center
              bg-gradient-to-br from-gray-100 to-gray-200
              dark:from-gray-950 dark:to-gray-900 transition">
        <!-- CARD -->
        <div class="w-full max-w-md mx-4">
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">

                <!-- ICON -->
                <div class="flex justify-center mb-6">
                    <div
                        class="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                        IoT
                    </div>
                </div>

                <!-- TITLE -->
                <h1 class="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
                    Laboratorio Remoto
                </h1>

                <p class="text-center text-gray-500 dark:text-gray-400 mb-6">
                    Accede con Google
                </p>

                <!-- ERROR -->
                <div v-if="error" class="text-red-500 text-sm text-center mb-4">
                    {{ error }}
                </div>

                <!-- GOOGLE BTN -->
                <div id="googleBtn" class="flex justify-center"
                    :class="{ 'opacity-50 pointer-events-none': isLoading }"></div>

                <!-- LOADING -->
                <div v-if="isLoading" class="text-center text-sm text-gray-400 mt-4">
                    Iniciando sesión...
                </div>

            </div>
        </div>
    </div>
</template>