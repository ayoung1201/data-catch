"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

function ArrowRight({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function ArrowLeft({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function CheckIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function SparkleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" />
      <path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" />
    </svg>
  );
}

function DocumentIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
    </svg>
  );
}

function SearchIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function CheckCircle({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Demo data                                                                  */
/* -------------------------------------------------------------------------- */

type DemoResult = {
  id: string;
  type: "자료" | "미팅";
  fileName: string;
  folder: string;
  date: string;
  page?: number;
  title: string;
  excerpt: string;
};

const demoResults: DemoResult[] = [
  {
    id: "intro",
    type: "자료",
    fileName: "회사 소개서.pdf",
    folder: "사업 기획",
    date: "2026.10.12",
    page: 3,
    title: "주요 도입 사례",
    excerpt:
      "다양한 산업군의 고객사가 서비스를 도입하여 업무 처리 시간을 단축했습니다. 도입 이후 반복 업무를 줄이고 필요한 정보를 빠르게 확인할 수 있었습니다.",
  },
  {
    id: "guide",
    type: "자료",
    fileName: "마케팅 운영 가이드.pdf",
    folder: "마케팅팀",
    date: "2026.10.10",
    page: 7,
    title: "고객사 도입 시 운영 기준",
    excerpt:
      "도입 초기에는 담당자 교육과 단계별 운영 가이드를 함께 제공하는 것이 중요합니다. 운영 과정에서 확인된 고객 의견을 수집해 개선 사항을 반영합니다.",
  },
  {
    id: "meeting",
    type: "미팅",
    fileName: "ABC파트너스 미팅",
    folder: "파트너사 미팅",
    date: "2026.10.12",
    title: "도입 사례 및 운영 프로세스 논의",
    excerpt:
      "서비스 도입 사례를 공유하고 초기 운영 프로세스와 담당자 교육에 필요한 사항을 논의했습니다.",
  },
];

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function Home() {
  // Demo state
  const [demoView, setDemoView] = useState<"search" | "detail" | "chat">(
    "search"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"자료" | "미팅">("자료");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [selectedResult, setSelectedResult] = useState<DemoResult | null>(
    null
  );
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatAnswerVisible, setChatAnswerVisible] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [followUpVisible, setFollowUpVisible] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(false);

  // Signup state
  const [email, setEmail] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const jobCategories = [
    "기획 / 전략",
    "마케팅 / 광고",
    "개발 / IT",
    "디자인",
    "영업 / 사업개발",
    "인사 / 운영",
    "학생 / 취업준비생",
    "기타",
  ];

  const scrollToSignup = () => {
    document.getElementById("signup")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToExperience = () => {
    document.getElementById("experience")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const resetDemo = () => {
    setDemoView("search");
    setSearchQuery("");
    setActiveTab("자료");
    setSearchSubmitted(false);
    setSelectedResult(null);
    setChatQuestion("");
    setChatAnswerVisible(false);
    setChatLoading(false);
    setFollowUpQuestion("");
    setFollowUpVisible(false);
    setFollowUpLoading(false);
  };

  const runSearch = (query?: string) => {
    const nextQuery = (query ?? searchQuery).trim();

    if (!nextQuery) return;

    setSearchQuery(nextQuery);
    setActiveTab("자료");
    setSearchSubmitted(true);
    setDemoView("search");
    setSelectedResult(null);
    setChatAnswerVisible(false);
    setFollowUpVisible(false);
  };

  const openResult = (result: DemoResult) => {
    setSelectedResult(result);
    setDemoView("detail");
  };

  const startChat = () => {
    setDemoView("chat");
    setChatQuestion("");
    setChatAnswerVisible(false);
    setChatLoading(false);
    setFollowUpQuestion("");
    setFollowUpVisible(false);
    setFollowUpLoading(false);
  };

  const sendSampleQuestion = (question: string) => {
    setChatQuestion(question);
    setChatLoading(true);
    setChatAnswerVisible(false);
    setFollowUpVisible(false);

    window.setTimeout(() => {
      setChatLoading(false);
      setChatAnswerVisible(true);
    }, 700);
  };

  const sendFollowUp = (question: string) => {
    if (!question.trim()) return;

    setFollowUpQuestion(question.trim());
    setFollowUpLoading(true);
    setFollowUpVisible(false);

    window.setTimeout(() => {
      setFollowUpLoading(false);
      setFollowUpVisible(true);
    }, 700);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitMessage("");
    setSubmitSuccess(false);

    if (!email.trim()) {
      setSubmitMessage("이메일 주소를 입력해 주세요.");
      return;
    }

    if (!jobCategory) {
      setSubmitMessage("현재 하시는 일을 선택해 주세요.");
      return;
    }

    if (!privacyConsent) {
      setSubmitMessage("개인정보 수집 및 이용에 동의해 주세요.");
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("experience_signups")
        .insert([
          {
            email: email.trim(),
            job_category: jobCategory,
            privacy_consent: privacyConsent,
          },
        ]);

      if (error) {
        if (error.code === "23505") {
          setSubmitMessage("이미 신청된 이메일이에요.");
        } else {
          setSubmitMessage(
            "신청 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요."
          );
        }
        return;
      }

      setSubmitSuccess(true);
      setSubmitMessage("신청이 완료됐어요! 소식을 가장 먼저 전해드릴게요.");
      setEmail("");
      setJobCategory("");
      setPrivacyConsent(false);
    } catch {
      setSubmitMessage(
        "신청 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const visibleResults = demoResults.filter((result) => {
    if (result.type !== activeTab) return false;

    const query = searchQuery.toLowerCase();

    if (!query) return true;

    const searchableText = [
      result.fileName,
      result.folder,
      result.title,
      result.excerpt,
      result.type,
    ]
      .join(" ")
      .toLowerCase();

    // Sample demo search: keep results discoverable even if a visitor
    // enters a related term that is not literally present in the excerpt.
    const relatedTerms: Record<string, string[]> = {
      "도입 사례": ["도입", "사례", "고객", "서비스", "회사"],
      "abc파트너스": ["abc", "파트너", "미팅", "도입"],
      가격: ["가격", "운영", "서비스", "고객"],
    };

    const normalizedRelatedTerm = Object.keys(relatedTerms).find((term) =>
      query.includes(term.toLowerCase())
    );

    if (normalizedRelatedTerm) {
      const terms = relatedTerms[normalizedRelatedTerm];
      return (
        terms.some((term) => searchableText.includes(term)) ||
        searchableText.includes(query)
      );
    }

    return searchableText.includes(query);
  });

  return (
    <main className="min-h-screen bg-[#fafaf9] text-[#202124]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#fafaf9]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-6 md:px-10">
          <a
            href="#home"
            className="flex items-center gap-2.5"
            aria-label="Gather 홈"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#252525] text-white">
              <SparkleIcon size={17} />
            </div>
            <span className="text-[19px] font-semibold tracking-[-0.7px]">
              gather
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-[13px] text-[#626262] md:flex">
            <a href="#problem" className="transition hover:text-black">
              문제
            </a>
            <a href="#experience" className="transition hover:text-black">
              사용 경험
            </a>
            <a href="#benefits" className="transition hover:text-black">
              활용 방법
            </a>
          </nav>

          <button
            type="button"
            onClick={scrollToSignup}
            className="flex items-center gap-2 rounded-full bg-[#252525] px-4 py-2.5 text-[12px] font-medium text-white transition hover:bg-black"
          >
            먼저 만나보기
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="overflow-hidden px-6 pb-24 pt-20 md:px-10 md:pb-32 md:pt-28"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3.5 py-2 text-[12px] text-[#555]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6e9b79]" />
              업무 자료에서 필요한 맥락을 찾는 새로운 방법
            </div>

            <h1 className="max-w-[620px] text-[42px] font-semibold leading-[1.2] tracking-[-2.6px] md:text-[58px] lg:text-[64px]">
              기획안, 보고서,
              <br />
              업무 가이드까지.
              <br />
              <span className="text-[#929292]">필요한 정보만 빠르게.</span>
            </h1>

            <p className="mt-7 max-w-[470px] text-[15px] leading-7 text-[#696969] md:text-[16px]">
              자료가 쌓일수록 필요한 정보를 찾는 일은 어려워집니다.
              <br className="hidden md:block" />
              Gather와 함께 필요한 맥락을 찾고 다음 단계로 나아가세요.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={scrollToExperience}
                className="flex items-center gap-2 rounded-full bg-[#252525] px-6 py-3.5 text-[13px] font-medium text-white transition hover:bg-black"
              >
                직접 경험해 보기
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={scrollToSignup}
                className="rounded-full border border-black/[0.12] bg-white px-6 py-3.5 text-[13px] font-medium transition hover:bg-[#f2f2f0]"
              >
                업데이트 소식 받기
              </button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-[#858585]">
              <span className="flex items-center gap-1.5">
                <CheckIcon size={14} />
                업무 자료 중심
              </span>
              <span className="flex items-center gap-1.5">
                <CheckIcon size={14} />
                필요한 내용 검색
              </span>
              <span className="flex items-center gap-1.5">
                <CheckIcon size={14} />
                출처 위치 확인
              </span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto w-full max-w-[500px]">
            <div className="absolute -inset-8 rounded-[40px] bg-[#e9e9e5]/60 blur-3xl" />

            <div className="relative rounded-[26px] border border-black/[0.08] bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.06)] md:p-7">
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-5">
                <div>
                  <div className="text-[13px] font-semibold">
                    내 업무 자료
                  </div>
                  <div className="mt-1 text-[11px] text-[#929292]">
                    흩어진 자료를 한곳에서
                  </div>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f5f3] text-[#696969]">
                  <SearchIcon size={16} />
                </div>
              </div>

              <div className="space-y-3 py-5">
                {[
                  {
                    name: "서비스 기획안",
                    description: "주요 기능 및 사용자 흐름",
                    type: "기획 문서",
                    color: "bg-[#e8edff] text-[#536bb0]",
                  },
                  {
                    name: "고객 피드백 정리",
                    description: "고객 의견 및 개선 사항",
                    type: "고객 데이터",
                    color: "bg-[#f9eadc] text-[#aa7449]",
                  },
                  {
                    name: "운영 가이드",
                    description: "프로세스 및 업무 기준",
                    type: "운영 문서",
                    color: "bg-[#e5f2e8] text-[#538061]",
                  },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 rounded-2xl border border-black/[0.06] p-3.5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5f5f3] text-[#777]">
                      <DocumentIcon size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12px] font-medium">
                        {item.name}
                      </div>
                      <div className="mt-1 truncate text-[10px] text-[#929292]">
                        {item.description}
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[9px] ${item.color}`}
                    >
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-[#f7f7f5] p-4">
                <div className="flex items-center gap-2 text-[11px] text-[#777]">
                  <SearchIcon size={14} />
                  자료에서 필요한 내용 찾기
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl border border-black/[0.07] bg-white px-3.5 py-3">
                  <span className="text-[11px] text-[#999]">
                    예: 도입 사례, 고객 요구사항...
                  </span>
                  <ArrowRight size={15} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section
        id="problem"
        className="border-y border-black/[0.06] bg-white px-6 py-20 md:px-10 md:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-[620px]">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[2px] text-[#888]">
              The problem
            </p>

            <h2 className="text-[30px] font-semibold leading-[1.35] tracking-[-1.4px] md:text-[42px]">
              자료는 계속 쌓이는데,
              <br />
              필요한 정보는 쉽게 보이지 않습니다.
            </h2>

            <p className="mt-5 text-[14px] leading-7 text-[#777] md:text-[15px]">
              이전 기획안, 고객 피드백, 업무 가이드.
              <br className="hidden md:block" />
              자료가 늘어날수록 필요한 내용을 찾는 데 더 많은 시간이 필요합니다.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "어디에 있는지 모르는 자료",
                description:
                  "파일과 문서가 여러 곳에 쌓여 필요한 정보가 있는 위치부터 찾아야 합니다.",
              },
              {
                number: "02",
                title: "다시 읽어야 하는 긴 문서",
                description:
                  "수십 페이지의 자료를 처음부터 훑으며 필요한 문장과 맥락을 확인합니다.",
              },
              {
                number: "03",
                title: "반복되는 검색과 확인",
                description:
                  "이미 정리했던 내용도 다시 찾고, 이전 자료를 확인하는 일이 반복됩니다.",
              },
            ].map((item) => (
              <article
                key={item.number}
                className="rounded-2xl border border-black/[0.07] bg-[#fafaf9] p-6 md:p-7"
              >
                <div className="text-[11px] tracking-[1px] text-[#999]">
                  {item.number}
                </div>
                <h3 className="mt-6 text-[16px] font-semibold tracking-[-0.4px]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[13px] leading-6 text-[#777]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Transition */}
      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-black/[0.08] bg-white text-[#555] shadow-sm">
            <SparkleIcon size={22} />
          </div>

          <h2 className="mt-7 text-[30px] font-semibold leading-[1.4] tracking-[-1.3px] md:text-[42px]">
            자료를 다시 읽는 대신,
            <br />
            필요한 내용부터 찾아보세요.
          </h2>

          <p className="mx-auto mt-5 max-w-[560px] text-[14px] leading-7 text-[#777] md:text-[15px]">
            먼저 필요한 자료를 찾고, 더 궁금한 내용은 AI에게 물어보세요.
            <br className="hidden md:block" />
            검색부터 내용 확인까지 하나의 흐름으로 이어집니다.
          </p>

          <div className="mt-8 flex justify-center text-[#999]">
            <ArrowRight size={20} />
          </div>
        </div>
      </section>

      {/* Interactive experience */}
      <section
        id="experience"
        className="border-y border-black/[0.06] bg-white px-6 py-20 md:px-10 md:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[2px] text-[#888]">
              Try the experience
            </p>

            <h2 className="text-[30px] font-semibold tracking-[-1.4px] md:text-[42px]">
              필요한 정보, 직접 찾아보세요.
            </h2>

            <p className="mt-4 text-[14px] leading-7 text-[#777] md:text-[15px]">
              자료를 검색하고, 원하는 내용을 확인한 다음
              <br className="hidden md:block" />
              AI와 대화하며 내용을 더 깊이 살펴볼 수 있어요.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-[760px] overflow-hidden rounded-[24px] border border-black/[0.09] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.05)]">
            {/* Demo header */}
            <div className="flex items-center justify-between border-b border-black/[0.07] bg-[#fafaf9] px-5 py-4 md:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#252525] text-white">
                  {demoView === "chat" ? (
                    <SparkleIcon size={17} />
                  ) : (
                    <SearchIcon size={17} />
                  )}
                </div>

                <div>
                  <div className="text-[13px] font-semibold">
                    {demoView === "chat"
                      ? "자료와 대화하기"
                      : demoView === "detail"
                        ? "자료 상세"
                        : "업무 자료 검색"}
                  </div>
                  <div className="mt-0.5 text-[10px] text-[#888]">
                    {demoView === "chat"
                      ? "연결된 자료를 바탕으로 질문하기"
                      : "검색부터 근거 확인까지"}
                  </div>
                </div>
              </div>

              <span className="rounded-full border border-black/[0.07] bg-white px-3 py-1.5 text-[10px] text-[#777]">
                체험용 예시
              </span>
            </div>

            <div
              key={demoView}
              className="demo-fade-in p-5 md:p-8"
              aria-live="polite"
            >
              {/* STEP 1: Search */}
              {demoView === "search" && (
                <>
                  <div className="mb-5">
                    <div className="mb-3 text-[12px] font-semibold">
                      어떤 내용을 찾고 있나요?
                    </div>

                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        runSearch();
                      }}
                      className="flex items-center gap-2 rounded-xl border border-black/[0.12] bg-white p-2 pl-3.5 transition focus-within:border-black/[0.3]"
                    >
                      <span className="shrink-0 text-[#888]">
                        <SearchIcon size={18} />
                      </span>

                      <input
                        value={searchQuery}
                        onChange={(event) =>
                          setSearchQuery(event.target.value)
                        }
                        placeholder="예: 도입 사례"
                        className="h-10 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#aaa]"
                        aria-label="검색어"
                      />

                      <button
                        type="submit"
                        className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-[#252525] px-3.5 text-[11px] font-medium text-white transition hover:bg-black"
                      >
                        검색
                        <ArrowRight size={14} />
                      </button>
                    </form>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] text-[#999]">
                        추천 검색어
                      </span>
                      {["도입 사례", "ABC파트너스", "가격"].map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => runSearch(term)}
                          className="rounded-full border border-black/[0.08] bg-[#fafaf9] px-3 py-1.5 text-[10px] text-[#666] transition hover:border-black/[0.2] hover:bg-[#f2f2f0]"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {searchSubmitted && (
                    <div className="demo-fade-in border-t border-black/[0.07] pt-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-[12px] font-semibold">
                          검색 결과
                        </div>
                        <span className="text-[10px] text-[#999]">
                          &apos;{searchQuery}&apos; 검색
                        </span>
                      </div>

                      <div className="mt-4 flex gap-5 border-b border-black/[0.07]">
                        {(["미팅", "자료"] as const).map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`relative pb-3 text-[12px] transition ${
                              activeTab === tab
                                ? "font-semibold text-[#252525]"
                                : "text-[#999] hover:text-[#555]"
                            }`}
                          >
                            {tab}
                            {activeTab === tab && (
                              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#252525]" />
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="mt-3 space-y-2">
                        {visibleResults.length > 0 ? (
                          visibleResults.map((result) => (
                            <button
                              key={result.id}
                              type="button"
                              onClick={() => openResult(result)}
                              className="group w-full rounded-xl border border-black/[0.07] p-4 text-left transition hover:border-black/[0.18] hover:bg-[#fafaf9]"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5f5f3] text-[#666]">
                                  <DocumentIcon size={17} />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[12px] font-medium">
                                      {result.fileName}
                                    </span>
                                    {result.page && (
                                      <span className="rounded bg-[#edf3ed] px-2 py-0.5 text-[9px] text-[#57735c]">
                                        p.{result.page}
                                      </span>
                                    )}
                                  </div>

                                  <div className="mt-1.5 text-[11px] font-medium text-[#666]">
                                    {result.title}
                                  </div>

                                  <p className="mt-1.5 line-clamp-2 text-[11px] leading-5 text-[#888]">
                                    {result.excerpt}
                                  </p>

                                  <div className="mt-2 text-[10px] text-[#aaa]">
                                    {result.folder} · {result.date}
                                  </div>
                                </div>

                                <span className="mt-1 shrink-0 text-[#aaa] transition group-hover:translate-x-0.5 group-hover:text-[#555]">
                                  <ArrowRight size={15} />
                                </span>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="rounded-xl bg-[#fafaf9] px-4 py-8 text-center">
                            <p className="text-[12px] text-[#777]">
                              일치하는 예시 결과가 없어요.
                            </p>
                            <p className="mt-2 text-[10px] text-[#999]">
                              추천 검색어를 선택해 체험해 보세요.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {!searchSubmitted && (
                    <div className="rounded-xl bg-[#fafaf9] px-4 py-5">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-[#888]">
                          <SparkleIcon size={17} />
                        </div>
                        <div>
                          <p className="text-[11px] font-medium text-[#555]">
                            검색어를 입력해 보세요.
                          </p>
                          <p className="mt-1 text-[10px] leading-5 text-[#999]">
                            미팅 기록과 자료에서 필요한 내용을 찾아볼 수 있어요.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: Document detail */}
              {demoView === "detail" && selectedResult && (
                <div className="demo-fade-in">
                  <button
                    type="button"
                    onClick={() => setDemoView("search")}
                    className="mb-5 flex items-center gap-2 text-[11px] text-[#777] transition hover:text-black"
                  >
                    <ArrowLeft size={15} />
                    검색 결과로 돌아가기
                  </button>

                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f5f5f3] text-[#666]">
                      <DocumentIcon size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-[14px] font-semibold">
                        {selectedResult.fileName}
                      </h3>
                      <p className="mt-1 text-[10px] text-[#999]">
                        {selectedResult.folder} · {selectedResult.date}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-[#e3e9e2] bg-[#fbfdfb] p-5 md:p-6">
                    <div className="flex items-center gap-2 text-[11px] font-medium text-[#57735c]">
                      <CheckCircle size={17} />
                      찾은 구절
                      {selectedResult.page && (
                        <span className="rounded-md bg-[#edf3ed] px-2 py-1 text-[10px]">
                          p.{selectedResult.page}
                        </span>
                      )}
                    </div>

                    <h4 className="mt-4 text-[13px] font-semibold">
                      {selectedResult.title}
                    </h4>

                    <p className="mt-3 text-[12px] leading-7 text-[#555]">
                      {selectedResult.excerpt}
                    </p>
                  </div>

                  {selectedResult.type === "자료" ? (
                    <div className="mt-5">
                      <p className="mb-3 text-[11px] text-[#888]">
                        이 자료에 대해 더 알아보고 싶다면
                      </p>

                      <button
                        type="button"
                        onClick={startChat}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#252525] px-4 py-3.5 text-[12px] font-medium text-white transition hover:bg-black"
                      >
                        <SparkleIcon size={16} />
                        AI에게 질문하기
                        <ArrowRight size={15} />
                      </button>

                      <p className="mt-3 text-center text-[10px] leading-5 text-[#999]">
                        폴더에 연결된 자료를 바탕으로 질문하는 상황을 체험합니다.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 rounded-xl bg-[#f7f7f5] p-4">
                      <p className="text-[11px] leading-6 text-[#777]">
                        미팅 검색 결과를 확인했어요. AI 대화 체험은 자료 탭에서
                        문서를 선택해 진행할 수 있어요.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("자료");
                          setDemoView("search");
                        }}
                        className="mt-3 flex items-center gap-2 text-[11px] font-medium text-[#555] hover:text-black"
                      >
                        자료 검색으로 이동
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: AI conversation */}
              {demoView === "chat" && (
                <div className="demo-fade-in">
                  <button
                    type="button"
                    onClick={() => setDemoView("detail")}
                    className="mb-5 flex items-center gap-2 text-[11px] text-[#777] transition hover:text-black"
                  >
                    <ArrowLeft size={15} />
                    자료로 돌아가기
                  </button>

                  <div className="rounded-xl border border-black/[0.07] bg-[#fafaf9] p-3.5">
                    <div className="flex items-center gap-2">
                      <DocumentIcon size={17} />
                      <span className="text-[11px] font-medium">
                        {selectedResult?.fileName ?? "회사 소개서.pdf"}
                      </span>
                    </div>
                    <p className="mt-1 pl-6 text-[10px] text-[#999]">
                      연결된 자료를 바탕으로 대화합니다.
                    </p>
                  </div>

                  <div className="mt-6">
                    <div className="mb-3 text-[12px] font-semibold">
                      무엇이 궁금하신가요?
                    </div>

                    {!chatQuestion && (
                      <div className="space-y-2">
                        {[
                          "연결된 자료 요약해 줘",
                          "주요 도입 사례를 정리해 줘",
                        ].map((question) => (
                          <button
                            key={question}
                            type="button"
                            onClick={() => sendSampleQuestion(question)}
                            className="flex w-full items-center justify-between gap-3 rounded-xl border border-black/[0.09] bg-white px-4 py-3.5 text-left text-[12px] transition hover:border-black/[0.2] hover:bg-[#fafaf9]"
                          >
                            <span>{question}</span>
                            <ArrowRight size={15} />
                          </button>
                        ))}
                      </div>
                    )}

                    {chatQuestion && (
                      <div className="space-y-4">
                        <div className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-sm bg-[#252525] px-4 py-3 text-[12px] leading-6 text-white">
                          {chatQuestion}
                        </div>

                        {chatLoading && (
                          <div className="flex items-center gap-3 rounded-xl bg-[#fafaf9] p-4">
                            <SparkleIcon size={17} />
                            <div className="flex items-center gap-1.5 text-[11px] text-[#888]">
                              자료를 살펴보는 중
                              <span className="typing-dot" />
                              <span className="typing-dot delay-1" />
                              <span className="typing-dot delay-2" />
                            </div>
                          </div>
                        )}

                        {chatAnswerVisible && (
                          <div className="demo-fade-in rounded-2xl border border-black/[0.07] p-4 md:p-5">
                            <div className="flex items-center gap-2 text-[11px] font-semibold">
                              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f2f2ef]">
                                <SparkleIcon size={15} />
                              </div>
                              답변
                            </div>

                            <p className="mt-4 text-[12px] leading-7 text-[#555]">
                              연결된 자료를 살펴보면, 주요 도입 사례에서 업무
                              처리 시간 단축이 언급됩니다. 도입 초기에는 담당자
                              교육과 단계별 운영 가이드도 중요하게 다뤄집니다.
                            </p>

                            <div className="mt-4 border-t border-black/[0.06] pt-4">
                              <div className="mb-2 text-[10px] font-medium text-[#888]">
                                참고 자료
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f5f5f3] px-2.5 py-2 text-[10px] text-[#666]">
                                  <DocumentIcon size={13} />
                                  회사 소개서.pdf · p.3
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f5f5f3] px-2.5 py-2 text-[10px] text-[#666]">
                                  <DocumentIcon size={13} />
                                  마케팅 운영 가이드.pdf · p.7
                                </span>
                              </div>
                            </div>

                            <div className="mt-5 border-t border-black/[0.06] pt-4">
                              <p className="mb-3 text-[11px] font-medium text-[#777]">
                                이어서 질문해 보세요.
                              </p>

                              {!followUpVisible && !followUpLoading && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    sendFollowUp(
                                      "도입 초기 주의사항만 정리해 줘"
                                    )
                                  }
                                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-black/[0.08] bg-white px-3.5 py-3 text-left text-[11px] transition hover:bg-[#fafaf9]"
                                >
                                  <span>
                                    도입 초기 주의사항만 정리해 줘
                                  </span>
                                  <ArrowRight size={14} />
                                </button>
                              )}

                              {followUpLoading && (
                                <div className="flex items-center gap-2 py-3 text-[11px] text-[#888]">
                                  답변을 정리하는 중
                                  <span className="typing-dot" />
                                  <span className="typing-dot delay-1" />
                                  <span className="typing-dot delay-2" />
                                </div>
                              )}

                              {followUpVisible && (
                                <div className="demo-fade-in">
                                  <div className="ml-auto mb-3 w-fit max-w-[90%] rounded-2xl rounded-br-sm bg-[#252525] px-3.5 py-2.5 text-[11px] leading-5 text-white">
                                    {followUpQuestion}
                                  </div>

                                  <p className="text-[12px] leading-7 text-[#555]">
                                    도입 초기에는 담당자 교육, 단계별 안내,
                                    고객 인증 절차를 확인하고, 운영 중 발견된
                                    불편 사항을 기록해 개선하는 것이 좋습니다.
                                  </p>

                                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#f5f5f3] px-2.5 py-2 text-[10px] text-[#666]">
                                    <DocumentIcon size={13} />
                                    마케팅 운영 가이드.pdf · p.7
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {chatAnswerVisible && (
                    <div className="mt-5 rounded-xl bg-[#f7f7f5] p-4">
                      <p className="text-[11px] leading-6 text-[#777]">
                        필요한 자료를 찾고, 관련 내용을 이어서 확인할 수 있어요.
                      </p>
                      <button
                        type="button"
                        onClick={scrollToSignup}
                        className="mt-3 flex items-center gap-2 text-[11px] font-medium text-[#444] transition hover:text-black"
                      >
                        Gather 업데이트 소식 받기
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Demo disclaimer */}
              <div className="mt-6 rounded-xl bg-[#f7f7f5] p-3.5">
                <p className="text-[10px] leading-5 text-[#858585]">
                  이 화면은 검색과 AI 대화 흐름을 보여주는 체험용 예시입니다.
                  자료와 답변은 미리 구성되어 있으며, 실제 Pelyn 검색이나 AI와
                  연결되어 있지 않습니다.
                </p>

                {demoView !== "search" && (
                  <button
                    type="button"
                    onClick={resetDemo}
                    className="mt-2 text-[10px] font-medium text-[#666] underline underline-offset-2 hover:text-black"
                  >
                    체험 처음부터 다시 하기
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-[600px]">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[2px] text-[#888]">
              Why Gather
            </p>

            <h2 className="text-[30px] font-semibold leading-[1.4] tracking-[-1.4px] md:text-[42px]">
              정보를 찾는 시간을 줄이고,
              <br />
              일에 더 집중할 수 있도록.
            </h2>

            <p className="mt-5 text-[14px] leading-7 text-[#777] md:text-[15px]">
              업무에 필요한 자료를 다시 찾아 헤매는 대신,
              <br className="hidden md:block" />
              정보를 확인하고 다음 업무로 이어갈 수 있도록 돕습니다.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: <SearchIcon size={21} />,
                title: "필요한 내용부터 탐색",
                description:
                  "긴 문서를 처음부터 다시 읽기보다 찾고 싶은 내용을 중심으로 확인합니다.",
              },
              {
                icon: <DocumentIcon size={21} />,
                title: "원본 자료와 위치 확인",
                description:
                  "검색 결과가 어느 파일에서 나왔는지 확인해 원문을 다시 살펴볼 수 있습니다.",
              },
              {
                icon: <SparkleIcon size={21} />,
                title: "반복되는 자료 탐색 줄이기",
                description:
                  "이미 쌓여 있는 업무 자료를 활용해 정보를 찾고 확인하는 과정을 간결하게 만듭니다.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-black/[0.07] bg-white p-6 md:p-7"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4f4f1] text-[#555]">
                  {item.icon}
                </div>

                <h3 className="mt-6 text-[15px] font-semibold tracking-[-0.3px]">
                  {item.title}
                </h3>

                <p className="mt-3 text-[13px] leading-6 text-[#777]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Signup */}
      <section
        id="signup"
        className="border-t border-black/[0.06] bg-white px-6 py-20 md:px-10 md:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-24">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[2px] text-[#888]">
              Stay connected
            </p>

            <h2 className="text-[32px] font-semibold leading-[1.35] tracking-[-1.5px] md:text-[44px]">
              더 나은 업무 경험,
              <br />
              가장 먼저 만나보세요.
            </h2>

            <p className="mt-5 max-w-[480px] text-[14px] leading-7 text-[#777]">
              Gather의 새로운 기능과 업데이트 소식을 전해드릴게요.
              필요한 정보를 찾는 일이 조금 더 쉬워지는 경험을 함께해 주세요.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "새로운 기능과 서비스 업데이트 소식",
                "업무 자료 활용에 관한 유용한 정보",
                "초기 사용자 대상 경험 및 피드백 기회",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 text-[12px] text-[#666]"
                >
                  <span className="text-[#7b927e]">
                    <CheckIcon size={15} />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-black/[0.08] bg-[#fafaf9] p-6 md:p-8">
            <div className="mb-6">
              <h3 className="text-[17px] font-semibold tracking-[-0.5px]">
                업데이트 소식 신청하기
              </h3>
              <p className="mt-2 text-[12px] leading-5 text-[#888]">
                이메일을 남겨주시면 Gather의 소식을 전해드릴게요.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="signup-email"
                  className="mb-2 block text-[12px] font-medium"
                >
                  이메일 주소
                </label>

                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="h-12 w-full rounded-xl border border-black/[0.1] bg-white px-4 text-[13px] outline-none transition placeholder:text-[#aaa] focus:border-black/[0.35]"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="signup-job"
                  className="mb-2 block text-[12px] font-medium"
                >
                  현재 하시는 일
                </label>

                <select
                  id="signup-job"
                  value={jobCategory}
                  onChange={(event) => setJobCategory(event.target.value)}
                  className="h-12 w-full rounded-xl border border-black/[0.1] bg-white px-4 text-[13px] text-[#555] outline-none transition focus:border-black/[0.35]"
                  required
                >
                  <option value="" disabled>
                    직무를 선택해 주세요
                  </option>

                  {jobCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={privacyConsent}
                  onChange={(event) =>
                    setPrivacyConsent(event.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#252525]"
                  required
                />

                <span className="text-[11px] leading-5 text-[#777]">
                  개인정보 수집 및 이용에 동의합니다. 입력한 정보는 Gather
                  업데이트 소식 안내를 위해 사용됩니다.
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#252525] text-[13px] font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "신청 중..." : "업데이트 소식 신청하기"}
                {!submitting && <ArrowRight size={16} />}
              </button>

              {submitMessage && (
                <p
                  role="status"
                  className={`rounded-xl px-4 py-3 text-[12px] leading-5 ${
                    submitSuccess
                      ? "bg-[#edf5ee] text-[#4e7656]"
                      : "bg-[#fff3f0] text-[#9a5144]"
                  }`}
                >
                  {submitMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] px-6 py-7 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <a href="#home" className="flex w-fit items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#252525] text-white">
              <SparkleIcon size={14} />
            </div>
            <span className="text-[15px] font-semibold tracking-[-0.5px]">
              gather
            </span>
          </a>

          <p className="text-[11px] text-[#999]">
            필요한 정보에 더 쉽게 닿을 수 있도록.
          </p>
        </div>
      </footer>

      {/* Small, subtle interaction animations */}
      <style jsx global>{`
        @keyframes demoFadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .demo-fade-in {
          animation: demoFadeIn 220ms ease-out both;
        }

        @keyframes demoTyping {
          0%,
          60%,
          100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          30% {
            opacity: 1;
            transform: translateY(-2px);
          }
        }

        .typing-dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: #777;
          animation: demoTyping 900ms ease-in-out infinite;
        }

        .typing-dot.delay-1 {
          animation-delay: 150ms;
        }

        .typing-dot.delay-2 {
          animation-delay: 300ms;
        }

        @media (prefers-reduced-motion: reduce) {
          .demo-fade-in,
          .typing-dot {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}