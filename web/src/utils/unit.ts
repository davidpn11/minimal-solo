export const unit: void = void 0;
export type SideEffect = <T extends unknown[]>(...args: T) => void;
export const noop: SideEffect = () => void 0;
export const unitJSX: JSX.Element = null!;
