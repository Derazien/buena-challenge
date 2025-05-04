import { useCallback } from 'react';
import confetti from 'canvas-confetti';

/**
 * A hook that provides a function to trigger confetti animation
 * Used when a ticket status is changed to "resolved"
 */
export function useConfetti() {
    const triggerConfetti = useCallback(() => {
        // Configure confetti options
        const defaults = {
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            zIndex: 9999,
            particleCount: 150,
            origin: { y: 0.6 }
        };

        // Generate random colors with property management theme (blues, greens)
        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
        }

        const colors = ['#4f46e5', '#0ea5e9', '#10b981', '#059669', '#34d399'];

        // Launch multiple confetti bursts with different colors
        confetti({
            ...defaults,
            particleCount: 80,
            scalar: 1.2,
            shapes: ['circle', 'square'],
            colors: [colors[0], colors[1]]
        });

        setTimeout(() => {
            confetti({
                ...defaults,
                particleCount: 50,
                scalar: 0.75,
                shapes: ['circle'],
                colors: [colors[2], colors[3]]
            });
        }, 250);

        setTimeout(() => {
            confetti({
                ...defaults,
                particleCount: 100,
                scalar: 1.5,
                shapes: ['circle', 'square'],
                colors: [colors[1], colors[4]]
            });
        }, 400);
    }, []);

    return { triggerConfetti };
}