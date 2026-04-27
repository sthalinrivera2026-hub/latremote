<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const toast = useToast()
const api = useApi()
const emit = defineEmits(['success'])

const open = ref(false)

// Esquema de validación
const schema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    avatar_url: z.string().url('URL inválida').optional().or(z.literal('')),
    role: z.enum(['admin', 'student'])
})

type Schema = z.output<typeof schema>

const initialState = {
    name: '',
    email: '',
    avatar_url: '',
    role: 'student' as const
}

const state = reactive({ ...initialState })

async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
        await api('/users', {
            method: 'POST',
            body: event.data
        })
        toast.add({
            title: 'Usuario creado',
            description: `${event.data.name} ha sido agregado.`,
            color: 'success'
        })
        emit('success')
        close()
    } catch (err: any) {
        toast.add({
            title: 'Error',
            description: err.message,
            color: 'error'
        })
    }
}

function close() {
    open.value = false
    Object.assign(state, initialState)
}

defineExpose({ open, close })
</script>

<template>
    <div>
        <UModal v-model:open="open">
            <UButton label="Nuevo usuario" icon="i-lucide-user" />

            <template #body>
                <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                    <UFormField label="Nombre" name="name" required>
                        <UInput v-model="state.name" placeholder="Juan Pérez" />
                    </UFormField>

                    <UFormField label="Email" name="email" required>
                        <UInput v-model="state.email" type="email" placeholder="usuario@ejemplo.com" />
                    </UFormField>

                    <UFormField label="Avatar URL" name="avatar_url" hint="Opcional">
                        <UInput v-model="state.avatar_url" placeholder="https://..." />
                    </UFormField>

                    <UFormField label="Rol" name="role">
                        <USelect v-model="state.role" :items="[
                            { label: 'Estudiante', value: 'student' },
                            { label: 'Administrador', value: 'admin' }
                        ]" />
                    </UFormField>

                    <div class="flex justify-end gap-2 pt-2">
                        <UButton label="Cancelar" color="neutral" variant="subtle" @click="close" />
                        <UButton label="Crear" color="primary" type="submit" />
                    </div>
                </UForm>
            </template>
        </UModal>

    </div>
</template>