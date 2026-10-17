"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

const jobCategories = [
  "기획 / 전략",
  "마케팅",
  "경영 / 회계",
  "영업 / 세일즈",
  "인사 / 총무",
  "기타",
];

const demoQuestions = [
  {
    id: "decision",
    label: "회의에서 결정된 내용",
    question: "지난 회의에서 최종 결정된 내용과 그 이유를 정리해 줘.",
    answer: {
      title: "회의에서 결정된 핵심 내용",
      description:
        "논의 내용을 바탕으로 주요 결정 사항과 결정 배경을 구분해 정리했습니다.",
      items: [
        {
          number: "01",
          title: "우선순위 조정",
          content:
            "신규 기능을 한 번에 확대하기보다 사용 빈도가 높은 핵심 기능부터 개선하기로 했습니다.",
          tag: "주요 결정",
        },
        {
          number: "02",
          title: "사용자 반응 확인",
          content:
            "기능 개선 이후 사용자 피드백을 수집하고, 이를 바탕으로 다음 개선 방향을 결정하기로 했습니다.",
          tag: "검토 기준",
        },
        {
          number: "03",
          title: "다음 회의에서 결과 공유",
          content:
            "개선 진행 상황과 사용자 반응을 정리해 다음 회의에서 공유하기로 했습니다.",
          tag: "후속 계획",
        },
      ],
    },
  },
  {
    id: "tasks",
    label: "후속 업무와 담당자",
    question: "회의 이후 해야 할 일과 담당자를 정리해 줘.",
    answer: {
      title: "회의 이후 실행할 업무",
      description:
        "회의에서 논의한 후속 작업을 실행 단위로 나누어 정리했습니다.",
      items: [
        {
          number: "01",
          title: "사용자 피드백 수집",
          content:
            "최근 사용자 의견을 모으고 반복적으로 언급되는 개선 요청을 분류합니다.",
          tag: "자료 정리",
        },
        {
          number: "02",
          title: "개선안 초안 작성",
          content:
            "수집한 피드백을 바탕으로 우선 개선할 항목과 실행 방안을 정리합니다.",
          tag: "기획",
        },
        {
          number: "03",
          title: "다음 회의 자료 준비",
          content:
            "진행 상황과 검토가 필요한 사항을 정리해 다음 회의에서 확인할 수 있도록 준비합니다.",
          tag: "회의 준비",
        },
      ],
    },
  },
  {
    id: "summary",
    label: "회의 내용 요약",
    question: "이번 회의의 핵심 논의와 다음에 확인할 사항을 요약해 줘.",
    answer: {
      title: "회의 핵심 요약",
      description:
        "긴 회의 기록을 핵심 논의, 결정 사항, 추가 확인 사항으로 나누어 정리했습니다.",
      items: [
        {
          number: "01",
          title: "핵심 논의",
          content:
            "사용자 경험을 개선하기 위해 현재 기능의 사용성과 불편 사항을 점검합니다.",
          tag: "논의",
        },
        {
          number: "02",
          title: "결정 사항",
          content:
            "우선순위가 높은 항목부터 개선하고, 변경 이후의 반응을 확인하기로 했습니다.",
          tag: "결정",
        },
        {
          number: "03",
          title: "추가 확인 사항",
          content:
            "개선에 필요한 자료를 확인하고 다음 회의에서 진행 상황을 공유합니다.",
          tag: "다음 단계",
        },
      ],
    },
  },
];

function ArrowRight({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M12 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowDown({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 5v14m-7-7 7 7 7-7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
      aria-hidden="true"
    >
      <path
        d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z"
        fill="currentColor"
      />
    </svg>
  );
}

function DocumentIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 3.75h7l4.25 4.5v12H7a2 2 0 0 1-2-2v-12a2.5 2.5 0 0 1 2-2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M14 4v4h4M8.5 12h7M8.5 15.5h7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="10.8"
        cy="10.8"
        r="6.8"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckCircle({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m8 12 2.5 2.5L16.5 8.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  const [selectedQuestion, setSelectedQuestion] = useState("decision");
  const [email, setEmail] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const activeQuestion =
    demoQuestions.find((item) => item.id === selectedQuestion) ??
    demoQuestions[0];

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
      setSubmitMessage("이메일을 입력해 주세요.");
      return;
    }

    if (!jobCategory) {
      setSubmitMessage("직무를 선택해 주세요.");
      return;
    }

    if (!privacyConsent) {
      setSubmitMessage("개인정보 수집 및 이용에 동의해 주세요.");
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from("experience_signups").insert({
        email: email.trim(),
        job_category: jobCategory,
        privacy_consent: true,
      });

      if (error) {
        console.error("신청 저장 오류:", error);
        setSubmitMessage(
          "신청을 저장하지 못했어요. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      setSubmitSuccess(true);
      setSubmitMessage("신청이 완료됐어요. 관심을 가져 주셔서 감사합니다!");
      setEmail("");
      setJobCategory("");
      setPrivacyConsent(false);
    } catch (error) {
      console.error("신청 처리 오류:", error);
      setSubmitMessage(
        "일시적인 오류가 발생했어요. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f8fc] text-[#191925]">

      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <a
            href="#home"
            className="flex items-center gap-2.5"
            aria-label="Gather 홈"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-gradient-to-br from-[#8577ff] via-[#7365ee] to-[#5546d8] text-white shadow-[0_4px_12px_rgba(104,87,225,0.25)]">
              <SparkleIcon size={19} />
            </div>
            <span className="text-[20px] font-semibold tracking-[-0.8px]">
              gather
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-[13px] font-medium text-[#777787] sm:flex">
            <a href="#problem" className="transition hover:text-[#242438]">
              Why Gather
            </a>
            <a href="#experience" className="transition hover:text-[#242438]">
              Experience
            </a>
          </nav>

          <button
            onClick={scrollToSignup}
            className="flex items-center gap-2 rounded-full bg-[#242238] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#49445f] sm:px-5 sm:text-[13px]"
          >
            소식 받아보기
            <ArrowRight size={15} />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative isolate px-5 pb-20 pt-36 sm:px-8 sm:pb-28 sm:pt-44 lg:px-12 lg:pt-48"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-[-100px] h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-[#e9e5ff] opacity-75 blur-[100px]" />
          <div className="absolute right-[-120px] top-[220px] h-[350px] w-[350px] rounded-full bg-[#dceeff] opacity-65 blur-[100px]" />
          <div className="absolute bottom-[-150px] left-[-100px] h-[350px] w-[350px] rounded-full bg-[#f1e5ff] opacity-60 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="gather-fade-up mb-7 inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/70 px-4 py-2 text-[11px] font-medium tracking-[0.02em] text-[#696681] shadow-[0_4px_24px_rgba(67,57,123,0.05)] sm:text-[12px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8273f6]" />
              Your work, connected.
            </div>

            <h1 className="gather-fade-up text-[39px] font-semibold leading-[1.2] tracking-[-2.3px] sm:text-[57px] sm:leading-[1.17] sm:tracking-[-3.5px] lg:text-[72px]">
              자료를 찾는 시간보다,
              <br />
              <span className="bg-gradient-to-r from-[#8172f4] via-[#7162e6] to-[#4e62cb] bg-clip-text text-transparent">
                일을 진전시키는 시간에.
              </span>
            </h1>

            <p className="gather-fade-up mx-auto mt-7 max-w-[610px] text-[14px] leading-[1.9] text-[#747486] sm:mt-8 sm:text-[16px]">
              회의 기록은 쌓이고, 필요한 정보는 흩어지고,
              <br className="hidden sm:block" />
              같은 내용을 다시 찾고 정리하는 일은 반복됩니다.
              <br />
              Gather와 함께 업무의 맥락을 찾고 다음 단계로 나아가세요.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#experience"
                className="group inline-flex min-h-[49px] items-center justify-center gap-2 rounded-full bg-[#7163e8] px-7 text-[13px] font-semibold text-white shadow-[0_8px_25px_rgba(113,99,232,0.22)] transition hover:-translate-y-0.5 hover:bg-[#6152db] hover:shadow-[0_12px_30px_rgba(113,99,232,0.3)]"
              >
                업무 흐름 살펴보기
                <ArrowRight size={16} />
              </a>

              <button
                onClick={scrollToSignup}
                className="inline-flex min-h-[49px] items-center justify-center gap-2 rounded-full border border-white bg-white/65 px-7 text-[13px] font-semibold text-[#454457] shadow-sm transition hover:bg-white"
              >
                소식 받아보기
                <ArrowDown size={15} />
              </button>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto mt-16 max-w-[940px] sm:mt-20">
            <div className="absolute left-[7%] top-[7%] h-[75%] w-[86%] rounded-[35px] bg-gradient-to-br from-[#ded9ff] to-[#e8efff] opacity-80 blur-2xl" />

            <div className="gather-glass gather-fade-up relative overflow-hidden rounded-[24px] border border-white/90 p-3 shadow-[0_30px_100px_rgba(74,64,131,0.13)] sm:rounded-[30px] sm:p-5">
              <div className="overflow-hidden rounded-[17px] border border-[#eae9f1] bg-white sm:rounded-[21px]">
                <div className="flex h-[52px] items-center justify-between border-b border-[#efedf5] px-4 sm:h-[60px] sm:px-6">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#f2b4b4]" />
                      <span className="h-2 w-2 rounded-full bg-[#f0d08b]" />
                      <span className="h-2 w-2 rounded-full bg-[#a7d9b5]" />
                    </div>
                    <span className="ml-2 text-[11px] font-medium text-[#9291a0] sm:text-[12px]">
                      Work overview
                    </span>
                  </div>
                  <span className="rounded-full bg-[#f4f1ff] px-3 py-1.5 text-[10px] font-medium text-[#7668d9] sm:text-[11px]">
                    Connected context
                  </span>
                </div>

                <div className="grid min-h-[260px] grid-cols-1 sm:grid-cols-[0.85fr_1.15fr]">
                  <div className="border-b border-[#efedf5] p-5 sm:border-b-0 sm:border-r sm:p-7">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a1a0b1]">
                      Your workspace
                    </p>

                    <h2 className="mt-3 text-[20px] font-semibold tracking-[-0.7px] sm:text-[23px]">
                      흩어진 업무 기록
                    </h2>

                    <p className="mt-2 text-[11px] leading-6 text-[#9291a0] sm:text-[12px]">
                      필요한 정보가 담긴 기록을
                      <br />
                      한곳에서 확인해 보세요.
                    </p>

                    <div className="mt-5 space-y-2.5">
                      {[
                        {
                          title: "주간 기획 회의",
                          date: "10. 14",
                          icon: "doc",
                        },
                        {
                          title: "캠페인 진행 논의",
                          date: "10. 12",
                          icon: "doc",
                        },
                        {
                          title: "프로젝트 회고",
                          date: "10. 09",
                          icon: "doc",
                        },
                      ].map((file) => (
                        <div
                          key={file.title}
                          className="flex items-center gap-3 rounded-[12px] border border-[#f0eef6] bg-[#fcfbff] p-3"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#eeebff] text-[#7668df]">
                            <DocumentIcon size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[11px] font-medium text-[#4d4c5d] sm:text-[12px]">
                              {file.title}
                            </p>
                            <p className="mt-1 text-[10px] text-[#a3a1b0]">
                              회의 기록
                            </p>
                          </div>
                          <span className="shrink-0 text-[10px] text-[#aaa9b8]">
                            {file.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-white to-[#faf9ff] p-5 sm:p-7">
                    <div className="flex items-center gap-2 text-[#7567df]">
                      <SparkleIcon size={18} />
                      <span className="text-[11px] font-semibold">
                        Ask your work
                      </span>
                    </div>

                    <div className="mt-5 rounded-[15px] border border-[#e9e5fb] bg-white p-4 shadow-[0_4px_18px_rgba(72,60,140,0.04)] sm:p-5">
                      <p className="text-[12px] leading-6 text-[#4f4d60] sm:text-[13px]">
                        지난 회의에서 결정된 내용과
                        <br className="hidden sm:block" />
                        다음에 해야 할 일을 정리해 줘.
                      </p>
                    </div>

                    <div className="gather-float mt-4 rounded-[15px] border border-[#ebe7ff] bg-white/90 p-4 sm:p-5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eeeaff] text-[#7464e5]">
                          <SparkleIcon size={15} />
                        </div>
                        <span className="text-[12px] font-semibold text-[#424054]">
                          핵심 내용 정리
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        {[
                          "주요 결정 사항 확인",
                          "후속 업무와 진행 방향 정리",
                          "다음 회의 준비 항목 확인",
                        ].map((item) => (
                          <div
                            key={item}
                            className="flex items-start gap-2.5 text-[11px] leading-5 text-[#767487] sm:text-[12px]"
                          >
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#f0edff] text-[#7667e5]">
                              <CheckIcon size={11} />
                            </span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="mt-4 text-center text-[10px] text-[#aaa8b8]">
                      Find context. Move work forward.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-5 left-1/2 hidden -translate-x-1/2 rounded-full border border-white/90 bg-white/85 px-5 py-2.5 text-[11px] text-[#77748e] shadow-[0_8px_25px_rgba(61,51,117,0.07)] backdrop-blur-xl sm:block">
              필요한 맥락을 찾고, 다음 업무로 연결하세요.
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section
        id="problem"
        className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.19em] text-[#8173e7]">
              The everyday friction
            </p>

            <h2 className="mt-5 text-[29px] font-semibold leading-[1.35] tracking-[-1.5px] sm:text-[43px] sm:tracking-[-2px]">
              일보다 자료를 찾는 데
              <br className="sm:hidden" />{" "}
              더 많은 시간을 쓰고 있나요?
            </h2>

            <p className="mx-auto mt-5 max-w-[590px] text-[13px] leading-[1.95] text-[#828193] sm:text-[15px]">
              필요한 정보는 분명 어딘가에 있는데,
              <br className="hidden sm:block" />
              다시 찾고 확인하고 정리하는 과정은 매번 반복됩니다.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-3">
            {[
              {
                number: "01",
                title: "찾고 싶은 기록이 있다",
                description:
                  "지난 회의에서 무슨 이야기를 했는지, 어떤 결정을 내렸는지 다시 찾아봅니다.",
                icon: <SearchIcon size={21} />,
              },
              {
                number: "02",
                title: "읽고 정리하는 일이 남는다",
                description:
                  "긴 기록을 다시 읽고, 중요한 내용과 필요한 정보를 직접 골라냅니다.",
                icon: <DocumentIcon size={21} />,
              },
              {
                number: "03",
                title: "결국 다시 확인한다",
                description:
                  "결정 사항과 다음 할 일을 다시 정리하고 공유하는 과정이 이어집니다.",
                icon: <CheckCircle size={21} />,
              },
            ].map((item) => (
              <article
                key={item.number}
                className="rounded-[22px] border border-white bg-white/75 p-6 shadow-[0_8px_35px_rgba(58,50,104,0.035)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_45px_rgba(58,50,104,0.075)] sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold tracking-[0.12em] text-[#aaa7c0]">
                    {item.number}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#f0edff] text-[#7768e5]">
                    {item.icon}
                  </div>
                </div>

                <h3 className="mt-7 text-[16px] font-semibold tracking-[-0.5px] sm:text-[17px]">
                  {item.title}
                </h3>

                <p className="mt-3 text-[12px] leading-[1.9] text-[#858395] sm:text-[13px]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Transition */}
      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[27px] bg-gradient-to-br from-[#29243f] via-[#343052] to-[#4c4775] px-6 py-12 text-center text-white shadow-[0_25px_75px_rgba(47,40,85,0.15)] sm:rounded-[32px] sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#8f81ff]/25 blur-[70px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-[#8ebaff]/15 blur-[65px]" />

          <div className="relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[17px] border border-white/15 bg-white/10 text-[#d9d3ff]">
              <SparkleIcon size={24} />
            </div>

            <h2 className="mt-6 text-[26px] font-semibold leading-[1.4] tracking-[-1.2px] sm:text-[38px] sm:tracking-[-1.8px]">
              이미 쌓인 업무 기록,
              <br />
              다음 업무의 출발점으로.
            </h2>

            <p className="mx-auto mt-4 max-w-[530px] text-[12px] leading-[1.9] text-white/65 sm:text-[14px]">
              기억에만 의존하거나 같은 자료를 반복해서 찾는 대신,
              <br className="hidden sm:block" />
              필요한 맥락을 확인하고 실행할 일에 집중해 보세요.
            </p>

            <a
              href="#experience"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[12px] font-semibold text-[#35304f] transition hover:-translate-y-0.5 hover:bg-[#f2efff] sm:text-[13px]"
            >
              업무 흐름 살펴보기
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* Interactive experience */}
      <section
        id="experience"
        className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.19em] text-[#8173e7]">
              Explore the workflow
            </p>

            <h2 className="mt-5 text-[29px] font-semibold leading-[1.35] tracking-[-1.5px] sm:text-[43px] sm:tracking-[-2px]">
              필요한 정보를 물어보고,
              <br />
              다음 할 일까지 정리하기
            </h2>

            <p className="mx-auto mt-5 max-w-[560px] text-[13px] leading-[1.95] text-[#828193] sm:text-[15px]">
              회의 기록을 다시 읽는 대신, 확인하고 싶은 내용을 질문해 보세요.
              <br className="hidden sm:block" />
              아래 질문을 선택하면 정보가 정리되는 흐름을 살펴볼 수 있어요.
            </p>
          </div>

          <div className="mt-11 overflow-hidden rounded-[25px] border border-white bg-white/80 shadow-[0_20px_75px_rgba(59,50,111,0.08)] sm:mt-14 sm:rounded-[30px]">
            {/* Demo header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#efedf5] px-5 py-4 sm:px-7 sm:py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#8d7dff] to-[#6556d9] text-white">
                  <SparkleIcon size={19} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold tracking-[-0.3px]">
                    Work assistant
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#9b99ab]">
                    회의 기록에서 필요한 정보 찾기
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 rounded-full bg-[#f4f1ff] px-3 py-1.5 text-[10px] font-medium text-[#7769df]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8879f4]" />
                Interactive example
              </div>
            </div>

            <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
              {/* Questions */}
              <div className="border-b border-[#efedf5] bg-[#fbfaff] p-5 sm:p-7 lg:border-b-0 lg:border-r">
                <div className="flex items-center gap-2">
                  <DocumentIcon size={16} />
                  <h3 className="text-[12px] font-semibold text-[#535165]">
                    어떤 정보가 필요하세요?
                  </h3>
                </div>

                <p className="mt-2 text-[11px] leading-5 text-[#9a98aa]">
                  확인하고 싶은 업무를 선택해 보세요.
                </p>

                <div className="mt-5 space-y-3">
                  {demoQuestions.map((item) => {
                    const active = selectedQuestion === item.id;

                    return (
                      <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedQuestion(item.id)}
                          aria-pressed={active}
                          className={`group w-full rounded-[16px] border p-4 text-left transition duration-200 ${
                            active
                              ? "border-[#bdb4ff] bg-white shadow-[0_5px_20px_rgba(108,93,216,0.09)]"
                              : "border-[#eeecf4] bg-white/60 hover:border-[#d9d3fa] hover:bg-white"
                          }`}
                        >                 
                        <div className="flex items-center justify-between gap-3">
                          <span
                            className={`text-[12px] font-semibold ${
                              active ? "text-[#6c5cda]" : "text-[#565467]"
                            }`}
                          >
                            {item.label}
                          </span>

                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                              active
                                ? "border-[#7768e6] bg-[#7768e6] text-white"
                                : "border-[#dcd9e8] text-transparent"
                            }`}
                          >
                            <CheckIcon size={12} />
                          </span>
                        </div>

                        <p className="mt-2 text-[11px] leading-[1.8] text-[#8c8a9c]">
                          {item.question}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-[14px] border border-[#eae7fb] bg-[#f5f2ff] p-4">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 text-[#7b6de0]">
                      <SparkleIcon size={16} />
                    </div>
                    <p className="text-[10px] leading-[1.8] text-[#79738f]">
                      질문에 따라 필요한 정보와 후속 업무를 구분해 확인할 수
                      있습니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* Answer */}
              <div className="min-w-0 p-5 sm:p-7 lg:p-8">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eeeaff] text-[#7464df]">
                    <SparkleIcon size={14} />
                  </span>
                  <span className="text-[11px] font-semibold text-[#76738d]">
                    질문
                  </span>
                </div>

                <div className="mt-3 rounded-[15px] border border-[#e9e6f3] bg-[#faf9fd] p-4 sm:p-5">
                  <p className="text-[12px] leading-[1.9] text-[#535166] sm:text-[13px]">
                    {activeQuestion.question}
                  </p>
                </div>

                <div
                  key={selectedQuestion}
                  className="gather-fade-up mt-7"
                  aria-live="polite"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#8d7dff] to-[#6556d9] text-white">
                      <SparkleIcon size={15} />
                    </div>
                    <span className="text-[12px] font-semibold text-[#454359]">
                      정리된 내용
                    </span>
                  </div>

                  <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.7px] sm:text-[22px]">
                    {activeQuestion.answer.title}
                  </h3>

                  <p className="mt-2 text-[11px] leading-[1.9] text-[#9290a1] sm:text-[12px]">
                    {activeQuestion.answer.description}
                  </p>

                  <div className="mt-5 space-y-3">
                    {activeQuestion.answer.items.map((item) => (
                      <article
                        key={item.number}
                        className="rounded-[15px] border border-[#eeecf5] bg-white p-4 transition hover:border-[#ddd7fa] sm:p-5"
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-[#f1efff] text-[10px] font-semibold text-[#7869e0]">
                            {item.number}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-[12px] font-semibold text-[#4b495d] sm:text-[13px]">
                                {item.title}
                              </h4>
                              <span className="rounded-full bg-[#f5f3fb] px-2 py-1 text-[9px] font-medium text-[#8b86a7]">
                                {item.tag}
                              </span>
                            </div>

                            <p className="mt-2 text-[11px] leading-[1.9] text-[#898799] sm:text-[12px]">
                              {item.content}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="mt-5 flex items-start gap-3 rounded-[15px] bg-gradient-to-r from-[#f3f0ff] to-[#f6f8ff] p-4">
                    <span className="mt-0.5 text-[#7869df]">
                      <CheckCircle size={17} />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold text-[#57536e]">
                        다음 단계까지 한눈에
                      </p>
                      <p className="mt-1 text-[10px] leading-[1.8] text-[#85819e]">
                        결정 사항과 후속 업무를 구분하면 다음에 무엇을 확인하고
                        실행해야 할지 더 명확해집니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#efedf5] bg-white/70 px-5 py-3.5 sm:px-7">
              <p className="text-[10px] leading-5 text-[#a19eaf]">
                위 화면은 업무 흐름을 이해하기 위한 예시입니다. 실제 답변은
                연결된 기록과 사용 가능한 기능에 따라 달라질 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.19em] text-[#8173e7]">
              Less searching, more doing
            </p>

            <h2 className="mt-5 text-[29px] font-semibold leading-[1.4] tracking-[-1.5px] sm:text-[40px] sm:tracking-[-2px]">
              반복되는 정리에서 벗어나
              <br />
              다음 일에 집중하세요.
            </h2>

            <p className="mt-5 max-w-[440px] text-[13px] leading-[2] text-[#828193] sm:text-[14px]">
              업무 기록을 다시 확인하고, 필요한 정보를 추리고, 실행할 일을
              정리하는 과정. 그 반복을 줄이고 실제로 일을 진전시키는 데 더
              많은 시간을 쓸 수 있도록.
            </p>

            <button
              onClick={scrollToSignup}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#7163e8] px-6 py-3.5 text-[12px] font-semibold text-white shadow-[0_6px_20px_rgba(113,99,232,0.18)] transition hover:-translate-y-0.5 hover:bg-[#6152db]"
            >
              업데이트 받아보기
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-[21px] border border-white bg-white/80 p-6 shadow-[0_8px_30px_rgba(58,50,104,0.035)] sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#f0edff] text-[#7667df]">
                <SearchIcon size={22} />
              </div>
              <h3 className="mt-6 text-[15px] font-semibold tracking-[-0.4px]">
                필요한 맥락 찾기
              </h3>
              <p className="mt-2 text-[12px] leading-[1.9] text-[#898799]">
                과거 기록을 다시 살펴보며 필요한 정보를 확인합니다.
              </p>
            </article>

            <article className="rounded-[21px] border border-white bg-white/80 p-6 shadow-[0_8px_30px_rgba(58,50,104,0.035)] sm:mt-9 sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#eaf3ff] text-[#5f8bd5]">
                <DocumentIcon size={22} />
              </div>
              <h3 className="mt-6 text-[15px] font-semibold tracking-[-0.4px]">
                핵심 내용 정리
              </h3>
              <p className="mt-2 text-[12px] leading-[1.9] text-[#898799]">
                긴 기록 속에서 결정 사항과 필요한 정보를 구분합니다.
              </p>
            </article>

            <article className="rounded-[21px] border border-white bg-white/80 p-6 shadow-[0_8px_30px_rgba(58,50,104,0.035)] sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#e8f7f0] text-[#4d9b79]">
                <CheckCircle size={22} />
              </div>
              <h3 className="mt-6 text-[15px] font-semibold tracking-[-0.4px]">
                후속 업무 연결
              </h3>
              <p className="mt-2 text-[12px] leading-[1.9] text-[#898799]">
                회의에서 나온 내용을 다음 실행 단계로 이어갑니다.
              </p>
            </article>

            <article className="rounded-[21px] border border-white bg-white/80 p-6 shadow-[0_8px_30px_rgba(58,50,104,0.035)] sm:mt-9 sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#fff0e8] text-[#d38b61]">
                <SparkleIcon size={22} />
              </div>
              <h3 className="mt-6 text-[15px] font-semibold tracking-[-0.4px]">
                업무에 집중하기
              </h3>
              <p className="mt-2 text-[12px] leading-[1.9] text-[#898799]">
                반복되는 자료 확인과 정리에 쓰는 시간을 줄이는 데 집중합니다.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Signup */}
      <section
        id="signup"
        className="scroll-mt-20 px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16 lg:px-12"
      >
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-white bg-white/80 shadow-[0_20px_75px_rgba(59,50,111,0.08)] sm:rounded-[34px]">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#e5dfff] opacity-75 blur-[75px]" />
          <div className="pointer-events-none absolute -bottom-28 -left-12 h-64 w-64 rounded-full bg-[#e3efff] opacity-70 blur-[75px]" />

          <div className="relative grid lg:grid-cols-[1fr_0.9fr]">
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-gradient-to-br from-[#8d7dff] to-[#6556d9] text-white shadow-[0_6px_18px_rgba(108,93,216,0.2)]">
                <SparkleIcon size={23} />
              </div>

              <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8173e7]">
                Stay connected
              </p>

              <h2 className="mt-4 text-[29px] font-semibold leading-[1.4] tracking-[-1.4px] sm:text-[38px] sm:tracking-[-1.8px]">
                더 나은 업무 흐름을
                <br />
                가장 먼저 만나보세요.
              </h2>

              <p className="mt-4 max-w-[390px] text-[12px] leading-[1.95] text-[#858395] sm:text-[13px]">
                업무에서 겪는 불편을 어떻게 줄일 수 있을지 함께 살펴봐요.
                업데이트와 관련 소식을 이메일로 전해드릴게요.
              </p>

              <div className="mt-7 space-y-3">
                {[
                  "관심 직무에 맞는 소식",
                  "새로운 업무 활용 사례",
                  "서비스 업데이트 안내",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 text-[12px] text-[#77758a]"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#eeebff] text-[#7668e0]">
                      <CheckIcon size={12} />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#eeecf5] bg-white/60 p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              {submitSuccess ? (
                <div className="flex h-full min-h-[330px] flex-col items-center justify-center text-center gather-fade-up">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f7ef] text-[#42976c]">
                    <CheckIcon size={30} />
                  </div>

                  <h3 className="mt-6 text-[21px] font-semibold tracking-[-0.8px]">
                    신청이 완료됐어요.
                  </h3>

                  <p className="mt-3 max-w-[270px] text-[12px] leading-[1.9] text-[#898799]">
                    관심을 가져 주셔서 감사합니다.
                    <br />
                    새로운 소식이 있으면 이메일로 전해드릴게요.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-[17px] font-semibold tracking-[-0.5px]">
                      소식 받아보기
                    </h3>
                    <p className="mt-2 text-[11px] leading-5 text-[#9694a5]">
                      이메일과 관심 직무를 입력해 주세요.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-[11px] font-semibold text-[#575568]"
                      >
                        이메일
                        <span className="ml-1 text-[#8374eb]">*</span>
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="name@example.com"
                        className="h-[47px] w-full rounded-[12px] border border-[#e9e7f0] bg-white px-4 text-[12px] text-[#39374b] outline-none transition placeholder:text-[#b5b3c1] focus:border-[#a79bf5] focus:ring-4 focus:ring-[#8173e7]/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="jobCategory"
                        className="mb-2 block text-[11px] font-semibold text-[#575568]"
                      >
                        관심 직무
                        <span className="ml-1 text-[#8374eb]">*</span>
                      </label>

                      <select
                        id="jobCategory"
                        name="job_category"
                        required
                        value={jobCategory}
                        onChange={(event) =>
                          setJobCategory(event.target.value)
                        }
                        className={`h-[47px] w-full rounded-[12px] border border-[#e9e7f0] bg-white px-4 text-[12px] outline-none transition focus:border-[#a79bf5] focus:ring-4 focus:ring-[#8173e7]/10 ${
                          jobCategory ? "text-[#39374b]" : "text-[#b5b3c1]"
                        }`}
                      >
                        <option value="" disabled>
                          관심 있는 직무를 선택해 주세요
                        </option>
                        {jobCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="rounded-[12px] border border-[#eeecf5] bg-white/80 p-3.5">
                      <label
                        htmlFor="privacyConsent"
                        className="flex cursor-pointer items-start gap-2.5"
                      >
                        <input
                          id="privacyConsent"
                          name="privacy_consent"
                          type="checkbox"
                          required
                          checked={privacyConsent}
                          onChange={(event) =>
                            setPrivacyConsent(event.target.checked)
                          }
                          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#7163e8]"
                        />

                        <span className="text-[10px] leading-[1.8] text-[#79778b]">
                          <span className="font-semibold text-[#555368]">
                            [필수] 개인정보 수집 및 이용에 동의합니다.
                          </span>
                          <br />
                          수집 항목: 이메일, 관심 직무
                          <br />
                          이용 목적: 서비스 관련 소식 및 업데이트 안내
                          <br />
                          보유 기간: 수집 목적 달성 후 파기
                        </span>
                      </label>
                    </div>

                    {submitMessage && (
                      <p
                        role="status"
                        className={`text-[11px] leading-5 ${
                          submitSuccess ? "text-[#32835c]" : "text-[#c65f6d]"
                        }`}
                      >
                        {submitMessage}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="group flex h-[49px] w-full items-center justify-center gap-2 rounded-full bg-[#7163e8] text-[12px] font-semibold text-white shadow-[0_7px_20px_rgba(113,99,232,0.18)] transition hover:bg-[#6152db] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? "신청 중..." : "소식 받아보기"}
                      {!submitting && <ArrowRight size={15} />}
                    </button>

                    <p className="text-center text-[10px] leading-5 text-[#aaa8b6]">
                      필수 항목을 입력하고 개인정보 수집 및 이용에 동의하면
                      신청할 수 있습니다.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#ebe9f2] bg-white/50 px-5 py-7 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <a href="#home" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-gradient-to-br from-[#8577ff] to-[#5546d8] text-white">
              <SparkleIcon size={16} />
            </div>
            <span className="text-[16px] font-semibold tracking-[-0.6px]">
              gather
            </span>
          </a>

          <p className="text-[10px] leading-5 text-[#aaa8b7]">
            Make room for the work that matters.
          </p>

          <a
            href="#home"
            className="text-[11px] font-medium text-[#858296] transition hover:text-[#6f60dc]"
          >
            Back to top ↑
          </a>
        </div>
      </footer>
    </main>
  );
}