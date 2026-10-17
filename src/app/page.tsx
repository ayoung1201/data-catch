"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

function ArrowRight({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function ArrowDown({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  );
}

function CheckIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function SparkleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" />
      <path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" />
    </svg>
  );
}

function DocumentIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
    </svg>
  );
}

function SearchIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function CheckCircle({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Demo data                                                                  */
/* -------------------------------------------------------------------------- */

const demoDocuments = [
  {
    id: "feedback",
    name: "고객 피드백 정리.pdf",
    pages: 12,
    type: "고객 데이터",
  },
  {
    id: "guide",
    name: "마케팅 운영 가이드.pdf",
    pages: 18,
    type: "운영 문서",
  },
  {
    id: "service",
    name: "서비스 소개서.pdf",
    pages: 9,
    type: "기획 문서",
  },
];

const demoResults = {
  feedback: {
    fileName: "고객 피드백 정리.pdf",
    page: 3,
    title: "가입 과정에서 반복적으로 언급된 불편",
    excerpt:
      "가입 과정에서 본인 인증 절차가 복잡하고, 다음 단계로 넘어가는 방법을 이해하기 어렵다는 의견이 반복적으로 확인되었습니다.",
  },
  guide: {
    fileName: "마케팅 운영 가이드.pdf",
    page: 5,
    title: "가입 절차 개선 시 확인할 운영 기준",
    excerpt:
      "가입 과정의 변경 사항을 검토할 때는 고객 인증 절차, 단계별 안내 문구, 가입 완료 기준을 함께 확인합니다.",
  },
};

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function Home() {
  const [demoStep, setDemoStep] = useState<1 | 2>(1);
  const [showFollowUp, setShowFollowUp] = useState(false);

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

  const startDemo = () => {
    setDemoStep(1);
    setShowFollowUp(false);
  };

  return (
    <main className="min-h-screen bg-[#fafaf9] text-[#202124]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#fafaf9]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-6 md:px-10">
          <a href="#home" className="flex items-center gap-2.5" aria-label="Gather 홈">
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
              <span className="text-[#929292]">
                필요한 정보만 빠르게.
              </span>
            </h1>

            <p className="mt-7 max-w-[470px] text-[15px] leading-7 text-[#696969] md:text-[16px]">
              자료가 쌓일수록 필요한 정보를 찾는 일은 어려워집니다.
              <br className="hidden md:block" />
              Gather와 함께 필요한 맥락을 찾고 다음 단계로 나아가세요.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("experience")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
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
                  <div className="text-[13px] font-semibold">내 업무 자료</div>
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
                    예: 환불 정책, 고객 요구사항...
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
            찾고 싶은 내용을 입력하고 관련된 정보를 확인하세요.
            <br className="hidden md:block" />
            중요한 것은 자료의 양이 아니라, 필요한 맥락에 빠르게 도달하는 일입니다.
          </p>

          <div className="mt-8 flex justify-center text-[#999]">
            <ArrowDown size={20} />
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
              필요한 정보, 자료 속에서 찾아보세요.
            </h2>

            <p className="mt-4 text-[14px] leading-7 text-[#777] md:text-[15px]">
              여러 업무 자료를 하나씩 열어보는 대신,
              <br className="hidden md:block" />
              질문을 통해 관련 내용과 근거 자료를 확인해 보세요.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-[760px] overflow-hidden rounded-[24px] border border-black/[0.09] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.05)]">
            {/* Demo header */}
            <div className="flex items-center justify-between border-b border-black/[0.07] bg-[#fafaf9] px-5 py-4 md:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#252525] text-white">
                  <SearchIcon size={17} />
                </div>

                <div>
                  <div className="text-[13px] font-semibold">
                    업무 자료 검색
                  </div>
                  <div className="mt-0.5 text-[10px] text-[#888]">
                    검색부터 근거 확인까지
                  </div>
                </div>
              </div>

              <span className="rounded-full border border-black/[0.07] bg-white px-3 py-1.5 text-[10px] text-[#777]">
                Interactive demo
              </span>
            </div>

            <div className="p-5 md:p-8">
              {/* Documents */}
              <div className="mb-7">
                <div className="mb-3 text-[12px] font-semibold">
                  연결된 업무 자료
                </div>

                <div className="space-y-2">
                  {demoDocuments.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center gap-3 rounded-xl border border-black/[0.06] p-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5f5f3] text-[#666]">
                        <DocumentIcon size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12px] font-medium">
                          {document.name}
                        </div>
                        <div className="mt-1 text-[10px] text-[#999]">
                          {document.pages}페이지 · {document.type}
                        </div>
                      </div>

                      <span className="text-[#63816a]">
                        <CheckCircle size={17} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* First question */}
              <div className="border-t border-black/[0.07] pt-6">
                <div className="mb-3 text-[12px] font-semibold">
                  01. 무엇이 궁금하신가요?
                </div>

                <button
                  type="button"
                  onClick={startDemo}
                  className="w-full rounded-xl border border-black/[0.09] bg-[#fafaf9] p-4 text-left transition hover:border-black/[0.2]"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-[#777]">
                      <SearchIcon size={17} />
                    </div>

                    <div>
                      <div className="text-[12px] font-medium leading-5">
                        고객들이 가장 많이 불편해한 부분은 뭐였지?
                      </div>
                      <div className="mt-1 text-[10px] text-[#999]">
                        예시 질문을 선택해 결과를 확인하세요.
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* First result */}
              {demoStep === 1 && (
                <div className="mt-5 overflow-hidden rounded-2xl border border-[#dfe8df] bg-[#fbfdfb]">
                  <div className="flex items-center gap-2 border-b border-[#e6ece6] px-4 py-3.5">
                    <span className="text-[#63816a]">
                      <CheckCircle size={18} />
                    </span>
                    <span className="text-[12px] font-semibold">
                      관련 자료를 찾았어요
                    </span>
                  </div>

                  <div className="p-4 md:p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#666]">
                        <DocumentIcon size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-semibold">
                          {demoResults.feedback.fileName}
                        </div>

                        <div className="mt-1.5 inline-flex rounded-md bg-[#edf3ed] px-2 py-1 text-[10px] text-[#57735c]">
                          출처 · {demoResults.feedback.page}페이지
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-black/[0.06] bg-white p-4">
                      <div className="mb-2 text-[10px] font-medium text-[#999]">
                        {demoResults.feedback.title}
                      </div>

                      <p className="text-[12px] leading-7 text-[#4e4e4e]">
                        {demoResults.feedback.excerpt}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowFollowUp((previous) => !previous)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#252525] px-4 py-3.5 text-[12px] font-medium text-white transition hover:bg-black"
                    >
                      {showFollowUp
                        ? "후속 질문 닫기"
                        : "관련 운영 기준까지 확인하기"}
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* Follow-up question and result */}
              {showFollowUp && (
                <div className="mt-5">
                  <div className="mb-3 text-[12px] font-semibold">
                    02. 관련 자료까지 살펴볼까요?
                  </div>

                  <div className="rounded-xl border border-black/[0.09] bg-[#fafaf9] p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-[#777]">
                        <SparkleIcon size={17} />
                      </div>

                      <p className="text-[12px] leading-6">
                        이 문제를 개선하려면 운영 가이드에서 어떤 기준을 확인해야 할까?
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-2xl border border-[#dfe8df] bg-[#fbfdfb]">
                    <div className="flex items-center gap-2 border-b border-[#e6ece6] px-4 py-3.5">
                      <span className="text-[#63816a]">
                        <CheckCircle size={18} />
                      </span>
                      <span className="text-[12px] font-semibold">
                        관련 운영 기준
                      </span>
                    </div>

                    <div className="p-4 md:p-5">
                      <p className="text-[12px] leading-7 text-[#4e4e4e]">
                        가입 과정의 불편을 줄이려면 고객 인증 절차와 단계별 안내
                        문구, 가입 완료 기준을 함께 확인하는 것이 좋습니다.
                      </p>

                      <div className="mt-4 rounded-xl border border-black/[0.06] bg-white p-4">
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 text-[#666]">
                            <DocumentIcon size={19} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="text-[12px] font-semibold">
                              {demoResults.guide.fileName}
                            </div>

                            <div className="mt-1.5 inline-flex rounded-md bg-[#edf3ed] px-2 py-1 text-[10px] text-[#57735c]">
                              출처 · {demoResults.guide.page}페이지
                            </div>

                            <p className="mt-3 text-[11px] leading-6 text-[#777]">
                              {demoResults.guide.excerpt}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={scrollToSignup}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-black/[0.1] bg-white px-4 py-3.5 text-[12px] font-medium transition hover:bg-[#f5f5f3]"
                      >
                        Gather 업데이트 소식 받기
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Demo disclaimer */}
              <div className="mt-5 rounded-xl bg-[#f7f7f5] p-4">
                <p className="text-[11px] leading-5 text-[#858585]">
                  검색 결과와 페이지 번호는 체험을 위해 미리 구성한 예시입니다.
                </p>
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
    </main>
  );
}