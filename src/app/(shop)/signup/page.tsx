"use client";

import { useState, useEffect, FormEvent, CSSProperties } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Mail,
  Phone,
  User,
  Loader2,
  AlertCircle,
  Heart,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

type FieldErrors = Partial<Record<"fullName" | "phone" | "email" | "password", string>>;

const fieldBase =
  "peer w-full rounded-2xl border-2 bg-white/80 px-12 py-3.5 text-[15px] font-semibold text-[#2c1a22] placeholder:text-[#2c1a22]/35 outline-none transition-all duration-300 focus:bg-white focus:border-[#F95353] focus:shadow-[0_0_0_5px_rgba(249,83,83,0.12)] disabled:opacity-60";

const fieldOk = "border-[#eadcd9]";
const fieldBad = "border-red-400 bg-red-50/60 focus:border-red-500 focus:shadow-[0_0_0_5px_rgba(239,68,68,0.12)]";

// Score 0-3 from password length and character variety.
const passwordScore = (password: string): number => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Za-z]/.test(password) && /[0-9\W]/.test(password)) score++;
  return score;
};

const isValidFullName = (value: string) => {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  return parts.length >= 2 && parts[0].length >= 2 && parts.slice(1).join(" ").length >= 2;
};

const isValidPhone = (value: string) => (value.match(/\d/g) || []).length >= 8;
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

// Decorative blob positions and timing, so each one drifts differently.
const BLOBS: { cls: string; style: CSSProperties }[] = [
  { cls: "bg-[#F95353]/70", style: { top: "-6%", insetInlineStart: "-8%", width: "42%", height: "42%", animationDelay: "0s" } },
  { cls: "bg-[#FFB48A]/70", style: { bottom: "-10%", insetInlineEnd: "-6%", width: "46%", height: "46%", animationDelay: "-4s" } },
  { cls: "bg-[#7C3AED]/50", style: { top: "35%", insetInlineStart: "38%", width: "24%", height: "24%", animationDelay: "-8s" } },
];

export default function SignupPage() {
  const { isAuthenticated, isAuthLoading, signup, clearError } = useAuthStore();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!isValidFullName(fullName)) {
      next.fullName = "أدخل الاسم الأول والاسم الأخير، كل واحد حرفين على الأقل.";
    }
    if (!isValidPhone(phone)) {
      next.phone = "أدخل رقم هاتف يحتوي على 8 أرقام على الأقل.";
    }
    if (!isValidEmail(email)) {
      next.email = "أدخل بريداً إلكترونياً صحيحاً.";
    }
    if (password.length < 6) {
      next.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل.";
    }
    return next;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ");

    clearError();
    await signup(email.trim(), password, firstName, lastName, phone.trim());
    const authState = useAuthStore.getState();
    if (authState.error) {
      setServerError(authState.error);
      toast.error("تعذر إنشاء الحساب", { description: authState.error });
    } else {
      toast.success("أهلاً بك في أسس!", {
        description: "تم إنشاء حسابك، جاري تجهيز مساحتك...",
      });
    }
  };

  if (isAuthenticated) {
    return null;
  }

  const score = passwordScore(password);
  const strengthLabel = ["", "ضعيفة", "جيدة", "قوية"][score];
  const strengthColor = ["", "bg-[#F95353]", "bg-[#FFB020]", "bg-emerald-500"][score];

  const inputClass = (key: keyof FieldErrors) => `${fieldBase} ${errors[key] ? fieldBad : fieldOk}`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fff4ef] text-[#2c1a22]" dir="rtl">
      <style>{`
        @keyframes signup-float {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(2%, -3%, 0) scale(1.06); }
        }
        @keyframes signup-rise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes signup-shine {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .signup-blob { animation: signup-float 14s ease-in-out infinite; filter: blur(70px); }
        .signup-rise { animation: signup-rise .7s cubic-bezier(.2,.7,.2,1) both; }
        .signup-shine {
          background-size: 200% 100%;
          animation: signup-shine 6s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .signup-blob, .signup-rise, .signup-shine { animation: none; }
        }
      `}</style>

      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {BLOBS.map((b, i) => (
          <span key={i} className={`signup-blob absolute rounded-full ${b.cls}`} style={{ ...b.style, position: "absolute" }} />
        ))}
        <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(#2c1a22_1px,transparent_1px)] [background-size:22px_22px]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.05fr_1fr] lg:px-10">
        {/* Story panel */}
        <section className="signup-rise order-2 lg:order-1">
          <Link href="/" className="inline-flex items-center gap-3 rounded-full bg-white/70 px-3 py-2 pe-5 shadow-sm backdrop-blur">
            <img src="/Ossos/OSSOS-ACADEMY-profile.png" alt="" className="h-9 w-9 rounded-full object-cover" />
            <span className="text-sm font-black text-[#2c1a22]">أكاديمية أسس</span>
          </Link>

          <h1 className="mt-10 text-4xl font-black leading-[1.25] lg:text-6xl">
            ابدأ رحلتك نحو{" "}
            <span className="signup-shine bg-gradient-to-l from-[#F95353] via-[#FF8A5C] to-[#7C3AED] bg-clip-text text-transparent">
              علاقة صحية
            </span>
          </h1>
          <p className="mt-5 max-w-md text-base font-semibold leading-relaxed text-[#2c1a22]/70">
            منصة تعليمية توعوية تساعدك على الإعداد للحياة الزوجية وما بعدها، بكورسات مبنية على علم النفس والتجارب الواقعية.
          </p>

          <ul className="mt-10 space-y-4">
            {[
              { icon: Heart, title: "محتوى معتمد", text: "كورسات من مختصين في العلاقات والأسرة" },
              { icon: Sparkles, title: "تعلم بالسرعة التي تناسبك", text: "وصول دائم لكل ما تشتريه" },
              { icon: ShieldCheck, title: "بياناتك في أمان", text: "لا نشارك معلوماتك مع أي طرف" },
            ].map((item, i) => (
              <li
                key={item.title}
                className="signup-rise flex items-center gap-4 rounded-2xl bg-white/60 p-4 backdrop-blur"
                style={{ animationDelay: `${0.15 + i * 0.1}s` }}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F95353] to-[#FF8A5C] text-white shadow-md shadow-[#F95353]/30">
                  <item.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-black">{item.title}</span>
                  <span className="block text-xs font-semibold text-[#2c1a22]/60">{item.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Form card */}
        <section className="signup-rise order-1 lg:order-2" style={{ animationDelay: ".1s" }}>
          <div className="relative rounded-[32px] border border-white/70 bg-white/75 p-7 shadow-[0_30px_80px_-20px_rgba(249,83,83,0.35)] backdrop-blur-xl md:p-10">
            <h2 className="text-2xl font-black">إنشاء حساب جديد</h2>
            <p className="mb-7 mt-1 text-sm font-semibold text-[#2c1a22]/60">لن يستغرق الأمر أكثر من دقيقة.</p>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {serverError && (
                <div role="alert" className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              <Field label="الاسم الكامل" error={errors.fullName} errorId="fullName-error" icon={User}>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  disabled={isAuthLoading}
                  placeholder="أحمد بن علي"
                  className={inputClass("fullName")}
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="الهاتف" error={errors.phone} errorId="phone-error" icon={Phone}>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    disabled={isAuthLoading}
                    placeholder="22 222 222"
                    dir="ltr"
                    className={inputClass("phone")}
                  />
                </Field>

                <Field label="البريد الإلكتروني" error={errors.email} errorId="email-error" icon={Mail}>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    disabled={isAuthLoading}
                    placeholder="you@example.com"
                    dir="ltr"
                    className={inputClass("email")}
                  />
                </Field>
              </div>

              <Field label="كلمة المرور" error={errors.password} errorId="password-error" icon={ShieldCheck}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : "password-hint"}
                  disabled={isAuthLoading}
                  placeholder="6 أحرف على الأقل"
                  dir="ltr"
                  className={inputClass("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  className="absolute end-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#2c1a22]/50 transition-colors hover:bg-[#F95353]/10 hover:text-[#F95353]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <div id="password-hint" className="mt-2 flex items-center gap-2">
                  <div className="flex flex-1 gap-1.5" aria-hidden="true">
                    {[1, 2, 3].map((i) => (
                      <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= score ? strengthColor : "bg-[#2c1a22]/10"}`} />
                    ))}
                  </div>
                  {password && <span className="text-[11px] font-bold text-[#2c1a22]/60">{strengthLabel}</span>}
                </div>
              </Field>

              <button
                type="submit"
                disabled={isAuthLoading}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-l from-[#F95353] to-[#FF7A4D] px-4 py-4 text-base font-black text-white shadow-xl shadow-[#F95353]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-[#F95353]/40 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isAuthLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>جاري إنشاء حسابك...</span>
                  </>
                ) : (
                  <>
                    <span>ابدأ رحلتي</span>
                    <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#2c1a22]/10" />
              <span className="text-[11px] font-bold text-[#2c1a22]/50">أو سجل بسرعة</span>
              <div className="h-px flex-1 bg-[#2c1a22]/10" />
            </div>

            <div className="flex items-center justify-center">
              <GoogleSignInButton />
            </div>

            <p className="mt-8 text-center text-sm font-semibold text-[#2c1a22]/60">
              لديك حساب بالفعل؟{" "}
              <Link href="/login" className="font-black text-[#F95353] hover:underline underline-offset-4">
                سجل دخولك
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  errorId,
  icon: Icon,
  children,
}: {
  label: string;
  error?: string;
  errorId: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-black text-[#2c1a22]/70">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute start-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#2c1a22]/40" />
        {children}
      </div>
      {error && (
        <p id={errorId} className="text-xs font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
