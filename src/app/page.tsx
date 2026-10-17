"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type DemoStep = "upload" | "search" | "detail" | "question" | "answer";

const demoResults = [
  {
    id: 1,
    title: "회사 소개서.pdf",
    type: "PDF 자료",
    location: "p.3",
    description: "다양한 산업군의 주요 도입 사례",
    content:
      "다양한 산업군의 고객사가 서비스를 도입하여 업무 처리 시간을 단축했습니다. 도입 이후 반복 업무를 줄이고 필요한 정보를 빠르게 확인할 수 있었습니다.",
  },
  {
    id: 2,
    title: "마케팅 운영 가이드.pdf",
    type: "PDF 자료",
    location: "p.7",
    description: "고객사 도입 사례 및 운영 가이드",
    content:
      "도입 초기에는 담당자 교육과 단계별 운영 가이드를 함께 제공하는 것이 중요합니다. 운영 과정에서 확인된 고객 의견을 수집해 개선 사항을 반영합니다.",
  },
  {
    id: 3,
    title: "ABC파트너스 미팅",
    type: "회의록",
    location: "2026.10.12",
    description: "파트너사 미팅 및 온보딩 논의",
    content:
      "파트너사와 서비스 도입 사례를 공유했습니다. 초기 온보딩 과정과 담당자 교육을 구체화하고, 운영 단계별 안내 자료를 제공하기로 했습니다.",
  },
];

const jobCategories = [
  "대학생",
  "직장인",
  "창업가·프리랜서",
  "취업 준비생",
  "기타",
];

export default function Home() {
  // 체험 상태
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [demoStep, setDemoStep] = useState<DemoStep>("upload");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("도입 사례");
  const [selectedResult, setSelectedResult] = useState(demoResults[0]);
  const [aiQuestion, setAiQuestion] = useState(
    "주요 도입 사례와 효과를 정리해 줘."
  );
  const [aiLoading, setAiLoading] = useState(false);

  // 소식 신청 상태
  const [email, setEmail] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // 파일 업로드 애니메이션
  useEffect(() => {
    if (!isDemoOpen || demoStep !== "upload") return;

    setUploadProgress(0);

    const interval = window.setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 5, 100));
    }, 100);

    const nextStepTimer = window.setTimeout(() => {
      setUploadProgress(100);

      window.setTimeout(() => {
        setDemoStep("search");
      }, 450);
    }, 2100);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(nextStepTimer);
    };
  }, [isDemoOpen, demoStep]);

  // 체험 시작
  const openDemo = () => {
    setDemoStep("upload");
    setUploadProgress(0);
    setSearchQuery("도입 사례");
    setSelectedResult(demoResults[0]);
    setAiQuestion("주요 도입 사례와 효과를 정리해 줘.");
    setAiLoading(false);
    setIsDemoOpen(true);
  };

  // 체험 종료
  const closeDemo = () => {
    setIsDemoOpen(false);
    setAiLoading(false);
  };

  // 자료 검색
  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();

    const result =
      demoResults.find(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query)
      ) ?? demoResults[0];

    setSelectedResult(result);
    setDemoStep("detail");
  };

  // AI 질문
  const handleAskAI = () => {
    if (!aiQuestion.trim()) return;

    setAiLoading(true);

    window.setTimeout(() => {
      setAiLoading(false);
      setDemoStep("answer");
    }, 1200);
  };

  // 소식 신청 폼으로 이동
  const goToSignup = () => {
    closeDemo();

    window.setTimeout(() => {
      document.getElementById("signup")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  };

  // 소식 신청
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage("");
    setFormSuccess(false);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setFormMessage("이메일 주소를 입력해 주세요.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setFormMessage("올바른 이메일 주소를 입력해 주세요.");
      return;
    }

    if (!jobCategory) {
      setFormMessage("현재 상황을 선택해 주세요.");
      return;
    }

    if (!privacyConsent) {
      setFormMessage("개인정보 수집 및 이용에 동의해 주세요.");
      return;
    }

    setFormLoading(true);

    try {
      const { error } = await supabase
        .from("experience_signups")
        .insert([
          {
            email: trimmedEmail,
            job_category: jobCategory,
            privacy_consent: privacyConsent,
          },
        ]);

      if (error) {
        if (error.code === "23505") {
          setFormMessage("이미 소식을 신청한 이메일이에요!");
        } else {
          setFormMessage(
            "신청 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요."
          );
        }
        return;
      }

      setFormSuccess(true);
      setFormMessage("신청이 완료됐어요! 새로운 소식이 생기면 알려드릴게요.");
      setEmail("");
      setJobCategory("");
      setPrivacyConsent(false);
    } catch {
      setFormMessage(
        "신청 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FAF9F6] text-[#20201F]">
      {/* 첫 화면 */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 py-24 text-center">
        {/* 상단 로고 */}
        <div className="absolute left-6 top-7 flex items-center gap-2 md:left-12 md:top-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#292927] text-sm font-bold text-white">
            G
          </div>
          <span className="text-lg font-bold tracking-tight">Gather</span>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#E7E4DD] bg-white/80 px-4 py-2 text-sm text-[#68665F]">
            <span className="h-2 w-2 rounded-full bg-[#8B9B78]" />
            흩어진 업무 정보를 한곳에서
          </div>

          <h1 className="text-[38px] font-extrabold leading-[1.3] tracking-[-0.055em] sm:text-5xl md:text-6xl lg:text-[68px]">
            분명 어디서 봤는데,
            <br />
            어디 있는지 모르겠는 그 정보.
          </h1>

          <p className="mx-auto mt-7 max-w-lg text-base leading-7 text-[#77746E] sm:text-lg sm:leading-8">
            Gather는 업무 자료를 검색하고,
            <br className="sm:hidden" /> AI에게 질문해 필요한 답을 찾도록 도와줘요.
          </p>

          <button
            type="button"
            onClick={openDemo}
            className="group mt-10 inline-flex min-h-[58px] items-center justify-center gap-3 rounded-2xl bg-[#292927] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#41413D] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#292927]/15"
          >
            직접 체험해 보기
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>

          <p className="mt-4 text-xs text-[#A09D95]">
            별도의 가입 없이 체험할 수 있어요.
          </p>
        </div>

        {/* 아래쪽 안내 */}
        <div className="absolute bottom-7 flex flex-col items-center gap-2 text-xs text-[#A09D95]">
          <span>검색부터 AI 답변까지</span>
          <span className="animate-bounce text-base">↓</span>
        </div>
      </section>

      {/* 간단한 서비스 소개 */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#ECE9E2] bg-white p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F1EB] text-lg">
              ↑
            </div>
            <h2 className="font-bold">자료 모으기</h2>
            <p className="mt-2 text-sm leading-6 text-[#858179]">
              필요한 업무 자료를 한곳에.
            </p>
          </div>

          <div className="rounded-2xl border border-[#ECE9E2] bg-white p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F1EB] text-lg">
              ⌕
            </div>
            <h2 className="font-bold">한 번에 검색하기</h2>
            <p className="mt-2 text-sm leading-6 text-[#858179]">
              기억에 의존하지 않고 빠르게 찾기.
            </p>
          </div>

          <div className="rounded-2xl border border-[#ECE9E2] bg-white p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F1EB] text-lg">
              ✳
            </div>
            <h2 className="font-bold">AI에게 질문하기</h2>
            <p className="mt-2 text-sm leading-6 text-[#858179]">
              자료를 읽고 필요한 답을 얻기.
            </p>
          </div>
        </div>
      </section>

      {/* 소식 신청 */}
      <section id="signup" className="scroll-mt-8 px-6 py-24">
        <div className="mx-auto max-w-xl rounded-[28px] border border-[#EAE7E0] bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-12">
          <div className="mb-7 text-center">
            <span className="inline-flex rounded-full bg-[#F3F1EB] px-3 py-1.5 text-xs font-medium text-[#716E65]">
              STAY IN THE LOOP
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
              새로운 소식 받기
            </h2>

            <p className="mt-4 text-sm leading-6 text-[#858179] sm:text-base">
              Gather의 새로운 기능과 체험 소식을
              <br className="sm:hidden" /> 가장 먼저 알려드릴게요.
            </p>
          </div>

          {formSuccess ? (
            <div className="rounded-2xl bg-[#F3F5EF] px-5 py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl">
                ✓
              </div>
              <p className="mt-4 font-semibold text-[#4E6043]">
                신청이 완료됐어요!
              </p>
              <p className="mt-2 text-sm leading-6 text-[#777C70]">
                새로운 소식이 생기면 알려드릴게요.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="hello@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-[#E6E3DC] bg-[#FCFBF9] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#B1AEA7] focus:border-[#77766C] focus:bg-white focus:ring-4 focus:ring-[#292927]/5"
                />
              </div>

              <div>
                <label
                  htmlFor="jobCategory"
                  className="mb-2 block text-sm font-semibold"
                >
                  현재 어떤 일을 하고 계신가요?
                </label>
                <select
                  id="jobCategory"
                  value={jobCategory}
                  onChange={(event) => setJobCategory(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#E6E3DC] bg-[#FCFBF9] px-4 py-3.5 text-sm outline-none transition focus:border-[#77766C] focus:bg-white focus:ring-4 focus:ring-[#292927]/5"
                >
                  <option value="">선택해 주세요</option>
                  {jobCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#77746E]">
                <input
                  type="checkbox"
                  checked={privacyConsent}
                  onChange={(event) =>
                    setPrivacyConsent(event.target.checked)
                  }
                  className="mt-1 h-4 w-4 shrink-0 accent-[#292927]"
                />
                <span>
                  <span className="font-medium text-[#383833]">
                    [필수] 개인정보 수집 및 이용에 동의합니다.
                  </span>
                  <br />
                  소식 전달을 위한 이메일 및 현재 상황 정보 수집에 동의합니다.
                </span>
              </label>

              {formMessage && (
                <p
                  role="status"
                  className={`rounded-xl px-4 py-3 text-sm leading-6 ${
                    formSuccess
                      ? "bg-[#F3F5EF] text-[#4E6043]"
                      : "bg-[#FBF0ED] text-[#A14D3B]"
                  }`}
                >
                  {formMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={formLoading}
                className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-[#292927] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#41413D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {formLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    신청 중...
                  </>
                ) : (
                  <>
                    소식 받아보기 <span>→</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs leading-5 text-[#AAA69E]">
                입력한 정보는 Gather 관련 소식 전달 목적으로만 사용돼요.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-[#EAE7E0] px-6 py-7">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-[#A09D95] sm:flex-row">
          <span className="font-bold tracking-tight text-[#66635C]">
            Gather
          </span>
          <span>흩어진 정보를 연결하고, 필요한 답을 찾다.</span>
        </div>
      </footer>

      {/* 체험 모달: 배경 블러 + 어두운 오버레이 */}
      {isDemoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#171715]/45 px-4 py-6 backdrop-blur-md sm:px-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDemo();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-title"
            className="relative my-auto w-full max-w-2xl animate-[modalIn_0.3s_ease-out] overflow-hidden rounded-[26px] border border-white/70 bg-[#FCFBF9] shadow-2xl shadow-black/20 sm:rounded-[32px]"
          >
            {/* 모달 상단 */}
            <div className="flex items-center justify-between border-b border-[#ECE9E2] px-5 py-4 sm:px-8 sm:py-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#292927] text-sm font-bold text-white">
                  G
                </div>
                <div>
                  <p className="text-sm font-bold">Gather 체험하기</p>
                  <p className="mt-0.5 text-xs text-[#9A968E]">
                    자료를 찾고 AI에게 질문해 보세요.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeDemo}
                aria-label="체험 닫기"
                className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-[#858179] transition hover:bg-[#F0EEE8] hover:text-[#292927]"
              >
                ×
              </button>
            </div>

            {/* 단계 표시 */}
            <div className="px-5 pt-5 sm:px-8 sm:pt-6">
              <div className="flex items-center gap-2">
                {(
                  [
                    ["upload", "자료 준비"],
                    ["search", "검색"],
                    ["detail", "자료 확인"],
                    ["question", "AI 질문"],
                    ["answer", "답변"],
                  ] as [DemoStep, string][]
                ).map(([step, label], index) => {
                  const steps: DemoStep[] = [
                    "upload",
                    "search",
                    "detail",
                    "question",
                    "answer",
                  ];
                  const currentIndex = steps.indexOf(demoStep);
                  const isComplete = index < currentIndex;
                  const isCurrent = step === demoStep;

                  return (
                    <div key={step} className="flex min-w-0 flex-1 flex-col gap-2">
                      <div
                        className={`h-1.5 rounded-full transition-colors duration-300 ${
                          isComplete || isCurrent
                            ? "bg-[#45463E]"
                            : "bg-[#EAE7E0]"
                        }`}
                      />
                      <span
                        className={`truncate text-[10px] sm:text-xs ${
                          isCurrent
                            ? "font-bold text-[#34342F]"
                            : "text-[#A09D95]"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 체험 콘텐츠 */}
            <div className="px-5 pb-6 pt-7 sm:px-8 sm:pb-8 sm:pt-9">
              {/* 1. 파일 업로드 */}
              {demoStep === "upload" && (
                <div className="py-5 text-center sm:py-8">
                  <div className="relative mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#F0EEE7]">
                    <div className="absolute inset-0 animate-ping rounded-[28px] bg-[#E5E2D8] opacity-40" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E1DED5] bg-white shadow-sm">
                      <svg
                        viewBox="0 0 48 48"
                        fill="none"
                        className="h-9 w-9"
                        aria-hidden="true"
                      >
                        <path
                          d="M14 5.5H27L37 15.5V40C37 41.1 36.1 42 35 42H14C12.9 42 12 41.1 12 40V7.5C12 6.4 12.9 5.5 14 5.5Z"
                          stroke="#45463E"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M27 5.5V15.5H37"
                          stroke="#45463E"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M24 34V22M19 27L24 22L29 27"
                          stroke="#777D67"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <h2
                    id="demo-title"
                    className="text-2xl font-extrabold tracking-tight sm:text-3xl"
                  >
                    업무 자료를 모으고 있어요
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-[#858179]">
                    흩어져 있던 문서를 한곳에 모아볼게요.
                  </p>

                  <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-[#EAE7E0] bg-white p-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5F2E9] text-sm font-bold text-[#827A64]">
                        PDF
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          회사 소개서.pdf
                        </p>
                        <p className="mt-1 text-xs text-[#9A968E]">
                          {uploadProgress < 100
                            ? "자료를 정리하는 중..."
                            : "업로드 완료"}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          uploadProgress >= 100
                            ? "text-[#647A52]"
                            : "text-[#858179]"
                        }`}
                      >
                        {uploadProgress}%
                      </span>
                    </div>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#EFEEE9]">
                      <div
                        className="h-full rounded-full bg-[#777D67] transition-all duration-100"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>

                  <p className="mt-5 text-xs text-[#AAA69E]">
                    잠시만 기다려 주세요.
                  </p>
                </div>
              )}

              {/* 2. 검색 */}
              {demoStep === "search" && (
                <div className="animate-[contentIn_0.3s_ease-out]">
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#888579]">
                      STEP 01
                    </p>
                    <h2
                      id="demo-title"
                      className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl"
                    >
                      찾고 싶은 정보를 검색해 보세요.
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-[#858179]">
                      정확한 파일명이 기억나지 않아도 괜찮아요.
                    </p>
                  </div>

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleSearch();
                    }}
                    className="flex items-center gap-2 rounded-2xl border border-[#DCD9D0] bg-white p-2 transition focus-within:border-[#777D67] focus-within:ring-4 focus-within:ring-[#777D67]/10"
                  >
                    <span className="pl-3 text-xl text-[#858179]">⌕</span>
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="예: 도입 사례"
                      className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-[#B1AEA7]"
                    />
                    <button
                      type="submit"
                      className="shrink-0 rounded-xl bg-[#292927] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#41413D]"
                    >
                      검색
                    </button>
                  </form>

                  <div className="mt-6">
                    <p className="mb-3 text-xs font-medium text-[#9A968E]">
                      이런 자료를 찾을 수 있어요
                    </p>

                    <div className="space-y-2">
                      {demoResults.map((result) => (
                        <button
                          type="button"
                          key={result.id}
                          onClick={() => {
                            setSelectedResult(result);
                            setDemoStep("detail");
                          }}
                          className="flex w-full items-center gap-3 rounded-2xl border border-[#ECE9E2] bg-white p-3.5 text-left transition hover:border-[#C7C5B9] hover:bg-[#FAF9F6]"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3F1EB] text-xs font-bold text-[#827A64]">
                            {result.type === "PDF 자료" ? "PDF" : "DOC"}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">
                              {result.title}
                            </p>
                            <p className="mt-1 truncate text-xs text-[#969188]">
                              {result.description}
                            </p>
                          </div>

                          <span className="text-lg text-[#A09D95]">›</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedResult(demoResults[0]);
                      setDemoStep("detail");
                    }}
                    className="mt-6 w-full rounded-xl bg-[#292927] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#41413D]"
                  >
                    검색 결과 확인하기 →
                  </button>
                </div>
              )}

              {/* 3. 자료 상세 */}
              {demoStep === "detail" && (
                <div className="animate-[contentIn_0.3s_ease-out]">
                  <button
                    type="button"
                    onClick={() => setDemoStep("search")}
                    className="mb-5 inline-flex items-center gap-2 text-sm text-[#858179] transition hover:text-[#292927]"
                  >
                    ← 검색 결과로
                  </button>

                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#888579]">
                    STEP 02
                  </p>

                  <div className="mt-3 flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F0EEE7] text-sm font-bold text-[#827A64]">
                      {selectedResult.type === "PDF 자료" ? "PDF" : "DOC"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2
                        id="demo-title"
                        className="break-words text-xl font-extrabold tracking-tight sm:text-2xl"
                      >
                        {selectedResult.title}
                      </h2>
                      <p className="mt-2 text-sm text-[#858179]">
                        {selectedResult.type} · {selectedResult.location}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-[#EAE7E0] bg-white p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-lg bg-[#F3F1EB] px-2.5 py-1.5 text-xs font-semibold text-[#77746E]">
                        자료 미리보기
                      </span>
                      <span className="text-xs text-[#A09D95]">
                        {selectedResult.location}
                      </span>
                    </div>

                    <h3 className="mt-5 text-base font-bold">
                      {selectedResult.description}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-[#716E65]">
                      {selectedResult.content}
                    </p>

                    <div className="mt-5 border-t border-[#F0EEE8] pt-4">
                      <p className="text-xs text-[#A09D95]">
                        자료를 확인했어요. 이제 AI에게 질문해 보세요.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDemoStep("question")}
                    className="mt-6 w-full rounded-xl bg-[#292927] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#41413D]"
                  >
                    이 자료에 대해 AI에게 질문하기 →
                  </button>
                </div>
              )}

              {/* 4. AI 질문 */}
              {demoStep === "question" && (
                <div className="animate-[contentIn_0.3s_ease-out]">
                  <button
                    type="button"
                    onClick={() => setDemoStep("detail")}
                    className="mb-5 inline-flex items-center gap-2 text-sm text-[#858179] transition hover:text-[#292927]"
                  >
                    ← 자료로 돌아가기
                  </button>

                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#888579]">
                    STEP 03
                  </p>

                  <h2
                    id="demo-title"
                    className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl"
                  >
                    자료를 일일이 읽지 말고,
                    <br />
                    AI에게 물어보세요.
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-[#858179]">
                    필요한 내용을 질문하면 핵심을 정리해 드려요.
                  </p>

                  <div className="mt-6 rounded-2xl border border-[#EAE7E0] bg-white p-4 sm:p-5">
                    <div className="flex items-center gap-3 border-b border-[#F0EEE8] pb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0EEE7] text-lg">
                        ✳
                      </div>
                      <div>
                        <p className="text-sm font-bold">Gather AI</p>
                        <p className="mt-1 text-xs text-[#9A968E]">
                          참고 자료: {selectedResult.title}
                        </p>
                      </div>
                    </div>

                    <label
                      htmlFor="aiQuestion"
                      className="mb-3 mt-5 block text-sm font-semibold"
                    >
                      무엇이 궁금하신가요?
                    </label>

                    <textarea
                      id="aiQuestion"
                      value={aiQuestion}
                      onChange={(event) => setAiQuestion(event.target.value)}
                      rows={3}
                      placeholder="예: 주요 도입 사례와 효과를 정리해 줘."
                      className="w-full resize-none rounded-xl border border-[#E6E3DC] bg-[#FCFBF9] p-4 text-sm leading-6 outline-none transition placeholder:text-[#B1AEA7] focus:border-[#777D67] focus:bg-white focus:ring-4 focus:ring-[#777D67]/10"
                    />

                    <button
                      type="button"
                      onClick={handleAskAI}
                      disabled={aiLoading || !aiQuestion.trim()}
                      className="mt-3 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#292927] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#41413D] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {aiLoading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          자료를 확인하고 있어요...
                        </>
                      ) : (
                        <>
                          질문하기 <span>→</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* 5. AI 답변 */}
              {demoStep === "answer" && (
                <div className="animate-[contentIn_0.3s_ease-out]">
                  <div className="mb-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0EEE7] text-xl">
                      ✳
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#888579]">
                      AI ANSWER
                    </p>

                    <h2
                      id="demo-title"
                      className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl"
                    >
                      필요한 답을 찾았어요.
                    </h2>
                  </div>

                  <div className="rounded-2xl border border-[#EAE7E0] bg-white p-5 sm:p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F0EEE7] text-xs">
                        Q
                      </span>
                      {aiQuestion}
                    </div>

                    <div className="mt-5 border-t border-[#F0EEE8] pt-5">
                      <p className="text-sm font-bold">핵심 내용</p>

                      <div className="mt-4 space-y-4 text-sm leading-7 text-[#716E65]">
                        <p>
                          <span className="font-semibold text-[#34342F]">
                            1. 다양한 산업군에서 도입
                          </span>
                          <br />
                          여러 산업의 고객사가 서비스를 활용하며 반복 업무를
                          줄이고 필요한 정보를 빠르게 확인하고 있어요.
                        </p>

                        <p>
                          <span className="font-semibold text-[#34342F]">
                            2. 초기 온보딩이 중요
                          </span>
                          <br />
                          도입 초기에 담당자 교육과 단계별 운영 가이드를
                          제공하면 서비스 정착에 도움이 돼요.
                        </p>

                        <p>
                          <span className="font-semibold text-[#34342F]">
                            3. 기대 효과
                          </span>
                          <br />
                          업무 처리 시간을 줄이고, 정보를 찾는 데 드는
                          반복적인 수고를 덜 수 있어요.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-[#F0EEE8] pt-5">
                      <p className="mb-3 text-xs font-semibold text-[#858179]">
                        참고한 자료
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3 rounded-xl bg-[#F8F7F3] p-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[10px] font-bold text-[#827A64]">
                            PDF
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-[#55534D]">
                              회사 소개서.pdf
                            </p>
                            <p className="mt-1 text-[11px] text-[#9A968E]">
                              p.3 · 주요 도입 사례
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl bg-[#F8F7F3] p-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[10px] font-bold text-[#827A64]">
                            PDF
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-[#55534D]">
                              마케팅 운영 가이드.pdf
                            </p>
                            <p className="mt-1 text-[11px] text-[#9A968E]">
                              p.7 · 운영 가이드
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-[#F0EEE7] p-5 sm:p-6">
                    <p className="text-base font-bold leading-7">
                      필요한 정보가 어디 있는지 기억하지 않아도,
                      <br className="hidden sm:block" />
                      질문으로 바로 찾을 수 있어요.
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#77746E]">
                      Gather의 새로운 기능과 체험 소식을 가장 먼저 받아보세요.
                    </p>

                    <button
                      type="button"
                      onClick={goToSignup}
                      className="mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#292927] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#41413D]"
                    >
                      업데이트 소식 받기 <span>→</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={openDemo}
                    className="mt-4 w-full rounded-xl border border-[#E6E3DC] bg-white px-5 py-3.5 text-sm font-medium text-[#77746E] transition hover:bg-[#F8F7F3] hover:text-[#292927]"
                  >
                    체험 처음부터 다시 하기
                  </button>
                </div>
              )}

              {/* 예시 데이터 안내 */}
              <p className="mt-6 text-center text-[10px] leading-5 text-[#AAA69E]">
                본 체험은 서비스 이해를 돕기 위한 예시 화면이며,
                <br />
                실제 파일 업로드나 AI 검색이 실행되는 것은 아니에요.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 모달 등장 애니메이션 */}
      <style jsx global>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes contentIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </main>
  );
}