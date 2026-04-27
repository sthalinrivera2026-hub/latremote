import { defineStore } from 'pinia'

interface Queue {
    position: number
}

interface Session {
    remaining: number
}

export const useLabStore = defineStore('lab', () => {
    const config = useRuntimeConfig()

    // STATE (tipado correcto)
    const queue = ref<Queue | null>(null)
    const session = ref<Session | null>(null)
    const timeLeft = ref<number | null>(null)
    const loading = ref(false)

    let poll: ReturnType<typeof setInterval> | null = null
    let timer: ReturnType<typeof setInterval> | null = null

    // API
    const api = () => {
        if (process.client) {
            const token = localStorage.getItem("token")

            return $fetch.create({
                baseURL: config.public.apiUrl,
                headers: { Authorization: `Bearer ${token}` }
            })
        }
        return $fetch
    }

    // LOAD (robusto)
    const load = async () => {
        try {
            const a = api()

            const [q, s] = await Promise.all([
                a("/queue/status").catch(() => null),
                a("/session/current").catch(() => null)
            ])

            queue.value = q as Queue | null
            session.value = s as Session | null

            // CONTROL TIMER (solo si cambia)
            if (session.value?.remaining !== undefined) {
                if (timeLeft.value !== session.value.remaining) {
                    startTimer(session.value.remaining)
                }
            } else {
                stopTimer()
            }

        } catch (e) {
            console.error("❌ load error", e)
        }
    }

    // TIMER
    const startTimer = (sec: number) => {
        if (timer) clearInterval(timer)

        timeLeft.value = sec

        timer = setInterval(() => {
            if (timeLeft.value === null) return

            timeLeft.value--

            if (timeLeft.value <= 0) {
                stopTimer()
                load()
            }
        }, 1000)
    }

    const stopTimer = () => {
        if (timer) clearInterval(timer)
        timer = null
        timeLeft.value = null
    }

    // ACTIONS
    const join = async () => {
        if (queue.value || session.value) return

        loading.value = true

        try {
            await api()("/queue/join", { method: "POST" })
            await load()
        } catch (e) {
            console.error("❌ join error", e)
        } finally {
            loading.value = false
        }
    }

    const end = async () => {
        try {
            await api()("/session/end", { method: "POST" })
            await load()
        } catch (e) {
            console.error("❌ end error", e)
        }
    }

    // INIT GLOBAL (evita duplicados)
    const init = () => {
        if (poll) return

        load()
        poll = setInterval(load, 3000)
    }

    const stop = () => {
        if (poll) clearInterval(poll)
        if (timer) clearInterval(timer)

        poll = null
        timer = null
    }

    // PERMISO
    const hasAccess = computed(() => !!session.value)

    return {
        queue,
        session,
        timeLeft,
        loading,
        hasAccess,
        init,
        stop,
        join,
        load,
        end
    }
})