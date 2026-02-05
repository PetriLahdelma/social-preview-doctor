export type BotName = "linkedin" | "twitter" | "facebook";
export type FetchHop = {
    url: string;
    status: number;
    location?: string;
    headers: Record<string, string>;
};
export type MetaTags = Record<string, string>;
export type Diagnosis = {
    level: "info" | "warn" | "error";
    code: string;
    message: string;
};
