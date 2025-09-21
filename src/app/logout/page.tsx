import { logout } from './actions'

export default function LogoutPage() {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <form action={logout}>
                <button
                    className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                    Se déconnecter
                </button>
            </form>
        </main>
    )
}
