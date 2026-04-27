<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { User } from '~/types'

const props = defineProps<{
    user: User | null
}>()

const toast = useToast()
const api = useApi()
const emit = defineEmits(['success'])

const open = ref(false)

const schema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    avatar_url: z.string().url('URL inválida').optional().or(z.literal(''))
})

type Schema = z.output<typeof schema>

const state = reactive<Schema>({
    name: '',
    email: '',
    avatar_url: ''
})

watch(() => props.user, (newUser) => {
    if (newUser) {
        state.name = newUser.name
        state.email = newUser.email
        state.avatar_url = newUser.avatar_url || ''
    }
}, { immediate: true })

async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (!props.user) return
    try {
        await api(`/users/${props.user.id}`, {
            method: 'PUT',
            body: event.data
        })
        toast.add({
            title: 'Usuario actualizado',
            description: `${event.data.name} ha sido modificado.`,
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
}

defineExpose({ open, close })
</script>

<template>
    <UModal v-model:open="open">
        
        <template #body>
            <h3 class="text-lg font-semibold mb-4">Editar usuario</h3>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormField label="Nombre" name="name" required>
                    <UInput v-model="state.name" placeholder="Nombre completo" />
                </UFormField>

                <UFormField label="Email" name="email" required>
                    <UInput v-model="state.email" type="email" placeholder="usuario@ejemplo.com" />
                </UFormField>

                <UFormField label="Avatar URL" name="avatar_url" hint="Opcional">
                    <UInput v-model="state.avatar_url" placeholder="https://..." />
                </UFormField>

                <div class="flex justify-end gap-2 pt-2">
                    <UButton label="Cancelar" color="neutral" variant="subtle" @click="close" />
                    <UButton label="Guardar cambios" color="primary" type="submit" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>