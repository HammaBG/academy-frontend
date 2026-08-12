"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Camera, Loader2, Save, User as UserIcon, Mail, Phone, ShieldCheck, Briefcase, Link2 } from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isAuthLoading, isDataLoading, updateProfile, getProfile } = useAuthStore();

  const [avatar, setAvatar] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [bio, setBio] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setAvatar(user.avatar_url || null);
      setTitle(user.title || "");
      setLinkedinUrl(user.linkedin_url || "");
      setBio(user.bio || "");
    }
  }, [user]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
        <p className="text-text-secondary text-sm font-semibold">جاري تحميل البيانات...</p>
      </div>
    );
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError("حجم الصورة يجب أن يكون أقل من 5 ميجابايت.");
      return;
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      setFileError("الملف المحدد يجب أن يكون صورة.");
      return;
    }

    setFileError(null);
    setSuccessMsg(null);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAvatar(base64String); // Local preview
      handleUploadImage(base64String); // Direct upload trigger
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async (base64Image: string) => {
    if (!token) return;
    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await updateProfile({ avatar_url: base64Image }, token);
      await getProfile(); // Sync new profile state
      setSuccessMsg("تم تحديث الصورة الشخصية بنجاح.");
    } catch (err: any) {
      setErrorMsg(err.message || "فشل تحميل الصورة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await updateProfile({ title, linkedin_url: linkedinUrl, bio }, token);
      await getProfile();
      setSuccessMsg("تم تحديث البيانات المهنية بنجاح.");
    } catch (err: any) {
      setErrorMsg(err.message || "فشل تحديث البيانات. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 bg-background/30 dir-rtl text-right">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-text-primary">إعدادات الحساب</h1>
          <p className="text-text-secondary text-sm font-semibold">تعديل ملفك الشخصي وإدارة بياناتك داخل المنصة.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Right Column: Avatar Manager Card */}
          <div className="md:col-span-4 bg-surface border border-border/40 p-8 rounded-[2rem] shadow-xl flex flex-col items-center text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full filter blur-2xl pointer-events-none" />

            <div className="relative group cursor-pointer" onClick={handleAvatarClick} aria-label="تغيير الصورة الشخصية" role="button">
              {/* Image Circle */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-border/60 bg-surface flex items-center justify-center shadow-lg relative z-10 group-hover:border-brand-primary transition-all duration-300">
                {avatar ? (
                  <img src={avatar} alt="Profile photo" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-16 h-16 text-text-secondary/30" />
                )}

                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera className="w-8 h-8 text-white animate-bounce" />
                  <span className="text-[10px] text-white/90 font-bold mt-1">تحديث الصورة</span>
                </div>
              </div>

              {/* Upload spinner */}
              {(isUploading || isDataLoading) && (
                <div className="absolute inset-0 z-20 rounded-full bg-surface/80 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div className="space-y-1 z-10">
              <h2 className="text-xl font-bold text-text-primary">
                {user.first_name ? `${user.first_name} ${user.last_name || ""}` : "مستخدم المنصة"}
              </h2>
              <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-black">
                {user.role === "admin" ? "مدير النظام" : user.role === "instructor" ? "معلم / مدرب" : "طالب / مشترك"}
              </span>
            </div>

            {fileError && <p className="text-xs font-bold text-brand-primary">{fileError}</p>}

            <p className="text-[10px] text-text-secondary font-medium leading-relaxed max-w-[200px]">
              صيغ الصور المدعومة: PNG, JPG. أقصى حجم مسموح به هو 5 ميجابايت.
            </p>
          </div>

          {/* Left Column: Info Card & Form */}
          <div className="md:col-span-8 bg-surface border border-border/40 p-8 md:p-10 rounded-[2.5rem] shadow-xl space-y-8">

            {/* Alerts */}
            {successMsg && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl text-sm font-semibold text-center">
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-2xl text-sm font-semibold text-center">
                {errorMsg}
              </div>
            )}

            {/* Read-Only Identity Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-text-primary border-b border-border/40 pb-2">بيانات الحساب الأساسية</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Email (Read-Only) */}
                <div className="flex items-center gap-3 p-4 bg-background/40 border border-border/40 rounded-2xl">
                  <Mail className="w-5 h-5 text-text-secondary shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] text-text-secondary font-bold">البريد الإلكتروني</span>
                    <span className="block text-sm font-semibold text-text-primary truncate">{user.email}</span>
                  </div>
                </div>

                {/* Phone (Read-Only) */}
                <div className="flex items-center gap-3 p-4 bg-background/40 border border-border/40 rounded-2xl">
                  <Phone className="w-5 h-5 text-text-secondary shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] text-text-secondary font-bold">رقم الهاتف</span>
                    <span className="block text-sm font-semibold text-text-primary truncate">{user.phone || "غير محدد"}</span>
                  </div>
                </div>

                {/* Role (Read-Only) */}
                <div className="flex items-center gap-3 p-4 bg-background/40 border border-border/40 rounded-2xl">
                  <ShieldCheck className="w-5 h-5 text-text-secondary shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] text-text-secondary font-bold">نوع الحساب</span>
                    <span className="block text-sm font-semibold text-text-primary truncate">
                      {user.role === "admin" ? "مدير" : user.role === "instructor" ? "معلم" : "مشترك"}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Editable Profile Information Form - ONLY for Instructors */}
            {user.role === "instructor" && (
              <form onSubmit={handleSaveInfo} className="space-y-6 pt-4 border-t border-border/40">
                <h3 className="text-lg font-extrabold text-text-primary pb-2 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-primary" />
                  <span>البيانات المهنية للخبراء</span>
                </h3>

                <div className="space-y-2">
                  <label htmlFor="title-input" className="text-sm font-bold text-text-secondary">
                    المسمى المهني / التخصص
                  </label>
                  <input
                    id="title-input"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: طبيبة نفسية، أخصائي إرشاد أسري"
                    className="w-full bg-background/40 border border-border/60 focus:border-brand-primary p-4 rounded-2xl text-sm font-semibold text-text-primary outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="linkedin-input" className="text-sm font-bold text-text-secondary">
                    رابط حساب لينكد إن (LinkedIn)
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input
                      id="linkedin-input"
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      dir="ltr"
                      className="w-full bg-background/40 border border-border/60 focus:border-brand-primary p-4 pl-12 rounded-2xl text-sm font-semibold text-text-primary outline-none transition-colors text-left"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio-input" className="text-sm font-bold text-text-secondary">
                    نبذة تعريفية قصيرة (Bio)
                  </label>
                  <textarea
                    id="bio-input"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="اكتب نبذة مهنية قصيرة للتعريف بخبراتك ودوراتك التدريبية..."
                    className="w-full bg-background/40 border border-border/60 focus:border-brand-primary p-4 rounded-2xl text-sm font-semibold text-text-primary outline-none transition-colors min-h-[120px] resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUploading || isDataLoading}
                  className="w-full py-4 bg-brand-primary hover:bg-brand-primary/95 text-white font-extrabold rounded-2xl transition-all shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {isUploading || isDataLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span>حفظ البيانات المهنية</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
