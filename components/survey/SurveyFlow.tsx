"use client";

import { useEffect, useReducer, useRef } from "react";
import { questions } from "@/lib/questions";
import { type Unit } from "@/lib/constants";
import { WelcomeScreen } from "./WelcomeScreen";
import { BannerHeader } from "./BannerHeader";
import { UnitSelector } from "./UnitSelector";
import { QuestionList } from "./QuestionList";
import { ContactStage } from "./ContactStage";
import { ConfirmationScreen } from "./ConfirmationScreen";
import { Button } from "@/components/ui/Button";

type Stage = "welcome" | "questions" | "contact" | "confirmation";

interface State {
  stage: Stage;
  unit: Unit | null;
  answers: Record<string, number | null | undefined>;
  comments: Record<string, string>;
  errors: {
    unit?: string;
    questions?: Record<string, string>;
    email?: string;
  };
  name: string;
  email: string;
  submitting: boolean;
  submitError: string | null;
  submissionId: string;
}

type Action =
  | { type: "SKIP_WELCOME" }
  | { type: "SET_UNIT"; unit: Unit }
  | { type: "SET_ANSWER"; questionId: string; value: number | null }
  | { type: "SET_COMMENT"; questionId: string; value: string }
  | { type: "VALIDATE_STAGE1_FAIL"; errors: State["errors"] }
  | { type: "GO_TO_CONTACT" }
  | { type: "GO_BACK_TO_QUESTIONS" }
  | { type: "SET_NAME"; value: string }
  | { type: "SET_EMAIL"; value: string }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_ERROR"; message: string }
  | { type: "SUBMIT_EMAIL_INVALID"; message: string }
  | { type: "RESET" };

function makeSubmissionId() {
  return crypto.randomUUID();
}

function initialState(): State {
  return {
    stage: "welcome",
    unit: null,
    answers: {},
    comments: {},
    errors: {},
    name: "",
    email: "",
    submitting: false,
    submitError: null,
    submissionId: makeSubmissionId(),
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SKIP_WELCOME":
      return { ...state, stage: "questions" };
    case "SET_UNIT":
      return {
        ...state,
        unit: action.unit,
        errors: { ...state.errors, unit: undefined },
      };
    case "SET_ANSWER":
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.value },
        errors: {
          ...state.errors,
          questions: { ...state.errors.questions, [action.questionId]: "" },
        },
      };
    case "SET_COMMENT":
      return {
        ...state,
        comments: { ...state.comments, [action.questionId]: action.value },
      };
    case "VALIDATE_STAGE1_FAIL":
      return { ...state, errors: action.errors };
    case "GO_TO_CONTACT":
      return { ...state, stage: "contact", errors: {} };
    case "GO_BACK_TO_QUESTIONS":
      return { ...state, stage: "questions" };
    case "SET_NAME":
      return { ...state, name: action.value };
    case "SET_EMAIL":
      return { ...state, email: action.value, errors: { ...state.errors, email: undefined } };
    case "SUBMIT_START":
      return { ...state, submitting: true, submitError: null };
    case "SUBMIT_SUCCESS":
      return { ...state, submitting: false, stage: "confirmation" };
    case "SUBMIT_ERROR":
      return { ...state, submitting: false, submitError: action.message };
    case "SUBMIT_EMAIL_INVALID":
      return {
        ...state,
        submitting: false,
        errors: { ...state.errors, email: action.message },
      };
    case "RESET":
      return initialState();
    default:
      return state;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SurveyPayload {
  submissionId: string;
  unit: Unit | null;
  answers: Record<string, number | null | undefined>;
  comments: Record<string, string>;
  name: string;
  email: string;
  anonymous: boolean;
}

async function postSurvey(payload: SurveyPayload) {
  return fetch("/api/survey", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function SurveyFlow() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const unitRef = useRef<HTMLDivElement | null>(null);
  const questionRefs = useRef(new Map<string, HTMLDivElement>());
  const submittingRef = useRef(false);
  const pendingScrollTarget = useRef<string | null>(null);

  useEffect(() => {
    if (!pendingScrollTarget.current) return;
    const targetId = pendingScrollTarget.current;
    pendingScrollTarget.current = null;
    const el =
      targetId === "unit" ? unitRef.current : questionRefs.current.get(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus();
    }
  }, [state.errors]);

  function handleContinue() {
    const errors: State["errors"] = { questions: {} };
    let firstInvalid: string | null = null;

    if (!state.unit) {
      errors.unit = "Selecciona una sede para continuar.";
      firstInvalid = "unit";
    }

    for (const q of questions) {
      const answered = q.id in state.answers && state.answers[q.id] !== undefined;
      if (!answered) {
        errors.questions![q.id] = "Falta calificar esta pregunta.";
        if (!firstInvalid) firstInvalid = q.id;
      }
    }

    const hasErrors = Boolean(errors.unit) || Object.keys(errors.questions!).length > 0;

    if (hasErrors) {
      dispatch({ type: "VALIDATE_STAGE1_FAIL", errors });
      pendingScrollTarget.current = firstInvalid;
      return;
    }

    dispatch({ type: "GO_TO_CONTACT" });

    // Guarda las calificaciones como "Usuario Anónimo" apenas termina de
    // calificar, antes de mostrar los datos de contacto opcionales — así, si
    // cierra el navegador sin llegar a enviar, sus notas ya quedaron
    // archivadas. El envío final (con o sin nombre/correo) actualiza esta
    // misma fila en vez de crear una duplicada (ver app/api/survey/route.ts).
    postSurvey({
      submissionId: state.submissionId,
      unit: state.unit,
      answers: state.answers,
      comments: state.comments,
      name: "",
      email: "",
      anonymous: true,
    }).catch(() => {
      // Si falla (p. ej. sin conexión), el envío final igual crea la fila.
    });
  }

  async function doSubmit(anonymous: boolean) {
    if (submittingRef.current) return;

    if (!anonymous && state.email.trim() && !EMAIL_RE.test(state.email.trim())) {
      dispatch({ type: "SUBMIT_EMAIL_INVALID", message: "El correo no tiene un formato válido." });
      return;
    }

    submittingRef.current = true;
    dispatch({ type: "SUBMIT_START" });

    try {
      const res = await postSurvey({
        submissionId: state.submissionId,
        unit: state.unit,
        answers: state.answers,
        comments: state.comments,
        name: anonymous ? "" : state.name,
        email: anonymous ? "" : state.email,
        anonymous,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || "No se pudo enviar la encuesta. Intenta de nuevo.");
      }

      dispatch({ type: "SUBMIT_SUCCESS" });
    } catch (err) {
      dispatch({
        type: "SUBMIT_ERROR",
        message: err instanceof Error ? err.message : "Ocurrió un error inesperado.",
      });
    } finally {
      submittingRef.current = false;
    }
  }

  if (state.stage === "welcome") {
    return <WelcomeScreen onDone={() => dispatch({ type: "SKIP_WELCOME" })} />;
  }

  if (state.stage === "confirmation") {
    return <ConfirmationScreen onFinish={() => dispatch({ type: "RESET" })} />;
  }

  return (
    <div>
      <BannerHeader />

      {state.stage === "questions" && (
        <div className="pb-16">
          <UnitSelector
            value={state.unit}
            onChange={(unit) => dispatch({ type: "SET_UNIT", unit })}
            error={state.errors.unit}
            innerRef={(el) => (unitRef.current = el)}
          />

          <div className="mt-10">
            <QuestionList
              answers={state.answers}
              onChange={(questionId, value) =>
                dispatch({ type: "SET_ANSWER", questionId, value })
              }
              errors={state.errors.questions}
              registerRef={(id, el) => {
                if (el) questionRefs.current.set(id, el);
                else questionRefs.current.delete(id);
              }}
              comments={state.comments}
              onCommentChange={(questionId, value) =>
                dispatch({ type: "SET_COMMENT", questionId, value })
              }
            />
          </div>

          <div className="mx-auto mt-8 max-w-3xl px-6">
            <Button onClick={handleContinue} className="w-full sm:w-auto">
              Continuar
            </Button>
          </div>
        </div>
      )}

      {state.stage === "contact" && (
        <>
          <ContactStage
            name={state.name}
            email={state.email}
            onNameChange={(value) => dispatch({ type: "SET_NAME", value })}
            onEmailChange={(value) => dispatch({ type: "SET_EMAIL", value })}
            onSubmit={() => doSubmit(false)}
            onSubmitAnonymous={() => doSubmit(true)}
            onBack={() => dispatch({ type: "GO_BACK_TO_QUESTIONS" })}
            emailError={state.errors.email}
            submitting={state.submitting}
          />
          {state.submitError && (
            <div className="mx-auto max-w-xl px-6">
              <p role="alert" className="rounded-lg bg-rose-50 p-4 text-sm font-medium text-rose-700">
                {state.submitError}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
