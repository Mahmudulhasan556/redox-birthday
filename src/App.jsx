import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import "./App.css";

function MatrixRain() {
  const columns = useMemo(() => {
    const symbols = [
      "0",
      "1",
      "R",
      "E",
      "D",
      "O",
      "X",
      "Z",
      "★",
      "✦",
      "✧",
      "◆",
      "兄",
      "友",
    ];

    return Array.from({ length: 70 }).map((_, index) => ({
      id: index,
      left: `${(index / 70) * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${7 + Math.random() * 9}s`,
      size: `${12 + Math.random() * 8}px`,
      opacity: `${0.28 + Math.random() * 0.45}`,
      chars: Array.from({ length: 34 }).map(
        () => symbols[Math.floor(Math.random() * symbols.length)]
      ),
    }));
  }, []);

  return (
    <div className="matrix-layer">
      {columns.map((column) => (
        <span
          key={column.id}
          className="matrix-column"
          style={{
            left: column.left,
            animationDelay: column.delay,
            animationDuration: column.duration,
            fontSize: column.size,
            opacity: column.opacity,
          }}
        >
          {column.chars.map((char, i) => (
            <b
              key={i}
              className={i === 0 ? "matrix-head" : ""}
              style={{
                animationDelay: `${i * 0.08}s`,
              }}
            >
              {char}
            </b>
          ))}
        </span>
      ))}
    </div>
  );
}

function ParticleField() {
  const particles = useMemo(() => {
    return Array.from({ length: 36 }).map((_, index) => ({
      id: index,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 6}s`,
      duration: `${4 + Math.random() * 7}s`,
    }));
  }, []);

  return (
    <div className="particle-field">
      {particles.map((particle) => (
        <span
          key={particle.id}
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
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

function BirthdayCake({ cakeCut, onCutCake }) {
  return (
    <div className="cake-zone">
      <motion.div
        className={`cake-stage ${cakeCut ? "cake-cut" : ""}`}
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 3.45, duration: 0.7 }}
      >
        <div className="cake-glow"></div>

        <div className="candles">
          <span className="candle">
            <i></i>
          </span>
          <span className="candle">
            <i></i>
          </span>
          <span className="candle">
            <i></i>
          </span>
        </div>

        <div className="cake-body">
          <div className="cake-half cake-left">
            <div className="frosting"></div>
            <div className="cake-layer layer-one"></div>
            <div className="cake-layer layer-two"></div>
            <div className="cake-layer layer-three"></div>
          </div>

          <div className="cake-half cake-right">
            <div className="frosting"></div>
            <div className="cake-layer layer-one"></div>
            <div className="cake-layer layer-two"></div>
            <div className="cake-layer layer-three"></div>
          </div>

          <motion.div
            className="knife"
            initial={{ x: 130, y: -130, rotate: -38, opacity: 0 }}
            animate={
              cakeCut
                ? { x: 0, y: 16, rotate: -18, opacity: 1 }
                : { x: 130, y: -130, rotate: -38, opacity: 0.65 }
            }
            transition={{ duration: 0.7, type: "spring" }}
          >
            <span></span>
          </motion.div>
        </div>

        <div className="plate"></div>
      </motion.div>

      <AnimatePresence>
        {cakeCut && (
          <motion.p
            className="cake-message"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            Cake cut complete. Birthday mode unlocked for REDOX.
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        className="cake-button"
        onClick={onCutCake}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
      >
        {cakeCut ? "CUT AGAIN" : "CUT THE CAKE"}
      </motion.button>
    </div>
  );
}

function App() {
  const [opened, setOpened] = useState(false);
  const [cakeCut, setCakeCut] = useState(false);
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
      } catch {
        setMusicPlaying(false);
        setMusicBlocked(true);
      }
    };

    tryPlayMusic();
  }, []);

  useEffect(() => {
    const birthdayLoop = setInterval(() => {
      confetti({
        particleCount: 24,
        spread: 80,
        startVelocity: 24,
        origin: {
          x: Math.random(),
          y: Math.random() * 0.32,
        },
        colors: ["#4c1d95", "#5b21b6", "#7c3aed", "#c4b5fd", "#ffffff"],
      });
    }, 5200);

    return () => clearInterval(birthdayLoop);
  }, []);

  useEffect(() => {
    if (!opened) return;

    const end = Date.now() + 3500;

    const frame = () => {
      confetti({
        particleCount: 5,
        spread: 75,
        startVelocity: 34,
        origin: { x: Math.random(), y: 0.65 },
        colors: ["#312e81", "#4c1d95", "#7c3aed", "#c4b5fd", "#ffffff"],
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
    } catch {
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
    } catch {
      setMusicBlocked(true);
    }
  };

  const celebrate = async () => {
    setOpened(true);
    await enableMusic();

    confetti({
      particleCount: 230,
      spread: 130,
      startVelocity: 42,
      origin: { y: 0.55 },
      colors: ["#312e81", "#4c1d95", "#7c3aed", "#c4b5fd", "#ffffff"],
    });
  };

  const cutCake = async () => {
    setCakeCut(false);

    setTimeout(() => {
      setCakeCut(true);
    }, 80);

    await enableMusic();

    confetti({
      particleCount: 180,
      spread: 110,
      startVelocity: 38,
      origin: { y: 0.62 },
      colors: ["#7c3aed", "#a78bfa", "#c4b5fd", "#ffffff"],
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
              Loading midnight celebration...
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
          To my brother level friend REDOX  respect for the loyalty, the
          laughs, the support, and the real memories. May this year bring you
          stronger success, bigger wins, peaceful days, and a future full of
          power.
        </motion.p>

        <BirthdayCake cakeCut={cakeCut} onCutCake={cutCake} />

        <div className="quote-grid">
          <motion.div
            className="quote-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.5 }}
          >
            <span>01</span>
            <p>Stay sharp, stay focused, and keep moving like a winner.</p>
          </motion.div>

          <motion.div
            className="quote-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.7 }}
          >
            <span>02</span>
            <p>Real friends are rare. You are one of the solid ones.</p>
          </motion.div>

          <motion.div
            className="quote-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.9 }}
          >
            <span>03</span>
            <p>New age, new level, new achievements. Keep winning, brother.</p>
          </motion.div>
        </div>

        <AnimatePresence>
          {opened && (
            <motion.div
              className="wish-box"
              initial={{ opacity: 0, y: 25, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <span>ACCESS GRANTED</span>
              <p>
                REDOX, you are a real one strong mindset, loyal heart, and
                legendary energy. Keep winning, brother.
              </p>
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
        <span>Built with respect for REDOX</span>
        <strong>FROM ZODIAC</strong>
      </footer>
    </main>
  );
}

export default App;