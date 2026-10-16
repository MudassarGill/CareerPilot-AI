import { useState, useEffect, useRef } from "react";
import {
  startInterview,
  submitAnswer,
  finishInterview,
  getInterviewHistory,
  getInterviewDetail,
} from "../../services/interview";

export default function InterviewView({ onNavigate }) {
  // Navigation / active tab: "studio" | "history"
  const [activeTab, setActiveTab] = useState("studio");

  // Setup form states
  const [selectedRole, setSelectedRole] = useState("Frontend Developer");
  const [interviewType, setInterviewType] = useState("text"); // text | audio | video
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState("mid");

  // Active Session states
  const [session, setSession] = useState(null); // { id, role, interview_type, questions, ... }
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [evaluations, setEvaluations] = useState({}); // { [question_index]: evaluation }
  const [answers, setAnswers] = useState({}); // { [question_index]: answer_text }
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [debrief, setDebrief] = useState(null); // Final result object

  // Timer & Speech states
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const recognitionRef = useRef(null);

  // Video stream
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  // History list state
  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedHistoryDetail, setSelectedHistoryDetail] = useState(null);

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
  ];

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

  async function startCamera() {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
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

  async function handleStartInterview() {
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      const newSession = await startInterview({
        role: selectedRole,
        interview_type: interviewType,
        question_count: Number(questionCount),
        difficulty,
      });
      setSession(newSession);
      setCurrentIndex(0);
      setAnswerText("");
      setEvaluations({});
      setAnswers({});
      setDebrief(null);
      setShowHint(false);
      setSuccess(`Mock interview initialized for ${newSession.role}. Good luck!`);
    } catch (err) {
      setError(err.message || "Failed to start interview. Check backend connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Text-To-Speech for Question
  function handleSpeakQuestion(text) {
    if (!("speechSynthesis" in window)) {
      setError("Speech synthesis is not supported in this browser.");
      return;
    }
    if (isSpeakingQuestion) {
      window.speechSynthesis.cancel();
      setIsSpeakingQuestion(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeakingQuestion(false);
    utterance.onerror = () => setIsSpeakingQuestion(false);
    setIsSpeakingQuestion(true);
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
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setAnswerText((prev) => {
          const separator = prev.length && !prev.endsWith(" ") ? " " : "";
          return prev + separator + transcript;
        });
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setError("Could not initialize voice recording.");
      setIsListening(false);
    }
  }

  // Submit single answer for real-time AI evaluation
  async function handleSubmitCurrentAnswer() {
    if (!answerText.trim()) {
      setError("Please provide an answer before submitting.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const evalResult = await submitAnswer({
        interview_id: session.id,
        question_index: currentIndex,
        answer_text: answerText,
        duration_sec: elapsedSeconds,
      });

      setEvaluations((prev) => ({
        ...prev,
        [currentIndex]: evalResult,
      }));
      setAnswers((prev) => ({
        ...prev,
        [currentIndex]: answerText,
      }));
      setSuccess(`Answer for question ${currentIndex + 1} evaluated!`);
    } catch (err) {
      setError(err.message || "Failed to evaluate answer.");
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
      if (isSpeakingQuestion) {
        window.speechSynthesis.cancel();
        setIsSpeakingQuestion(false);
      }
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
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

  // Finish session
  async function handleFinishSession() {
    setError("");
    setIsFinishing(true);
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
      setSuccess("Mock interview completed! Your Career Readiness Score has been updated.");
    } catch (err) {
      setError(err.message || "Failed to complete interview session.");
    } finally {
      setIsFinishing(false);
    }
  }

  function handleExportPDF(debriefData = debrief, currentSession = session) {
    if (!debriefData || !currentSession) return;

    const questions = currentSession.questions || [];
    const evaluationsList = debriefData.question_evaluations || [];
    const formattedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

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
        <title>CareerPilot AI - Mock Interview Transcript - ${currentSession.role}</title>
        <style>
          @page {
            size: A4;
            margin: 14mm 16mm;
          }
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            background: #ffffff;
            margin: 0;
            padding: 0;
            line-height: 1.5;
            font-size: 13px;
          }
          .header-banner {
            border-bottom: 2px solid #0284c7;
            padding-bottom: 12px;
            margin-bottom: 18px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .brand-title {
            font-size: 22px;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 4px 0;
          }
          .brand-sub {
            color: #64748b;
            font-size: 11px;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .meta-box {
            text-align: right;
            font-size: 11px;
            color: #475569;
          }
          .score-summary-card {
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 8px;
            padding: 14px 18px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .score-big {
            font-size: 32px;
            font-weight: 800;
            color: #0284c7;
            line-height: 1;
          }
          .score-lbl {
            font-size: 10px;
            text-transform: uppercase;
            color: #0369a1;
            font-weight: 700;
          }
          .summary-text {
            max-width: 70%;
            font-size: 12px;
            color: #334155;
          }
          .section-heading {
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
            margin: 16px 0 10px 0;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
          }
          .q-block {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 14px;
            page-break-inside: avoid;
          }
          .q-header {
            display: flex;
            justify-content: space-between;
            font-weight: 700;
            font-size: 12px;
            margin-bottom: 6px;
          }
          .q-number { color: #0284c7; }
          .q-score { color: #0f766e; }
          .q-text {
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 8px;
          }
          .candidate-ans {
            background: #ffffff;
            border-left: 3px solid #0284c7;
            padding: 8px 10px;
            border-radius: 0 4px 4px 0;
            margin-bottom: 8px;
            font-size: 12px;
            color: #334155;
          }
          .candidate-ans strong {
            display: block;
            font-size: 10px;
            color: #64748b;
            text-transform: uppercase;
            margin-bottom: 2px;
          }
          .candidate-ans p { margin: 0; }
          .eval-box {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 8px 10px;
            font-size: 11px;
            color: #334155;
          }
          .eval-title {
            font-weight: 700;
            color: #475569;
            margin-bottom: 4px;
          }
          .kw-row {
            margin-top: 6px;
            font-size: 11px;
          }
          .kw {
            display: inline-block;
            padding: 1px 6px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: 600;
            margin-right: 4px;
            margin-bottom: 2px;
          }
          .kw-match { background: #dcfce7; color: #166534; }
          .kw-miss { background: #ffedd5; color: #9a3412; }
          .meta-row {
            margin-top: 6px;
            font-size: 10px;
            color: #64748b;
            display: flex;
            gap: 16px;
          }
          .footer-note {
            margin-top: 24px;
            text-align: center;
            font-size: 10px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
            padding-top: 8px;
          }
        </style>
      </head>
      <body>
        <div class="header-banner">
          <div>
            <h1 class="brand-title">CareerPilot AI</h1>
            <p class="brand-sub">AI Mock Interview Transcript & Rubric Evaluation</p>
          </div>
          <div class="meta-box">
            <div><strong>Role:</strong> ${currentSession.role}</div>
            <div><strong>Date:</strong> ${formattedDate}</div>
            <div><strong>Format:</strong> ${currentSession.interview_type || "text"}</div>
          </div>
        </div>

        <div class="score-summary-card">
          <div>
            <div class="score-big">${debriefData.overall_score || 0}%</div>
            <div class="score-lbl">Overall Performance Score</div>
          </div>
          <div class="summary-text">
            <strong>Debrief Summary:</strong><br />
            ${debriefData.feedback_summary || "Evaluation completed."}
            ${
              debriefData.new_crs_score
                ? `<br /><span style="color: #0284c7; font-weight: 700; font-size: 11px;">Career Readiness Score (CRS) synchronized: ${debriefData.new_crs_score}%</span>`
                : ""
            }
          </div>
        </div>

        <div class="section-heading">Detailed Question Rubric Breakdown</div>
        ${questionsHtml}

        <div class="footer-note">
          Generated automatically by CareerPilot AI Interview Intelligence Engine.
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
          <h1 className="module-main-title">AI Mock Interview Studio</h1>
          <p className="module-subtitle">
            Practice real-time technical and behavioral interviews with dynamic speech recognition,
            multi-dimensional rubric evaluation, and Career Readiness Score (CRS) integration.
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
            <h2 className="interview-section-title">Past Interview Sessions</h2>
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
                      <span className="history-score-lbl">Score</span>
                    </div>
                  </div>

                  <div className="history-card__meta">
                    <span>{item.questions_count || 5} Questions</span>
                    <span className="history-status-badge">{item.status}</span>
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
                              feedback_summary: `Past session archive for ${detail.role}.`,
                              question_evaluations: detail.feedback || [],
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
                  <span className="section-pill">Interactive Simulation</span>
                  <h2 className="interview-card-title">Configure Your Interview Session</h2>
                  <p className="interview-card-subtitle">
                    Select your target career discipline, format, and technical complexity.
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

                <div className="setup-form-group">
                  <label className="setup-label">Interview Format & Studio Mode:</label>
                  <div className="format-options-row">
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
                        <span>Voice speech recognition with live pacing telemetry</span>
                      </div>
                    </label>

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
                        <strong>Video & Audio Studio</strong>
                        <span>Camera mirror feed + voice dictation & rubric evaluation</span>
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
                    onClick={handleStartInterview}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Generating Questions..." : "Begin Mock Interview"}
                  </button>
                </div>
              </div>

              {/* Informational Guidance Cards */}
              <div className="interview-guidance-col">
                <div className="guidance-card">
                  <h4 className="guidance-card__title">Evaluation Rubric (4 Dimensions)</h4>
                  <ul className="guidance-list">
                    <li>
                      <strong>Keyword Coverage (40%):</strong> Industry terminology, framework concepts, and precise syntax.
                    </li>
                    <li>
                      <strong>Technical Depth (30%):</strong> Architectural considerations, edge cases, and rationale.
                    </li>
                    <li>
                      <strong>Clarity & Structure (30%):</strong> Articulation using the STAR and Problem-Solution pattern.
                    </li>
                    <li>
                      <strong>Delivery Pacing:</strong> Real-time word-per-minute pacing metrics.
                    </li>
                  </ul>
                </div>

                <div className="guidance-card">
                  <h4 className="guidance-card__title">Career Readiness Score (CRS) Sync</h4>
                  <p className="guidance-card__desc">
                    Interview performance directly determines <strong>25%</strong> of your overall
                    Career Readiness Score. Completing mock sessions dynamically enhances your candidate rating.
                  </p>
                </div>

                <div className="guidance-card">
                  <h4 className="guidance-card__title">Privacy Assurance</h4>
                  <p className="guidance-card__desc">
                    All video previews and speech recognition execute locally within your browser context.
                    Transcripts are strictly confidential to your account.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STATE 2: ACTIVE INTERVIEW LIVE STUDIO */}
          {session && !debrief && currentQuestion && (
            <div className="interview-live-layout">
              {/* Top Progress & Telemetry Bar */}
              <div className="interview-live-statusbar">
                <div className="statusbar-left">
                  <span className="statusbar-role">{session.role}</span>
                  <span className="statusbar-format-pill">{session.interview_type}</span>
                  <span className="statusbar-progress">
                    Question {currentIndex + 1} of {session.questions.length}
                  </span>
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

              {/* Main Live Grid: Question & Response vs Video & Rubric */}
              <div className="interview-live-grid">
                {/* Left Col: Question & Candidate Response */}
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
                        onClick={() => handleSpeakQuestion(currentQuestion.question)}
                      >
                        {isSpeakingQuestion ? "Stop Audio" : "Listen to Question"}
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
                          {isListening ? "Listening... (Click to Stop)" : "Voice Dictation"}
                        </button>
                        <span className="word-count-badge">
                          {wordCount} words ({estimatedWpm} wpm)
                        </span>
                      </div>
                    </div>

                    <textarea
                      className="answer-textarea"
                      rows={6}
                      placeholder="Type your structured answer here, or click 'Voice Dictation' to speak aloud..."
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
                          {isSubmitting ? "Evaluating Rubric..." : "Submit for AI Evaluation"}
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

                {/* Right Col: Video Preview & Questions Navigator */}
                <div className="interview-sidebar-col">
                  {/* Video Stream (if video mode) */}
                  {session.interview_type === "video" && (
                    <div className="webcam-box">
                      <div className="webcam-header">
                        <span className="webcam-title">Live Video Mirror</span>
                        <span
                          className={`cam-status ${
                            cameraActive ? "cam-status--active" : "cam-status--off"
                          }`}
                        >
                          {cameraActive ? "Active" : "Camera Inactive"}
                        </span>
                      </div>
                      <div className="webcam-frame">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="webcam-video"
                        />
                        {!cameraActive && (
                          <div className="webcam-placeholder">
                            <span>Camera stream not connected</span>
                            <button
                              type="button"
                              className="btn-secondary btn-sm"
                              onClick={startCamera}
                            >
                              Connect Camera
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Question Navigator Drawer */}
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
            </div>
          )}

          {/* STATE 3: FINAL DEBRIEF & SCORE */}
          {debrief && (
            <div className="interview-debrief-container">
              {/* Top Banner */}
              <div className="debrief-header-card">
                <div className="debrief-score-ring">
                  <div className="score-ring-circle">
                    <span className="score-ring-number">{debrief.overall_score}%</span>
                    <span className="score-ring-label">Overall Score</span>
                  </div>
                </div>

                <div className="debrief-text-block">
                  <span className="section-pill">Session Complete</span>
                  <h2 className="debrief-title">{debrief.role} Performance Debrief</h2>
                  <p className="debrief-summary">{debrief.feedback_summary}</p>

                  {debrief.new_crs_score && (
                    <div className="crs-sync-banner">
                      <strong>Career Readiness Score (CRS) Synchronized:</strong>
                      <span> Your updated overall readiness score is {debrief.new_crs_score}%</span>
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
    </div>
  );
}
