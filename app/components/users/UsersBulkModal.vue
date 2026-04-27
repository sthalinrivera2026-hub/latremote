<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const toast = useToast()
const api = useApi()
const emit = defineEmits(['success'])

const open = ref(false)
const loading = ref(false)
const inputMethod = ref<'json' | 'csv'>('json')
const rawData = ref('')

// Esquema para validación previa (cuando se hace submit)
const schema = z.object({
    data: z.string().min(1, 'Debes ingresar datos')
})

type Schema = z.output<typeof schema>

async function onSubmit(event: FormSubmitEvent<Schema>) {
    loading.value = true
    try {
        let usersToSend: any[] = []

        if (inputMethod.value === 'json') {
            const parsed = JSON.parse(event.data.data)
            if (!Array.isArray(parsed)) throw new Error('Debe ser un array de usuarios')
            // Validar cada objeto (mínimo email y name)
            for (const u of parsed) {
                if (!u.email || !u.name) throw new Error('Cada usuario debe tener email y name')
                if (u.role && !['admin', 'student'].includes(u.role)) u.role = 'student'
            }
            usersToSend = parsed
        } else {
            // CSV
            const lines = event.data.data.trim().split(/\r?\n/)
            if (lines.length < 2) throw new Error('CSV debe tener cabecera + al menos un dato')
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
            const required = ['email', 'name']
            for (const r of required) {
                if (!headers.includes(r)) throw new Error(`CSV debe tener columna "${r}"`)
            }
            usersToSend = lines.slice(1).map((line, idx) => {
                const values = line.split(',').map(v => v.trim())
                const obj: any = {}
                headers.forEach((h, i) => {
                    obj[h] = values[i] || ''
                })
                if (!obj.email || !obj.name) {
                    throw new Error(`Fila ${idx + 2}: faltan email o nombre`)
                }
                if (!obj.role) obj.role = 'student'
                if (!['admin', 'student'].includes(obj.role)) obj.role = 'student'
                return obj
            })
        }

        if (usersToSend.length === 0) throw new Error('No hay usuarios para crear')

        const response = await api('/users/bulk', {
            method: 'POST',
            body: { users: usersToSend }
        })
        toast.add({
            title: 'Carga masiva exitosa',
            description: `${response.length || usersToSend.length} usuarios creados.`,
            color: 'success'
        })
        emit('success')
        close()
    } catch (err: any) {
        toast.add({
            title: 'Error en carga masiva',
            description: err.message,
            color: 'error'
        })
    } finally {
        loading.value = false
    }
}

function close() {
    open.value = false
    rawData.value = ''
    inputMethod.value = 'json'
}

defineExpose({ open, close })
</script>

<template>

    <div>
        <UModal v-model:open="open">
            <UButton label="Carga masiva" color="neutral" variant="outline" icon="i-lucide-users" />
            <template #body>
                <h3 class="text-lg font-semibold mb-4">Carga masiva de usuarios</h3>

                <UForm :schema="schema" :state="{ data: rawData }" class="space-y-4" @submit="onSubmit">
                    <UFormField label="Formato">
                        <URadioGroup v-model="inputMethod" :items="[
                            { label: 'JSON', value: 'json' },
                            { label: 'CSV', value: 'csv' }
                        ]" />
                    </UFormField>

                    <UAlert v-if="inputMethod === 'json'" icon="i-lucide-file-code" title="Ejemplo de JSON"
                        description='[{"email": "juan@mail.com", "name": "Juan", "role": "student"}, {"email": "ana@mail.com", "name": "Ana", "role": "admin"}]' />
                    <UAlert v-else icon="i-lucide-file-spreadsheet" title="Formato CSV (con cabecera)"
                        description="email,name,role\njuan@mail.com,Juan,student\nana@mail.com,Ana,admin" />

                    <UFormField label="Datos" name="data" required>
                        <UTextarea v-model="rawData"
                            :placeholder="inputMethod === 'json' ? 'Pega aquí tu array JSON' : 'Pega aquí el contenido CSV'"
                            rows="8" class="font-mono text-sm" />
                    </UFormField>

                    <div class="flex justify-end gap-2 pt-2">
                        <UButton label="Cancelar" color="neutral" variant="subtle" @click="close" />
                        <UButton label="Crear usuarios" color="primary" type="submit" :loading="loading" />
                    </div>
                </UForm>
            </template>
        </UModal>
    </div>
</template>