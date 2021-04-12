import { Config, Timespan } from './types';
export declare namespace Commits {
    function list(tailDate: string): Promise<{
        url: string;
        sha: string;
        node_id: string;
        html_url: string;
        comments_url: string;
        commit: {
            url: string;
            author: {
                name?: string | undefined;
                email?: string | undefined;
                date?: string | undefined;
            } | null;
            committer: {
                name?: string | undefined;
                email?: string | undefined;
                date?: string | undefined;
            } | null;
            message: string;
            comment_count: number;
            tree: {
                sha: string;
                url: string;
            };
            verification?: {
                verified: boolean;
                reason: string;
                payload: string | null;
                signature: string | null;
            } | undefined;
        };
        author: {
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
        committer: {
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
        parents: {
            sha: string;
            url: string;
            html_url?: string | undefined;
        }[];
        stats?: {
            additions?: number | undefined;
            deletions?: number | undefined;
            total?: number | undefined;
        } | undefined;
        files?: {
            filename?: string | undefined;
            additions?: number | undefined;
            deletions?: number | undefined;
            changes?: number | undefined;
            status?: string | undefined;
            raw_url?: string | undefined;
            blob_url?: string | undefined;
            patch?: string | undefined;
            sha?: string | undefined;
            contents_url?: string | undefined;
            previous_filename?: string | undefined;
        }[] | undefined;
    }[]>;
    function render(commitList: {
        url: string;
        sha: string;
        node_id: string;
        html_url: string;
        comments_url: string;
        commit: {
            url: string;
            author: {
                name?: string | undefined;
                email?: string | undefined;
                date?: string | undefined;
            } | null;
            committer: {
                name?: string | undefined;
                email?: string | undefined;
                date?: string | undefined;
            } | null;
            message: string;
            comment_count: number;
            tree: {
                sha: string;
                url: string;
            };
            verification?: {
                verified: boolean;
                reason: string;
                payload: string | null;
                signature: string | null;
            } | undefined;
        };
        author: {
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
        committer: {
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
        parents: {
            sha: string;
            url: string;
            html_url?: string | undefined;
        }[];
        stats?: {
            additions?: number | undefined;
            deletions?: number | undefined;
            total?: number | undefined;
        } | undefined;
        files?: {
            filename?: string | undefined;
            additions?: number | undefined;
            deletions?: number | undefined;
            changes?: number | undefined;
            status?: string | undefined;
            raw_url?: string | undefined;
            blob_url?: string | undefined;
            patch?: string | undefined;
            sha?: string | undefined;
            contents_url?: string | undefined;
            previous_filename?: string | undefined;
        }[] | undefined;
    }[] | undefined, timespan: Timespan, config: Config): string;
    function renderContributors(commits: {
        url: string;
        sha: string;
        node_id: string;
        html_url: string;
        comments_url: string;
        commit: {
            url: string;
            author: {
                name?: string | undefined;
                email?: string | undefined;
                date?: string | undefined;
            } | null;
            committer: {
                name?: string | undefined;
                email?: string | undefined;
                date?: string | undefined;
            } | null;
            message: string;
            comment_count: number;
            tree: {
                sha: string;
                url: string;
            };
            verification?: {
                verified: boolean;
                reason: string;
                payload: string | null;
                signature: string | null;
            } | undefined;
        };
        author: {
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
        committer: {
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
        parents: {
            sha: string;
            url: string;
            html_url?: string | undefined;
        }[];
        stats?: {
            additions?: number | undefined;
            deletions?: number | undefined;
            total?: number | undefined;
        } | undefined;
        files?: {
            filename?: string | undefined;
            additions?: number | undefined;
            deletions?: number | undefined;
            changes?: number | undefined;
            status?: string | undefined;
            raw_url?: string | undefined;
            blob_url?: string | undefined;
            patch?: string | undefined;
            sha?: string | undefined;
            contents_url?: string | undefined;
            previous_filename?: string | undefined;
        }[] | undefined;
    }[] | undefined, timespan: Timespan, config: Config): string;
}
