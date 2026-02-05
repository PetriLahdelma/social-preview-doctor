import { Diagnosis, MetaTags, FetchHop } from "./types.js";
export declare function diagnose(meta: MetaTags, chain: FetchHop[], finalHeaders: Record<string, string>, finalUrl: string): Diagnosis[];
