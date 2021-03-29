import { Config, Timespan } from './types';
export declare namespace Renderer {
    function renderTitle(timespan: Timespan, config: Config): string;
    function renderBody(timespan: Timespan, config: Config): Promise<string>;
}
