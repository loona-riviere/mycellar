export type Bottle = {
    id: string;
    name: string;
    estate: string;
    producer?: string;
    region?: string;
    color: 'red' | 'white' | 'rose' | 'sparkling';
    grapes?: string;
    comm?: string;
    year: number;
    max_year: number;
    price?: number;
    consumed: false;
    rating: number | null;
    notes: string | null;
}
export type ActionState = {
    error: string | null;
};

export const labelColors: Record<string, string> = {
    red: "Rouge",
    white: "Blanc",
    rose: "Rosé",
    sparkling: "Pétillant",
}

