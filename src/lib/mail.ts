// Mail service disabled - ZeptoMail SDK has type issues
// This can be re-enabled when email service is configured

interface TrapNotificationStats {
    timeToYes: number;
    attempts: number;
}

export const sendTrapNotification = async (
    _to: string,
    _creatorName: string,
    _partnerName: string,
    _stats: TrapNotificationStats
): Promise<null> => {
    // Disabled - would require ZeptoMail configuration
    // When enabled, implement email sending here
    return null;
}
