'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';

type ParallaxBalanceTickerProps = {
  balance: number;
  label: string;
  backgroundImage?: string;
  height?: number;
};

const AnimatedNumber = ({ value }: { value: number }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: 300,
    config: { mass: 1, tension: 20, friction: 10 },
  });

  return (
    <animated.span>
      {number.to((n: number) => `$${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`)}
    </animated.span>
  );
};

const ParallaxBalanceTicker: React.FC<ParallaxBalanceTickerProps> = ({
  balance,
  label,
  backgroundImage = '/images/ticker-bg.jpg',
  height = 180,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Transform the scroll progress into a parallax effect for the background
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '30%']
  );

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden rounded-xl shadow-lg"
      style={{ height }}
    >
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          y: backgroundY,
          // Make the background slightly larger to avoid seeing edges during parallax
          height: '130%',
          top: '-15%',
        }}
      />

      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white p-6 z-10">
        <h3 className="text-xl font-medium mb-2">{label}</h3>
        <div className="text-4xl font-bold">
          <AnimatedNumber value={balance} />
        </div>
      </div>
    </motion.div>
  );
};

export default ParallaxBalanceTicker;