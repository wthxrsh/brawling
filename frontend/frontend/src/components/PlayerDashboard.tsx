import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { ArrowLeft, Download, Loader2 } from "lucide-react";

import FlexCard from "./FlexCard";
import type { PlayerStats } from "../types/player";

interface PlayerDashboardProps {
    player: PlayerStats;
    onBack: () => void;
}

export default function PlayerDashboard({
    player,
    onBack,
}: PlayerDashboardProps) {
    const [exporting, setExporting] = useState(false);
    const [exportMode, setExportMode] = useState(false);
    const captureRef = useRef<HTMLDivElement | null>(null);

    const handleExport = async () => {
        const node = captureRef.current;

        if (!node || exporting) {
            return;
        }

        setExporting(true);
        setExportMode(true);

        try {
            /*
             * Give the motion components a frame to settle on
             * their final static values before the capture.
             */
            await new Promise((resolve) =>
                setTimeout(resolve, 100)
            );

            const dataUrl = await toPng(node, {
                pixelRatio: 2,
                cacheBust: true,
            });

            const link = document.createElement("a");
            link.download =
                `brawling-${player.tag.replace("#", "").toLowerCase()}.png`;
            link.href = dataUrl;
            link.click();
        } finally {
            setExportMode(false);
            setExporting(false);
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#0f0a1a]">
            {/* ==============================
                AMBIENT BACKGROUND
                ============================== */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-purple-600/20 blur-3xl" />
                <div className="absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-orange-500/15 blur-3xl" />
                <div className="absolute bottom-[-160px] left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-pink-500/15 blur-3xl" />
            </div>

            {/* ==============================
                CONTENT
                ============================== */}

            <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-10">
                {/* Toolbar */}

                <div className="mb-6 flex w-full max-w-[580px] items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black tracking-widest text-white/70 transition hover:bg-white/10 hover:text-white"
                    >
                        <ArrowLeft size={15} />
                        BACK
                    </button>

                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-300 to-orange-400 px-4 py-2 text-xs font-black tracking-widest text-black shadow-lg shadow-orange-400/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {exporting ? (
                            <>
                                <Loader2
                                    size={15}
                                    className="animate-spin"
                                />
                                EXPORTING
                            </>
                        ) : (
                            <>
                                <Download size={15} />
                                EXPORT PNG
                            </>
                        )}
                    </button>
                </div>

                <FlexCard
                    player={player}
                    captureRef={captureRef}
                    exportMode={exportMode}
                />
            </div>
        </main>
    );
}