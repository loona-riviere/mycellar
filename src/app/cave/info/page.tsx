import { createClient } from "@/utils/supabase/server";

export default async function CaveInfoPage() {
    const supabase = await createClient();

    // 1️⃣ Récupérer l'utilisateur connecté
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return <main className="p-6 text-red-600">Utilisateur non connecté</main>;
    }

    // 2️⃣ Récupérer la cave liée à cet utilisateur
    const { data: caveLink, error: caveLinkError } = await supabase
        .from("cave_users")
        .select("cave_id")
        .eq("user_id", user.id)
        .limit(1)
        .single();

    if (caveLinkError || !caveLink) {
        return <main className="p-6 text-red-600">Cave introuvable pour cet utilisateur</main>;
    }

    const caveId = caveLink.cave_id;

    // 3️⃣ Récupérer la cave
    const { data: caveData, error: caveError } = await supabase
        .from("caves")
        .select("*")
        .eq("id", caveId)
        .single();

    if (caveError || !caveData) {
        return <main className="p-6 text-red-600">Erreur lors de la récupération de la cave</main>;
    }

    // 4️⃣ Récupérer les bouteilles
    const { data: bottles = [] } = await supabase
        .from("bottles")
        .select("*")
        .eq("cave_id", caveId)
        .eq("consumed", false);

    const { data: members } = await supabase
        .from("cave_users")
        .select(`
    user_id,
    profile (email, full_name)
  `)
        .eq("cave_id", caveId);

    console.log(members)

    return (
        <main className="container mx-auto px-4 py-8 space-y-6">
            <h1 className="text-3xl font-playfair font-bold">{caveData.name}</h1>
            {caveData.description && <p className="text-muted-foreground">{caveData.description}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre de bouteilles */}
                <div className="rounded-lg bg-gray-100 p-4">
                    <h2 className="text-lg font-semibold mb-2">Nombre de bouteilles</h2>
                    <p>{bottles!.length}</p>
                </div>

                {/* Membres de la cave */}
                <div className="rounded-lg bg-gray-100 p-4">
                    <h2 className="text-lg font-semibold mb-2">Membres</h2>
                    {members && members.length > 0 ? (
                        <ul className="list-disc ml-5">
                            {members?.map(m => (
                                <li key={m.user_id}>
                                    {m.profile.full_name ?? m.user_id} -
                                    {m.profile.email ?? m.profile.email}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Aucun membre dans la cave</p>
                    )}
                </div>
            </div>
        </main>
    );
}
