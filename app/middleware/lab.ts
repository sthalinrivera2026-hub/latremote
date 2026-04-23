import { useLabStore } from "~/stores/useLab"

export default defineNuxtRouteMiddleware(() => {
    const lab = useLabStore()

    if (!lab.session) {
        return navigateTo("/dashboard")
    }
})