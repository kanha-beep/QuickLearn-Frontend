import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { TestLanding } from "./components/TestLanding.jsx";
import { TestRunner } from "./components/TestRunner.jsx";
import { ResultsView } from "./components/ResultsView.jsx";
import { api, apiRoutes } from "../../api.js";

const initialState = {
  tests: [],
  submissions: [],
  loading: true,
  error: "",
  candidateName: "",
  generationPrompt:
    "This chapter test is generated automatically from the chapter sections and subsection summaries.",
  generating: false,
  generationElapsed: 0,
  activeTest: null,
  currentIndex: 0,
  answers: {},
  timeLeft: 0,
  submission: null,
  resultFilter: "all",
  chapterName: "",
};

const GENERATION_ESTIMATE_SECONDS = 45;

function buildAnswerState(previous, questionId, nextAnswer) {
  return {
    ...previous,
    [questionId]: {
      ...(previous[questionId] || {}),
      ...nextAnswer,
    },
  };
}

export default function ChapterTestPage() {
  const { subjectId, chapterId, classId } = useParams();
  const location = useLocation();
  const [state, setState] = useState(initialState);
  const stateRef = useRef(state);
  const timerRef = useRef(null);
  const generationTimerRef = useRef(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const loadDashboardData = async (candidateName = "") => {
    const [tests, submissions] = await Promise.all([
      api.get(apiRoutes.chapterTests(subjectId, chapterId)).then((res) => res.data),
      api.get(apiRoutes.chapterTestSubmissions(subjectId, chapterId, candidateName.trim())).then((res) => res.data),
    ]);

    setState((previous) => ({
      ...previous,
      tests,
      submissions,
      loading: false,
    }));
  };

  useEffect(() => {
    const chapterName = location.state?.chapterName || "";
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    setState((previous) => ({
      ...previous,
      chapterName,
      generationPrompt: chapterName
        ? `Prepare a holistic chapter test on ${chapterName} using chapter summaries, subsection summaries, and relevant UPSC prelims PYQ patterns.`
        : previous.generationPrompt,
      candidateName: parsedUser?.email || previous.candidateName,
    }));

    loadDashboardData(parsedUser?.email || "").catch((error) => {
      setState((previous) => ({
        ...previous,
        loading: false,
        error: error.message || "Unable to load chapter tests",
      }));
    });
  }, [subjectId, chapterId, location.state]);

  useEffect(() => {
    if (!state.generating) {
      window.clearInterval(generationTimerRef.current);
      return undefined;
    }

    generationTimerRef.current = window.setInterval(() => {
      setState((previous) => ({
        ...previous,
        generationElapsed: previous.generationElapsed + 1,
      }));
    }, 1000);

    return () => window.clearInterval(generationTimerRef.current);
  }, [state.generating]);

  useEffect(() => {
    if (!state.activeTest || state.submission) {
      window.clearInterval(timerRef.current);
      return undefined;
    }

    timerRef.current = window.setInterval(() => {
      setState((previous) => {
        if (previous.timeLeft <= 1) {
          window.clearInterval(timerRef.current);
          return {
            ...previous,
            timeLeft: 0,
          };
        }

        return {
          ...previous,
          timeLeft: previous.timeLeft - 1,
        };
      });
    }, 1000);

    return () => window.clearInterval(timerRef.current);
  }, [state.activeTest, state.submission]);

  useEffect(() => {
    if (!state.activeTest || state.submission || state.timeLeft !== 0) return;
    submitTest();
  }, [state.activeTest, state.submission, state.timeLeft]);

  useEffect(() => {
    if (!location.state?.autostart) return;
    if (state.loading || state.generating || state.activeTest || state.tests.length > 0) return;

    generateTest();
  }, [location.state, state.loading, state.generating, state.activeTest, state.tests.length]);

  const startTest = async (testId) => {
    try {
      const test = await api.get(apiRoutes.chapterTestById(subjectId, chapterId, testId)).then((res) => res.data);
      setState((previous) => ({
        ...previous,
        activeTest: test,
        currentIndex: 0,
        answers: {},
        timeLeft: test.durationMinutes * 60,
        submission: null,
        resultFilter: "all",
        error: "",
      }));
    } catch (error) {
      setState((previous) => ({
        ...previous,
        error: error.message || "Unable to start test",
      }));
    }
  };

  const generateTest = async () => {
    try {
      setState((previous) => ({
        ...previous,
        generating: true,
        generationElapsed: 0,
        error: "",
      }));

      const createdTest = await api
        .post(apiRoutes.chapterGenerateTest(subjectId, chapterId))
        .then((res) => res.data);
      await loadDashboardData(stateRef.current.candidateName);
      window.clearInterval(generationTimerRef.current);
      setState((previous) => ({
        ...previous,
        generating: false,
        generationElapsed: GENERATION_ESTIMATE_SECONDS,
      }));
      await startTest(createdTest._id);
    } catch (error) {
      window.clearInterval(generationTimerRef.current);
      setState((previous) => ({
        ...previous,
        generating: false,
        generationElapsed: 0,
        error: error?.response?.data?.message || error.message || "Unable to generate test",
      }));
    }
  };

  const selectOption = (questionId, optionKey) => {
    setState((previous) => {
      const existing = previous.answers[questionId];
      const nextStatus =
        existing?.status === "review" || existing?.status === "review_answered"
          ? "review_answered"
          : "answered";

      return {
        ...previous,
        answers: buildAnswerState(previous.answers, questionId, {
          selectedOption: optionKey,
          status: nextStatus,
        }),
      };
    });
  };

  const skipQuestion = (questionId) => {
    setState((previous) => ({
      ...previous,
      answers: buildAnswerState(previous.answers, questionId, {
        selectedOption: null,
        status: "skipped",
      }),
    }));
  };

  const clearResponse = (questionId) => {
    setState((previous) => {
      const existing = previous.answers[questionId];
      const nextStatus =
        existing?.status === "review_answered" || existing?.status === "review"
          ? "review"
          : "skipped";

      return {
        ...previous,
        answers: buildAnswerState(previous.answers, questionId, {
          selectedOption: null,
          status: nextStatus,
        }),
      };
    });
  };

  const markForReview = (questionId) => {
    setState((previous) => {
      const existing = previous.answers[questionId];
      return {
        ...previous,
        answers: buildAnswerState(previous.answers, questionId, {
          selectedOption: existing?.selectedOption || null,
          status: existing?.selectedOption ? "review_answered" : "review",
        }),
      };
    });
  };

  const submitTest = async () => {
    const currentState = stateRef.current;
    if (!currentState.activeTest) return;

    try {
      const payload = {
        candidateName: currentState.candidateName,
        answers: currentState.activeTest.questions.map((question) => {
          const answer = currentState.answers[question._id];
          return {
            questionId: question._id,
            selectedOption: answer?.selectedOption || null,
            status: answer?.status || "skipped",
          };
        }),
      };

      const submissionResponse = await api
        .post(apiRoutes.chapterTestSubmit(subjectId, chapterId, currentState.activeTest._id), payload)
        .then((res) => res.data);
      const submission = await api
        .get(apiRoutes.chapterTestSubmissionById(subjectId, chapterId, submissionResponse.submissionId))
        .then((res) => res.data);
      const submissions = await api
        .get(apiRoutes.chapterTestSubmissions(subjectId, chapterId, currentState.candidateName))
        .then((res) => res.data);

      setState((previous) => ({
        ...previous,
        submission,
        submissions,
        resultFilter: "all",
      }));
    } catch (error) {
      setState((previous) => ({
        ...previous,
        error: error?.response?.data?.message || error.message || "Unable to submit test",
      }));
    }
  };

  const resetToLanding = async () => {
    window.clearInterval(timerRef.current);
    setState((previous) => ({
      ...previous,
      activeTest: null,
      currentIndex: 0,
      answers: {},
      timeLeft: 0,
      submission: null,
      resultFilter: "all",
    }));

    try {
      await loadDashboardData(stateRef.current.candidateName);
    } catch (error) {
      setState((previous) => ({
        ...previous,
        error: error.message || "Unable to refresh chapter tests",
      }));
    }
  };

  return (
    <main className="relative min-h-screen max-w-full overflow-x-hidden overflow-y-hidden bg-[radial-gradient(circle_at_top_left,rgba(196,102,31,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(20,92,82,0.18),transparent_22%),linear-gradient(145deg,#f8f2ea_0%,#efe3d1_100%)] px-4 py-6 text-stone-900 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute right-[-5rem] top-[-7rem] h-80 w-80 rounded-full bg-amber-700/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8rem] left-[-4rem] h-96 w-96 rounded-full bg-emerald-800/15 blur-3xl" />

      {state.error && (
        <div className="fixed right-4 top-4 z-50 rounded-2xl border border-red-700/15 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-lg">
          {state.error}
        </div>
      )}

      {!state.activeTest && (
        <TestLanding
          tests={state.tests}
          submissions={state.submissions}
          loading={state.loading}
          error={state.error}
          candidateName={state.candidateName}
          generationPrompt={state.generationPrompt}
          generating={state.generating}
          generationElapsed={state.generationElapsed}
          generationEstimate={GENERATION_ESTIMATE_SECONDS}
          onNameChange={(candidateName) =>
            setState((previous) => ({
              ...previous,
              candidateName,
            }))
          }
          onPromptChange={(generationPrompt) =>
            setState((previous) => ({
              ...previous,
              generationPrompt,
            }))
          }
          onGenerate={generateTest}
          onStart={startTest}
          onRefreshDashboard={() => loadDashboardData(state.candidateName)}
        />
      )}

      {state.activeTest && !state.submission && (
        <TestRunner
          test={state.activeTest}
          candidateName={state.candidateName}
          currentIndex={state.currentIndex}
          answers={state.answers}
          timeLeft={state.timeLeft}
          onSelectQuestion={(currentIndex) =>
            setState((previous) => ({ ...previous, currentIndex }))
          }
          onSelectOption={selectOption}
          onSkip={skipQuestion}
          onMarkForReview={markForReview}
          onClearResponse={clearResponse}
          onSubmit={submitTest}
        />
      )}

      {state.submission && (
        <ResultsView
          submission={state.submission}
          activeFilter={state.resultFilter}
          onFilterChange={(resultFilter) =>
            setState((previous) => ({ ...previous, resultFilter }))
          }
          onRetake={resetToLanding}
        />
      )}
    </main>
  );
}
