import { useEffect, useState } from "react";

const cardBase =
  "rounded-[28px] border border-stone-900/10 bg-white/70 p-6 shadow-[0_30px_70px_rgba(80,46,11,0.12)] backdrop-blur-xl";

const primaryButton =
  "inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-700 to-orange-500 px-5 py-4 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(196,102,31,0.28)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0";

const secondaryButton =
  "inline-flex items-center justify-center rounded-2xl border border-stone-900/10 bg-white/80 px-4 py-3 text-sm font-semibold text-stone-900 transition hover:-translate-y-0.5";

const arrowButton =
  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-900/10 bg-white/80 text-xl font-bold text-stone-900 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0";

function formatSeconds(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatSavedDate(value) {
  if (!value) {
    return "Saved test";
  }

  const date = new Date(value);
  return date.toLocaleString();
}

function scorePercent(submission) {
  const total = submission?.test?.totalMarks || 0;
  if (!total) {
    return 0;
  }
  return Math.round((submission.score / total) * 100);
}

export function TestLanding({
  tests,
  submissions,
  loading,
  error,
  candidateName,
  generationPrompt,
  generating,
  generationElapsed,
  generationEstimate,
  onNameChange,
  onPromptChange,
  onGenerate,
  onStart,
  onRefreshDashboard
}) {
  const latestTest = tests[0];
  const [savedTestIndex, setSavedTestIndex] = useState(0);

  useEffect(() => {
    if (tests.length === 0) {
      setSavedTestIndex(0);
      return;
    }

    setSavedTestIndex((current) => Math.min(current, tests.length - 1));
  }, [tests]);

  const currentSavedTest = tests[savedTestIndex] || null;
  const progressRatio = generating ? Math.min(generationElapsed / generationEstimate, 0.92) : 0;
  const progressWidth = `${Math.max(progressRatio * 100, generating ? 6 : 0)}%`;
  const remainingSeconds = Math.max(generationEstimate - generationElapsed, 0);
  const bestScore = submissions.reduce((best, item) => {
    const percent = scorePercent(item);
    return percent > best ? percent : best;
  }, 0);

  return (
    <section className="relative z-10 grid min-h-[calc(100vh-4rem)] grid-cols-1 items-start gap-8 xl:grid-cols-[1.05fr_0.95fr]">
      <div>
        <span className="inline-flex text-xs font-bold uppercase tracking-[0.18em] text-amber-800">
          Modern Gest-Style Exam Platform
        </span>
        <h1 className="mt-3 max-w-5xl font-['Outfit'] text-5xl font-black leading-[0.95] tracking-[-0.06em] text-stone-900 sm:text-6xl lg:text-7xl">
          Generate a topic-wise test from a prompt, then start and solve it like a real exam.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-600">
          Every AI-generated paper is stored in MongoDB, and every submission is saved in your marks dashboard for future comparison.
        </p>

        <div className="mt-8 max-w-xl space-y-6">
          <div className="space-y-2">
            <label htmlFor="candidateName" className="block text-sm font-semibold text-stone-900">
              Candidate name
            </label>
            <input
              id="candidateName"
              value={candidateName}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-3xl border border-stone-900/10 bg-white/80 px-6 py-4 text-stone-900 outline-none ring-0 placeholder:text-stone-400 focus:border-amber-600"
            />
            <button className={secondaryButton} onClick={onRefreshDashboard} type="button">
              Refresh Dashboard
            </button>
          </div>

          <div className="space-y-3">
            <label htmlFor="generationPrompt" className="block text-sm font-semibold text-stone-900">
              Test generation prompt
            </label>
            <textarea
              id="generationPrompt"
              value={generationPrompt}
              onChange={(event) => onPromptChange(event.target.value)}
              placeholder="Prepare a test on president topic with medium difficulty questions"
              rows={5}
              className="min-h-36 w-full resize-y rounded-[28px] border border-stone-900/10 bg-white/80 px-6 py-4 text-stone-900 outline-none placeholder:text-stone-400 focus:border-amber-600"
            />
            <button className={primaryButton} onClick={onGenerate} type="button" disabled={generating}>
              {generating ? "Generating Test..." : "Generate Test With AI"}
            </button>

            {generating && (
              <div className="rounded-[24px] border border-amber-700/10 bg-white/70 p-4">
                <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-stone-700">
                  <span>Preparing your question paper</span>
                  <span>{formatSeconds(remainingSeconds)} left</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-stone-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-700 via-orange-500 to-emerald-700 transition-all duration-1000 ease-linear"
                    style={{ width: progressWidth }}
                  />
                </div>
                <p className="mt-2 text-xs leading-5 text-stone-500">
                  Estimated generation time. The bar completes automatically when the AI finishes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {latestTest && (
          <div className={cardBase}>
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex rounded-full bg-amber-700/10 px-3 py-2 text-xs font-semibold text-amber-800">
                Latest Ready Test
              </span>
              <span className="inline-flex rounded-full bg-emerald-900/10 px-3 py-2 text-xs font-semibold text-emerald-800">
                {latestTest.durationMinutes} min
              </span>
            </div>
            <h2 className="mt-5 font-['Sora'] text-3xl font-bold tracking-[-0.04em] text-stone-900">
              {latestTest.title}
            </h2>
            <p className="mt-3 text-base leading-7 text-stone-600">{latestTest.description}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-stone-900/10 bg-white/70 p-4">
                <strong className="block font-['Sora'] text-3xl text-stone-900">{latestTest.totalQuestions}</strong>
                <span className="text-sm text-stone-500">Questions</span>
              </div>
              <div className="rounded-3xl border border-stone-900/10 bg-white/70 p-4">
                <strong className="block font-['Sora'] text-3xl text-stone-900">{latestTest.totalMarks}</strong>
                <span className="text-sm text-stone-500">Marks</span>
              </div>
              <div className="rounded-3xl border border-stone-900/10 bg-white/70 p-4">
                <strong className="block font-['Sora'] text-3xl text-stone-900">4</strong>
                <span className="text-sm text-stone-500">Options each</span>
              </div>
            </div>
            <button className={`${primaryButton} mt-6`} onClick={() => onStart(latestTest._id)} type="button">
              Start Latest Test
            </button>
          </div>
        )}

        <div className={cardBase}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-['Sora'] text-2xl font-bold tracking-[-0.04em] text-stone-900">Marks Dashboard</h3>
              <p className="mt-1 text-sm text-stone-500">Compare your saved attempts and scores.</p>
            </div>
            <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold text-white">{submissions.length}</span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-stone-900/10 bg-white/70 p-4">
              <strong className="block font-['Sora'] text-3xl text-stone-900">{submissions.length}</strong>
              <span className="text-sm text-stone-500">Attempts</span>
            </div>
            <div className="rounded-3xl border border-stone-900/10 bg-white/70 p-4">
              <strong className="block font-['Sora'] text-3xl text-stone-900">{bestScore}%</strong>
              <span className="text-sm text-stone-500">Best Score</span>
            </div>
            <div className="rounded-3xl border border-stone-900/10 bg-white/70 p-4">
              <strong className="block font-['Sora'] text-3xl text-stone-900">{candidateName?.trim() || "All"}</strong>
              <span className="text-sm text-stone-500">Candidate Filter</span>
            </div>
          </div>

          {!loading && submissions.length === 0 && !error && (
            <p className="mt-4 text-sm leading-6 text-stone-600">
              No saved marks yet. Submit a test and your score history will appear here.
            </p>
          )}

          <div className="mt-5 grid gap-3">
            {submissions.map((submission) => (
              <div
                key={submission._id}
                className="rounded-3xl border border-stone-900/10 bg-white/70 p-4 transition hover:border-amber-700/30"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-stone-900">{submission.test?.title || "Saved Attempt"}</h4>
                    <p className="mt-1 text-sm text-stone-600">{submission.candidateName}</p>
                    <p className="mt-2 text-xs text-stone-500">{formatSavedDate(submission.submittedAt)}</p>
                  </div>
                  <div className="rounded-3xl bg-emerald-900/10 px-4 py-3 text-right">
                    <strong className="block font-['Sora'] text-2xl text-stone-900">
                      {submission.score}/{submission.test?.totalMarks || 0}
                    </strong>
                    <span className="text-xs font-semibold text-emerald-800">{scorePercent(submission)}%</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-600">
                  <span className="rounded-full bg-stone-900/5 px-3 py-1">Correct {submission.summary.correct}</span>
                  <span className="rounded-full bg-stone-900/5 px-3 py-1">Incorrect {submission.summary.incorrect}</span>
                  <span className="rounded-full bg-stone-900/5 px-3 py-1">Skipped {submission.summary.skipped}</span>
                  <span className="rounded-full bg-stone-900/5 px-3 py-1">Review {submission.summary.review}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={cardBase}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-['Sora'] text-2xl font-bold tracking-[-0.04em] text-stone-900">Saved Tests</h3>
              <p className="mt-1 text-sm text-stone-500">One test per screen. Use arrows to browse your saved papers.</p>
            </div>
            <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold text-white">{tests.length}</span>
          </div>

          {loading && <p className="mt-4 text-stone-500">Loading saved tests...</p>}
          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
          {!loading && tests.length === 0 && !error && (
            <p className="mt-4 text-sm leading-6 text-stone-600">
              No saved tests yet. Generate one and it will stay available here for future access.
            </p>
          )}

          {currentSavedTest && (
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <button
                  className={arrowButton}
                  onClick={() => setSavedTestIndex((current) => Math.max(current - 1, 0))}
                  type="button"
                  disabled={savedTestIndex === 0}
                >
                  ?
                </button>
                <span className="text-sm font-medium text-stone-600">
                  Test {savedTestIndex + 1} of {tests.length}
                </span>
                <button
                  className={arrowButton}
                  onClick={() => setSavedTestIndex((current) => Math.min(current + 1, tests.length - 1))}
                  type="button"
                  disabled={savedTestIndex === tests.length - 1}
                >
                  ?
                </button>
              </div>

              <div className="rounded-3xl border border-stone-900/10 bg-white/70 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-amber-700/10 px-3 py-2 text-xs font-semibold text-amber-800">
                    {formatSavedDate(currentSavedTest.createdAt)}
                  </span>
                  <span className="rounded-full bg-emerald-900/10 px-3 py-2 text-xs font-semibold text-emerald-800">
                    {currentSavedTest.durationMinutes} min
                  </span>
                </div>
                <h4 className="mt-4 text-2xl font-semibold text-stone-900">{currentSavedTest.title}</h4>
                <p className="mt-2 text-sm leading-7 text-stone-600">{currentSavedTest.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-stone-600">
                  <span className="rounded-full bg-stone-900/5 px-3 py-1">{currentSavedTest.totalQuestions} questions</span>
                  <span className="rounded-full bg-stone-900/5 px-3 py-1">{currentSavedTest.totalMarks} marks</span>
                  <span className="rounded-full bg-stone-900/5 px-3 py-1">4 options</span>
                </div>
                <button className={`${primaryButton} mt-5`} onClick={() => onStart(currentSavedTest._id)} type="button">
                  Open Test
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
