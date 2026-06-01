import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import "./App.css";

function MatrixRain() {
  const columns = Array.from({ length: 42 });

  return (
    <div className="matrix-layer">
      {columns.map((_, index) => {
        const chars = Array.from({ length: 26 });

        return (
          <span
            key={index}
            className="matrix-column"
            style={{
              left: `${index * 2.5}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 7}s`,
            }}
          >
            {chars.map((_, i) => (
              <b key={i}>
                {
                  ["0", "1", "R", "E", "D", "O", "X", "★", "♡"][
                    Math.floor(Math.random() * 9)
                  ]
                }
              </b>
            ))}
          </span>
        );
      })}
    </div>
  );
}

function ParticleField() {
  return (
    <div className="particle-field">
      {Array.from({ length: 34 }).map((_, index) => (
        <span
          key={index}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${4 + Math.random() * 7}s`,
          }}
        />
      ))}
    </div>
  );
}

function FloatingOrb({ left, delay, size }) {
  return (
    <motion.div
      className="orb"
      style={{ left, width: size, height: size }}
      initial={{ y: "110vh", opacity: 0 }}
      animate={{ y: "-35vh", opacity: [0, 1, 0] }}
      transition={{
        duration: 10,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

function MusicBars({ playing }) {
  return (
    <div className={`music-bars ${playing ? "playing" : ""}`}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

function App() {
  const [opened, setOpened] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicBlocked, setMusicBlocked] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroDone(true);
    }, 2300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = 0.45;
    audio.loop = true;

    const tryPlayMusic = async () => {
      try {
        await audio.play();
        setMusicPlaying(true);
        setMusicBlocked(false);
      } catch (error) {
        setMusicPlaying(false);
        setMusicBlocked(true);
      }
    };

    tryPlayMusic();
  }, []);

  useEffect(() => {
    const birthdayLoop = setInterval(() => {
      confetti({
        particleCount: 35,
        spread: 90,
        startVelocity: 30,
        origin: {
          x: Math.random(),
          y: Math.random() * 0.35,
        },
        colors: ["#a855f7", "#d946ef", "#f0abfc", "#ffffff", "#c084fc"],
      });
    }, 4500);

    return () => clearInterval(birthdayLoop);
  }, []);

  useEffect(() => {
    if (!opened) return;

    const end = Date.now() + 4200;

    const frame = () => {
      confetti({
        particleCount: 7,
        spread: 80,
        startVelocity: 38,
        origin: { x: Math.random(), y: 0.65 },
        colors: ["#7c3aed", "#a855f7", "#d946ef", "#ffffff", "#f0abfc"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [opened]);

  const enableMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    try {
      await audio.play();
      setMusicPlaying(true);
      setMusicBlocked(false);
    } catch (error) {
      setMusicPlaying(false);
      setMusicBlocked(true);
    }
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
      return;
    }

    try {
      await audio.play();
      setMusicPlaying(true);
      setMusicBlocked(false);
    } catch (error) {
      setMusicBlocked(true);
    }
  };

  const celebrate = async () => {
    setOpened(true);
    await enableMusic();

    confetti({
      particleCount: 260,
      spread: 140,
      startVelocity: 45,
      origin: { y: 0.55 },
      colors: ["#7c3aed", "#a855f7", "#d946ef", "#ffffff", "#f0abfc"],
    });
  };

  return (
    <main className="birthday-page">
      <audio ref={audioRef} src="/happy-birthday.mp3" preload="auto" />

      <AnimatePresence>
        {!introDone && (
          <motion.div
            className="intro-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="intro-logo"
              initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              REDOX
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              Loading birthday celebration...
            </motion.p>
            <div className="intro-loader"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <MatrixRain />
      <ParticleField />

      <div className="grid-bg"></div>
      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>
      <div className="glow glow-three"></div>

      <FloatingOrb left="8%" delay={0} size="90px" />
      <FloatingOrb left="24%" delay={2} size="55px" />
      <FloatingOrb left="68%" delay={1} size="80px" />
      <FloatingOrb left="88%" delay={3} size="48px" />

      <motion.button
        className="music-control"
        onClick={toggleMusic}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
      >
        <MusicBars playing={musicPlaying} />
        {musicPlaying ? "Music On" : "Music Off"}
      </motion.button>

      <AnimatePresence>
        {musicBlocked && (
          <motion.button
            className="enable-music"
            onClick={enableMusic}
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
          >
            🔊 Enable Birthday Music
          </motion.button>
        )}
      </AnimatePresence>

      <motion.section
        className="hero-card"
        initial={{ opacity: 0, y: 50, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 2.1, duration: 0.9, ease: "easeOut" }}
      >
        <div className="corner top-left"></div>
        <div className="corner top-right"></div>
        <div className="corner bottom-left"></div>
        <div className="corner bottom-right"></div>

        <motion.div
          className="birthday-icon"
          animate={{
            y: [0, -14, 0],
            rotate: [0, 4, -4, 0],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          🎂
        </motion.div>

        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, letterSpacing: "2px" }}
          animate={{ opacity: 1, letterSpacing: "8px" }}
          transition={{ delay: 2.5, duration: 0.9 }}
        >
          PREMIUM BIRTHDAY SYSTEM ACTIVE
        </motion.p>

        <motion.h1
          className="title"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7 }}
        >
          HAPPY BIRTHDAY
        </motion.h1>

        <motion.h2
          className="hollow-name"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 3,
            type: "spring",
            stiffness: 120,
          }}
        >
          REDOX
        </motion.h2>

        <motion.div
          className="scanner"
          initial={{ x: "-120%" }}
          animate={{ x: "120%" }}
          transition={{
            delay: 3.2,
            duration: 2.2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.p
          className="message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.3 }}
        >
          To my biggest friend — may your new year of life be powerful,
          successful, unforgettable, full of happiness, surprises, and legendary
          memories.
        </motion.p>

        <AnimatePresence>
          {opened && (
            <motion.div
              className="wish-box"
              initial={{ opacity: 0, y: 25, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <span>ACCESS GRANTED</span>
              <p>REDOX, you are not just a friend — you are a legend.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          className="cyber-button"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={celebrate}
        >
          {opened ? "RESTART CELEBRATION" : "LAUNCH BIRTHDAY SURPRISE"}
        </motion.button>
      </motion.section>

     <footer>
  <span>Designed with futuristic love for REDOX</span>
  <strong>FROM ZODIAC</strong>
</footer>
    </main>
  );
}

export default App;