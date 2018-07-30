
function GetClassPropertiesOnly<T>(target: T, source: any): T {
    for (let key of Object.keys(target)) {
        target[key] = source[key];
    }
    return target;
}
export { GetClassPropertiesOnly };