import { login, signup } from './actions'

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50">
            <form className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow">
                <h1 className="text-xl font-semibold">Se connecter</h1>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium">Mot de passe</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        formAction={login}
                        className="flex-1 rounded-md bg-black px-4 py-2 text-white"
                    >
                        Log in
                    </button>
                    <button
                        formAction={signup}
                        className="flex-1 rounded-md border px-4 py-2"
                    >
                        Sign up
                    </button>
                </div>
            </form>
        </main>
    )
}
