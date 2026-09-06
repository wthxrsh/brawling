import { useState } from "react";
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";
import {
    ArrowRight,
    Trophy,
    Sparkles,
    Zap,
    Star,
    Loader2,
} from "lucide-react";

import { getPlayer } from "./api/playerApi";
import type { PlayerStats } from "./types/player";
import PlayerDashboard from "./components/PlayerDashboard";

function App() {
    const [playerTag, setPlayerTag] = useState("");
    const [player, setPlayer] = useState<PlayerStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /*
     * ==============================
     * Mouse movement
     * ==============================
     */

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, {
        stiffness: 80,
        damping: 20,
    });

    const smoothY = useSpring(mouseY, {
        stiffness: 80,
        damping: 20,
    });

    /*
     * Different background layers
     * move at different speeds.
     */

    const blob1X = useTransform(
        smoothX,
        [-1, 1],
        [-35, 35]
    );

    const blob1Y = useTransform(
        smoothY,
        [-1, 1],
        [-25, 25]
    );

    const blob2X = useTransform(
        smoothX,
        [-1, 1],
        [25, -25]
    );

    const blob2Y = useTransform(
        smoothY,
        [-1, 1],
        [20, -20]
    );

    const blob3X = useTransform(
        smoothX,
        [-1, 1],
        [-15, 15]
    );

    const blob3Y = useTransform(
        smoothY,
        [-1, 1],
        [15, -15]
    );

    const centerGlowX = useTransform(
        smoothX,
        [-1, 1],
        [-250, 250]
    );

    const centerGlowY = useTransform(
        smoothY,
        [-1, 1],
        [-200, 200]
    );

    /*
     * ==============================
     * Mouse handler
     * ==============================
     */

    const handleMouseMove = (
        event: React.MouseEvent<HTMLElement>
    ) => {
        const { innerWidth, innerHeight } = window;

        const x = event.clientX / innerWidth;
        const y = event.clientY / innerHeight;

        mouseX.set((x - 0.5) * 2);
        mouseY.set((y - 0.5) * 2);
    };

    /*
     * ==============================
     * Generate player
     * ==============================
     */

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        let tag = playerTag.trim().toUpperCase();

        if (!tag) {
            setError("ENTER A PLAYER TAG");
            return;
        }

        /*
         * Allow the user to enter either:
         *
         * #Q2PGLJQCU
         *
         * or
         *
         * Q2PGLJQCU
         */

        if (!tag.startsWith("#")) {
            tag = `#${tag}`;
        }

        setLoading(true);
        setError("");

        try {
            const data = await getPlayer(tag);

            setPlayer(data);
        } catch {
            setError(
                "PLAYER NOT FOUND. CHECK THE TAG AND TRY AGAIN."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * ==============================
     * Dashboard
     * ==============================
     */

    if (player) {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key="dashboard"
                    initial={{
                        opacity: 0,
                        scale: 0.98,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    transition={{
                        duration: 0.4,
                    }}
                >
                    <PlayerDashboard
                        player={player}
                        onBack={() => {
                            setPlayer(null);
                            setError("");
                        }}
                    />
                </motion.div>
            </AnimatePresence>
        );
    }

    /*
     * ==============================
     * Landing page
     * ==============================
     */

    return (
        <main
            onMouseMove={handleMouseMove}
            className="relative min-h-screen overflow-hidden
                 bg-[#fffdf8] text-[#17151f]"
        >
            {/* ========================================
          BACKGROUND
          ======================================== */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">

                {/* Yellow blob */}

                <motion.div
                    style={{
                        x: blob1X,
                        y: blob1Y,
                    }}
                    className="absolute -left-32 -top-32
                     h-[520px] w-[520px]
                     rounded-full
                     bg-yellow-300/40
                     blur-3xl"
                />

                {/* Blue blob */}

                <motion.div
                    style={{
                        x: blob2X,
                        y: blob2Y,
                    }}
                    className="absolute -right-40 top-20
                     h-[500px] w-[500px]
                     rounded-full
                     bg-sky-300/35
                     blur-3xl"
                />

                {/* Pink blob */}

                <motion.div
                    style={{
                        x: blob3X,
                        y: blob3Y,
                    }}
                    className="absolute bottom-[-200px]
                     left-1/3
                     h-[500px] w-[500px]
                     rounded-full
                     bg-pink-300/25
                     blur-3xl"
                />

                {/* Subtle grid */}

                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: `
              linear-gradient(#17151f 1px, transparent 1px),
              linear-gradient(90deg, #17151f 1px, transparent 1px)
            `,
                        backgroundSize: "55px 55px",
                    }}
                />

                {/* Mouse reactive center glow */}

                <motion.div
                    style={{
                        x: centerGlowX,
                        y: centerGlowY,
                    }}
                    className="absolute left-1/2 top-1/2
                     h-[280px] w-[280px]
                     -translate-x-1/2
                     -translate-y-1/2
                     rounded-full
                     bg-orange-300/20
                     blur-[100px]"
                />
            </div>

            {/* ========================================
          FLOATING SHAPES
          ======================================== */}

            <FloatingShape
                className="left-[8%] top-[25%]"
                type="star"
                delay={0}
                x={smoothX}
                y={smoothY}
            />

            <FloatingShape
                className="right-[12%] top-[20%]"
                type="circle"
                delay={1}
                x={smoothX}
                y={smoothY}
            />

            <FloatingShape
                className="left-[15%] bottom-[20%]"
                type="square"
                delay={2}
                x={smoothX}
                y={smoothY}
            />

            <FloatingShape
                className="right-[15%] bottom-[22%]"
                type="star"
                delay={3}
                x={smoothX}
                y={smoothY}
            />

            {/* ========================================
          MAIN CONTENT
          ======================================== */}

            <div
                className="relative z-10 mx-auto flex min-h-screen
                   max-w-6xl flex-col items-center
                   justify-center px-6 py-20"
            >

                {/* ======================================
            BRAND BADGE
            ====================================== */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: -20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    className="mb-8"
                >
                    <div
                        className="flex items-center gap-2
                       rounded-full
                       border border-black/5
                       bg-white/80
                       px-5 py-2.5
                       shadow-lg
                       shadow-black/5
                       backdrop-blur-xl"
                    >

                        <div
                            className="flex h-7 w-7
                         items-center justify-center
                         rounded-lg
                         bg-yellow-300"
                        >
                            <Zap
                                size={15}
                                fill="black"
                            />
                        </div>

                        <span
                            className="text-sm font-black
                         tracking-wide"
                        >
              BRAWLING
            </span>

                        <span className="text-black/20">
              •
            </span>

                        <span
                            className="text-sm font-semibold
                         text-black/40"
                        >
              FLEX YOUR STATS
            </span>

                    </div>
                </motion.div>

                {/* ======================================
            HERO
            ====================================== */}

                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.9,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    transition={{
                        duration: 0.8,
                        type: "spring",
                        stiffness: 100,
                    }}
                    className="text-center"
                >

                    <h1
                        className="text-6xl font-black
                       tracking-[-0.065em]
                       sm:text-7xl
                       md:text-8xl
                       lg:text-9xl"
                    >
                        SHOW THEM

                        <span className="block">

              <span className="relative inline-block">

                <span
                    className="relative z-10
                             bg-gradient-to-r
                             from-orange-500
                             via-yellow-400
                             to-pink-500
                             bg-clip-text
                             text-transparent"
                >
                  YOUR STATS.
                </span>

                  {/* Animated underline */}

                  <motion.div
                      initial={{
                          scaleX: 0,
                      }}
                      animate={{
                          scaleX: 1,
                      }}
                      transition={{
                          delay: 0.8,
                          duration: 0.7,
                      }}
                      className="absolute
                             -bottom-1
                             left-0
                             right-0
                             h-3
                             origin-left
                             rounded-full
                             bg-yellow-300/60"
                  />

              </span>

            </span>
                    </h1>

                    <motion.p
                        initial={{
                            opacity: 0,
                            y: 15,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.6,
                        }}
                        className="mx-auto mt-8 max-w-xl
                       text-lg font-medium
                       leading-relaxed
                       text-black/45
                       sm:text-xl"
                    >
                        Turn your Brawl Stars achievements
                        into a

                        <span className="font-bold text-black/70">
              {" "}shareable flex card.
            </span>
                    </motion.p>

                </motion.div>

                {/* ======================================
            PLAYER TAG FORM
            ====================================== */}

                <motion.form
                    onSubmit={handleSubmit}
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.8,
                        duration: 0.7,
                    }}
                    className="mt-12 w-full max-w-2xl"
                >

                    <div className="group relative">

                        {/* Glow */}

                        <div
                            className="absolute -inset-1
                         rounded-[22px]
                         bg-gradient-to-r
                         from-yellow-400
                         via-orange-400
                         to-pink-400
                         opacity-20
                         blur-lg
                         transition
                         duration-500
                         group-hover:opacity-50"
                        />

                        {/* Input container */}

                        <div
                            className="relative flex items-center
                         rounded-2xl
                         border border-black/10
                         bg-white/90
                         p-2
                         shadow-2xl
                         shadow-black/10
                         backdrop-blur-xl"
                        >

                            <div
                                className="flex flex-1
                           items-center px-5"
                            >

                <span
                    className="mr-2 text-xl
                             font-black
                             text-black/25"
                >
                  #
                </span>

                                <input
                                    value={playerTag}
                                    onChange={(event) => {
                                        setPlayerTag(event.target.value);
                                        setError("");
                                    }}
                                    type="text"
                                    placeholder="ENTER PLAYER TAG"
                                    disabled={loading}
                                    className="w-full
                             bg-transparent
                             py-4
                             text-lg
                             font-black
                             tracking-wide
                             text-black
                             outline-none
                             placeholder:text-black/20
                             disabled:opacity-50"
                                />

                            </div>

                            <motion.button
                                whileHover={
                                    loading
                                        ? {}
                                        : {
                                            scale: 1.04,
                                            rotate: -1,
                                        }
                                }
                                whileTap={
                                    loading
                                        ? {}
                                        : {
                                            scale: 0.96,
                                        }
                                }
                                disabled={loading}
                                type="submit"
                                className="flex items-center
                           gap-2
                           rounded-xl
                           bg-gradient-to-r
                           from-yellow-300
                           to-orange-400
                           px-7 py-4
                           font-black
                           text-black
                           shadow-lg
                           shadow-orange-400/20
                           disabled:cursor-not-allowed
                           disabled:opacity-70"
                            >

                                {loading ? (
                                    <>
                                        <Loader2
                                            size={19}
                                            className="animate-spin"
                                        />

                                        LOADING
                                    </>
                                ) : (
                                    <>
                                        GENERATE

                                        <ArrowRight size={19} />
                                    </>
                                )}

                            </motion.button>

                        </div>
                    </div>

                    {/* Error */}

                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{
                                    opacity: 0,
                                    y: -10,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -10,
                                }}
                                className="mt-4 text-center
                           text-sm font-black
                           text-red-500"
                            >
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>

                </motion.form>

                {/* ======================================
            FEATURE PILLS
            ====================================== */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 1.1,
                    }}
                    className="mt-12 flex flex-wrap
                     justify-center gap-4"
                >

                    <Feature
                        icon={<Trophy size={17} />}
                        text="TROPHIES"
                    />

                    <Feature
                        icon={<Zap size={17} />}
                        text="BRAWLERS"
                    />

                    <Feature
                        icon={<Sparkles size={17} />}
                        text="FLEX CARDS"
                    />

                </motion.div>

            </div>

            {/* ========================================
          BOTTOM FADE
          ======================================== */}

            <div
                className="pointer-events-none
                   absolute bottom-0
                   h-32 w-full
                   bg-gradient-to-t
                   from-[#fffdf8]
                   to-transparent"
            />

        </main>
    );
}


/* ============================================
   FLOATING SHAPE
   ============================================ */

function FloatingShape({
                           className,
                           type,
                           delay,
                           x,
                           y,
                       }: {
    className: string;
    type: "star" | "circle" | "square";
    delay: number;
    x: ReturnType<typeof useMotionValue<number>>;
    y: ReturnType<typeof useMotionValue<number>>;
}) {
    const moveX = useTransform(
        x,
        [-1, 1],
        [-18, 18]
    );

    const moveY = useTransform(
        y,
        [-1, 1],
        [-18, 18]
    );

    return (
        <motion.div
            style={{
                x: moveX,
                y: moveY,
            }}
            className={`pointer-events-none
                  absolute
                  ${className}
                  z-10`}
            animate={{
                y: [0, -15, 0],
                rotate: [0, 8, -8, 0],
            }}
            transition={{
                duration: 5,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        >
            {type === "star" && (
                <Star
                    size={30}
                    fill="currentColor"
                    className="text-yellow-400/60"
                />
            )}

            {type === "circle" && (
                <div
                    className="h-8 w-8
                     rounded-full
                     border-[6px]
                     border-sky-300/60"
                />
            )}

            {type === "square" && (
                <div
                    className="h-7 w-7
                     rotate-12
                     rounded-lg
                     bg-pink-300/50"
                />
            )}
        </motion.div>
    );
}


/* ============================================
   FEATURE PILL
   ============================================ */

function Feature({
                     icon,
                     text,
                 }: {
    icon: React.ReactNode;
    text: string;
}) {
    return (
        <motion.div
            whileHover={{
                y: -4,
                scale: 1.04,
            }}
            className="flex items-center
                 gap-2
                 rounded-full
                 border border-black/5
                 bg-white/70
                 px-5 py-3
                 shadow-md
                 shadow-black/5
                 backdrop-blur"
        >

      <span className="text-orange-500">
        {icon}
      </span>

            <span
                className="text-xs font-black
                   tracking-widest
                   text-black/45"
            >
        {text}
      </span>

        </motion.div>
    );
}

export default App;