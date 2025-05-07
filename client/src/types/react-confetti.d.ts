declare module 'react-confetti' {
    interface ConfettiProps {
        width: number;
        height: number;
        recycle?: boolean;
        numberOfPieces?: number;
    }
    const Confetti: React.FC<ConfettiProps>;
    export default Confetti;
} 