'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

const FadeIn = ({ children, delay = 0, className = '', direction = 'up' }: FadeInProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px', // Trigger slightly before element is fully in view
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    const getTransform = () => {
        if (!direction || direction === 'none') return 'none';
        if (direction === 'up') return 'translateY(20px)';
        if (direction === 'down') return 'translateY(-20px)';
        if (direction === 'left') return 'translateX(20px)';
        if (direction === 'right') return 'translateX(-20px)';
        return 'none';
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'none' : getTransform(),
                transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
            }}
        >
            {children}
        </div>
    );
};

export default FadeIn;
