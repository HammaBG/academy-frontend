"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useEnrollmentCodeStore, IEnrollmentCode } from "@/store/enrollmentCode";
import { useCourseStore } from "@/store/course";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { 
  Ticket, 
  Plus, 
  Trash2, 
  BookOpen, 
  Clock, 
  UserCheck, 
  AlertCircle,
  Loader2,
  CheckCircle,
  HelpCircle
} from "lucide-react";

export default function AdminEnrollmentCodesPage() {
  const { token } = useAuthStore();
  const { 
    enrollmentCodes, 
    isLoading, 
    error: storeError,
    success,
    fetchEnrollmentCodes, 
    createEnrollmentCode, 
    deleteEnrollmentCode,
    clearStatus
  } = useEnrollmentCodeStore();

  const { courses, getPublicCourses } = useCourseStore();

  // Dialog/Sheet state
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [codeName, setCodeName] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [usageLimit, setUsageLimit] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchEnrollmentCodes(token);
    }
    getPublicCourses();
  }, [token, fetchEnrollmentCodes, getPublicCourses]);

  const handleOpenCreateSheet = () => {
    setCodeName("");
    setSelectedCourses([]);
    setUsageLimit(1);
    setErrorMsg(null);
    clearStatus();
    setIsCreateSheetOpen(true);
  };

  const handleCheckboxChange = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setErrorMsg(null);
    if (!codeName.trim()) {
      setErrorMsg("يرجى إدخال اسم الكود.");
      return;
    }
    if (selectedCourses.length === 0) {
      setErrorMsg("يرجى اختيار كورس واحد على الأقل.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createEnrollmentCode({
        name: codeName.toUpperCase().trim(),
        courses: selectedCourses,
        usageLimit: Number(usageLimit)
      }, token);
      
      setIsCreateSheetOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || "فشلت عملية إنشاء الكود.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCode = async (id: string) => {
    if (token && window.confirm("هل أنت متأكد من حذف كود الاشتراك هذا نهائياً؟")) {
      try {
        await deleteEnrollmentCode(id, token);
      } catch (err) {
        console.error("Failed to delete enrollment code", err);
      }
    }
  };

  const getCodeStatusBadgeClass = (code: IEnrollmentCode) => {
    if (!code.active) return "bg-gray-100 text-gray-800 border-gray-200";
    if (code.used) return "bg-red-100 text-red-800 border-red-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  const getCodeStatusLabel = (code: IEnrollmentCode) => {
    if (!code.active) return "غير نشط";
    if (code.used) return "مستخدم بالكامل";
    return "نشط / متاح";
  };

  return (
    <div className="space-y-6 text-right dir-rtl" dir="rtl">
      {/* Page Title */}
      <div className="flex items-center justify-between pb-5 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900">أكواد التفعيل والاشتراك</h1>
          <p className="text-sm text-gray-500 mt-1">إنشاء وإدارة أكواد التسجيل المجاني والمسبق للدفع في الكورسات</p>
        </div>
        <Button
          onClick={handleOpenCreateSheet}
          className="bg-[#8b3d6f] hover:bg-[#8b3d6f]/90 text-white font-bold rounded-xl px-5 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء كود جديد</span>
        </Button>
      </div>

      {/* Main Codes Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 text-[#8b3d6f] animate-spin" />
            <p className="text-sm text-gray-500">جاري تحميل البيانات...</p>
          </div>
        ) : enrollmentCodes.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Ticket className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="font-bold text-gray-700">لا توجد أكواد تفعيل</h3>
            <p className="text-xs text-gray-400">انقر فوق زر "إنشاء كود جديد" لبدء إنشاء الأكواد.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="text-right font-bold text-gray-700 text-xs">الكود</TableHead>
                  <TableHead className="text-right font-bold text-gray-700 text-xs">الكورسات المرتبطة</TableHead>
                  <TableHead className="text-right font-bold text-gray-700 text-xs">حد الاستخدام</TableHead>
                  <TableHead className="text-right font-bold text-gray-700 text-xs">تاريخ الإنشاء</TableHead>
                  <TableHead className="text-right font-bold text-gray-700 text-xs">مستخدم من قبل</TableHead>
                  <TableHead className="text-right font-bold text-gray-700 text-xs">الحالة</TableHead>
                  <TableHead className="text-center font-bold text-gray-700 text-xs w-20">حذف</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollmentCodes.map((code) => (
                  <TableRow key={code.id} className="hover:bg-gray-50/30">
                    <TableCell className="font-mono font-black text-gray-900 text-sm tracking-wider whitespace-nowrap">
                      {code.name}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="space-y-1 py-1 max-w-[260px]">
                        {(code.courses || []).map((c: any, index: number) => (
                          <div key={index} className="flex items-center gap-1.5 text-gray-800">
                            <BookOpen className="w-3.5 h-3.5 text-[#8b3d6f] shrink-0" />
                            <span className="truncate font-semibold">{c.name || "كورس غير معروف"}</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-gray-700">
                      {code.usedBy?.length || 0} / {code.usageLimit}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500 font-medium whitespace-nowrap">
                      {new Date(code.createdAt).toLocaleDateString("ar-TN", {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="text-xs">
                      {code.usedBy && code.usedBy.length > 0 ? (
                        <div className="flex flex-col gap-1 max-h-[80px] overflow-y-auto">
                          {code.usedBy.map((usr: any, index: number) => (
                            <div key={index} className="flex items-center gap-1 text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                              <span className="font-bold truncate" title={usr.email}>{usr.name}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">لم يستخدم بعد</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getCodeStatusBadgeClass(code)}`}>
                        {getCodeStatusLabel(code)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCode(code.id)}
                        className="h-8 w-8 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="حذف كود التفعيل"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Slide-over Sheet for Creating Codes */}
      <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md text-right dir-rtl p-6 overflow-y-auto">
          <SheetHeader className="pb-5 border-b border-gray-150 mb-5">
            <SheetTitle className="text-lg font-black text-gray-900">إنشاء كود تفعيل جديد</SheetTitle>
            <SheetDescription className="text-xs text-gray-500">
              أنشئ كود اشتراك مخصص لربطه بكورس أو عدة كورسات مع تحديد حد أقصى لعدد مرات الاستخدام.
            </SheetDescription>
          </SheetHeader>

          {/* Form Banner Error */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-red-700 mb-5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="codeName" className="text-xs font-bold text-gray-500 block">
                اسم الكود التفعيلي <span className="text-red-500">*</span>
              </label>
              <Input
                id="codeName"
                value={codeName}
                onChange={(e) => setCodeName(e.target.value)}
                placeholder="مثال: BENAA2026"
                className="text-right uppercase font-mono tracking-wider focus:border-[#8b3d6f] focus:ring-1 focus:ring-[#8b3d6f]/20 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="usageLimit" className="text-xs font-bold text-gray-500 block">
                الحد الأقصى لعدد مرات الاستخدام <span className="text-red-500">*</span>
              </label>
              <Input
                id="usageLimit"
                type="number"
                min={1}
                value={usageLimit}
                onChange={(e) => setUsageLimit(Number(e.target.value))}
                className="text-right focus:border-[#8b3d6f] focus:ring-1 focus:ring-[#8b3d6f]/20 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 block">
                اختر الكورسات المرتبطة بالكود <span className="text-red-500">*</span>
              </label>
              
              <div className="border border-gray-200 rounded-xl overflow-hidden max-h-[220px] overflow-y-auto bg-gray-50/50 p-2 space-y-1.5">
                {courses.length === 0 ? (
                  <p className="text-xs text-gray-400 p-3 text-center">لا توجد كورسات متاحة حالياً.</p>
                ) : (
                  courses.map((course) => (
                    <label
                      key={course.id}
                      className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100 hover:border-purple-200 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course.id)}
                        onChange={() => handleCheckboxChange(course.id)}
                        className="rounded border-gray-300 text-[#8b3d6f] focus:ring-[#8b3d6f] h-4 w-4"
                      />
                      <div className="flex-1 min-w-0 text-right">
                        <p className="text-xs font-bold text-gray-800 truncate">{course.name}</p>
                        <p className="text-[10px] text-gray-400">{course.price} DT</p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-1.5 py-3.5 bg-[#8b3d6f] hover:bg-[#8b3d6f]/90 text-white rounded-xl font-bold text-xs shadow-md mt-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري إنشاء الكود...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>تأكيد وإنشاء كود التفعيل</span>
                </>
              )}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
