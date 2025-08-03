"use client"
import React from 'react';

export const ReactScan = () => {
    return (
        <div className="flex flex-col items-center justify-center bg-transparent p-8 rounded-lg">
            <div className="relative w-48 h-48">
                <div className="absolute inset-0 border-4 border-green-500/20 rounded-full animate-pulse-border"></div>
                <div className="absolute inset-2 border-2 border-green-500/30 rounded-full animate-pulse-border-inner"></div>
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32">
                    <div className="w-full h-full rounded-full bg-green-950 shadow-inner-neon"></div>
                </div>

                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-transparent via-green-400 to-transparent animate-scan-vertical"></div>

                <style jsx>{`
                    @keyframes pulse-border {
                        0%, 100% { transform: scale(0.95); opacity: 0.5; }
                        50% { transform: scale(1.05); opacity: 1; }
                    }
                    @keyframes pulse-border-inner {
                        0%, 100% { transform: scale(1.05); opacity: 1; }
                        50% { transform: scale(0.95); opacity: 0.7; }
                    }
                    .animate-pulse-border {
                        animation: pulse-border 3s ease-in-out infinite;
                    }
                    .animate-pulse-border-inner {
                        animation: pulse-border-inner 3s ease-in-out infinite;
                    }
                    .shadow-inner-neon {
                        box-shadow: inset 0 0 15px rgba(16, 185, 129, 0.6), 0 0 5px rgba(16, 185, 129, 0.3);
                    }
                    @keyframes scan-vertical {
                        0% { transform: translateY(-100%) scaleY(0); }
                        50% { transform: translateY(0) scaleY(1); }
                        100% { transform: translateY(100%) scaleY(0); }
                    }
                    .animate-scan-vertical {
                        animation: scan-vertical 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                        box-shadow: 0 0 20px 5px #10b981;
                    }
                `}</style>
            </div>
            <p className="mt-6 text-lg font-semibold text-green-300 tracking-wider">
                Processing Query...
            </p>
            <p className="text-sm text-green-400/70 mt-1">
                Fetching data from LeetCode GraphQL API
            </p>
        </div>
    );
};
