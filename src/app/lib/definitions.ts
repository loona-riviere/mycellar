export type Bottle = {
    name: string;
    producer?: string;
    region?: string;
    color: 'red' | 'white' | 'rose' | 'sparkling';
    grapes?: string;
    comm?: string;
    year: number;
    max_year: number;
    price?: number;
    consumed: false;
    rating?: 0 | 1 | 2 | 3 | 4 | 5;
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

