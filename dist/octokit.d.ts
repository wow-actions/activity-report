export declare const octokit: {
    [x: string]: any;
} & {
    [x: string]: any;
} & import("@octokit/core").Octokit & import("@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types").RestEndpointMethods & {
    paginate: import("@octokit/plugin-paginate-rest").PaginateInterface;
};
