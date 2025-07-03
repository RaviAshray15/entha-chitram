import { useState, useRef, useEffect } from 'react';
import { Pause, Play, SkipBack, SkipForward, Volume2, Music2, X } from 'lucide-react';
import '../index.css';

const playlist = [
    { title: 'Poyi Raa Mama | Kubera ', src: '/sounds/poyira.mp3' },
    { title: 'Mental Madhilo | OK Bangaram', src: '/sounds/mentalmadhilo.mp3' },
    { title: 'Entha Chitram | Ante Sundaraaniki', src: '/sounds/enthachitram.mp3' },
    { title: 'Adhento Gaani Vunnapaatuga | Jersey', src: '/sounds/adhento.mp3' },
    { title: 'Ee Hridayam | Ye Maaya Chesave', src: '/sounds/hridayam.mp3' }
];

function AudioPlayer({ autoPlay = false }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackIndex, setTrackIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.4);
    const [showPlayer, setShowPlayer] = useState(true); // starts open
    const [isFadingOut, setIsFadingOut] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = volume;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
        };
    }, [trackIndex, volume]);

    useEffect(() => {
        if (autoPlay && audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
        }
    }, [autoPlay, trackIndex]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                e.preventDefault();
                togglePlay();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const skipNext = () => {
        setTrackIndex((prev) => (prev + 1) % playlist.length);
        setCurrentTime(0);
        const audio = audioRef.current;
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            if (isPlaying) setTimeout(() => audio.play(), 100);
        }
    };

    const skipPrev = () => {
        setTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
        setCurrentTime(0);
        const audio = audioRef.current;
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            if (isPlaying) setTimeout(() => audio.play(), 100);
        }
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const handleVolumeChange = (e) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        if (audioRef.current) {
            audioRef.current.volume = vol;
        }
    };

    const formatTime = (time) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    return (
        <>
            {/* Hidden audio element */}
            <audio ref={audioRef} src={playlist[trackIndex].src} onEnded={skipNext} />

            {/* Music toggle button - always visible */}
            <button
                onClick={() => {
                    if (showPlayer) {
                        setIsFadingOut(true);
                        setTimeout(() => {
                            setShowPlayer(false);
                            setIsFadingOut(false);
                        }, 400);
                    } else {
                        setShowPlayer(true);
                        setIsFadingOut(false);
                    }
                }}

                className="fixed bottom-6 right-6 bg-rose-600 text-white p-3 rounded-full shadow-xl hover:bg-rose-700 dark:hover:bg-rose-500 z-[999]"
                aria-label="Toggle Player"
            >
                <Music2 size={24} />
            </button>

            {/* Audio Player */}
            {showPlayer && (
                <div
                    className={`fixed bottom-20 right-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-2xl shadow-2xl w-[320px] z-50 font-['Inter'] ${isFadingOut ? 'animate-fadeOut' : 'animate-fadeIn'
                        }`}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => {
                            setIsFadingOut(true);
                            setTimeout(() => {
                                setShowPlayer(false);
                                setIsFadingOut(false);
                            }, 400); // match fadeOut duration
                        }}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-2 text-sm font-semibold truncate mb-3 mt-1">
                        <Music2 size={16} className="text-purple-600 dark:text-purple-400" />
                        {playlist[trackIndex].title}
                    </div>

                    <div className="flex items-center justify-between gap-4 mb-3">
                        <button
                            onClick={skipPrev}
                            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            <SkipBack size={18} />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="p-3 bg-rose-600 text-white rounded-full hover:bg-rose-700 dark:hover:bg-rose-500"
                        >
                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                        </button>

                        <button
                            onClick={skipNext}
                            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            <SkipForward size={18} />
                        </button>
                    </div>

                    {/* Seek Bar */}
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max={duration || 1}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full mb-4 accent-rose-500 h-1.5 rounded-full"
                    />

                    {/* Volume Bar */}
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <Volume2 size={16} />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-full accent-rose-500 h-1.5 rounded-full"
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default AudioPlayer;
