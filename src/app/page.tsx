"use client";

import { useEffect, useRef, useState } from "react";

const documents = [
  {
    id: 1,
    name: "10월 캠페인 성과.xlsx",
    type: "XLSX",
    color: "bg-emerald-50 text-emerald-700",
    description: "캠페인별 광고비, 클릭 수, 전환율",
  },
  {
    id: 2,
    name: "마케팅 주간 회의록.docx",
    type: "DOCX",
    color: "bg-blue-50 text-blue-700",
    description: "주요 결정 사항과 후속 업무",
  },
  {
    id: 3,
    name: "광고 운영 결과 보고서.pdf",
    type: "PDF",
    color: "bg-rose-50 text-rose-700",
    description: "광고 운영 결과 및 개선 방향",
  },
];

const questions = [
  {
    label: "성과가 가장 좋았던 캠페인은?",
    answer:
      "10월 캠페인 중에서는 가을 신제품 캠페인의 전환율이 가장 높았습니다. 아래 수치는 데모용 예시 데이터입니다.",
    source: "10월 캠페인 성과.xlsx",
    detail: "가을 신제품 캠페인 · 전환율 4.8%",
    note: "비교 기간: 2026년 10월 1일~15일",
  },
  {
    label: "지난 회의에서 정한 할 일은?",
    answer:
      "지난 회의에서는 광고 소재 A/B 테스트 진행, 성과 보고서 업데이트, 다음 주 캠페인 예산 검토를 주요 할 일로 정했습니다.",
    source: "마케팅 주간 회의록.docx",
    detail: "담당자별 할 일 및 후속 조치",
    note: "회의록을 바탕으로 구성한 데모 답변입니다.",
  },
  {
    label: "광고 성과 개선 방향은?",
    answer:
      "전환율이 높은 소재를 중심으로 예산 배분을 검토하고, 성과가 낮은 소재는 타깃과 메시지를 재점검하는 방향을 제안합니다.",
    source: "광고 운영 결과 보고서.pdf",
    detail: "소재별 성과 분석 및 개선 제안",
    note: "실제 보고서 분석 결과가 아닌 데모용 예시입니다.",
  },
];

export default function Home() {
  const [demoFocused, setDemoFocused] = useState(false);
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(
    null
  );
  const [email, setEmail] = useState("");
  const [job, setJob] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const demoRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const activeQuestion =
    selectedQuestion === null ? null : questions[selectedQuestion];

  useEffect(() => {
    const target = demoRef.current;
    if (!target || demoCompleted) {
      setDemoFocused(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 체험 섹션이 화면 중앙에 들어왔을 때 주변 콘텐츠를 흐리게 합니다.
        setDemoFocused(entry.isIntersecting && entry.intersectionRatio > 0.25);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-8% 0px -8% 0px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [demoCompleted]);

  function startDemo() {
    setSelectedQuestion(null);
    setDemoCompleted(false);
    demoRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function finishDemo() {
    setDemoCompleted(true);
    setDemoFocused(false);
    window.setTimeout(() => {
      contactRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // 현재는 화면 동작 확인용입니다.
    // 실제 연락처 저장은 데이터베이스 연동 후 가능합니다.
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-white text-slate-900">
      <div className={`transition-[filter,opacity] duration-500 ${demoFocused ? "pointer-events-none select-none blur-sm opacity-45" : "blur-0 opacity-100"}`}>
      {/* 고정 상단 헤더 */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
          <a href="#" className="flex shrink-0 items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
              D
            </div>
            <span className="text-lg font-bold tracking-tight">
              자료캐치
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-sm text-slate-500 md:flex">
            <a href="#problem" className="transition hover:text-indigo-600">
              문제 발견
            </a>
            <a href="#solution" className="transition hover:text-indigo-600">
              해결 방법
            </a>
            <a href="#contact" className="transition hover:text-indigo-600">
              의견 남기기
            </a>
          </nav>

          <button
            onClick={startDemo}
            className="shrink-0 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:px-5"
          >
            체험하기 →
          </button>
        </div>
      </header>

      {/* 메인 소개 */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-100/70 blur-3xl sm:h-96 sm:w-96" />
        <div className="pointer-events-none absolute -bottom-20 -left-24 h-72 w-72 rounded-full bg-violet-100/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-semibold text-indigo-700 shadow-sm sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              직장인을 위한 업무 자료 탐색 체험
            </div>

            <h1 className="text-4xl font-bold leading-[1.2] tracking-tight sm:text-5xl lg:text-[58px]">
              자료 찾다가,
              <br />
              오늘 할 일은
              <br />
              <span className="text-indigo-600">언제 하세요?</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-slate-500 sm:mt-7 sm:text-lg">
              엑셀을 열고, 문서를 뒤지고, 지난 기록을 다시 확인하는 시간.
              흩어진 업무 자료 속에서 필요한 정보를 찾는 과정을 직접
              경험해 보세요.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={startDemo}
                className="rounded-xl bg-indigo-600 px-7 py-4 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                내 업무 시간 되찾기 →
              </button>

              <a
                href="#problem"
                className="rounded-xl border border-slate-200 bg-white px-7 py-4 text-center font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50"
              >
                어떤 문제를 해결하나요?
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
              <span>✓ 별도 파일 업로드 없이 체험</span>
              <span>✓ 약 1분 소요</span>
              <span>✓ 예시 자료 사용</span>
            </div>
          </div>

          {/* 미리보기 */}
          <div className="relative min-w-0">
            <div className="absolute -inset-3 rounded-[32px] bg-gradient-to-br from-indigo-100 to-violet-100 opacity-70 blur-xl sm:-inset-4" />

            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-indigo-100/60">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs text-slate-400">내 업무 자료</span>
              </div>

              <div className="p-4 sm:p-7">
                <div className="mb-5 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-slate-400">
                      WORKSPACE / MARKETING
                    </p>
                    <h3 className="mt-1 text-lg font-bold">자료 보관함</h3>
                  </div>
                  <span className="shrink-0 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-600">
                    자료 3개
                  </span>
                </div>

                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-indigo-200 hover:bg-indigo-50/30"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[9px] font-bold sm:h-11 sm:w-11 sm:text-[10px] ${doc.color}`}
                      >
                        {doc.type}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {doc.name}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-400">
                          {doc.description}
                        </p>
                      </div>
                      <span className="shrink-0 text-slate-300">↗</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
                    <span>✳</span>
                    자료에 대해 질문하기
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    &ldquo;이번 달 성과가 가장 좋았던 캠페인은
                    무엇이었지?&rdquo;
                  </p>
                  <button
                    onClick={startDemo}
                    className="mt-4 flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 text-left text-xs text-slate-400 ring-1 ring-slate-200 transition hover:ring-indigo-300"
                  >
                    질문을 선택해 체험해 보세요
                    <span className="rounded-lg bg-indigo-600 px-3 py-2 text-white">
                      체험 →
                    </span>
                  </button>
                </div>

                <p className="mt-4 text-center text-[10px] text-slate-400">
                  이해를 돕기 위한 예시 화면입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 문제 제시 */}
      <section id="problem" className="scroll-mt-20 bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold text-indigo-600">SOUND FAMILIAR?</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              분명 어딘가에 있는데,
              <br />
              찾는 데 시간이 더 걸립니다.
            </h2>
            <p className="mt-5 leading-7 text-slate-500">
              자료가 없어서가 아니라, 필요한 자료를 찾고 연결하는 과정이
              번거로운 건 아닐까요?
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "파일을 하나씩 열어보기",
                description:
                  "엑셀, 회의록, 보고서. 어디에 답이 있는지 몰라 파일을 하나씩 확인합니다.",
                tag: "자료 탐색",
              },
              {
                number: "02",
                title: "같은 내용을 다시 확인하기",
                description:
                  "이전에 정리했던 정보도 필요할 때마다 다시 찾고, 또 검토합니다.",
                tag: "반복 작업",
              },
              {
                number: "03",
                title: "찾은 정보를 다시 정리하기",
                description:
                  "자료에서 내용을 찾은 뒤에도 보고하거나 공유할 형태로 다시 정리해야 합니다.",
                tag: "업무 연결",
              },
            ].map((item) => (
              <article
                key={item.number}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-indigo-100">
                    {item.number}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                    {item.tag}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-8 text-center text-sm font-medium text-slate-600">
            필요한 건 더 많은 파일이 아니라, 필요한 정보를 찾는 더 나은 방법.
          </p>
        </div>
      </section>

      {/* 해결 방법 */}
      <section id="solution" className="scroll-mt-20 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="text-sm font-bold text-indigo-600">
              FROM SEARCH TO ACTION
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              자료를 찾는 일에서
              <br />
              업무를 진행하는 일로.
            </h2>
            <p className="mt-5 leading-8 text-slate-500">
              흩어진 자료를 다시 확인하는 대신, 필요한 정보를 질문하고
              관련된 자료를 확인하는 과정을 체험해 보세요.
            </p>

            <div className="mt-8 space-y-5">
              {[
                {
                  title: "찾고 싶은 내용을 질문하세요",
                  desc: "어떤 정보가 필요한지 구체적으로 정리합니다.",
                },
                {
                  title: "관련 자료와 답변을 확인하세요",
                  desc: "답변과 함께 참고 자료를 확인하는 경험을 제공합니다.",
                },
                {
                  title: "결과를 다음 업무에 활용하세요",
                  desc: "찾은 정보를 보고, 검토, 후속 업무에 활용할 수 있습니다.",
                },
              ].map((item, index) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={startDemo}
              className="mt-8 w-full rounded-xl bg-indigo-600 px-6 py-4 font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
            >
              직접 경험해 보기 →
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg text-white">
                  ✳
                </div>
                <div>
                  <p className="font-bold">자료 탐색 예시</p>
                  <p className="mt-1 text-xs text-slate-400">
                    업무 자료를 바탕으로 질문하기
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">내 질문</p>
                <p className="mt-2 text-sm font-medium leading-6">
                  &ldquo;지난 회의에서 정한 후속 조치가 뭐였지?&rdquo;
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                <p className="text-xs font-semibold text-indigo-600">
                  답변 예시
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  회의록에서 정리된 할 일을 확인하고, 담당자와 후속 조치를
                  다시 살펴볼 수 있습니다.
                </p>
                <div className="mt-4 rounded-lg bg-white p-3 text-xs text-slate-500">
                  ▤ 마케팅 주간 회의록.docx
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-400">
                실제 제품 연동이 아닌 UI 예시입니다. 답변과 자료는 데모용으로
                구성했습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      </div>

      {/* 스크롤 기반 체험 영역: 모달 없이 페이지 안에서 진행 */}
      <section
        id="demo"
        ref={demoRef}
        className={`relative scroll-mt-20 ${demoCompleted ? "" : "min-h-[125vh]"}`}
        aria-labelledby="demo-title"
      >
        <div className="sticky top-16 flex min-h-[calc(100dvh-4rem)] items-center py-5 sm:top-16 sm:py-8">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-8">
            <div className={`overflow-hidden rounded-2xl border bg-white shadow-2xl transition-all duration-500 sm:rounded-3xl ${demoFocused ? "relative z-20 border-indigo-200 shadow-indigo-200/50 ring-4 ring-indigo-100/70" : "border-slate-200 shadow-slate-200/50"}`}>
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-7 sm:py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">D</div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold sm:text-base">자료 탐색 워크스페이스</p>
                    <p className="mt-0.5 text-xs text-slate-400">가상의 마케팅팀 업무 공간</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">DEMO MODE</span>
              </div>

              <div className="p-4 sm:p-7">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold tracking-wide text-indigo-600">STEP 01 · ASK</p>
                    <h2 id="demo-title" className="mt-2 text-xl font-bold sm:text-2xl">어떤 정보가 필요하세요?</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">질문을 선택하면 관련 답변과 참고 자료를 확인할 수 있어요.</p>
                  </div>
                  <span className="text-xs text-slate-400">예시 자료 3개</span>
                </div>

                <div className="mb-5 grid gap-2 sm:grid-cols-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[9px] font-bold ${doc.color}`}>{doc.type}</span>
                      <span className="min-w-0 truncate text-xs font-medium text-slate-600">{doc.name}</span>
                    </div>
                  ))}
                </div>

                <div className="grid gap-2 md:grid-cols-3">
                  {questions.map((question, index) => (
                    <button
                      key={question.label}
                      type="button"
                      onClick={() => setSelectedQuestion(index)}
                      className={`flex min-h-16 items-center justify-between gap-3 rounded-xl border p-3 text-left text-sm transition sm:p-4 ${selectedQuestion === index ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100" : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40"}`}
                    >
                      <span className="font-medium">{question.label}</span><span className="shrink-0 text-lg">→</span>
                    </button>
                  ))}
                </div>

                {activeQuestion ? (
                  <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-bold text-indigo-700">STEP 02 · RESULT</p>
                      <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-500">데모 답변</span>
                    </div>
                    <h3 className="mt-3 font-bold">{activeQuestion.label}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{activeQuestion.answer}</p>
                    <div className="mt-3 rounded-xl border border-indigo-100 bg-white p-3 sm:p-4">
                      <p className="text-xs font-semibold text-slate-400">참고 자료</p>
                      <p className="mt-2 break-words text-sm font-semibold text-indigo-700">▤ {activeQuestion.source}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{activeQuestion.detail}</p>
                      <p className="mt-2 border-t border-slate-100 pt-2 text-xs leading-5 text-slate-400">{activeQuestion.note}</p>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-slate-500">미리 작성한 데모 콘텐츠입니다. 실제 파일 분석이나 AI 생성 결과는 아닙니다.</p>
                  </div>
                ) : (
                  <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">위 질문 중 하나를 선택해 답변과 참고 자료를 확인해 보세요.</p>
                )}

                <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-slate-400">{demoFocused ? "체험 영역에 집중할 수 있도록 주변 화면을 흐리게 표시하고 있어요." : "스크롤을 내려 체험을 시작해 보세요."}</p>
                  <button
                    type="button"
                    onClick={finishDemo}
                    disabled={selectedQuestion === null}
                    className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 sm:w-auto"
                  >체험 완료하고 의견 남기기 →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 연락처 입력 */}
      <section
        id="contact"
        ref={contactRef}
        className={`scroll-mt-20 bg-indigo-50/50 py-16 transition-[filter,opacity] duration-500 sm:py-24 ${demoFocused ? "pointer-events-none select-none blur-sm opacity-45" : "blur-0 opacity-100"}`}
      >
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="text-sm font-bold text-indigo-600">
              WHAT ABOUT YOUR WORK?
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              당신의 업무에서는
              <br />
              어떤 자료를 찾고 있나요?
            </h2>
            <p className="mt-5 max-w-lg leading-8 text-slate-500">
              자료를 찾는 데 얼마나 많은 시간이 필요한지, 어떤 업무에서
              불편함을 느끼는지 알려주세요. 더 나은 업무 경험을 설계하는 데
              활용하겠습니다.
            </p>

            <div className="mt-7 space-y-4 text-sm text-slate-600 sm:mt-8">
              <p className="flex items-start gap-3">
                <span className="font-bold text-indigo-600">01</span>
                현재 업무에서 겪는 불편함을 파악합니다.
              </p>
              <p className="flex items-start gap-3">
                <span className="font-bold text-indigo-600">02</span>
                어떤 해결 방법이 실제로 필요한지 알아봅니다.
              </p>
              <p className="flex items-start gap-3">
                <span className="font-bold text-indigo-600">03</span>
                향후 체험 및 사용자 인터뷰 기회를 안내할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-indigo-100/50 sm:p-9">
            {submitted ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600">
                  ✓
                </div>
                <h3 className="mt-5 text-xl font-bold">입력이 완료됐어요!</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  현재는 화면 동작만 구현된 상태입니다. 입력 내용은 서버에
                  저장되지 않았습니다.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold">체험 및 인터뷰 소식 받기</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  아래 정보를 입력해 주세요.
                </p>

                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold"
                    >
                      이메일
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="work@example.com"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-base outline-none transition placeholder:text-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="job"
                      className="mb-2 block text-sm font-semibold"
                    >
                      현재 담당하는 업무
                    </label>
                    <select
                      id="job"
                      required
                      value={job}
                      onChange={(e) => setJob(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    >
                      <option value="" disabled>
                        업무를 선택해 주세요
                      </option>
                      <option value="기획">기획 / 전략</option>
                      <option value="마케팅">마케팅</option>
                      <option value="경영회계">경영 / 회계</option>
                      <option value="영업">영업 / 세일즈</option>
                      <option value="인사총무">인사 / 총무</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>

                  <label className="flex items-start gap-3 text-xs leading-5 text-slate-500">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 accent-indigo-600"
                    />
                    <span>
                      수요 검증 및 안내를 위한 개인정보 수집·이용에 동의합니다.
                      실제 운영 전에는 수집 목적, 항목, 보유 기간 등을 명시한
                      개인정보 처리 안내를 제공해야 합니다.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-indigo-600 px-5 py-4 font-semibold text-white transition hover:bg-indigo-700"
                  >
                    체험 소식 받기 →
                  </button>

                  <p className="text-center text-xs leading-5 text-slate-400">
                    현재는 프로토타입입니다. 제출 정보를 저장하거나 이메일을
                    발송하지 않습니다.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 하단 */}
      <footer className={`border-t border-slate-100 bg-white transition-[filter,opacity] duration-500 ${demoFocused ? "pointer-events-none select-none blur-sm opacity-45" : "blur-0 opacity-100"}`}>
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              D
            </div>
            <span className="font-bold">자료캐치</span>
          </div>

          <p className="text-xs leading-6 text-slate-400">
            더 나은 업무 자료 탐색 경험을 위한 수요 검증 프로젝트
          </p>

          <p className="text-xs text-slate-400">© 2026 DATA CATCH</p>
        </div>
      </footer>

    </main>
  );
}