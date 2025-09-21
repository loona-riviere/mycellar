import { login, signInWithMagicLink } from './actions'
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function LoginPage() {

    const supabase = await createClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session) {
        redirect("/bottles");
    }
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
                    <label htmlFor="password" className="block text-sm font-medium">
                        Mot de passe <span className="text-gray-400">(facultatif si lien magique)</span>
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        formAction={login}
                        className="w-full rounded-md bg-black px-4 py-2 text-white"
                    >
                        Se connecter
                    </button>

                    <button
                        formAction={signInWithMagicLink}
                        className="w-full rounded-md border px-4 py-2"
                        title="Recevoir un lien de connexion par email"
                    >
                        Envoyer un lien magique ✉️
                    </button>
                </div>
            </form>
        </main>
    )
}
