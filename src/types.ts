import { Util } from './util'

export type Await<T> = T extends PromiseLike<infer U> ? U : T

export type Config = ReturnType<typeof Util.getInputs>
