import { createClient } from "@/utils/supabase/server";
import { labelColors } from '@/app/lib/definitions';

type Member = {
    user_id: string;
    profiles: {
        email: string;
        full_name: string | null;
    } | null;
};

type Bottle = {
    id: string;
    color: string | null;
    region: string | null;
    year: number | null;
    price: number | null;
    producer: string | null;
    appellation: string | null;
    classification: string | null;
    grapes: string | null;
    estate: string;
    rating: number | null;
};

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

    // 5️⃣ Récupérer les membres avec leurs profils
    const { data: membersRaw = [], error: membersError } = await supabase
        .from("cave_users")
        .select(`
            user_id,
            profiles!cave_users_user_id_fkey1 (
                email,
                full_name
            )
        `)
        .eq("cave_id", caveId);

    if (membersError) {
        console.error("Erreur lors de la récupération des membres:", membersError);
    }

    const members = membersRaw as unknown as Member[];

    // 📊 Calcul des statistiques
    const bottlesTyped = bottles as Bottle[];

    // Statistiques par couleur
    const colorStats = bottlesTyped.reduce((acc, bottle) => {
        const color = bottle.color ? labelColors[bottle.color] : 'Non spécifié';
        acc[color] = (acc[color] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const colorOrder = ['Rouge', 'Blanc', 'Rosé', 'Pétillant'];

    // Statistiques par région
    const regionStats = bottlesTyped.reduce((acc, bottle) => {
        const region = bottle.region ?? 'Non spécifiée';
        acc[region] = (acc[region] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Statistiques par décennie
    const decadeStats = bottlesTyped.reduce((acc, bottle) => {
        if (bottle.year) {
            const decade = Math.floor(bottle.year / 10) * 10;
            const decadeLabel = `${decade}s`;
            acc[decadeLabel] = (acc[decadeLabel] || 0) + 1;
        } else {
            acc['Année inconnue'] = (acc['Année inconnue'] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    // Statistiques par classification
    const classificationStats = bottlesTyped.reduce((acc, bottle) => {
        const classification = (bottle.classification && bottle.classification != "") ? bottle.classification : 'Non classé';
        acc[classification] = (acc[classification] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const classificationOrder = [
        'Grand Cru Classé',
        '1er Cru Classé',
        '2ème Cru Classé',
        '3ème Cru Classé',
        '4ème Cru Classé',
        'Villages / AOC',
        'Non classé'
    ];


    // Bouteille la mieux notée
    const bestRated = bottlesTyped.reduce((max, bottle) => {
        return (bottle.rating ?? 0) > (max?.rating ?? 0) ? bottle : max;
    }, null as Bottle | null);

    // Moyenne des notes
    const ratedBottles = bottlesTyped.filter(bottle => bottle.rating !== null);
    const averageRating = ratedBottles.length > 0
        ? ratedBottles.reduce((sum, bottle) => sum + (bottle.rating ?? 0), 0) / ratedBottles.length
        : 0;

    // Top 3 des régions
    const topRegions = Object.entries(regionStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);

    return (
        <main className="container mx-auto px-4 py-8 space-y-6">
            <h1 className="text-3xl font-playfair font-bold">{caveData.name}</h1>
            {caveData.description && <p className="text-muted-foreground">{caveData.description}</p>}

            {/* Informations générales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="rounded-lg bg-gray-100 p-4">
                    <h2 className="text-lg font-semibold mb-2">Bouteilles</h2>
                    <p className="text-2xl font-bold text-red-700">{bottles?.length ?? "Aucune bouteille"}</p>
                </div>

                <div className="rounded-lg bg-gray-100 p-4">
                    <h2 className="text-lg font-semibold mb-2">Membres</h2>
                    <p className="text-2xl font-bold text-red-700">{members.length}</p>
                </div>

                <div className="rounded-lg bg-gray-100 p-4">
                    <h2 className="text-lg font-semibold mb-2">Note moyenne</h2>
                    <p className="text-2xl font-bold text-red-700">
                        {averageRating > 0 ? `${averageRating.toFixed(1)}/5` : 'N/A'}
                    </p>
                </div>
            </div>

            {/* Statistiques détaillées */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Répartition par couleur */}
                <div className="rounded-lg bg-white border p-6">
                    <h3 className="text-xl font-semibold mb-4">Par couleur</h3>
                    <div className="space-y-2">
                        {colorOrder
                            .filter((key) => colorStats[key] > 0)
                            .map((key) => (
                                <div key={key} className="flex justify-between items-center">
                                    <span className="capitalize">{key}</span>
                                    <span className="font-semibold">{colorStats[key]}</span>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Top régions */}
                <div className="rounded-lg bg-white border p-6">
                    <h3 className="text-xl font-semibold mb-4">Top régions</h3>
                    <div className="space-y-2">
                        {topRegions.map(([region, count], index) => (
                            <div key={region} className="flex justify-between items-center">
                                <span className="flex items-center">
                                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                                        {index + 1}
                                    </span>
                                    <span className="text-sm">{region}</span>
                                </span>
                                <span className="font-semibold">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Classifications */}
                <div className="rounded-lg bg-white border p-6">
                    <h3 className="text-xl font-semibold mb-4">Classifications</h3>
                    <div className="space-y-2">
                        {classificationOrder
                            .filter((key) => classificationStats[key] > 0) // ← garde uniquement celles avec > 0
                            .map((key) => (
                                <div key={key} className="flex justify-between items-center">
                                    <span className="text-sm">{key}</span>
                                    <span className="font-semibold">{classificationStats[key]}</span>
                                </div>
                            ))}
                </div>
            </div>

            {/* Répartition par décennie */}
            <div className="rounded-lg bg-white border p-6">
                <h3 className="text-xl font-semibold mb-4">Par décennie</h3>
                <div className="space-y-2">
                    {Object.entries(decadeStats)
                        .sort(([a], [b]) => b.localeCompare(a))
                        .map(([decade, count]) => (
                                <div key={decade} className="flex justify-between items-center">
                                    <span>{decade}</span>
                                    <span className="font-semibold">{count}</span>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* Bouteille coup de cœur */}
            {bestRated?.rating && bestRated.rating > 0 && (
                <div className="rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 p-6">
                    <h3 className="text-xl font-semibold mb-3 text-purple-800">⭐ Coup de cœur de la cave</h3>
                    <div className="bg-white rounded-lg p-4">
                        <p className="font-bold text-lg">{bestRated.estate}</p>
                        <p className="text-gray-600">{bestRated.producer} - {bestRated.year}</p>
                        {bestRated.classification && (
                            <p className="text-sm text-purple-600 font-medium mt-1">{bestRated.classification}</p>
                        )}
                        <div className="flex items-center mt-2">
                            <span className="text-2xl font-bold text-purple-600">{bestRated.rating}/5</span>
                            <div className="ml-2 flex">
                                {[...Array(5)].map((_, i) => (
                                    <span key={_.id} className={`text-lg ${i < bestRated.rating! ? 'text-yellow-400' : 'text-gray-300'}`}>
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Liste des membres */}
            <div className="rounded-lg bg-white border p-6">
                <h3 className="text-xl font-semibold mb-4">Membres de la cave</h3>
                {members && members.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {members.map((member) => {
                            const profile = member.profiles;
                            return (
                                <div key={member.user_id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold">
                                            {profile?.full_name?.charAt(0) ?? 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium">{profile?.full_name ?? 'Utilisateur'}</p>
                                        <p className="text-sm text-gray-500">{profile?.email}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500">Aucun membre dans la cave</p>
                )}
            </div>
        </main>
    );
}