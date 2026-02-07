
export interface TrapConfig {
    id?: string;
    creatorName: string;
    partnerName: string;
    message: string;
    customYesLabel?: string; // New
    customNoLabel?: string; // New
    responseNote?: string; // New (Message from partner)
    creatorEmail?: string;
    theme: 'cupid' | 'dark-romance' | 'neon-love' | 'pastel-dream' | 'obsidian';

    successMessage?: string; // New: Custom message on success

    // New Granular Mechanics
    noMechanic: 'run-away' | 'shrink' | 'teleport' | 'hidden' | 'dsa-quiz' | 'essay-hard' | 'impossible-form' | 'many-yes' | 'persuasion' | 'guilt-trip' | 'fake-no';
    yesMechanic: 'simple' | 'magnet' | 'sticky' | 'grow' | 'rewards';
    chaosMode: 'none' | 'maze' | 'distractions' | 'fill-screen';

    difficulty: 'easy' | 'medium' | 'hard' | 'impossible'; // Still keeps speed/sensitivity

    security?: {
        question: string;
        answer: string;
        hint?: string;
        scold?: string; // Message shown on wrong answer
    };

    assets?: {
        image?: string; // Legacy/Main
        images?: string[]; // New Multi-image support
        audio?: string;
        confetti?: string;
    };
    createdAt: number;
}


export interface AnalyticsEvent {
    type: 'view' | 'attempt_security' | 'hover_no' | 'click_no' | 'click_yes' | 'error';
    timestamp: number;
    metadata?: Record<string, any>;
}

export interface AnalyticsSession {
    visitorId: string; // Anonymous ID
    trapId: string;
    startTime: number;
    endTime?: number;
    duration?: number;

    // Geo
    country?: string;
    city?: string;
    region?: string;
    ip?: string; // Optional if we want privacy

    // Device
    deviceType: 'mobile' | 'tablet' | 'desktop';
    browser: string;
    os: string;
    userAgent: string;

    // Engagement
    securityAttempts: number;
    hoverCount: number;
    clickCount: number;
}

export interface TrapStats {
    attempts: number;
    hovers: number;
    timeToYes: number;
    completedAt: number;
    views: number; // Added views
}

export interface TrapData extends TrapConfig {
    stats?: TrapStats;
    status: 'active' | 'completed' | 'disabled'; // Added disabled
}
