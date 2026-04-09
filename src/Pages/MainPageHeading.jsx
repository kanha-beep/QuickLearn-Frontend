import React from "react";

export function MainPageHeading() {
  return (
    <div className="mb-6 text-center sm:mb-8">
      {/* <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">
        Smart Study Workspace
      </div> */}
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
        Welcome to quickLearn
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
        A focused space to manage classes and keep your learning flow fast,
        clean, and organized.
      </p>
      <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
    </div>
  );
}
