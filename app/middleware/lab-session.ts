// middleware/lab-session.ts
export default defineNuxtRouteMiddleware(async (to) => {
    const { isLogged } = useAuth()
    const lab = useLabStore()

    // 1. Autenticación
    if (!isLogged) {
        return navigateTo('/login')
    }

    // 2. Si el store aún no ha cargado sus datos (null inicial), forzar carga
    if (lab.session === null && lab.queue === null) {
        await lab.load()
    }

    // 3. Rutas que requieren sesión activa de laboratorio
    const requiresLabSession = ['/camera', '/ios-jetson-nano', '/schematic', '/queue'].includes(to.path)

    if (requiresLabSession && !lab.hasAccess) {
        return navigateTo('/student')
    }
})