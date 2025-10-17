export const isEmpty = (obj: any, optional: string[] = []) => {
    return Object.entries(obj).some(([key, value]) => {
        // Skip the field if it's in the optional array
        if (optional.includes(key)) {
            return false;
        }
        if (typeof value === "object" && value !== null) {
            if (Array.isArray(value)) {
                return value.length === 0 || value.some(x => x === null || x === '');
            } else {
                return Object.values(value).some(x => x === null || x === '');
            }
        } else {
            return value === null || value === '';
        }
    });
};
