import { useState } from "react";

/**
 * InterviewConsentModal
 * SRS UC-06 & FR-06 Security, Consent, and Retention Modal.
 * Collects explicit consent prior to activating camera, mic, and computer vision analysis.
 * Informs candidate about 30-day retention policy and local browser-side optical processing.
 */
export default function InterviewConsentModal({ isOpen, onClose, onAccept, role, format }) {
  const [hasAgreed, setHasAgreed] = useState(false);
  const [devicePermissionTested, setDevicePermissionTested] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState({ camera: "pending", mic: "pending" });
  const [testingDevices, setTestingDevices] = useState(false);

  if (!isOpen) return null;

  async function handleTestHardware() {
    setTestingDevices(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setDeviceStatus({ camera: "unsupported", mic: "unsupported" });
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: format === "video",
        audio: true,
      });
      const hasVideo = stream.getVideoTracks().length > 0;
      const hasAudio = stream.getAudioTracks().length > 0;
      setDeviceStatus({
        camera: hasVideo ? "ready" : "none",
        mic: hasAudio ? "ready" : "none",
      });
      // Stop temporary preview tracks immediately
      stream.getTracks().forEach((track) => track.stop());
      setDevicePermissionTested(true);
    } catch (err) {
      console.warn("Hardware permission test error:", err);
      setDeviceStatus({ camera: "denied", mic: "denied" });
      setDevicePermissionTested(true);
    } finally {
      setTestingDevices(false);
    }
  }

  function handleProceed() {
    if (!hasAgreed) return;
    onAccept({
      consentGranted: true,
      timestamp: new Date().toISOString(),
    });
  }

  return (
    <div className="interview-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="consent-title">
      <div className="interview-modal-card">
        {/* Header */}
        <div className="interview-modal-header">
          <div className="modal-badge-row">
            <span className="consent-pill">SRS Security & Consent Protocol</span>
            <span className="retention-pill">30-Day Retention Limit</span>
          </div>
          <h2 id="consent-title" className="interview-modal-title">
            AI Interview Recording & Behavioral Analysis Notice
          </h2>
          <p className="interview-modal-subtitle">
            Please review the biometric, privacy, and data processing guidelines before starting your simulated video interview for <strong>{role}</strong>.
          </p>
        </div>

        {/* Content Body */}
        <div className="interview-modal-body">
          <div className="consent-notice-box">
            <h4 className="notice-heading">Local Computer Vision & Privacy Assurance</h4>
            <p className="notice-p">
              All facial detection, head orientation, approximate gaze direction, and posture tracking algorithms run <strong>strictly locally within your browser context</strong>. No raw video frames or continuous video streams are uploaded to or stored on our servers.
            </p>
          </div>

          <div className="consent-notice-box">
            <h4 className="notice-heading">Observable Behavioral Indicators & Scope</h4>
            <p className="notice-p">
              Visual telemetry is aggregated into observable interview metrics (Camera-Facing Engagement, Approximate Gaze Direction, Head Movement, and Posture Stability).
            </p>
            <p className="notice-disclaimer">
              <em>Ethical Limitation:</em> These indicators evaluate visual engagement and presentation during the call. They do <strong>not</strong> measure inner honesty, intelligence, psychological state, or personality.
            </p>
          </div>

          <div className="consent-notice-box">
            <h4 className="notice-heading">Data Retention & Expiry (SRS Section 2.3)</h4>
            <p className="notice-p">
              Interview transcripts, speech metrics, and aggregated presentation scores are encrypted and stored with an automated <strong>30-day retention expiry policy</strong>. Data is permanently purged upon expiration.
            </p>
          </div>

          {/* Quick Hardware Diagnostic */}
          <div className="hardware-check-box">
            <div className="hardware-check-header">
              <span className="hw-label">Hardware Device Verification:</span>
              <button
                type="button"
                className="btn-text-action"
                onClick={handleTestHardware}
                disabled={testingDevices}
              >
                {testingDevices ? "Testing Devices..." : "Test Camera & Microphone"}
              </button>
            </div>
            {devicePermissionTested && (
              <div className="hw-status-row">
                <span className={`hw-indicator hw-indicator--${deviceStatus.camera}`}>
                  Webcam: {deviceStatus.camera === "ready" ? "Operational" : "Permission Required / Inactive"}
                </span>
                <span className={`hw-indicator hw-indicator--${deviceStatus.mic}`}>
                  Microphone: {deviceStatus.mic === "ready" ? "Operational" : "Permission Required / Inactive"}
                </span>
              </div>
            )}
          </div>

          {/* Consent Checkbox */}
          <label className="consent-checkbox-label">
            <input
              type="checkbox"
              checked={hasAgreed}
              onChange={(e) => setHasAgreed(e.target.checked)}
              className="consent-checkbox"
            />
            <span className="consent-text">
              I have read and consent to the real-time browser optical and audio analysis, and acknowledge the 30-day retention limit for my interview session.
            </span>
          </label>
        </div>

        {/* Actions Footer */}
        <div className="interview-modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel & Return
          </button>
          <button
            type="button"
            className="btn-primary btn-proceed-consent"
            onClick={handleProceed}
            disabled={!hasAgreed}
          >
            Agree & Launch Live Studio
          </button>
        </div>
      </div>
    </div>
  );
}
