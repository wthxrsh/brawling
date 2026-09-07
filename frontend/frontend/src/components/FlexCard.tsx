import {
    useState,
    useEffect,
    useCallback,
    useRef,
    type RefObject,
    type ReactNode,
} from "react";

import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";

import {
    Trophy,
    Swords,
    Users,
    Sparkles,
    Zap,
    Shield,
    Crown,
    Flame,
    Target,
    ChevronUp,
    Gem,
} from "lucide-react";

import type { PlayerStats } from "../types/player";


interface FlexCardProps {
    player: PlayerStats;
    captureRef?: RefObject<HTMLDivElement | null>;
    exportMode?: boolean;
}


/* =============================================
   ANIMATED COUNTER
   ============================================= */

function useAnimatedCounter(
    target: number,
    duration = 1.8,
    delay = 0
) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let frame: number | undefined;

        const timeout = window.setTimeout(() => {
            const animate = (timestamp: number) => {
                if (!startTime) {
                    startTime = timestamp;
                }

                const elapsed =
                    timestamp - startTime;

                const progress = Math.min(
                    elapsed / (duration * 1000),
                    1
                );

                const eased =
                    1 - Math.pow(1 - progress, 3);

                setValue(
                    Math.floor(eased * target)
                );

                if (progress < 1) {
                    frame =
                        requestAnimationFrame(
                            animate
                        );
                }
            };

            frame =
                requestAnimationFrame(animate);

        }, delay * 1000);

        return () => {
            window.clearTimeout(timeout);

            if (frame !== undefined) {
                cancelAnimationFrame(frame);
            }
        };
    }, [target, duration, delay]);

    return value;
}


/* =============================================
   PARTICLE
   ============================================= */

function FloatingParticle({
                              delay,
                              x,
                              size,
                          }: {
    delay: number;
    x: number;
    size: number;
}) {
    const [duration] = useState(
        () => 3 + Math.random() * 2
    );
    const [repeatDelay] = useState(
        () => Math.random() * 3
    );

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 60,
                x,
            }}
            animate={{
                opacity: [0, 0.9, 0.7, 0],
                y: [60, -20, -80, -140],
                x: [
                    x,
                    x + 15,
                    x - 10,
                    x + 5,
                ],
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                repeatDelay,
                ease: "easeOut",
            }}
            className="pointer-events-none absolute"
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                background:
                    "radial-gradient(circle, rgba(255,215,0,0.9) 0%, rgba(255,165,0,0.4) 60%, transparent 100%)",
                bottom: "20%",
                left: "50%",
            }}
        />
    );
}


/* =============================================
   MAIN FLEX CARD
   ============================================= */

export default function FlexCard({
                                     player,
                                     captureRef,
                                     exportMode = false,
                                 }: FlexCardProps) {

    const cardRef =
        useRef<HTMLDivElement>(null);


    /* =========================================
       MOUSE TILT
       ========================================= */

    const mouseX =
        useMotionValue(0);

    const mouseY =
        useMotionValue(0);

    const rotateX = useSpring(
        useTransform(
            mouseY,
            [-0.5, 0.5],
            [8, -8]
        ),
        {
            stiffness: 150,
            damping: 20,
        }
    );

    const rotateY = useSpring(
        useTransform(
            mouseX,
            [-0.5, 0.5],
            [-8, 8]
        ),
        {
            stiffness: 150,
            damping: 20,
        }
    );


    const handleMouseMove =
        useCallback(
            (
                e: React.MouseEvent<HTMLDivElement>
            ) => {

                if (
                    exportMode ||
                    !cardRef.current
                ) {
                    return;
                }

                const rect =
                    cardRef.current.getBoundingClientRect();

                const x =
                    (e.clientX - rect.left) /
                    rect.width -
                    0.5;

                const y =
                    (e.clientY - rect.top) /
                    rect.height -
                    0.5;

                mouseX.set(x);
                mouseY.set(y);
            },
            [
                mouseX,
                mouseY,
                exportMode,
            ]
        );


    const handleMouseLeave =
        useCallback(() => {
            mouseX.set(0);
            mouseY.set(0);
        }, [mouseX, mouseY]);


    /* =========================================
       COUNTERS
       ========================================= */

    const animatedTrophies =
        useAnimatedCounter(
            player.trophies,
            2,
            0.4
        );

    const animatedPeakTrophies =
        useAnimatedCounter(
            player.highestTrophies,
            1.8,
            0.6
        );

    const animatedWins =
        useAnimatedCounter(
            player.totalVictories,
            1.6,
            0.8
        );

    const animatedBrawlers =
        useAnimatedCounter(
            player.brawlerCount,
            1.4,
            0.9
        );

    const animatedPower =
        useAnimatedCounter(
            player.highestBrawlerPower,
            1.2,
            1
        );

    const animatedBestTrophies =
        useAnimatedCounter(
            player.highestBrawlerTrophies,
            1.5,
            0.7
        );


    /*
     * During export we use the real values
     * immediately.
     */

    const trophies = exportMode
        ? player.trophies
        : animatedTrophies;

    const peakTrophies = exportMode
        ? player.highestTrophies
        : animatedPeakTrophies;

    const wins = exportMode
        ? player.totalVictories
        : animatedWins;

    const brawlers = exportMode
        ? player.brawlerCount
        : animatedBrawlers;

    const power = exportMode
        ? player.highestBrawlerPower
        : animatedPower;

    const bestTrophies = exportMode
        ? player.highestBrawlerTrophies
        : animatedBestTrophies;


    /* =========================================
       DERIVED
       ========================================= */

    const trophyProgress =
        player.highestTrophies > 0
            ? Math.min(
                (player.trophies /
                    player.highestTrophies) *
                100,
                100
            )
            : 0;

    const powerPercent =
        Math.min(
            (player.highestBrawlerPower / 11) *
            100,
            100
        );


    const brawlerImageUrl =
        `https://cdn.brawlify.com/brawlers/portraits/${player.highestTrophyBrawlerId}.png`;


    /* =========================================
       RANK
       ========================================= */

    const getRankColor = (
        rank: number
    ) => {

        if (rank >= 35) {
            return {
                bg: "from-red-500 to-orange-500",
                glow: "shadow-red-500/40",
            };
        }

        if (rank >= 30) {
            return {
                bg: "from-purple-500 to-pink-500",
                glow: "shadow-purple-500/40",
            };
        }

        if (rank >= 25) {
            return {
                bg: "from-yellow-400 to-orange-500",
                glow: "shadow-yellow-500/40",
            };
        }

        if (rank >= 20) {
            return {
                bg: "from-blue-400 to-cyan-400",
                glow: "shadow-blue-500/40",
            };
        }

        if (rank >= 15) {
            return {
                bg: "from-green-400 to-emerald-400",
                glow: "shadow-green-500/40",
            };
        }

        return {
            bg: "from-gray-400 to-gray-500",
            glow: "shadow-gray-500/40",
        };
    };


    const rankStyle =
        getRankColor(
            player.highestBrawlerRank
        );


    /* =========================================
       CARD
       ========================================= */

    return (
        <motion.div
            ref={cardRef}
            initial={
                exportMode
                    ? false
                    : {
                        opacity: 0,
                        scale: 0.8,
                        y: 40,
                    }
            }
            animate={
                exportMode
                    ? {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                    }
                    : {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                    }
            }
            transition={
                exportMode
                    ? { duration: 0 }
                    : {
                        duration: 1,
                        type: "spring",
                        stiffness: 80,
                        damping: 15,
                    }
            }
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective:
                    exportMode
                        ? undefined
                        : 1400,

                rotateX:
                    exportMode
                        ? 0
                        : rotateX,

                rotateY:
                    exportMode
                        ? 0
                        : rotateY,

                transformStyle:
                    exportMode
                        ? "flat"
                        : "preserve-3d",
            }}
            className="relative
                       mx-auto
                       w-full
                       max-w-[580px]"
        >

            {/* =====================================
                OUTER GLOW
                ===================================== */}

            {!exportMode && (
                <>
                    <motion.div
                        animate={{
                            opacity: [
                                0.4,
                                0.7,
                                0.4,
                            ],
                            scale: [
                                1,
                                1.05,
                                1,
                            ],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute
                                   -inset-8
                                   rounded-[48px]
                                   bg-gradient-to-br
                                   from-yellow-300/60
                                   via-orange-400/40
                                   to-pink-500/50
                                   blur-3xl"
                    />

                    <motion.div
                        animate={{
                            opacity: [
                                0.3,
                                0.6,
                                0.3,
                            ],
                            scale: [
                                1.02,
                                0.98,
                                1.02,
                            ],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                        }}
                        className="absolute
                                   -inset-6
                                   rounded-[44px]
                                   bg-gradient-to-tl
                                   from-purple-400/40
                                   via-blue-400/30
                                   to-cyan-300/40
                                   blur-2xl"
                    />
                </>
            )}


            {/* =====================================
                CAPTURE AREA
                ===================================== */}

            <div
                ref={captureRef}
                data-export-mode={
                    exportMode
                        ? "true"
                        : "false"
                }
                className="relative
                           rounded-[35px]
                           p-[3px]"
                style={{
                    background:
                        "conic-gradient(from 0deg, #f59e0b, #ec4899, #8b5cf6, #3b82f6, #10b981, #f59e0b)",
                }}
            >

                {/* =================================
                    CARD BODY
                    ================================= */}

                <div
                    className="relative
                               aspect-[5/7]
                               overflow-hidden
                               rounded-[32px]
                               border-[3px]
                               border-white/80
                               bg-[#0f0a1a]
                               shadow-2xl
                               shadow-purple-900/30"
                >

                    {/* =================================
                        BACKGROUND
                        ================================= */}

                    <div
                        className="pointer-events-none
                                   absolute inset-0"
                    >

                        <div
                            className="absolute
                                       inset-0
                                       bg-gradient-to-br
                                       from-[#1a1035]
                                       via-[#0f0a1a]
                                       to-[#0d1525]"
                        />


                        {/* Purple glow */}

                        <motion.div
                            animate={
                                exportMode
                                    ? {
                                        x: 0,
                                        y: 0,
                                    }
                                    : {
                                        x: [
                                            0,
                                            30,
                                            -20,
                                            0,
                                        ],
                                        y: [
                                            0,
                                            -20,
                                            15,
                                            0,
                                        ],
                                    }
                            }
                            transition={
                                exportMode
                                    ? {
                                        duration: 0,
                                    }
                                    : {
                                        duration: 12,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }
                            }
                            className="absolute
                                       -left-24
                                       -top-24
                                       h-[400px]
                                       w-[400px]
                                       rounded-full
                                       bg-purple-600/25
                                       blur-3xl"
                        />


                        {/* Orange glow */}

                        <motion.div
                            animate={
                                exportMode
                                    ? {
                                        x: 0,
                                        y: 0,
                                    }
                                    : {
                                        x: [
                                            0,
                                            -25,
                                            20,
                                            0,
                                        ],
                                        y: [
                                            0,
                                            20,
                                            -15,
                                            0,
                                        ],
                                    }
                            }
                            transition={
                                exportMode
                                    ? {
                                        duration: 0,
                                    }
                                    : {
                                        duration: 10,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 2,
                                    }
                            }
                            className="absolute
                                       -right-32
                                       top-20
                                       h-[350px]
                                       w-[350px]
                                       rounded-full
                                       bg-orange-500/20
                                       blur-3xl"
                        />


                        {/* Pink glow */}

                        <motion.div
                            animate={
                                exportMode
                                    ? {
                                        x: 0,
                                        y: 0,
                                    }
                                    : {
                                        x: [
                                            0,
                                            15,
                                            -15,
                                            0,
                                        ],
                                        y: [
                                            0,
                                            -10,
                                            10,
                                            0,
                                        ],
                                    }
                            }
                            transition={
                                exportMode
                                    ? {
                                        duration: 0,
                                    }
                                    : {
                                        duration: 14,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 4,
                                    }
                            }
                            className="absolute
                                       bottom-[-180px]
                                       left-1/2
                                       h-[400px]
                                       w-[400px]
                                       -translate-x-1/2
                                       rounded-full
                                       bg-pink-500/15
                                       blur-3xl"
                        />


                        {/* Grid */}

                        <div
                            className="absolute
                                       inset-0
                                       opacity-[0.04]"
                            style={{
                                backgroundImage: `
                                    linear-gradient(
                                        rgba(255,255,255,0.1)
                                        1px,
                                        transparent 1px
                                    ),
                                    linear-gradient(
                                        90deg,
                                        rgba(255,255,255,0.1)
                                        1px,
                                        transparent 1px
                                    )
                                `,
                                backgroundSize:
                                    "40px 40px",
                            }}
                        />


                        {/* Scan line */}

                        {!exportMode && (
                            <motion.div
                                animate={{
                                    y: [
                                        "-100%",
                                        "200%",
                                    ],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="absolute
                                           inset-x-0
                                           h-[2px]
                                           bg-gradient-to-r
                                           from-transparent
                                           via-cyan-400/20
                                           to-transparent"
                            />
                        )}

                    </div>


                    {/* =================================
                        PARTICLES
                        ================================= */}

                    {!exportMode &&
                        [
                            {
                                delay: 0,
                                x: -60,
                                size: 6,
                            },
                            {
                                delay: 0.8,
                                x: 20,
                                size: 4,
                            },
                            {
                                delay: 1.5,
                                x: -30,
                                size: 7,
                            },
                            {
                                delay: 2.2,
                                x: 50,
                                size: 5,
                            },
                            {
                                delay: 3,
                                x: -10,
                                size: 4,
                            },
                            {
                                delay: 0.4,
                                x: 40,
                                size: 6,
                            },
                        ].map(
                            (particle, index) => (
                                <FloatingParticle
                                    key={index}
                                    {...particle}
                                />
                            )
                        )}


                    {/* =================================
                        DECORATION
                        ================================= */}

                    {exportMode ? (

                        <div
                            className="absolute
                                       right-6
                                       top-6
                                       z-10"
                        >
                            <Gem
                                size={36}
                                className="text-yellow-400/70"
                                fill="currentColor"
                            />
                        </div>

                    ) : (

                        <motion.div
                            animate={{
                                rotate: [
                                    0,
                                    360,
                                ],
                                scale: [
                                    1,
                                    1.15,
                                    1,
                                ],
                            }}
                            transition={{
                                rotate: {
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear",
                                },
                                scale: {
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                },
                            }}
                            className="absolute
                                       right-6
                                       top-6
                                       z-10"
                        >
                            <Gem
                                size={36}
                                className="text-yellow-400/70"
                                fill="currentColor"
                            />
                        </motion.div>
                    )}


                    {/* =================================
                        CONTENT
                        ================================= */}

                    <div
                        className="relative
                                   z-10
                                   flex
                                   h-full
                                   flex-col
                                   p-6
                                   sm:p-8"
                    >

                        {/* =================================
                            HEADER
                            ================================= */}

                        <div
                            className="flex
                                       items-center
                                       justify-between"
                        >

                            <div
                                className="flex
                                           items-center
                                           gap-3"
                            >

                                <div
                                    className="flex
                                               h-10
                                               w-10
                                               items-center
                                               justify-center
                                               rounded-xl
                                               bg-gradient-to-br
                                               from-yellow-400
                                               to-orange-500
                                               shadow-lg
                                               shadow-orange-500/30"
                                >
                                    <Zap
                                        size={20}
                                        className="text-white"
                                        fill="currentColor"
                                    />
                                </div>


                                <div>

                                    <p
                                        className="text-sm
                                                   font-black
                                                   tracking-wide
                                                   text-white"
                                    >
                                        BRAWLING
                                    </p>

                                    <p
                                        className="text-[9px]
                                                   font-bold
                                                   tracking-[0.25em]
                                                   text-white/30"
                                    >
                                        PLAYER FLEX CARD
                                    </p>

                                </div>

                            </div>


                            <div
                                className="rounded-full
                                           border
                                           border-white/10
                                           bg-white/5
                                           px-3
                                           py-1.5"
                            >

                                <span
                                    className="text-[10px]
                                               font-black
                                               tracking-widest
                                               text-white/40"
                                >
                                    #01
                                </span>

                            </div>

                        </div>


                        {/* =================================
                            PLAYER
                            ================================= */}

                        <div className="mt-6">

                            <p
                                className="text-[10px]
                                           font-black
                                           tracking-[0.35em]
                                           text-orange-400"
                            >
                                PLAYER
                            </p>


                            <h1
                                className="mt-1
                                           text-4xl
                                           font-black
                                           tracking-[-0.06em]
                                           text-white
                                           sm:text-5xl"
                            >
                                {player.name}
                            </h1>


                            <p
                                className="mt-1
                                           font-mono
                                           text-sm
                                           font-bold
                                           text-white/25"
                            >
                                {player.tag}
                            </p>

                        </div>


                        {/* =================================
                            TOP BRAWLER
                            ================================= */}

                        <div
                            className="relative
                                       mt-4"
                        >

                            <div
                                className="relative
                                           h-[200px]
                                           overflow-hidden
                                           rounded-[24px]
                                           bg-gradient-to-br
                                           from-purple-600/40
                                           via-pink-600/30
                                           to-orange-500/30
                                           shadow-xl
                                           shadow-purple-500/10"
                            >

                                <div
                                    className="absolute
                                               -right-16
                                               -top-16
                                               h-44
                                               w-44
                                               rounded-full
                                               bg-white/10"
                                />


                                <div
                                    className="absolute
                                               -bottom-20
                                               -left-16
                                               h-48
                                               w-48
                                               rounded-full
                                               bg-black/15"
                                />


                                {!exportMode && (
                                    <motion.div
                                        animate={{
                                            x: [
                                                "-200%",
                                                "200%",
                                            ],
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            repeatDelay: 3,
                                            ease: "easeInOut",
                                        }}
                                        className="absolute
                                                   inset-y-0
                                                   w-24
                                                   -rotate-12
                                                   bg-white/10
                                                   blur-xl"
                                    />
                                )}


                                <p
                                    className="absolute
                                               left-4
                                               top-3
                                               z-20
                                               text-[9px]
                                               font-black
                                               tracking-[0.35em]
                                               text-white/50"
                                >
                                    YOUR TOP BRAWLER
                                </p>


                                {/* Rank */}

                                <div
                                    className={`absolute
                                               right-4
                                               top-3
                                               z-30
                                               flex
                                               items-center
                                               gap-1.5
                                               rounded-xl
                                               bg-gradient-to-r
                                               ${rankStyle.bg}
                                               px-3
                                               py-1.5
                                               shadow-lg
                                               ${rankStyle.glow}`}
                                >

                                    <Shield
                                        size={12}
                                        className="text-white"
                                        fill="currentColor"
                                    />

                                    <span
                                        className="text-[9px]
                                                   font-black
                                                   tracking-wider
                                                   text-white"
                                    >
                                        RANK{" "}
                                        {player.highestBrawlerRank}
                                    </span>

                                </div>


                                {/* Brawler */}

                                <h2
                                    className="absolute
                                               bottom-3
                                               left-4
                                               z-20
                                               text-3xl
                                               font-black
                                               tracking-[-0.04em]
                                               text-white
                                               drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                                >
                                    {player.highestTrophyBrawler}
                                </h2>


                                {/* STATIC IMAGE DURING EXPORT */}

                                {exportMode ? (

                                    <img
                                        src={brawlerImageUrl}
                                        alt={
                                            player.highestTrophyBrawler
                                        }
                                        crossOrigin="anonymous"
                                        className="absolute
                                                   bottom-0
                                                   left-1/2
                                                   z-10
                                                   h-[210px]
                                                   w-[210px]
                                                   -translate-x-1/2
                                                   object-contain
                                                   drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
                                    />

                                ) : (

                                    <motion.img
                                        initial={{
                                            opacity: 0,
                                            scale: 0.7,
                                            y: 40,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            y: [
                                                0,
                                                -6,
                                                0,
                                            ],
                                        }}
                                        transition={{
                                            opacity: {
                                                delay: 0.5,
                                                duration: 0.7,
                                            },
                                            scale: {
                                                delay: 0.5,
                                                duration: 0.7,
                                                type: "spring",
                                                stiffness: 80,
                                            },
                                            y: {
                                                duration: 4,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: 1.2,
                                            },
                                        }}
                                        whileHover={{
                                            scale: 1.08,
                                            y: -8,
                                        }}
                                        src={brawlerImageUrl}
                                        alt={
                                            player.highestTrophyBrawler
                                        }
                                        className="absolute
                                                   bottom-0
                                                   left-1/2
                                                   z-10
                                                   h-[210px]
                                                   w-[210px]
                                                   -translate-x-1/2
                                                   object-contain
                                                   drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
                                    />

                                )}


                                {/* Best */}

                                <div
                                    className="absolute
                                               bottom-3
                                               right-3
                                               z-30
                                               rounded-2xl
                                               bg-white/90
                                               px-4
                                               py-2
                                               text-center
                                               shadow-xl"
                                >

                                    <div
                                        className="flex
                                                   items-center
                                                   justify-center
                                                   gap-1
                                                   text-orange-500"
                                    >

                                        <Trophy
                                            size={12}
                                            fill="currentColor"
                                        />

                                        <span
                                            className="text-[8px]
                                                       font-black
                                                       tracking-wider"
                                        >
                                            BEST
                                        </span>

                                    </div>


                                    <p
                                        className="text-xl
                                                   font-black
                                                   text-gray-900"
                                    >
                                        {bestTrophies.toLocaleString()}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* =================================
                            TROPHIES
                            ================================= */}

                        <div className="mt-3">

                            <div
                                className="relative
                                           overflow-hidden
                                           rounded-2xl
                                           border
                                           border-yellow-500/30
                                           bg-gradient-to-r
                                           from-yellow-500/10
                                           via-yellow-400/15
                                           to-orange-400/10
                                           px-5
                                           py-3.5"
                            >

                                {!exportMode && (
                                    <motion.div
                                        animate={{
                                            x: [
                                                "-200%",
                                                "250%",
                                            ],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            repeatDelay: 4,
                                        }}
                                        className="absolute
                                                   inset-y-0
                                                   w-20
                                                   rotate-12
                                                   bg-gradient-to-r
                                                   from-transparent
                                                   via-white/30
                                                   to-transparent
                                                   blur-xl"
                                    />
                                )}


                                <div
                                    className="relative
                                               flex
                                               items-center
                                               justify-between"
                                >

                                    <div>

                                        <div
                                            className="flex
                                                       items-center
                                                       gap-2
                                                       text-yellow-400/70"
                                        >

                                            <Trophy
                                                size={14}
                                                fill="currentColor"
                                            />

                                            <span
                                                className="text-[9px]
                                                           font-black
                                                           tracking-[0.2em]"
                                            >
                                                CURRENT TROPHIES
                                            </span>

                                        </div>


                                        <div
                                            className="mt-0.5
                                                       flex
                                                       items-baseline
                                                       gap-2"
                                        >

                                            <p
                                                className="text-4xl
                                                           font-black
                                                           tracking-[-0.04em]
                                                           text-white"
                                            >
                                                {trophies.toLocaleString()}
                                            </p>


                                            <ChevronUp
                                                size={18}
                                                className="text-green-400"
                                            />

                                        </div>

                                    </div>


                                    <div className="text-right">

                                        <p
                                            className="text-[8px]
                                                       font-black
                                                       tracking-widest
                                                       text-white/30"
                                        >
                                            PEAK
                                        </p>

                                        <p
                                            className="text-lg
                                                       font-black
                                                       text-white/70"
                                        >
                                            {peakTrophies.toLocaleString()}
                                        </p>

                                    </div>

                                </div>


                                <div
                                    className="relative
                                               mt-2.5
                                               h-1.5
                                               overflow-hidden
                                               rounded-full
                                               bg-white/10"
                                >

                                    <div
                                        className="absolute
                                                   inset-y-0
                                                   left-0
                                                   rounded-full
                                                   bg-gradient-to-r
                                                   from-yellow-400
                                                   to-orange-400"
                                        style={{
                                            width:
                                                `${trophyProgress}%`,
                                        }}
                                    />

                                </div>

                            </div>

                        </div>


                        {/* =================================
                            POWER
                            ================================= */}

                        <div className="mt-2.5">

                            <div
                                className="flex
                                           items-center
                                           justify-between
                                           px-1"
                            >

                                <div
                                    className="flex
                                               items-center
                                               gap-1.5"
                                >

                                    <Zap
                                        size={11}
                                        className="text-purple-400"
                                        fill="currentColor"
                                    />

                                    <span
                                        className="text-[8px]
                                                   font-black
                                                   tracking-[0.2em]
                                                   text-white/40"
                                    >
                                        POWER LEVEL
                                    </span>

                                </div>


                                <span
                                    className="text-[10px]
                                               font-black
                                               text-purple-300"
                                >
                                    {player.highestBrawlerPower}/11
                                </span>

                            </div>


                            <div
                                className="relative
                                           mt-1
                                           h-1
                                           overflow-hidden
                                           rounded-full
                                           bg-white/10"
                            >

                                <div
                                    className="absolute
                                               inset-y-0
                                               left-0
                                               rounded-full
                                               bg-gradient-to-r
                                               from-purple-500
                                               to-pink-500"
                                    style={{
                                        width:
                                            `${powerPercent}%`,
                                    }}
                                />

                            </div>

                        </div>


                        {/* =================================
                            STAT CARDS
                            ================================= */}

                        <div
                            className="mt-3
                                       grid
                                       grid-cols-3
                                       gap-2"
                        >

                            <CardStat
                                icon={
                                    <Swords
                                        size={14}
                                    />
                                }
                                label="WINS"
                                value={wins}
                                color="orange"
                            />


                            <CardStat
                                icon={
                                    <Users
                                        size={14}
                                    />
                                }
                                label="BRAWLERS"
                                value={brawlers}
                                color="cyan"
                            />


                            <CardStat
                                icon={
                                    <Flame
                                        size={14}
                                    />
                                }
                                label="POWER"
                                value={power}
                                color="purple"
                            />

                        </div>


                        {/* =================================
                            RANKED / CLUB
                            ================================= */}

                        <div
                            className="mt-3
                                       flex
                                       gap-2"
                        >

                            <InfoBox
                                icon={
                                    <Crown
                                        size={13}
                                    />
                                }
                                label="RANKED"
                                value={
                                    player.rankedRankName ||
                                    "—"
                                }
                                color="red"
                            />


                            <InfoBox
                                icon={
                                    <Target
                                        size={13}
                                    />
                                }
                                label="CLUB"
                                value={
                                    player.clubName ||
                                    "—"
                                }
                                color="blue"
                            />

                        </div>


                        {/* =================================
                            FOOTER
                            ================================= */}

                        <div
                            className="mt-auto
                                       flex
                                       items-end
                                       justify-between
                                       pt-3"
                        >

                            <div>

                                <p
                                    className="text-[8px]
                                               font-black
                                               tracking-[0.2em]
                                               text-white/20"
                                >
                                    GENERATED WITH
                                </p>

                                <p
                                    className="text-sm
                                               font-black
                                               text-white/60"
                                >
                                    BRAWLING
                                </p>

                            </div>


                            <Sparkles
                                size={22}
                                className="text-yellow-400"
                                fill="currentColor"
                            />

                        </div>

                    </div>

                </div>

            </div>

        </motion.div>
    );
}


/* =============================================
   CARD STAT
   ============================================= */

function CardStat({
                      icon,
                      label,
                      value,
                      color,
                  }: {
    icon: ReactNode;
    label: string;
    value: number;
    color: "orange" | "cyan" | "purple";
}) {

    const colors = {

        orange: {
            icon: "text-orange-400",
            bar: "from-orange-400 to-yellow-400",
        },

        cyan: {
            icon: "text-cyan-400",
            bar: "from-cyan-400 to-blue-400",
        },

        purple: {
            icon: "text-purple-400",
            bar: "from-purple-400 to-pink-400",
        },

    };

    const c = colors[color];


    return (
        <div
            className="relative
                       overflow-hidden
                       rounded-xl
                       border
                       border-white/5
                       bg-white/[0.04]
                       p-3"
        >

            <div
                className={`flex
                           items-center
                           gap-1.5
                           ${c.icon}`}
            >

                {icon}

                <span
                    className="text-[8px]
                               font-black
                               tracking-wider
                               text-white/30"
                >
                    {label}
                </span>

            </div>


            <p
                className="mt-1
                           text-lg
                           font-black
                           text-white"
            >
                {value.toLocaleString()}
            </p>


            <div
                className={`absolute
                           inset-x-0
                           bottom-0
                           h-[2px]
                           bg-gradient-to-r
                           ${c.bar}`}
            />

        </div>
    );
}


/* =============================================
   INFO BOX
   ============================================= */

function InfoBox({
                     icon,
                     label,
                     value,
                     color,
                 }: {
    icon: ReactNode;
    label: string;
    value: string;
    color: "red" | "blue";
}) {

    return (
        <div
            className="flex
                       flex-1
                       items-center
                       gap-2.5
                       rounded-xl
                       border
                       border-white/5
                       bg-white/[0.04]
                       px-3
                       py-2.5"
        >

            <div
                className={`flex
                           h-7
                           w-7
                           items-center
                           justify-center
                           rounded-lg
                           ${
                    color === "red"
                        ? "bg-red-500/15 text-red-400"
                        : "bg-blue-500/15 text-blue-400"
                }`}
            >
                {icon}
            </div>


            <div className="min-w-0">

                <p
                    className="text-[7px]
                               font-black
                               tracking-[0.2em]
                               text-white/25"
                >
                    {label}
                </p>


                <p
                    className="truncate
                               text-[10px]
                               font-bold
                               text-white/70"
                >
                    {value}
                </p>

            </div>

        </div>
    );
}