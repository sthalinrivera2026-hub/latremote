export const useAuth = () => {
    const user = useState<any>("user", () => null)

    const isLogged = computed(() => !!user.value)

    const initAuth = () => {
        if (process.client) {
            const stored = localStorage.getItem("user")
            if (stored) user.value = JSON.parse(stored)
        }
    }

    const logout = () => {
        user.value = null
        if (process.client) {
            localStorage.removeItem("user")
            localStorage.removeItem("token")
        }
        navigateTo("/login")
    }

    const hasRole = (roles: string[]) => {
        return user.value && roles.includes(user.value.role)
    }

    return { user, isLogged, initAuth, logout, hasRole }
}