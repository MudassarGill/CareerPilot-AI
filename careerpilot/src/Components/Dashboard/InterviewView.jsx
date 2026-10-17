import { useState, useEffect, useRef, useCallback } from "react";
import {
  startInterview,
  submitAnswer,
  finishInterview,
  getInterviewHistory,
  getInterviewDetail,
  converseWithAvatar,
} from "../../services/interview";
import AIAvatarInterviewer from "./AIAvatarInterviewer";
import InterviewConsentModal from "./InterviewConsentModal";
import useComputerVision from "../../hooks/useComputerVision";

export default function InterviewView({ onNavigate }) {
  // Navigation / active tab: "studio" | "history"
  const [activeTab, setActiveTab] = useState("studio");

  // Setup form states
  const [selectedRole, setSelectedRole] = useState("Frontend Developer");
  const [interviewType, setInterviewType] = useState("video"); // video | audio | text
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState("mid");
  const [interviewerPersona, setInterviewerPersona] = useState("sarah"); // "sarah" | "marcus"

  // Consent & Permission Modal
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [consentGranted, setConsentGranted] = useState(true);

  // Active Session states
  const [session, setSession] = useState(null); // { id, role, interview_type, questions, expires_at... }
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [evaluations, setEvaluations] = useState({}); // { [question_index]: evaluation }
  const [answers, setAnswers] = useState({}); // { [question_index]: answer_text }
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [debrief, setDebrief] = useState(null); // Final result object

  // Conversational Warm-up & Introduction States
  const [interviewPhase, setInterviewPhase] = useState("warmup"); // "warmup" | "questions"
  const [warmupMessages, setWarmupMessages] = useState([]);
  const [warmupInput, setWarmupInput] = useState("");
  const [isAvatarReplying, setIsAvatarReplying] = useState(false);
  const [dialogueState, setDialogueState] = useState("intro"); // "intro" | "ready_check"
  const [candidateName, setCandidateName] = useState("");

  // Avatar states
  const [avatarState, setAvatarState] = useState("idle"); // 'idle' | 'listening' | 'speaking' | 'processing'
  const [avatarLatencyMs, setAvatarLatencyMs] = useState(165);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Timer & Speech states
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const recognitionRef = useRef(null);

  // Video stream & CV Overlay refs
  const videoRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Computer Vision Hook
  const isVideoMode = (session?.interview_type === "video" || (!session && interviewType === "video"));
  const { liveMetrics, resetAggregator, getAggregatedMetrics } = useComputerVision(
    videoRef,
    overlayCanvasRef,
    session && isVideoMode && !debrief && cameraActive
  );

  // History list state
  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Notifications
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const rolesList = [
    "Frontend Developer",
    "Backend Developer",
    "AI/ML Engineer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Data Analyst",
    "Cybersecurity Engineer",
    "QA / Test Engineer",
    "Game Developer",
    "Blockchain Developer",
    "iOS Developer",
    "Android Developer",
    "Site Reliability Engineer",
  ];

  // Common spoken filler words detector
  const fillerRegex = /\b(um|uh|like|you know|actually|basically|sort of|kind of|i mean|literally)\b/gi;
  const detectedFillersList = answerText.match(fillerRegex) || [];
  const fillerCount = detectedFillersList.length;

  // Load history when tab changes to history
  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab]);

  // Stopwatch for active question
  useEffect(() => {
    if (session && !debrief) {
      setElapsedSeconds(0);
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [session, currentIndex, debrief]);

  // Handle webcam stream for video mode
  useEffect(() => {
    if (session && session.interview_type === "video" && !debrief) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [session, debrief]);

  // Automatically introduce and speak question when entering a new question
  useEffect(() => {
    if (session && !debrief && session.questions?.[currentIndex]) {
      const qText = session.questions[currentIndex].question;
      // Short delay for natural conversation pacing
      const t = setTimeout(() => {
        if (!isAudioMuted) {
          speakQuestionWithAvatar(qText);
        }
      }, 600);
      return () => clearTimeout(t);
    }
  }, [session, currentIndex, debrief, isAudioMuted]);

  async function startCamera() {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: true,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      }
    } catch (err) {
      console.warn("Could not access camera/mic:", err);
      setCameraActive(false);
      setError("Webcam access denied or unavailable. You can still continue using voice dictation or text.");
    }
  }

  function stopCamera() {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  }

  async function fetchHistory() {
    setLoadingHistory(true);
    setError("");
    try {
      const data = await getInterviewHistory();
      setHistoryList(data || []);
    } catch (err) {
      setError(err.message || "Failed to load past interviews.");
    } finally {
      setLoadingHistory(false);
    }
  }

  function handleOpenSetupConsent() {
    setIsConsentModalOpen(true);
  }

  async function handleConsentAccepted(consentData) {
    setIsConsentModalOpen(false);
    setConsentGranted(true);
    await launchInterviewSession();
  }

  async function launchInterviewSession() {
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      const newSession = await startInterview({
        role: selectedRole,
        interview_type: interviewType,
        question_count: Number(questionCount),
        difficulty,
        consent_granted: true,
        interviewer_persona: interviewerPersona,
      });

      setSession(newSession);
      setInterviewPhase("warmup");
      setDialogueState("intro");
      setCandidateName("");
      setCurrentIndex(0);
      setAnswerText("");
      setWarmupInput("");
      setEvaluations({});
      setAnswers({});
      setDebrief(null);
      setShowHint(false);
      resetAggregator();
      setAvatarState("idle");

      const initialGreeting = interviewerPersona === "marcus"
        ? `Hello! I am Marcus Vance, VP of Engineering. Welcome to your interview session for the ${newSession.role} position. Before we dive into technical architecture, could you please introduce yourself and tell me a bit about your background?`
        : `Hello! I am Sarah Chen, your lead interviewer for today's session. It's wonderful to meet you! Before we start our technical questions for ${newSession.role}, could you please introduce yourself and tell me a bit about your background?`;

      setWarmupMessages([
        { sender: "avatar", text: initialGreeting, time: "Just now" }
      ]);
      setSuccess(`Mock interview initialized for ${newSession.role}. Introduce yourself to begin!`);

      // Avatar speaks initial introduction aloud
      setTimeout(() => {
        speakQuestionWithAvatar(initialGreeting);
      }, 700);
    } catch (err) {
      setError(err.message || "Failed to start interview. Check backend connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle conversational dialogue with avatar during warm-up phase
  async function handleSendWarmupMessage(customMsg) {
    const textToSend = (typeof customMsg === "string" ? customMsg : warmupInput).trim();
    if (!textToSend || isAvatarReplying) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setWarmupInput("");
    const userMsgObj = { sender: "user", text: textToSend, time: "Just now" };
    setWarmupMessages((prev) => [...prev, userMsgObj]);
    setIsAvatarReplying(true);
    setAvatarState("processing");

    try {
      const res = await converseWithAvatar({
        interview_id: session?.id,
        message: textToSend,
        persona: session?.interviewer_persona || interviewerPersona,
        role: session?.role || selectedRole,
        dialogue_state: dialogueState,
        candidate_name: candidateName,
      });

      if (res.candidate_name) {
        setCandidateName(res.candidate_name);
      }
      if (res.next_dialogue_state) {
        setDialogueState(res.next_dialogue_state);
      }

      const avatarMsgObj = { sender: "avatar", text: res.reply, time: "Just now" };
      setWarmupMessages((prev) => [...prev, avatarMsgObj]);

      speakQuestionWithAvatar(res.reply);

      if (res.proceed_to_questions) {
        setTimeout(() => {
          setInterviewPhase("questions");
          setCurrentIndex(0);
          if (session?.questions?.[0]) {
            speakQuestionWithAvatar(session.questions[0].question);
          }
        }, 3000);
      }
    } catch (err) {
      console.warn("Warmup conversation fallback:", err);
      const fallbackReply = "That's wonderful background! Whenever you're ready, say 'Yes' or 'Let's start' and we will begin with our first question.";
      setWarmupMessages((prev) => [...prev, { sender: "avatar", text: fallbackReply, time: "Just now" }]);
      speakQuestionWithAvatar(fallbackReply);
    } finally {
      setIsAvatarReplying(false);
    }
  }

  // Text-To-Speech for Question with Avatar Synchronization
  function speakQuestionWithAvatar(text) {
    if (!("speechSynthesis" in window)) {
      setError("Speech synthesis is not supported in this browser.");
      return;
    }
    if (isSpeakingQuestion) {
      window.speechSynthesis.cancel();
      setIsSpeakingQuestion(false);
      setAvatarState(isListening ? "listening" : "idle");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick appropriate browser voice
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      if (interviewerPersona === "marcus") {
        const maleVoice = voices.find(
          (v) => v.lang.startsWith("en") && (v.name.includes("Male") || v.name.includes("David") || v.name.includes("George"))
        );
        if (maleVoice) utterance.voice = maleVoice;
      } else {
        const femaleVoice = voices.find(
          (v) => v.lang.startsWith("en") && (v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Zira") || v.name.includes("Google US English"))
        );
        if (femaleVoice) utterance.voice = femaleVoice;
      }
    }

    const startPerf = performance.now();

    utterance.onstart = () => {
      const latency = Math.round(performance.now() - startPerf);
      setAvatarLatencyMs(latency > 0 ? latency : 165);
      setAvatarState("speaking");
      setIsSpeakingQuestion(true);
    };

    utterance.onend = () => {
      setIsSpeakingQuestion(false);
      setAvatarState(isListening ? "listening" : "idle");
    };

    utterance.onerror = () => {
      setIsSpeakingQuestion(false);
      setAvatarState("idle");
    };

    window.speechSynthesis.speak(utterance);
  }

  // Speech-To-Text for Candidate Answer
  function handleToggleVoiceDictation() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Voice recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setAvatarState("idle");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setAvatarState("listening"); // Avatar attentively listens to candidate
      };

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (interviewPhase === "warmup") {
          setWarmupInput((prev) => {
            const separator = prev.length && !prev.endsWith(" ") ? " " : "";
            return prev + separator + transcript;
          });
        } else {
          setAnswerText((prev) => {
            const separator = prev.length && !prev.endsWith(" ") ? " " : "";
            return prev + separator + transcript;
          });
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        setAvatarState("idle");
      };

      recognition.onend = () => {
        setIsListening(false);
        setAvatarState("idle");
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setError("Could not initialize voice recording.");
      setIsListening(false);
      setAvatarState("idle");
    }
  }

  // Submit single answer for real-time AI evaluation with CV & Speech telemetry
  async function handleSubmitCurrentAnswer() {
    if (!answerText.trim()) {
      setError("Please provide an answer before submitting.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    setAvatarState("processing"); // Avatar evaluates candidate response

    // Stop speaking or dictating if active
    if (isSpeakingQuestion) {
      window.speechSynthesis.cancel();
      setIsSpeakingQuestion(false);
    }
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    try {
      // Collect real-time computer vision metrics from the question window
      const cvTelemetry = getAggregatedMetrics();

      // Collect speech metrics
      const wordCount = answerText.trim().split(/\s+/).length;
      const wpm = elapsedSeconds > 0 ? Math.round((wordCount / elapsedSeconds) * 60) : 0;
      const speechMetrics = {
        wpm,
        filler_count: fillerCount,
        duration_sec: elapsedSeconds,
      };

      const startReq = performance.now();

      const evalResult = await submitAnswer({
        interview_id: session.id,
        question_index: currentIndex,
        answer_text: answerText,
        duration_sec: elapsedSeconds,
        visual_metrics: session.interview_type === "video" ? cvTelemetry : null,
        speech_metrics: speechMetrics,
        avatar_latency_ms: avatarLatencyMs,
      });

      const responseTime = Math.round(performance.now() - startReq);
      setAvatarLatencyMs(responseTime > 0 ? responseTime : 185);

      setEvaluations((prev) => ({
        ...prev,
        [currentIndex]: evalResult,
      }));
      setAnswers((prev) => ({
        ...prev,
        [currentIndex]: answerText,
      }));
      setAvatarState("idle");
      setSuccess(`Answer for Question ${currentIndex + 1} evaluated!`);
    } catch (err) {
      setError(err.message || "Failed to evaluate answer.");
      setAvatarState("idle");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNextQuestion() {
    if (currentIndex < (session?.questions?.length || 0) - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setAnswerText(answers[nextIdx] || "");
      setShowHint(false);
      setElapsedSeconds(0);
      resetAggregator();
      if (isSpeakingQuestion) {
        window.speechSynthesis.cancel();
        setIsSpeakingQuestion(false);
      }
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
      setAvatarState("idle");
    }
  }

  function handlePrevQuestion() {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setAnswerText(answers[prevIdx] || "");
      setShowHint(false);
    }
  }

  // Finish session and compute final scores
  async function handleFinishSession() {
    setError("");
    setIsFinishing(true);
    setAvatarState("processing");

    try {
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
      if (isSpeakingQuestion) {
        window.speechSynthesis.cancel();
        setIsSpeakingQuestion(false);
      }
      stopCamera();

      const result = await finishInterview(session.id);
      setDebrief(result);
      setAvatarState("idle");
      setSuccess("Mock interview completed! Your Career Readiness Score has been updated.");
    } catch (err) {
      setError(err.message || "Failed to complete interview session.");
      setAvatarState("idle");
    } finally {
      setIsFinishing(false);
    }
  }

  // Printable A4 PDF Report Generation
  function handleExportPDF(debriefData = debrief, currentSession = session) {
    if (!debriefData || !currentSession) return;

    const questions = currentSession.questions || [];
    const evaluationsList = debriefData.question_evaluations || [];
    const formattedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const confidenceBreakdown = debriefData.confidence_breakdown || {};
    const behavioralSummary = debriefData.behavioral_summary || {};
    const speechSummary = debriefData.speech_summary || {};

    const questionsHtml = questions
      .map((q, idx) => {
        const ev =
          evaluationsList.find((e) => e.question_index === idx) ||
          evaluations[idx] ||
          {};
        const userAns = answers[idx] || "No recorded response.";
        const matched = ev.matched_keywords || [];
        const missing = ev.missing_keywords || [];

        return `
          <div class="q-block">
            <div class="q-header">
              <span class="q-number">Question ${idx + 1} (${q.category || "Technical"})</span>
              <span class="q-score">${ev.score !== undefined ? ev.score + "%" : "Pending"}</span>
            </div>
            <div class="q-text">${q.question}</div>
            
            <div class="candidate-ans">
              <strong>Candidate Response:</strong>
              <p>${userAns}</p>
            </div>

            <div class="eval-box">
              <div class="eval-title">AI Rubric Evaluation:</div>
              <p>${ev.feedback || "Evaluation completed."}</p>
              
              <div class="kw-row">
                <strong>Matched Keywords:</strong>
                ${
                  matched.length > 0
                    ? matched.map((k) => `<span class="kw kw-match">${k}</span>`).join(" ")
                    : "<span>None detected</span>"
                }
              </div>

              ${
                missing.length > 0
                  ? `<div class="kw-row">
                      <strong>Recommended Concepts:</strong>
                      ${missing.map((k) => `<span class="kw kw-miss">${k}</span>`).join(" ")}
                    </div>`
                  : ""
              }

              <div class="meta-row">
                <span>Clarity Score: ${ev.clarity_score || 0}%</span>
                <span>Pacing: ${ev.pacing_feedback || "Normal"}</span>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>CareerPilot AI - Mock Interview Report & Behavioral Evaluation - ${currentSession.role}</title>
        <style>
          @page {
            size: A4;
            margin: 12mm 14mm;
          }
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 0;
            line-height: 1.45;
            font-size: 12px;
          }
          .header-banner {
            border-bottom: 2px solid #0284c7;
            padding-bottom: 10px;
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .brand-title {
            font-size: 20px;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 2px 0;
          }
          .brand-sub {
            color: #64748b;
            font-size: 10px;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .meta-box {
            text-align: right;
            font-size: 10px;
            color: #475569;
          }
          .dual-score-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 16px;
          }
          .score-card {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 12px 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .score-card--tech {
            background: #f0fdf4;
            border-color: #86efac;
          }
          .score-card--conf {
            background: #f0f9ff;
            border-color: #7dd3fc;
          }
          .score-big {
            font-size: 28px;
            font-weight: 800;
            line-height: 1;
            color: #0f172a;
          }
          .score-lbl {
            font-size: 9px;
            text-transform: uppercase;
            font-weight: 800;
            letter-spacing: 0.5px;
            color: #475569;
          }
          .srs-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 14px;
            font-size: 11px;
          }
          .srs-table th, .srs-table td {
            border: 1px solid #e2e8f0;
            padding: 6px 10px;
            text-align: left;
          }
          .srs-table th {
            background: #f1f5f9;
            font-weight: 700;
          }
          .section-heading {
            font-size: 13px;
            font-weight: 800;
            color: #0f172a;
            margin: 14px 0 8px 0;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .q-block {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 5px;
            padding: 10px;
            margin-bottom: 10px;
            page-break-inside: avoid;
          }
          .q-header {
            display: flex;
            justify-content: space-between;
            font-weight: 700;
            font-size: 11px;
            margin-bottom: 4px;
          }
          .q-number { color: #0284c7; }
          .q-score { color: #059669; }
          .q-text {
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 6px;
          }
          .candidate-ans {
            background: #ffffff;
            border-left: 3px solid #0284c7;
            padding: 6px 8px;
            border-radius: 0 4px 4px 0;
            margin-bottom: 6px;
            font-size: 11px;
            color: #334155;
          }
          .candidate-ans strong {
            display: block;
            font-size: 9px;
            color: #64748b;
            text-transform: uppercase;
          }
          .candidate-ans p { margin: 0; }
          .eval-box {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 6px 8px;
            font-size: 11px;
          }
          .eval-title {
            font-weight: 700;
            color: #475569;
            margin-bottom: 2px;
          }
          .kw-row {
            margin-top: 4px;
            font-size: 10px;
          }
          .kw {
            display: inline-block;
            padding: 1px 5px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: 600;
            margin-right: 3px;
          }
          .kw-match { background: #dcfce7; color: #166534; }
          .kw-miss { background: #ffedd5; color: #9a3412; }
          .disclaimer-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-left: 3px solid #f97316;
            padding: 8px 10px;
            margin-top: 14px;
            font-size: 10px;
            color: #475569;
            page-break-inside: avoid;
          }
          .disclaimer-title {
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 2px;
            text-transform: uppercase;
          }
          .footer-note {
            margin-top: 16px;
            text-align: center;
            font-size: 9px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
            padding-top: 6px;
          }
        </style>
      </head>
      <body>
        <div class="header-banner">
          <div>
            <h1 class="brand-title">CareerPilot AI</h1>
            <p class="brand-sub">AI Mock Interview Transcript & Behavioral Evaluation Report</p>
          </div>
          <div class="meta-box">
            <div><strong>Role:</strong> ${currentSession.role}</div>
            <div><strong>Date:</strong> ${formattedDate}</div>
            <div><strong>Format:</strong> ${currentSession.interview_type || "video"}</div>
            <div><strong>Retention Policy:</strong> 30 Days (Expires: ${new Date(Date.now() + 30 * 86400000).toLocaleDateString()})</div>
          </div>
        </div>

        <div class="dual-score-grid">
          <div class="score-card score-card--tech">
            <div>
              <div class="score-big">${debriefData.overall_score || 0}%</div>
              <div class="score-lbl">Technical Content Score</div>
            </div>
            <div style="font-size: 10px; color: #166534; text-align: right;">
              Keyword coverage, architectural depth, and structural articulation.
            </div>
          </div>

          <div class="score-card score-card--conf">
            <div>
              <div class="score-big">${debriefData.confidence_score !== undefined && debriefData.confidence_score !== null ? debriefData.confidence_score + "%" : "N/A"}</div>
              <div class="score-lbl">Presentation Confidence Score</div>
            </div>
            <div style="font-size: 10px; color: #0369a1; text-align: right;">
              Eye Contact (30%) + Posture (25%) + Vocal Clarity (25%) + Fluency (20%).
            </div>
          </div>
        </div>

        ${
          debriefData.confidence_breakdown
            ? `
            <div class="section-heading">Presentation & Behavioral Confidence Breakdown</div>
            <table class="srs-table">
              <thead>
                <tr>
                  <th>Indicator Dimension</th>
                  <th>Formula Weight</th>
                  <th>Observed Score</th>
                  <th>Telemetry Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Eye Contact & Approximate Gaze Direction</td>
                  <td>30%</td>
                  <td>${confidenceBreakdown.eye_contact?.score !== null && confidenceBreakdown.eye_contact?.score !== undefined ? confidenceBreakdown.eye_contact.score + "%" : "Unavailable (Camera disabled)"}</td>
                  <td>${confidenceBreakdown.eye_contact?.status || "Measured"}</td>
                </tr>
                <tr>
                  <td>Posture Stability & Upright Alignment</td>
                  <td>25%</td>
                  <td>${confidenceBreakdown.posture?.score !== null && confidenceBreakdown.posture?.score !== undefined ? confidenceBreakdown.posture.score + "%" : "Unavailable (Camera disabled)"}</td>
                  <td>${confidenceBreakdown.posture?.status || "Measured"}</td>
                </tr>
                <tr>
                  <td>Vocal Clarity & Structured Articulation</td>
                  <td>25%</td>
                  <td>${confidenceBreakdown.vocal_clarity?.score !== undefined ? confidenceBreakdown.vocal_clarity.score + "%" : "75%"}</td>
                  <td>${confidenceBreakdown.vocal_clarity?.status || "Measured"}</td>
                </tr>
                <tr>
                  <td>Response Fluency & Low Filler Density</td>
                  <td>20%</td>
                  <td>${confidenceBreakdown.response_fluency?.score !== undefined ? confidenceBreakdown.response_fluency.score + "%" : "75%"}</td>
                  <td>${confidenceBreakdown.response_fluency?.status || "Measured"}</td>
                </tr>
              </tbody>
            </table>
          `
            : ""
        }

        <div class="section-heading">Question-by-Question Rubric Breakdown</div>
        ${questionsHtml}

        <div class="disclaimer-box">
          <div class="disclaimer-title">Scientific & Ethical Interpretation Limitation</div>
          <p style="margin: 0;">
            ${debriefData.interpretation_limitation || "Observable behavioral indicators (face visibility, camera-facing behavior, approximate gaze, head movement, and posture) represent real-time optical engagement metrics during this simulated video interview. In accordance with AI ethics and scientific consensus, these measurements do NOT determine a candidate's actual inner honesty, intelligence, personality, or emotional state. They should be reviewed solely as presentation feedback."}
          </p>
        </div>

        <div class="footer-note">
          Generated automatically by CareerPilot AI Interview Intelligence Engine &bull; Stored locally with 30-day retention limit.
        </div>
      </body>
      </html>
    `;

    const printWin = window.open("", "_blank");
    if (printWin) {
      printWin.document.open();
      printWin.document.write(htmlContent);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => {
        printWin.print();
      }, 300);
      setSuccess("Opening PDF Print/Save dialog for Mock Interview Transcript!");
    }
  }

  const currentQuestion = session?.questions?.[currentIndex];
  const currentEvaluation = evaluations[currentIndex];
  const wordCount = answerText.trim() ? answerText.trim().split(/\s+/).length : 0;
  const estimatedWpm =
    elapsedSeconds > 0 ? Math.round((wordCount / elapsedSeconds) * 60) : 0;

  return (
    <div className="module-view-root">
      {/* ── Top Header Banner ── */}
      <div className="module-header-card module-header-card--gradient">
        <div className="module-header-text">
          <h1 className="module-main-title">AI Mock Interview Studio & Avatar Interviewer</h1>
          <p className="module-subtitle">
            Practice real-time technical and behavioral video interviews with an animated AI HR interviewer,
            live computer vision behavioral telemetry, speech recognition, and presentation confidence scoring.
          </p>
        </div>
        <div className="module-header-actions">
          <div className="tab-pill-group">
            <button
              type="button"
              className={`tab-pill-btn ${activeTab === "studio" ? "tab-pill-btn--active" : ""}`}
              onClick={() => setActiveTab("studio")}
            >
              Interview Studio
            </button>
            <button
              type="button"
              className={`tab-pill-btn ${activeTab === "history" ? "tab-pill-btn--active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              Session History
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && <div className="feedback-banner feedback-banner--error">{error}</div>}
      {success && <div className="feedback-banner feedback-banner--success">{success}</div>}

      {/* ── TAB: SESSION HISTORY ── */}
      {activeTab === "history" && (
        <div className="interview-history-container">
          <div className="interview-history-header">
            <div>
              <h2 className="interview-section-title">Past Interview Sessions</h2>
              <p className="interview-section-sub">
                Sessions are archived under the automated 30-day data retention policy.
              </p>
            </div>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={fetchHistory}
              disabled={loadingHistory}
            >
              {loadingHistory ? "Refreshing..." : "Refresh Records"}
            </button>
          </div>

          {loadingHistory ? (
            <div className="interview-loading-box">
              <div className="loading-spinner" />
              <p>Retrieving past interview history from database...</p>
            </div>
          ) : historyList.length === 0 ? (
            <div className="interview-empty-box">
              <p>No past mock interviews found. Start your first session to build readiness!</p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setActiveTab("studio")}
              >
                Go to Studio
              </button>
            </div>
          ) : (
            <div className="interview-history-grid">
              {historyList.map((item) => (
                <div key={item.id} className="history-card">
                  <div className="history-card__top">
                    <div>
                      <span className="history-format-tag">{item.interview_type}</span>
                      <h3 className="history-role">{item.role}</h3>
                      <span className="history-date">
                        {new Date(item.conducted_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="history-score-badge">
                      <span className="history-score-val">
                        {item.overall_score !== null ? `${item.overall_score}%` : "—"}
                      </span>
                      <span className="history-score-lbl">Tech Score</span>
                      {item.confidence_score !== null && item.confidence_score !== undefined && (
                        <span className="history-conf-val">
                          {item.confidence_score}% Confidence
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="history-card__meta">
                    <span>{item.questions_count || 5} Questions</span>
                    <span className="history-status-badge">{item.status}</span>
                    {item.expires_at && (
                      <span className="history-retention-badge">
                        Retention: ~{Math.max(0, Math.ceil((new Date(item.expires_at) - new Date()) / 86400000))}d left
                      </span>
                    )}
                  </div>

                  <div className="history-card__actions">
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={async () => {
                        try {
                          const detail = await getInterviewDetail(item.id);
                          handleExportPDF(
                            {
                              overall_score: detail.overall_score,
                              confidence_score: detail.confidence_score,
                              confidence_breakdown: detail.behavioral_metrics?.confidence_breakdown,
                              feedback_summary: `Past session archive for ${detail.role}.`,
                              question_evaluations: detail.feedback || [],
                              interpretation_limitation: detail.interpretation_limitation,
                            },
                            detail
                          );
                        } catch (err) {
                          setError("Failed to export past interview transcript.");
                        }
                      }}
                    >
                      Export PDF Transcript
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: ACTIVE INTERVIEW STUDIO ── */}
      {activeTab === "studio" && (
        <>
          {/* STATE 1: PRE-INTERVIEW SETUP */}
          {!session && !debrief && (
            <div className="interview-setup-grid">
              {/* Setup Configuration Card */}
              <div className="interview-setup-card">
                <div className="interview-setup-card__header">
                  <span className="section-pill">AI HR Video Call Studio</span>
                  <h2 className="interview-card-title">Configure Your AI Avatar Interview</h2>
                  <p className="interview-card-subtitle">
                    Experience an interactive video call with an animated AI HR Interviewer and live computer vision behavioral feedback.
                  </p>
                </div>

                <div className="setup-form-group">
                  <label className="setup-label">Target Role:</label>
                  <select
                    className="setup-select"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    {rolesList.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* AI Interviewer Persona Selector */}
                <div className="setup-form-group">
                  <div className="setup-label-with-sub">
                    <label className="setup-label">AI HR Interviewer Persona:</label>
                    <span className="setup-sublabel">Select your simulated interviewer style and evaluation persona</span>
                  </div>
                  <div className="persona-selection-grid">
                    <div
                      className={`persona-card-premium ${
                        interviewerPersona === "sarah" ? "persona-card-premium--selected persona-card-premium--sarah" : ""
                      }`}
                      onClick={() => setInterviewerPersona("sarah")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setInterviewerPersona("sarah");
                      }}
                    >
                      <div className="persona-card-top">
                        <div className="persona-avatar-wrap persona-avatar-wrap--sarah">
                          <span className="persona-avatar-initials">SC</span>
                          <span className="persona-online-dot" title="Active AI Persona" />
                        </div>
                        <div className="persona-header-text">
                          <div className="persona-name-row">
                            <span className="persona-name">Sarah Chen</span>
                            {interviewerPersona === "sarah" ? (
                              <span className="persona-selected-badge persona-badge--sarah">Active ✓</span>
                            ) : (
                              <span className="persona-select-pill">Select</span>
                            )}
                          </div>
                          <span className="persona-role">Lead Technical Recruiter & Talent Partner</span>
                        </div>
                      </div>

                      <div className="persona-card-body">
                        <p className="persona-summary">
                          Empathetic, structured, and insightful. Evaluates behavioral competency (STAR framework), communication clarity, and candidate culture alignment.
                        </p>
                        <div className="persona-tags-row">
                          <span className="persona-tag">Behavioral & STAR</span>
                          <span className="persona-tag">System Design</span>
                          <span className="persona-tag">Culture Fit</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`persona-card-premium ${
                        interviewerPersona === "marcus" ? "persona-card-premium--selected persona-card-premium--marcus" : ""
                      }`}
                      onClick={() => setInterviewerPersona("marcus")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setInterviewerPersona("marcus");
                      }}
                    >
                      <div className="persona-card-top">
                        <div className="persona-avatar-wrap persona-avatar-wrap--marcus">
                          <span className="persona-avatar-initials">MV</span>
                          <span className="persona-online-dot" title="Active AI Persona" />
                        </div>
                        <div className="persona-header-text">
                          <div className="persona-name-row">
                            <span className="persona-name">Marcus Vance</span>
                            {interviewerPersona === "marcus" ? (
                              <span className="persona-selected-badge persona-badge--marcus">Active ✓</span>
                            ) : (
                              <span className="persona-select-pill">Select</span>
                            )}
                          </div>
                          <span className="persona-role">VP of Engineering & Systems Architect</span>
                        </div>
                      </div>

                      <div className="persona-card-body">
                        <p className="persona-summary">
                          Rigorous, deep, and analytical. Probes architectural trade-offs, production scalability, fault tolerance, API design, and system bottlenecks.
                        </p>
                        <div className="persona-tags-row">
                          <span className="persona-tag">Technical Depth</span>
                          <span className="persona-tag">Scalability Trade-Offs</span>
                          <span className="persona-tag">Executive Direct</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="setup-form-group">
                  <label className="setup-label">Interview Format & Studio Mode:</label>
                  <div className="format-options-row">
                    <label
                      className={`format-option ${
                        interviewType === "video" ? "format-option--selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="format"
                        value="video"
                        checked={interviewType === "video"}
                        onChange={() => setInterviewType("video")}
                      />
                      <div>
                        <strong>Video & Animated AI Avatar Studio (Recommended)</strong>
                        <span>Full dual video-call experience with computer vision behavioral telemetry & avatar synchronization</span>
                      </div>
                    </label>

                    <label
                      className={`format-option ${
                        interviewType === "audio" ? "format-option--selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="format"
                        value="audio"
                        checked={interviewType === "audio"}
                        onChange={() => setInterviewType("audio")}
                      />
                      <div>
                        <strong>Audio / Voice Mode</strong>
                        <span>Animated avatar with voice speech recognition and pacing telemetry (camera disabled)</span>
                      </div>
                    </label>

                    <label
                      className={`format-option ${
                        interviewType === "text" ? "format-option--selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="format"
                        value="text"
                        checked={interviewType === "text"}
                        onChange={() => setInterviewType("text")}
                      />
                      <div>
                        <strong>Text & Speech Studio</strong>
                        <span>Type or dictate answers with browser text-to-speech</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="setup-two-col">
                  <div className="setup-form-group">
                    <label className="setup-label">Question Count:</label>
                    <select
                      className="setup-select"
                      value={questionCount}
                      onChange={(e) => setQuestionCount(e.target.value)}
                    >
                      <option value={3}>3 Questions (Quick Sprint - 10m)</option>
                      <option value={5}>5 Questions (Standard Mock - 20m)</option>
                      <option value={8}>8 Questions (Deep Technical - 35m)</option>
                    </select>
                  </div>

                  <div className="setup-form-group">
                    <label className="setup-label">Difficulty Level:</label>
                    <select
                      className="setup-select"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                    >
                      <option value="junior">Junior (Foundational concepts)</option>
                      <option value="mid">Mid-Level (Practical architecture)</option>
                      <option value="senior">Senior (System design & trade-offs)</option>
                    </select>
                  </div>
                </div>

                <div className="setup-action-footer">
                  <button
                    type="button"
                    className="btn-primary btn-start-interview"
                    onClick={handleOpenSetupConsent}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Initializing Studio..." : "Review Consent & Launch Interview"}
                  </button>
                </div>
              </div>

              {/* Informational Guidance Cards */}
              <div className="interview-guidance-col">
                <div className="guidance-card">
                  <h4 className="guidance-card__title">Presentation Confidence Scoring Model</h4>
                  <ul className="guidance-list">
                    <li>
                      <strong>Eye Contact (30%):</strong> Measured via optical gaze vector and camera-facing alignment.
                    </li>
                    <li>
                      <strong>Posture Stability (25%):</strong> Evaluated via head centroid tracking and slouching observation.
                    </li>
                    <li>
                      <strong>Vocal Clarity (25%):</strong> Structured articulation and transition markers.
                    </li>
                    <li>
                      <strong>Response Fluency (20%):</strong> Speech cadence, WPM, and low filler density.
                    </li>
                  </ul>
                </div>

                <div className="guidance-card">
                  <h4 className="guidance-card__title">Technical Content Rubric (Separate Score)</h4>
                  <p className="guidance-card__desc">
                    Technical evaluation is evaluated independently from visual presentation: Keyword coverage (40%), Technical Depth (30%), and Clarity & Structure (30%).
                  </p>
                </div>

                <div className="guidance-card">
                  <h4 className="guidance-card__title">Privacy & Retention Guarantee</h4>
                  <p className="guidance-card__desc">
                    Computer vision executes 100% locally in your browser. No raw video is sent to our servers. Records are auto-purged under our <strong>30-day retention limit</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STATE 2: ACTIVE INTERVIEW LIVE STUDIO (DUAL CALL INTERFACE) */}
          {session && !debrief && currentQuestion && (
            <div className="interview-live-layout">
              {/* Top Progress & Telemetry Bar */}
              <div className="interview-live-statusbar">
                <div className="statusbar-left">
                  <span className="statusbar-role">{session.role}</span>
                  <span className="statusbar-format-pill">{session.interview_type}</span>
                  {interviewPhase === "warmup" ? (
                    <span className="statusbar-progress">Interactive Warm-Up Phase</span>
                  ) : (
                    <span className="statusbar-progress">
                      Question {currentIndex + 1} of {session.questions.length}
                    </span>
                  )}
                </div>

                <div className="statusbar-right">
                  <div className="stopwatch-badge">
                    <span className="stopwatch-dot" />
                    <span>
                      {Math.floor(elapsedSeconds / 60)
                        .toString()
                        .padStart(2, "0")}
                      :{(elapsedSeconds % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-danger btn-sm"
                    onClick={handleFinishSession}
                    disabled={isFinishing}
                  >
                    {isFinishing ? "Finishing..." : "End Session Early"}
                  </button>
                </div>
              </div>

              {/* DUAL VIDEO CALL STAGE: AI AVATAR + CANDIDATE WEBCAM WITH CV HUD */}
              <div className="video-conference-stage">
                {/* Stage Left: Animated AI HR Interviewer */}
                <div className="stage-avatar-panel">
                  <AIAvatarInterviewer
                    state={avatarState}
                    persona={session.interviewer_persona || interviewerPersona}
                    currentQuestion={
                      interviewPhase === "warmup"
                        ? (warmupMessages[warmupMessages.length - 1]?.text || "Welcome to your AI Interview Session")
                        : currentQuestion.question
                    }
                    latencyMs={avatarLatencyMs}
                    isAudioMuted={isAudioMuted}
                    onToggleMute={() => setIsAudioMuted((prev) => !prev)}
                    onReplayAudio={() =>
                      speakQuestionWithAvatar(
                        interviewPhase === "warmup"
                          ? (warmupMessages[warmupMessages.length - 1]?.text || "")
                          : currentQuestion.question
                      )
                    }
                  />
                </div>

                {/* Stage Right: Candidate Live Webcam with CV HUD Overlay */}
                <div className="stage-candidate-panel">
                  <div className="candidate-video-card">
                    <div className="candidate-video-header">
                      <div className="candidate-ident">
                        <span className="cam-live-indicator" />
                        <span className="candidate-title">Candidate Live Stream</span>
                      </div>
                      <div className="cv-badge-group">
                        <span className={`cv-status-pill ${liveMetrics.faceDetected ? "cv-status-pill--active" : "cv-status-pill--warn"}`}>
                          {liveMetrics.faceDetected ? "Face Tracked" : "Searching Face"}
                        </span>
                        <span className="cv-status-pill cv-status-pill--tech">
                          {liveMetrics.cameraFacing ? "Camera-Facing" : "Looking Away"}
                        </span>
                      </div>
                    </div>

                    <div className="candidate-video-frame">
                      {session.interview_type === "video" ? (
                        <>
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="candidate-webcam"
                          />
                          <canvas
                            ref={overlayCanvasRef}
                            className="candidate-cv-overlay"
                          />
                          {!cameraActive && (
                            <div className="webcam-fallback-box">
                              <p>Camera stream is inactive or permission was not granted.</p>
                              <button
                                type="button"
                                className="btn-secondary btn-sm"
                                onClick={startCamera}
                              >
                                Connect Camera
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="audio-mode-placeholder">
                          <div className="audio-mode-icon">&#127908;</div>
                          <h4>Audio / Speech Mode Active</h4>
                          <p>Webcam is disabled in audio mode. Voice dictation and speech metrics remain active.</p>
                        </div>
                      )}
                    </div>

                    {/* Live Computer Vision Telemetry Bar */}
                    {session.interview_type === "video" && cameraActive && (
                      <div className="cv-telemetry-ribbon">
                        <div className="cv-tel-item">
                          <span className="cv-tel-lbl">Gaze:</span>
                          <span className="cv-tel-val">{liveMetrics.gazeDirection}</span>
                        </div>
                        <div className="cv-tel-item">
                          <span className="cv-tel-lbl">Head Pose:</span>
                          <span className="cv-tel-val">Y: {liveMetrics.headPose.yaw}&deg; | P: {liveMetrics.headPose.pitch}&deg;</span>
                        </div>
                        <div className="cv-tel-item">
                          <span className="cv-tel-lbl">Posture:</span>
                          <span className="cv-tel-val">{liveMetrics.postureState} ({liveMetrics.postureScore}%)</span>
                        </div>
                        <div className="cv-tel-item">
                          <span className="cv-tel-lbl">Motion:</span>
                          <span className="cv-tel-val">{liveMetrics.headMovement}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* EITHER Warmup Conversation Stage OR Technical Question Grid */}
              {interviewPhase === "warmup" ? (
                <div className="interview-warmup-card">
                  <div className="warmup-card-header">
                    <div className="warmup-header-title-row">
                      <span className="section-pill">Interactive Warm-Up Phase</span>
                      <span className="warmup-live-indicator">Voice Call Active (English & Urdu)</span>
                    </div>
                    <h3 className="warmup-title">Meet Your AI Interviewer & Self Introduction</h3>
                    <p className="warmup-desc">
                      Speak or type your introduction. You can introduce yourself, ask the interviewer questions, or speak in Urdu / Roman Urdu. Say <strong>&quot;Yes&quot;</strong> or <strong>&quot;Let&apos;s start&quot;</strong> when you are ready to begin the technical questions!
                    </p>
                  </div>

                  {/* Conversation History Log */}
                  <div className="warmup-chat-log">
                    {warmupMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`warmup-bubble-wrap ${
                          msg.sender === "avatar"
                            ? "warmup-bubble-wrap--avatar"
                            : "warmup-bubble-wrap--user"
                        }`}
                      >
                        <div className="warmup-bubble-sender">
                          {msg.sender === "avatar"
                            ? (session.interviewer_persona === "marcus" ? "Marcus Vance (AI Interviewer)" : "Sarah Chen (AI Interviewer)")
                            : (candidateName ? `${candidateName} (You)` : "You (Candidate)")}
                        </div>
                        <div className="warmup-bubble-text">{msg.text}</div>
                        {msg.sender === "avatar" && (
                          <button
                            type="button"
                            className="warmup-replay-btn"
                            onClick={() => speakQuestionWithAvatar(msg.text)}
                            title="Listen to avatar voice again"
                          >
                            Listen Again
                          </button>
                        )}
                      </div>
                    ))}
                    {isAvatarReplying && (
                      <div className="warmup-bubble-wrap warmup-bubble-wrap--avatar">
                        <div className="warmup-bubble-sender">AI Interviewer</div>
                        <div className="warmup-bubble-text warmup-bubble-text--thinking">
                          <span className="dot-pulse" /> Listening & replying...
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Action Suggestion Chips */}
                  <div className="warmup-chips-row">
                    <span className="chips-label">Quick Suggestions:</span>
                    <button
                      type="button"
                      className="warmup-chip"
                      onClick={() => handleSendWarmupMessage(`Hi! My name is ${candidateName || "Candidate"} and I have experience as a ${selectedRole}.`)}
                    >
                      &ldquo;My name is... and I am a {selectedRole}&rdquo;
                    </button>
                    <button
                      type="button"
                      className="warmup-chip warmup-chip--primary"
                      onClick={() => handleSendWarmupMessage("Yes, I am ready! Let's start the interview.")}
                    >
                      &ldquo;Yes, I&apos;m ready! Let&apos;s start.&rdquo;
                    </button>
                    <button
                      type="button"
                      className="warmup-chip"
                      onClick={() => handleSendWarmupMessage("Haan shuru karein, main tayar hoon.")}
                    >
                      &ldquo;Haan shuru karein, main tayar hoon (Urdu)&rdquo;
                    </button>
                    <button
                      type="button"
                      className="warmup-chip"
                      onClick={() => handleSendWarmupMessage("Aap kaise hain aur yeh interview kaisa hoga?")}
                    >
                      &ldquo;Aap kaise hain? (Urdu Chit-chat)&rdquo;
                    </button>
                  </div>

                  {/* Message Input & Voice Dictation Controls */}
                  <div className="warmup-input-bar">
                    <button
                      type="button"
                      className={`btn-dictation ${isListening ? "btn-dictation--listening" : ""}`}
                      onClick={handleToggleVoiceDictation}
                      title="Speak using microphone"
                    >
                      {isListening ? "Recording Voice..." : "Speak via Mic"}
                    </button>

                    <input
                      type="text"
                      className="warmup-input-field"
                      placeholder="Type or speak: 'Hi, my name is...', or 'Yes let\'s start', or in Urdu..."
                      value={warmupInput}
                      onChange={(e) => setWarmupInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendWarmupMessage();
                      }}
                      disabled={isAvatarReplying}
                    />

                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => handleSendWarmupMessage()}
                      disabled={!warmupInput.trim() || isAvatarReplying}
                    >
                      {isAvatarReplying ? "Replying..." : "Send Message"}
                    </button>

                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setInterviewPhase("questions");
                        setCurrentIndex(0);
                        if (session?.questions?.[0]) {
                          speakQuestionWithAvatar(session.questions[0].question);
                        }
                      }}
                      title="Skip straight to Question 1"
                    >
                      Start Technical Questions ➔
                    </button>
                  </div>
                </div>
              ) : (
                /* Main Live Grid: Question & Response vs Rubric Feedback & Navigator */
                <div className="interview-live-grid">
                {/* Left Col: Current Question & Candidate Response */}
                <div className="interview-primary-col">
                  {/* Question Card */}
                  <div className="interview-question-box">
                    <div className="question-box-header">
                      <div className="question-badges">
                        <span className="badge-category">{currentQuestion.category}</span>
                        <span className="badge-difficulty">{currentQuestion.difficulty}</span>
                      </div>
                      <button
                        type="button"
                        className={`btn-tts ${isSpeakingQuestion ? "btn-tts--speaking" : ""}`}
                        onClick={() => speakQuestionWithAvatar(currentQuestion.question)}
                      >
                        {isSpeakingQuestion ? "Stop Audio" : "Listen to Avatar"}
                      </button>
                    </div>

                    <h3 className="question-title-text">{currentQuestion.question}</h3>

                    {currentQuestion.hint && (
                      <div className="hint-wrapper">
                        <button
                          type="button"
                          className="hint-toggle-btn"
                          onClick={() => setShowHint((prev) => !prev)}
                        >
                          {showHint ? "Hide Guidance Hint" : "Show Guidance Hint"}
                        </button>
                        {showHint && <p className="hint-content">{currentQuestion.hint}</p>}
                      </div>
                    )}
                  </div>

                  {/* Candidate Answer Box */}
                  <div className="interview-answer-box">
                    <div className="answer-box-header">
                      <label className="answer-box-label">Your Response:</label>
                      <div className="answer-header-tools">
                        <button
                          type="button"
                          className={`btn-dictation ${
                            isListening ? "btn-dictation--listening" : ""
                          }`}
                          onClick={handleToggleVoiceDictation}
                        >
                          <span className={`mic-dot ${isListening ? "mic-dot--pulse" : ""}`} />
                          {isListening ? "Listening... (Click to Pause)" : "Voice Dictation"}
                        </button>
                        <span className="word-count-badge">
                          {wordCount} words ({estimatedWpm} wpm)
                        </span>
                        {fillerCount > 0 && (
                          <span className="filler-count-badge">
                            {fillerCount} filler{fillerCount > 1 ? "s" : ""} detected
                          </span>
                        )}
                      </div>
                    </div>

                    <textarea
                      className="answer-textarea"
                      rows={6}
                      placeholder="Type your response here, or click 'Voice Dictation' to speak naturally into your microphone..."
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                    />

                    <div className="answer-actions-bar">
                      <div className="nav-buttons-group">
                        <button
                          type="button"
                          className="btn-secondary btn-sm"
                          onClick={handlePrevQuestion}
                          disabled={currentIndex === 0}
                        >
                          ← Previous
                        </button>
                        {currentIndex < session.questions.length - 1 ? (
                          <button
                            type="button"
                            className="btn-secondary btn-sm"
                            onClick={handleNextQuestion}
                          >
                            Next →
                          </button>
                        ) : null}
                      </div>

                      <div className="submit-buttons-group">
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={handleSubmitCurrentAnswer}
                          disabled={isSubmitting || !answerText.trim()}
                        >
                          {isSubmitting ? "Evaluating Rubric & Telemetry..." : "Submit for AI Evaluation"}
                        </button>

                        {currentIndex === session.questions.length - 1 && (
                          <button
                            type="button"
                            className="btn-success"
                            onClick={handleFinishSession}
                            disabled={isFinishing}
                          >
                            {isFinishing ? "Generating Debrief..." : "Finish Interview"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Real-time AI Rubric Feedback Panel */}
                  {currentEvaluation && (
                    <div className="rubric-feedback-card">
                      <div className="rubric-header">
                        <div>
                          <span className="rubric-tag">AI Evaluation Result</span>
                          <h4 className="rubric-title">Question {currentIndex + 1} Feedback</h4>
                        </div>
                        <div className="rubric-score-badge">
                          <span className="rubric-score-val">{currentEvaluation.score}%</span>
                        </div>
                      </div>

                      <p className="rubric-feedback-text">{currentEvaluation.feedback}</p>

                      <div className="keywords-section">
                        {currentEvaluation.matched_keywords &&
                          currentEvaluation.matched_keywords.length > 0 && (
                            <div className="kw-group">
                              <span className="kw-label">Demonstrated Terminology:</span>
                              <div className="kw-tags-row">
                                {currentEvaluation.matched_keywords.map((kw, idx) => (
                                  <span key={idx} className="kw-tag kw-tag--matched">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                        {currentEvaluation.missing_keywords &&
                          currentEvaluation.missing_keywords.length > 0 && (
                            <div className="kw-group">
                              <span className="kw-label">Concepts to Consider:</span>
                              <div className="kw-tags-row">
                                {currentEvaluation.missing_keywords.map((kw, idx) => (
                                  <span key={idx} className="kw-tag kw-tag--missing">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>

                      <div className="rubric-metrics-row">
                        <div className="metric-cell">
                          <span className="metric-lbl">Clarity Score</span>
                          <span className="metric-val">{currentEvaluation.clarity_score}%</span>
                        </div>
                        <div className="metric-cell">
                          <span className="metric-lbl">Delivery Pacing</span>
                          <span className="metric-val">
                            {currentEvaluation.pacing_feedback || "Optimal pace"}
                          </span>
                        </div>
                        {currentEvaluation.behavioral_insights && (
                          <div className="metric-cell">
                            <span className="metric-lbl">Camera-Facing Engagement</span>
                            <span className="metric-val">
                              {Math.round((currentEvaluation.behavioral_insights.camera_facing_ratio || 0.85) * 100)}%
                            </span>
                          </div>
                        )}
                      </div>

                      {currentIndex < session.questions.length - 1 && (
                        <div className="rubric-next-step">
                          <button
                            type="button"
                            className="btn-primary"
                            onClick={handleNextQuestion}
                          >
                            Proceed to Question {currentIndex + 2} →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Col: Questions Navigator */}
                <div className="interview-sidebar-col">
                  <div className="q-nav-box">
                    <h4 className="q-nav-title">Questions Navigator</h4>
                    <div className="q-nav-list">
                      {session.questions.map((q, idx) => {
                        const hasAns = !!answers[idx];
                        const hasEval = !!evaluations[idx];
                        const isCurrent = idx === currentIndex;
                        return (
                          <button
                            key={idx}
                            type="button"
                            className={`q-nav-item ${isCurrent ? "q-nav-item--current" : ""} ${
                              hasEval ? "q-nav-item--evaluated" : hasAns ? "q-nav-item--answered" : ""
                            }`}
                            onClick={() => {
                              setCurrentIndex(idx);
                              setAnswerText(answers[idx] || "");
                              setShowHint(false);
                            }}
                          >
                            <span className="q-nav-num">Q{idx + 1}</span>
                            <span className="q-nav-desc">{q.category}</span>
                            <span className="q-nav-status">
                              {hasEval
                                ? `${evaluations[idx].score}%`
                                : hasAns
                                ? "Draft"
                                : "Pending"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

          {/* STATE 3: FINAL DEBRIEF & SCORE */}
          {debrief && (
            <div className="interview-debrief-container">
              {/* Dual Score Top Banner */}
              <div className="debrief-header-card">
                <div className="dual-score-container">
                  {/* Technical Score Ring */}
                  <div className="debrief-score-ring">
                    <div className="score-ring-circle">
                      <span className="score-ring-number">{debrief.overall_score}%</span>
                      <span className="score-ring-label">Technical Score</span>
                    </div>
                  </div>

                  {/* Presentation Confidence Score Ring */}
                  {debrief.confidence_score !== undefined && debrief.confidence_score !== null && (
                    <div className="debrief-score-ring debrief-score-ring--conf">
                      <div className="score-ring-circle score-ring-circle--conf">
                        <span className="score-ring-number">{debrief.confidence_score}%</span>
                        <span className="score-ring-label">Confidence Score</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="debrief-text-block">
                  <span className="section-pill">Session Complete &bull; 30-Day Retention</span>
                  <h2 className="debrief-title">{debrief.role} Performance Debrief</h2>
                  <p className="debrief-summary">{debrief.feedback_summary}</p>

                  {debrief.new_crs_score && (
                    <div className="crs-sync-banner">
                      <strong>Career Readiness Score (CRS) Synchronized:</strong>
                      <span> Your updated overall readiness rating is {debrief.new_crs_score}%</span>
                    </div>
                  )}

                  <div className="debrief-actions-row">
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => handleExportPDF()}
                    >
                      Export Interview Report (PDF)
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setSession(null);
                        setDebrief(null);
                        setEvaluations({});
                        setAnswers({});
                        setAvatarState("idle");
                      }}
                    >
                      Start Another Session
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setActiveTab("history")}
                    >
                      View All History
                    </button>
                  </div>
                </div>
              </div>

              {/* Presentation Confidence Score Breakdown Card */}
              {debrief.confidence_breakdown && (
                <div className="srs-breakdown-card">
                  <div className="srs-breakdown-header">
                    <div>
                      <span className="section-pill">Behavioral Telemetry Model</span>
                      <h3 className="srs-card-title">Presentation & Behavioral Confidence Telemetry</h3>
                    </div>
                    <span className="srs-formula-tag">
                      Eye Contact (30%) + Posture (25%) + Vocal Clarity (25%) + Response Fluency (20%)
                    </span>
                  </div>

                  <div className="srs-metrics-grid">
                    <div className="srs-metric-box">
                      <span className="srs-metric-title">Eye Contact & Gaze</span>
                      <span className="srs-metric-val">
                        {debrief.confidence_breakdown.eye_contact?.score !== null && debrief.confidence_breakdown.eye_contact?.score !== undefined
                          ? `${debrief.confidence_breakdown.eye_contact.score}%`
                          : "Unavailable"}
                      </span>
                      <span className="srs-metric-desc">Weight: 30% &bull; Camera focus alignment</span>
                    </div>

                    <div className="srs-metric-box">
                      <span className="srs-metric-title">Posture Stability</span>
                      <span className="srs-metric-val">
                        {debrief.confidence_breakdown.posture?.score !== null && debrief.confidence_breakdown.posture?.score !== undefined
                          ? `${debrief.confidence_breakdown.posture.score}%`
                          : "Unavailable"}
                      </span>
                      <span className="srs-metric-desc">Weight: 25% &bull; Upright alignment without slump</span>
                    </div>

                    <div className="srs-metric-box">
                      <span className="srs-metric-title">Vocal Clarity</span>
                      <span className="srs-metric-val">
                        {debrief.confidence_breakdown.vocal_clarity?.score !== undefined
                          ? `${debrief.confidence_breakdown.vocal_clarity.score}%`
                          : "75%"}
                      </span>
                      <span className="srs-metric-desc">Weight: 25% &bull; Structured answer articulation</span>
                    </div>

                    <div className="srs-metric-box">
                      <span className="srs-metric-title">Response Fluency</span>
                      <span className="srs-metric-val">
                        {debrief.confidence_breakdown.response_fluency?.score !== undefined
                          ? `${debrief.confidence_breakdown.response_fluency.score}%`
                          : "75%"}
                      </span>
                      <span className="srs-metric-desc">Weight: 20% &bull; Steady cadence & low filler words</span>
                    </div>
                  </div>

                  {/* Scientific Limitation Disclaimer */}
                  <div className="ethical-disclaimer-box">
                    <strong>Observable Interview Behaviour Notice:</strong>
                    <p>{debrief.interpretation_limitation}</p>
                  </div>
                </div>
              )}

              {/* Question Breakdown List */}
              <div className="debrief-breakdown-section">
                <h3 className="breakdown-heading">Question-by-Question Rubric Breakdown</h3>
                <div className="breakdown-grid">
                  {(session?.questions || []).map((q, idx) => {
                    const ev =
                      (debrief.question_evaluations || []).find(
                        (e) => e.question_index === idx
                      ) ||
                      evaluations[idx] ||
                      {};
                    const candidateAns = answers[idx] || "No recorded response.";

                    return (
                      <div key={idx} className="breakdown-card">
                        <div className="breakdown-card__header">
                          <div>
                            <span className="breakdown-qnum">
                              Question {idx + 1} &bull; {q.category}
                            </span>
                            <h4 className="breakdown-qtitle">{q.question}</h4>
                          </div>
                          <div className="breakdown-qscore">
                            <span className="qscore-val">
                              {ev.score !== undefined ? `${ev.score}%` : "—"}
                            </span>
                          </div>
                        </div>

                        <div className="breakdown-ans-box">
                          <span className="ans-label">Candidate Response:</span>
                          <p>{candidateAns}</p>
                        </div>

                        <div className="breakdown-eval-box">
                          <span className="eval-label">AI Feedback:</span>
                          <p>{ev.feedback || "Question evaluated."}</p>

                          {ev.matched_keywords && ev.matched_keywords.length > 0 && (
                            <div className="breakdown-kw-row">
                              <strong>Matched:</strong>
                              {ev.matched_keywords.map((k, i) => (
                                <span key={i} className="kw-tag kw-tag--matched">
                                  {k}
                                </span>
                              ))}
                            </div>
                          )}

                          {ev.missing_keywords && ev.missing_keywords.length > 0 && (
                            <div className="breakdown-kw-row">
                              <strong>Recommended:</strong>
                              {ev.missing_keywords.map((k, i) => (
                                <span key={i} className="kw-tag kw-tag--missing">
                                  {k}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Consent Modal */}
      <InterviewConsentModal
        isOpen={isConsentModalOpen}
        onClose={() => setIsConsentModalOpen(false)}
        onAccept={handleConsentAccepted}
        role={selectedRole}
        format={interviewType}
      />
    </div>
  );
}
