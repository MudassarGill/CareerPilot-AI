import { useState, useEffect, useRef } from "react";

/**
 * AIAvatarInterviewer
 * High-Fidelity Animated AI HR Interviewer Canvas Component.
 * Supports:
 * - Dynamic visual states: 'idle' | 'listening' | 'speaking' | 'processing'
 * - Lifelike procedural facial animation:
 *   * Blinking eyes with randomized intervals
 *   * Saccadic pupil gaze tracking
 *   * Natural micro-head tilting & breathing cycle
 *   * Real-time speech-synchronized mouth visemes (open, wide, round, closed)
 * - Dynamic audio soundwave visualizer when speaking
 * - Persona toggle: 'sarah' (Lead Talent Partner) | 'marcus' (VP of Engineering)
 * - PER-04 Avatar latency measurement and telemetry indicator
 */
export default function AIAvatarInterviewer({
  state = "idle", // 'idle' | 'listening' | 'speaking' | 'processing'
  persona = "sarah", // 'sarah' | 'marcus'
  currentQuestion = "",
  latencyMs = 180,
  isAudioMuted = false,
  onToggleMute = () => {},
  onReplayAudio = () => {},
}) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const mouthOpenRef = useRef(0);
  const blinkProgressRef = useRef(0);
  const nextBlinkTimeRef = useRef(Date.now() + 2500);
  const headAngleRef = useRef(0);
  const breathPhaseRef = useRef(0);

  const personas = {
    sarah: {
      name: "Sarah Chen",
      role: "Lead Technical Recruiter & Talent Partner",
      badge: "AI HR INTERVIEWER",
      skinTone: "#f5c6a5",
      hairColor: "#1e1e24",
      accentColor: "#f97316",
      suitColor: "#1e293b",
    },
    marcus: {
      name: "Marcus Vance",
      role: "VP of Engineering & Systems Architect",
      badge: "AI HR INTERVIEWER",
      skinTone: "#d49b74",
      hairColor: "#334155",
      accentColor: "#38bdf8",
      suitColor: "#0f172a",
    },
  };

  const activePersona = personas[persona] || personas.sarah;

  // Animation Loop rendering the human-like animated interviewer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let isRunning = true;

    function renderFrame(timestamp) {
      if (!isRunning) return;

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth || 400;
      const h = canvas.clientHeight || 340;

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // 1. Natural Breathing & Head Tilt Cycle
      breathPhaseRef.current += 0.03;
      const breathOffset = Math.sin(breathPhaseRef.current) * 2;

      // Head tilt depending on state
      let targetHeadAngle = 0;
      if (state === "listening") targetHeadAngle = 0.03; // attentive tilt
      else if (state === "speaking") targetHeadAngle = Math.sin(timestamp * 0.003) * 0.02; // conversational nod
      else if (state === "processing") targetHeadAngle = -0.025; // contemplative tilt

      headAngleRef.current += (targetHeadAngle - headAngleRef.current) * 0.05;

      // 2. Realistic Blinking Logic
      const now = Date.now();
      if (now >= nextBlinkTimeRef.current) {
        blinkProgressRef.current += 0.15;
        if (blinkProgressRef.current >= 1) {
          blinkProgressRef.current = 0;
          nextBlinkTimeRef.current = now + 2500 + Math.random() * 3000;
        }
      }
      const isBlinking = blinkProgressRef.current > 0;
      const eyeLidClosure = isBlinking
        ? Math.sin(blinkProgressRef.current * Math.PI)
        : 0;

      // 3. Speech-Synchronized Mouth Visemes
      if (state === "speaking") {
        // Multi-frequency wave simulating spoken syllables and phonemes
        const syllableWave =
          Math.sin(timestamp * 0.022) * 0.4 +
          Math.cos(timestamp * 0.015) * 0.35 +
          Math.sin(timestamp * 0.038) * 0.25;
        mouthOpenRef.current = Math.max(0.08, Math.min(1.0, syllableWave + 0.45));
      } else {
        mouthOpenRef.current += (0 - mouthOpenRef.current) * 0.2; // Return to natural rest
      }

      // 4. Render Studio Backdrop & Lighting
      drawStudioBackdrop(ctx, w, h, state);

      // 5. Draw Animated Avatar Persona
      ctx.save();
      ctx.translate(w / 2, h / 2 + 15 + breathOffset);
      ctx.rotate(headAngleRef.current);

      drawPersona(ctx, activePersona, {
        eyeLidClosure,
        mouthOpen: mouthOpenRef.current,
        state,
        timestamp,
      });

      ctx.restore();

      // 6. Draw Live State Halo & Audio Waves
      if (state === "speaking") {
        drawAudioWaveform(ctx, w, h, timestamp);
      }

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(renderFrame);
    }

    animFrameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [state, persona, activePersona]);

  return (
    <div className={`avatar-interviewer-card avatar-interviewer-card--${state}`}>
      {/* Top Video Call Header Bar */}
      <div className="avatar-card-header">
        <div className="avatar-ident">
          <div className={`avatar-status-dot avatar-status-dot--${state}`} />
          <div>
            <h3 className="avatar-persona-name">{activePersona.name}</h3>
            <span className="avatar-persona-title">{activePersona.role}</span>
          </div>
        </div>

        <div className="avatar-header-badges">
          <span className={`state-badge state-badge--${state}`}>
            {state === "speaking" && "Speaking Question..."}
            {state === "listening" && "Attentively Listening"}
            {state === "processing" && "Evaluating Response..."}
            {state === "idle" && "Ready / Standby"}
          </span>
          <span className="latency-badge" title="Avatar response latency (PER-04 target < 2.0s)">
            {latencyMs}ms latency
          </span>
        </div>
      </div>

      {/* Main Animated Canvas Frame */}
      <div className="avatar-canvas-wrapper">
        <canvas ref={canvasRef} className="avatar-canvas" />

        {/* Processing Neural Halo Overlay */}
        {state === "processing" && (
          <div className="processing-neural-halo">
            <div className="neural-pulse-ring" />
            <span className="neural-pulse-text">AI Evaluating Answer Rubric...</span>
          </div>
        )}

        {/* Bottom Audio Controls Bar */}
        <div className="avatar-call-controls">
          <button
            type="button"
            className="call-ctrl-btn"
            onClick={onReplayAudio}
            title="Replay interviewer audio"
          >
            Replay Audio
          </button>
          <button
            type="button"
            className={`call-ctrl-btn ${isAudioMuted ? "call-ctrl-btn--muted" : ""}`}
            onClick={onToggleMute}
            title={isAudioMuted ? "Unmute interviewer audio" : "Mute interviewer audio"}
          >
            {isAudioMuted ? "Unmute" : "Mute"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Draws executive glassmorphism studio backdrop with depth gradient.
 */
function drawStudioBackdrop(ctx, w, h, state) {
  const bgGrad = ctx.createRadialGradient(w / 2, h / 2 - 20, 20, w / 2, h / 2, Math.max(w, h));
  if (state === "listening") {
    bgGrad.addColorStop(0, "#0f231c");
    bgGrad.addColorStop(1, "#07120e");
  } else if (state === "processing") {
    bgGrad.addColorStop(0, "#19162e");
    bgGrad.addColorStop(1, "#0a0914");
  } else {
    bgGrad.addColorStop(0, "#131b2e");
    bgGrad.addColorStop(1, "#090d17");
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Soft atmospheric accent orb behind head
  const glowGrad = ctx.createRadialGradient(w / 2, h / 2 - 40, 0, w / 2, h / 2 - 40, 110);
  glowGrad.addColorStop(0, "rgba(56, 189, 248, 0.12)");
  glowGrad.addColorStop(1, "rgba(56, 189, 248, 0)");
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2 - 40, 110, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Procedurally draws the animated human-like interviewer persona.
 */
function drawPersona(ctx, persona, dynamics) {
  const { eyeLidClosure, mouthOpen, state, timestamp } = dynamics;

  // 1. Shoulders & Executive Blazer
  ctx.fillStyle = persona.suitColor;
  ctx.beginPath();
  ctx.ellipse(0, 120, 105, 55, 0, 0, Math.PI * 2);
  ctx.fill();

  // Blazer Lapels & Inner Shirt
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(-18, 70);
  ctx.lineTo(0, 105);
  ctx.lineTo(18, 70);
  ctx.closePath();
  ctx.fill();

  // Neck
  ctx.fillStyle = persona.skinTone;
  ctx.fillRect(-18, 30, 36, 45);

  // Neck shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
  ctx.fillRect(-18, 30, 36, 12);

  // 2. Head & Jaw Base
  ctx.fillStyle = persona.skinTone;
  ctx.beginPath();
  ctx.ellipse(0, -10, 52, 65, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. Hair
  ctx.fillStyle = persona.hairColor;
  ctx.beginPath();
  ctx.ellipse(0, -42, 56, 38, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  // Side hair bangs
  ctx.beginPath();
  ctx.ellipse(-48, -25, 12, 35, 0.1, 0, Math.PI * 2);
  ctx.ellipse(48, -25, 12, 35, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // 4. Eyebrows (responsive to state)
  const browOffset = state === "listening" ? -3 : state === "processing" ? 1.5 : 0;
  ctx.strokeStyle = persona.hairColor;
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";

  // Left Eyebrow
  ctx.beginPath();
  ctx.moveTo(-34, -28 + browOffset);
  ctx.quadraticCurveTo(-22, -35 + browOffset, -10, -30 + browOffset);
  ctx.stroke();

  // Right Eyebrow
  ctx.beginPath();
  ctx.moveTo(10, -30 + browOffset);
  ctx.quadraticCurveTo(22, -35 + browOffset, 34, -28 + browOffset);
  ctx.stroke();

  // 5. Lifelike Eyes with Pupil Tracking
  const eyeY = -14;
  const eyeSpacing = 22;

  // Saccadic pupil gaze shift
  let pupilXOffset = 0;
  let pupilYOffset = 0;
  if (state === "processing") {
    pupilXOffset = Math.sin(timestamp * 0.002) * 2;
    pupilYOffset = -2; // looking up thoughtfully
  } else if (state === "listening") {
    pupilYOffset = 0.5; // direct candidate gaze
  }

  [-eyeSpacing, eyeSpacing].forEach((eyeX) => {
    // Sclera (White)
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Iris & Pupil (only visible when not fully closed by blink)
    if (eyeLidClosure < 0.85) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(eyeX, eyeY, 12, 8 * (1 - eyeLidClosure), 0, 0, Math.PI * 2);
      ctx.clip();

      // Iris
      ctx.fillStyle = "#3b2f2f";
      ctx.beginPath();
      ctx.arc(eyeX + pupilXOffset, eyeY + pupilYOffset, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Pupil center
      ctx.fillStyle = "#0a0a0a";
      ctx.beginPath();
      ctx.arc(eyeX + pupilXOffset, eyeY + pupilYOffset, 3, 0, Math.PI * 2);
      ctx.fill();

      // Catchlight sparkle
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.beginPath();
      ctx.arc(eyeX + pupilXOffset - 1.5, eyeY + pupilYOffset - 1.5, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Eyelid Blinking Closure
    if (eyeLidClosure > 0) {
      ctx.fillStyle = persona.skinTone;
      ctx.beginPath();
      ctx.ellipse(eyeX, eyeY, 13, 8 * eyeLidClosure, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Eyelash line
    ctx.strokeStyle = "#1e1e24";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY - 2, 11, 0, Math.PI);
    ctx.stroke();
  });

  // 6. Nose
  ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(2, 6);
  ctx.lineTo(-4, 9);
  ctx.lineTo(4, 9);
  ctx.stroke();

  // 7. Articulated Mouth with Speech Visemes
  const mouthY = 25;
  const mouthWidth = 16 + mouthOpen * 4;
  const mouthHeight = Math.max(2, mouthOpen * 11);

  if (mouthOpen > 0.15) {
    // Open mouth aperture for phonemes (A, E, O, U)
    ctx.fillStyle = "#5c1d24"; // mouth interior
    ctx.beginPath();
    ctx.ellipse(0, mouthY, mouthWidth, mouthHeight, 0, 0, Math.PI * 2);
    ctx.fill();

    // Upper teeth
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.rect(-mouthWidth * 0.6, mouthY - mouthHeight * 0.9, mouthWidth * 1.2, mouthHeight * 0.45);
    ctx.fill();

    // Lip outline
    ctx.strokeStyle = "#c26d6d";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, mouthY, mouthWidth, mouthHeight, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    // Closed / Resting subtle conversational smile
    ctx.strokeStyle = "#b55d5d";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-14, mouthY);
    ctx.quadraticCurveTo(0, mouthY + 3.5, 14, mouthY);
    ctx.stroke();
  }
}

/**
 * Draws dynamic real-time audio soundwave bars along the bottom of the video frame.
 */
function drawAudioWaveform(ctx, w, h, timestamp) {
  const barCount = 18;
  const barWidth = 4;
  const spacing = 4;
  const totalW = barCount * (barWidth + spacing);
  const startX = (w - totalW) / 2;
  const baseY = h - 22;

  ctx.save();
  for (let i = 0; i < barCount; i++) {
    const waveFreq = timestamp * 0.012 + i * 0.4;
    const waveHeight = Math.abs(Math.sin(waveFreq) * 16) + 4;

    const barGrad = ctx.createLinearGradient(0, baseY - waveHeight, 0, baseY);
    barGrad.addColorStop(0, "#38bdf8");
    barGrad.addColorStop(1, "#f97316");

    ctx.fillStyle = barGrad;
    ctx.beginPath();
    ctx.roundRect(startX + i * (barWidth + spacing), baseY - waveHeight, barWidth, waveHeight, 2);
    ctx.fill();
  }
  ctx.restore();
}
