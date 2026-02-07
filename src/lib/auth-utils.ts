export const formatVirtualEmail = (username: string): string => {
    // Remove spaces and special chars, keep it simple
    const cleanName = username.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${cleanName}@lovetrap.app`;
};

export const extractUsername = (email: string): string => {
    return email.split('@')[0];
};

export const isValidUsername = (username: string): boolean => {
    return /^[a-zA-Z0-9]{3,}$/.test(username);
};
