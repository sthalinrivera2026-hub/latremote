export const useMenu = () => {
    const { isLogged, user } = useAuth()

    const visitorMenu = [
        { label: "Inicio", to: "/", icon: "i-lucide-home" },
        { label: "Nosotros", to: "/about", icon: "i-lucide-users" },
        { label: "Documentación", to: "/documentation", icon: "i-lucide-book-open" },
    ]

    const studentMenu = [
        { label: "Dashboard", to: "/student", icon: "i-lucide-layout-dashboard" },
        { label: "Esquematico", to: "/schematic", icon: "i-lucide-file-text" },
        { label: "Documentación", to: "/docs", icon: "i-lucide-book-open" },
        { label: "Laboratorio", to: "/ios-jetson-nano", icon: "i-lucide-flask-conical", },
        { label: "Cámara", to: "/camera", icon: "i-lucide-camera", },
    ]

    const adminMenu = [
        ...studentMenu,
        { label: "Clientes", to: "/customers", icon: "i-lucide-users" },
        { label: "Cola", to: "/queue", icon: "i-lucide-clock" }
    ]

    const menuItems = computed(() => {
        if (!isLogged.value) return visitorMenu
        if (user.value?.role === 'admin') return adminMenu
        return studentMenu
    })

    return { menuItems }
}