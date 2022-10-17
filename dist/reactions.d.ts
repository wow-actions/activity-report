import { Await } from './types';
export declare namespace Reactions {
    function list(issue: number): Promise<{
        id: number;
        node_id: string;
        user: {
            name?: string | null | undefined;
            email?: string | null | undefined;
            login: string;
            id: number;
            node_id: string;
            avatar_url: string;
            gravatar_id: string | null;
            url: string;
            html_url: string;
            followers_url: string;
            following_url: string;
            gists_url: string;
            starred_url: string;
            subscriptions_url: string;
            organizations_url: string;
            repos_url: string;
            events_url: string;
            received_events_url: string;
            type: string;
            site_admin: boolean;
            starred_at?: string | undefined;
        } | null;
        content: "+1" | "-1" | "laugh" | "confused" | "heart" | "hooray" | "rocket" | "eyes";
        created_at: string;
    }[]>;
    type ReactionsList = Await<ReturnType<typeof list>>;
    type Type = '+1' | '-1' | 'laugh' | 'confused' | 'heart' | 'hooray' | 'rocket' | 'eyes';
    function map(issues: number[]): Promise<{
        [key: number]: {
            id: number;
            node_id: string;
            user: {
                name?: string | null | undefined;
                email?: string | null | undefined;
                login: string;
                id: number;
                node_id: string;
                avatar_url: string;
                gravatar_id: string | null;
                url: string;
                html_url: string;
                followers_url: string;
                following_url: string;
                gists_url: string;
                starred_url: string;
                subscriptions_url: string;
                organizations_url: string;
                repos_url: string;
                events_url: string;
                received_events_url: string;
                type: string;
                site_admin: boolean;
                starred_at?: string | undefined;
            } | null;
            content: "+1" | "-1" | "laugh" | "confused" | "heart" | "hooray" | "rocket" | "eyes";
            created_at: string;
        }[];
    }>;
}
