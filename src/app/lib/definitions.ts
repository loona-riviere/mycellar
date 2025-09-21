export type Bottle = {
    name: string;
    producer?: string;
    region?: string;
    color: 'rouge' | 'rosé' | 'blanc' | 'pétillant';
    grapes?: string;
    comm?: string;
    year: number;
    price?: number;
    consumed: false;
    rating?: 0 | 1 | 2 | 3 | 4 | 5;
}
export type ActionState = {
    error: string | null;
};
