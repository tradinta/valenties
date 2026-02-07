import { useState } from 'react';
import { ImpossibleForm } from './challenges/ImpossibleForm';
import { EssayChallenge } from './challenges/EssayChallenge';
import { DSAQuiz } from './challenges/DSAQuiz';
import { HardEssay } from './challenges/HardEssay';
import { GuiltTripModal } from './mechanics/GuiltTripModal';
import { ManyYesOverlay } from './mechanics/ManyYesOverlay';

// Button Components
import { RunAwayButton } from './buttons/RunAwayButton';
import { ShrinkButton } from './buttons/ShrinkButton';
import { SecretYesButton } from './buttons/SecretYesButton';
import { PersuasionButton } from './buttons/PersuasionButton';
import { YesShowerButton } from './buttons/YesShowerButton';
import { ModalTriggerButton } from './buttons/ModalTriggerButton';

interface MechanicDispatcherProps {
    mechanic: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'impossible';
    onAttempt: () => void;
    onSuccess?: () => void;
}

export const MechanicDispatcher: React.FC<MechanicDispatcherProps> = ({ mechanic, difficulty, onAttempt, onSuccess }) => {
    const [activeChallenge, setActiveChallenge] = useState<'none' | 'form' | 'essay' | 'dsa' | 'essay-hard' | 'guilt' | 'many-yes'>('none');

    const triggerChallenge = (type: typeof activeChallenge) => {
        onAttempt();
        setActiveChallenge(type);
    };

    // --- Active Overlays ---
    if (activeChallenge === 'form') return <ImpossibleForm onGiveUp={() => setActiveChallenge('none')} />;
    if (activeChallenge === 'essay') return <EssayChallenge onGiveUp={() => setActiveChallenge('none')} />;
    if (activeChallenge === 'essay-hard') return <HardEssay onGiveUp={onSuccess || (() => setActiveChallenge('none'))} />;
    if (activeChallenge === 'dsa') return <DSAQuiz onFail={() => setActiveChallenge('none')} onSuccess={onSuccess || (() => setActiveChallenge('none'))} />;
    if (activeChallenge === 'guilt') return <GuiltTripModal onGiveUp={onSuccess || (() => setActiveChallenge('none'))} onCancel={() => setActiveChallenge('none')} />;
    if (activeChallenge === 'many-yes') return <ManyYesOverlay onSelect={onSuccess || (() => setActiveChallenge('none'))} />;

    // --- Button Render Logic ---

    switch (mechanic) {
        // Modal / Trigger Mechanics
        case 'dsa-quiz':
            return <ModalTriggerButton onClick={() => triggerChallenge('dsa')} label="No" />;
        case 'essay-hard':
            return <ModalTriggerButton onClick={() => triggerChallenge('essay-hard')} label="No" />;
        case 'impossible-form':
            return <ModalTriggerButton onClick={() => triggerChallenge('form')} label="No" />;
        case 'guilt-trip':
            return <ModalTriggerButton onClick={() => triggerChallenge('guilt')} label="No" />;

        // Specific Button Mechanics
        case 'shrink':
            return <ShrinkButton onAttempt={onAttempt} />;
        case 'fake-no':
            return <SecretYesButton onSuccess={onSuccess || (() => { })} />;
        case 'many-yes':
            return <YesShowerButton onClick={() => triggerChallenge('many-yes')} />;
        case 'persuasion':
            return <PersuasionButton onAttempt={onAttempt} />;

        // Default / Evasion
        case 'run-away':
        default:
            return <RunAwayButton onAttempt={onAttempt} />;
    }
};

