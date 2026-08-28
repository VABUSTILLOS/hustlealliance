"use client";

import { useEffect, useState } from "react";

type QuestionType = "TEXT" | "SELECT" | "MULTI_SELECT";

type Question = {
  id: string;
  question: string;
  type: QuestionType;
  options: string[];
  sortOrder: number;
  isActive: boolean;
  answerCount: number;
};

type WelcomeSettings = {
  title: string;
  message: string;
  sendEmail: boolean;
};

type ResponseSummary = {
  id: string;
  question: string;
  type: QuestionType;
  options: string[];
  totalAnswers: number;
  counts: Record<string, number>;
  recentAnswers: { id: string; answer: string; createdAt: string; user: { name: string; email: string } }[];
};

const emptyForm: { question: string; type: QuestionType; optionsText: string } = {
  question: "",
  type: "TEXT",
  optionsText: "",
};

export default function AdminOnboardingPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [form, setForm] = useState(emptyForm);

  const [welcome, setWelcome] = useState<WelcomeSettings>({ title: "", message: "", sendEmail: false });
  const [loadingWelcome, setLoadingWelcome] = useState(true);
  const [welcomeSaving, setWelcomeSaving] = useState(false);

  const [responses, setResponses] = useState<ResponseSummary[]>([]);
  const [loadingResponses, setLoadingResponses] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const loadQuestions = () => {
    setLoadingQuestions(true);
    fetch("/api/admin/onboarding/questions")
      .then((r) => r.json())
      .then((data) => setQuestions(data.questions || []))
      .finally(() => setLoadingQuestions(false));
  };

  const loadWelcome = () => {
    setLoadingWelcome(true);
    fetch("/api/admin/onboarding/welcome")
      .then((r) => r.json())
      .then((data) => setWelcome(data))
      .finally(() => setLoadingWelcome(false));
  };

  const loadResponses = () => {
    setLoadingResponses(true);
    fetch("/api/admin/onboarding/responses")
      .then((r) => r.json())
      .then((data) => setResponses(data.responses || []))
      .finally(() => setLoadingResponses(false));
  };

  useEffect(() => {
    loadQuestions();
    loadWelcome();
    loadResponses();
  }, []);

  async function addQuestion() {
    if (!form.question.trim()) return;
    const options = form.optionsText
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
    await fetch("/api/admin/onboarding/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: form.question, type: form.type, options }),
    });
    setForm(emptyForm);
    loadQuestions();
  }

  async function toggleActive(q: Question) {
    await fetch(`/api/admin/onboarding/questions/${q.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !q.isActive }),
    });
    loadQuestions();
  }

  async function deleteQuestion(id: string) {
    if (!confirm("Delete this question? Existing answers will also be deleted.")) return;
    await fetch(`/api/admin/onboarding/questions/${id}`, { method: "DELETE" });
    loadQuestions();
  }

  async function editQuestionText(q: Question) {
    const next = prompt("Edit question text", q.question);
    if (next == null || next.trim() === "" || next === q.question) return;
    await fetch(`/api/admin/onboarding/questions/${q.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: next }),
    });
    loadQuestions();
  }

  async function move(index: number, direction: -1 | 1) {
    const next = [...questions];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setQuestions(next);
    await fetch("/api/admin/onboarding/questions/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: next.map((q) => q.id) }),
    });
    loadQuestions();
  }

  async function saveWelcome() {
    setWelcomeSaving(true);
    try {
      await fetch("/api/admin/onboarding/welcome", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(welcome),
      });
    } finally {
      setWelcomeSaving(false);
    }
  }

  const typeColors: Record<QuestionType, string> = {
    TEXT: "bg-blue-500/20 text-blue-400",
    SELECT: "bg-yellow-500/20 text-yellow-400",
    MULTI_SELECT: "bg-green-500/20 text-green-400",
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl space-y-10">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Onboarding</h1>
        <p className="text-muted text-sm">
          Manage onboarding questions, the welcome message, and review member responses.
        </p>
      </div>

      {/* Questions */}
      <section>
        <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Questions</h2>

        <div className="bg-surface border border-surface-light rounded-2xl p-4 mb-6 space-y-4">
          <h3 className="text-sm font-medium text-foreground">Add a new question</h3>
          <input
            placeholder="Question text"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            className="w-full bg-surface-light border border-surface-light rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
          />
          <div className="grid grid-cols-2 gap-4">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as QuestionType })}
              className="bg-surface-light border border-surface-light rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
            >
              <option value="TEXT">Text</option>
              <option value="SELECT">Single select</option>
              <option value="MULTI_SELECT">Multi select</option>
            </select>
            <input
              placeholder="Options (comma-separated, for select types)"
              value={form.optionsText}
              onChange={(e) => setForm({ ...form, optionsText: e.target.value })}
              disabled={form.type === "TEXT"}
              className="bg-surface-light border border-surface-light rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent disabled:opacity-50"
            />
          </div>
          <button
            onClick={addQuestion}
            className="px-4 py-2 bg-accent rounded-xl text-sm text-white font-medium hover:opacity-90 transition"
          >
            + Add question
          </button>
        </div>

        {loadingQuestions ? (
          <p className="text-muted text-sm">Loading…</p>
        ) : questions.length === 0 ? (
          <p className="text-muted text-sm">No questions yet.</p>
        ) : (
          <div className="bg-surface border border-surface-light rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-light text-left text-muted">
                  <th className="p-4">Question</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Answers</th>
                  <th className="p-4">Active</th>
                  <th className="p-4">Order</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, i) => (
                  <tr key={q.id} className="border-b border-surface-light last:border-0">
                    <td className="p-4 text-foreground">{q.question}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${typeColors[q.type]}`}>
                        {q.type}
                      </span>
                    </td>
                    <td className="p-4 text-foreground">{q.answerCount}</td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleActive(q)}
                        className={`px-2 py-1 rounded-lg text-xs font-medium transition ${
                          q.isActive ? "bg-green-500/20 text-green-400" : "bg-surface-light text-muted"
                        }`}
                      >
                        {q.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button
                          onClick={() => move(i, -1)}
                          disabled={i === 0}
                          className="px-2 py-1 bg-surface-light rounded-lg text-xs text-foreground disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => move(i, 1)}
                          disabled={i === questions.length - 1}
                          className="px-2 py-1 bg-surface-light rounded-lg text-xs text-foreground disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => editQuestionText(q)}
                          className="text-muted hover:text-foreground text-xs transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteQuestion(q.id)}
                          className="text-muted hover:text-red-400 text-xs transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Welcome message */}
      <section>
        <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Welcome message</h2>
        {loadingWelcome ? (
          <p className="text-muted text-sm">Loading…</p>
        ) : (
          <div className="bg-surface border border-surface-light rounded-2xl p-4 space-y-4">
            <input
              placeholder="Title"
              value={welcome.title}
              onChange={(e) => setWelcome({ ...welcome, title: e.target.value })}
              className="w-full bg-surface-light border border-surface-light rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
            />
            <textarea
              placeholder="Message"
              value={welcome.message}
              onChange={(e) => setWelcome({ ...welcome, message: e.target.value })}
              rows={4}
              className="w-full bg-surface-light border border-surface-light rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
            />
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={welcome.sendEmail}
                onChange={(e) => setWelcome({ ...welcome, sendEmail: e.target.checked })}
                className="accent-accent"
              />
              Also send a welcome email
            </label>
            <button
              onClick={saveWelcome}
              disabled={welcomeSaving}
              className="px-4 py-2 bg-accent rounded-xl text-sm text-white font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {welcomeSaving ? "Saving…" : "Save welcome message"}
            </button>
          </div>
        )}
      </section>

      {/* Responses */}
      <section>
        <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Responses</h2>
        {loadingResponses ? (
          <p className="text-muted text-sm">Loading…</p>
        ) : responses.length === 0 ? (
          <p className="text-muted text-sm">No responses yet.</p>
        ) : (
          <div className="space-y-4">
            {responses.map((r) => (
              <div key={r.id} className="bg-surface border border-surface-light rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-foreground">{r.question}</h3>
                  <span className="text-xs text-muted">{r.totalAnswers} answers</span>
                </div>

                {r.type !== "TEXT" && Object.keys(r.counts).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {Object.entries(r.counts).map(([option, count]) => (
                      <span
                        key={option}
                        className="px-2 py-1 bg-surface-light rounded-lg text-xs text-foreground"
                      >
                        {option}: {count}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setExpanded({ ...expanded, [r.id]: !expanded[r.id] })}
                  className="text-accent text-xs hover:opacity-80 transition"
                >
                  {expanded[r.id] ? "Hide recent answers" : "Show recent answers"}
                </button>

                {expanded[r.id] && (
                  <ul className="mt-3 space-y-2">
                    {r.recentAnswers.map((a) => (
                      <li key={a.id} className="text-xs text-muted border-t border-surface-light pt-2">
                        <span className="text-foreground">{a.user?.name ?? "Unknown"}</span>: {a.answer}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
