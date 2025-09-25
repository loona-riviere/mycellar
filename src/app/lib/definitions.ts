export type Bottle = {
    id: string;
    estate: string;
    cuvee?: string;
    appellation?: string,
    classification?: string,
    producer?: string;
    region?: string;
    color: 'red' | 'white' | 'rose' | 'sparkling';
    grapes?: string;
    comm?: string;
    year: number;
    min_year?: number;
    max_year?: number;
    price?: number;
    consumed: false;
    rating: number | null;
    notes: string | null;
    updated_at: Date;
    created_at: Date;
    image_url: string;
}
export const labelColors: Record<string, string> = {
    red: "Rouge",
    white: "Blanc",
    rose: "Rosé",
    sparkling: "Pétillant",
}

export type Profile = {
    email?: string;
    full_name?: string;
};

export type Member = {
    user_id: string;
    profiles?: Profile; // facultatif car join pas garanti
};
