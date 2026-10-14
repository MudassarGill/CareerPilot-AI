import { useState } from "react";

const faqData = [
  {
    id: 1,
    question: "What is CareerPilot AI and how does it accelerate my career journey?",
    answer:
      "CareerPilot AI is an end-to-end intelligent career navigation ecosystem. It combines an ATS resume scanner, dynamic skills roadmap generator, realistic voice/video mock interview simulator, and Career Twin projection model to guide you step-by-step from student/job seeker to dream offer.",
  },
  {
    id: 2,
    question: "How does the ATS Resume Analyzer score my resume?",
    answer:
      "Our ATS engine evaluates your resume against modern Applicant Tracking System standards. It checks keyword relevance against target job descriptions, formatting compliance, action verbs, quantified achievements, and skill coverage, providing an actionable score from 0 to 100 with line-by-line recommendations.",
  },
  {
    id: 3,
    question: "What is the Career Readiness Score (CRS)?",
    answer:
      "The Career Readiness Score (CRS) is our proprietary benchmark that measures how job-ready you are. It synthesizes five pillars: Resume Quality (20%), ATS Keyword Match (25%), Skill Gap Coverage (25%), Mock Interview Performance (20%), and Continuous Learning (10%).",
  },
  {
    id: 4,
    question: "How does the AI Mock Interview system work?",
    answer:
      "The Mock Interview module generates tailored technical, behavioral, and situational questions according to your selected role and experience level. You can practice with text, audio, or video responses, receiving instant feedback on clarity, technical accuracy, and pacing.",
  },
  {
    id: 5,
    question: "What is the Career Twin simulator?",
    answer:
      "Career Twin creates a simulated digital persona of your career trajectory. By tweaking parameters—such as acquiring new certifications, changing industries, or relocating—it projects your expected salary ranges, job opportunities, and promotion timeline over the next 1 to 5 years.",
  },
  {
    id: 6,
    question: "Is my personal data and resume information kept safe?",
    answer:
      "Yes, absolutely. We prioritize strict enterprise-grade privacy and data protection. Your uploaded resumes, interview recordings, and assessment data are encrypted in transit and at rest, and are never sold or shared with unauthorized third-party advertisers.",
  },
];

function FAQSection() {
  const [openId, setOpenId] = useState(1); // First item open by default

  function toggleFAQ(id) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <section className="faq-section">
      <div className="faq-section__header">
        <span className="section-pill">Help & Support</span>
        <h2 className="faq-section__title">
          Frequently Asked <span className="brand-orange">Questions</span>
        </h2>
        <p className="faq-section__subtitle">
          Got questions about our career tools, ATS analysis, or interview coaching? Here are the answers.
        </p>
      </div>

      <div className="faq-accordion">
        {faqData.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={`faq-card ${isOpen ? "faq-card--open" : ""}`}
              onClick={() => toggleFAQ(item.id)}
            >
              <button
                type="button"
                className="faq-card__trigger"
                aria-expanded={isOpen}
              >
                <span className="faq-card__question">{item.question}</span>
                <span className="faq-card__icon-wrap">
                  <svg
                    className={`faq-card__arrow ${isOpen ? "faq-card__arrow--open" : ""}`}
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div className="faq-card__content">
                  <p className="faq-card__answer">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FAQSection;
