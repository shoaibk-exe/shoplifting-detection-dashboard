export function createUserRole(text: string) {
    if (text.includes(" ")) {
        return text
            .split(" ")
            .map(word => word.toUpperCase())
            .join("_");
    } else {
        return text.toUpperCase();
    }
}
export function reverseCreateUserRole(text: string) {
    const parts = text.split("_");
    if (parts.length > 1) {
        const capitalizedParts = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());
        return capitalizedParts.join(" ");
    } else {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }
}