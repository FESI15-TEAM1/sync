'use client';

import { motion } from 'motion/react';

import Heart from '@/assets/icons/heart.svg';
import HeartOutline from '@/assets/icons/heartOutline.svg';

export default function LikedButton({
  isLiked,
  onClick,
  disabled = false,
}: {
  isLiked: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.8 }}
      className={`w-0 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <motion.span
        key={isLiked ? 'liked' : 'unliked'}
        className={`inline-flex ${disabled ? 'grayscale' : ''}`}
        initial={{ scale: isLiked ? 0.6 : 1.15 }}
        animate={{ scale: 1 }}
        transition={
          isLiked
            ? { type: 'spring', stiffness: 700, damping: 15 }
            : { type: 'spring', stiffness: 500, damping: 25 }
        }
      >
        {isLiked ? <Heart /> : <HeartOutline />}
      </motion.span>
    </motion.button>
  );
}
