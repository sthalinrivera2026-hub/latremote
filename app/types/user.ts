export interface User {
    id: number
    email: string
    name: string
    avatar_url: string | null
    role: 'admin' | 'student'
    created_at: string
}