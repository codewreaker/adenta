import { LoadConfigOptions } from "c12";

export interface AdentaConfig {
    name: string;
    meta: Record<string, string | number | boolean |object >;
}

export type LoadOptions = Omit<LoadConfigOptions<AdentaConfig>, 'name' | 'jiti'>;