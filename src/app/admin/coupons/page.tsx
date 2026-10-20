"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "@/store/auth";
import { useCouponStore, Coupon } from "@/store/coupon";
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
  Tag,
  Plus,
  Trash2,
  Percent,
  Coins,
  Calendar,
  Users,
  AlertCircle,
  Loader2,
  CheckCircle,
  Copy,
  BookOpen,
  Search,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminCouponsPage() {
  const { token } = useAuthStore();
  const {
    coupons,
    isLoading,
    error: storeError,
    fetchCoupons,
    createCoupon,
    deleteCoupon,
    updateCoupon,
    clearMessages,
  } = useCouponStore();

  const { courses, getPublicCourses } = useCourseStore();

  // Create coupon modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  // Form states
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(0);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number | undefined>(undefined);
  const [usageLimit, setUsageLimit] = useState<number>(0);
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchCoupons(token);
    }
    getPublicCourses();
  }, [token, fetchCoupons, getPublicCourses]);

  const handleOpenCreate = () => {
    setCode("");
    setDiscountType("percentage");
    setDiscountValue(10);
    setMinOrderAmount(0);
    setMaxDiscountAmount(undefined);
    setUsageLimit(0);
    setExpiresAt("");
    setSelectedCourses([]);
    setDescription("");
    setFormError(null);
    clearMessages();
    setIsCreateOpen(true);
  };

  const handleToggleCourse = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const handleToggleActive = async (coupon: Coupon) => {
    if (!token) return;
    const success = await updateCoupon(coupon.id, { active: !coupon.active }, token);
    if (success) {
      toast.success(coupon.active ? "تم تعطيل الكوبون" : "تم تفعيل الكوبون");
    } else {
      toast.error("فشل تغيير حالة الكوبون");
    }
  };

  const handleDelete = async (id: string, codeName: string) => {
    if (!token) return;
    if (!confirm(`هل أنت متأكد من حذف كود الخصم "${codeName}"؟`)) return;

    const ok = await deleteCoupon(id, token);
    if (ok) {
      toast.success("تم حذف الكوبون بنجاح");
    } else {
      toast.error("فشل حذف الكوبون");
    }
  };

  const handleCopyCode = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    toast.success(`تم نسخ الكود: ${couponCode}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!code.trim()) {
      setFormError("يرجى إدخال رمز الكوبون");
      return;
    }

    if (discountValue <= 0) {
      setFormError("قيمة الخصم يجب أن تكون أكبر من صفر");
      return;
    }

    if (discountType === "percentage" && discountValue > 100) {
      setFormError("نسبة الخصم لا يمكن أن تتجاوز 100%");
      return;
    }

    if (!token) {
      setFormError("جلسة العمل منتهية، يرجى تسجيل الدخول");
      return;
    }

    setIsSubmitting(true);
    const success = await createCoupon(
      {
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount) || 0,
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
        usageLimit: Number(usageLimit) || 0,
        expiresAt: expiresAt || null,
        courses: selectedCourses,
        description: description.trim(),
        active: true,
      },
      token
    );

    setIsSubmitting(false);
    if (success) {
      toast.success("تم إنشاء كود الخصم بنجاح!");
      setIsCreateOpen(false);
    } else {
      setFormError(storeError || "فشل إنشاء الكوبون");
    }
  };

  const filteredCoupons = useMemo(() => {
    if (!searchFilter.trim()) return coupons;
    const q = searchFilter.toLowerCase().trim();
    return coupons.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [coupons, searchFilter]);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Tag className="w-7 h-7 text-[#8b3d6f]" />
            <span>إدارة أكواد الخصم والكوبونات</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            أنشئ حملات ترويجية وأكواد خصم (نسبة مئوية أو قيمة ثابتة) لزيادة مبيعات الكورسات.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-[#8b3d6f] hover:bg-[#722f5a] text-white flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-md transition-all font-bold"
        >
          <Plus className="w-5 h-5" />
          <span>إنشاء كود خصم جديد</span>
        </Button>
      </div>

      {/* Search and Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#8b3d6f]/10 text-[#8b3d6f] flex items-center justify-center">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{coupons.length}</div>
            <div className="text-xs font-semibold text-gray-500">إجمالي الأكواد</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">
              {coupons.filter((c) => c.active).length}
            </div>
            <div className="text-xs font-semibold text-gray-500">أكواد مفعّلة حالياً</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-purple-600">
              {coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0)}
            </div>
            <div className="text-xs font-semibold text-gray-500">مرات الاستخدام الإجمالية</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث برمز الكوبون..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-3 pr-9 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8b3d6f]/20 focus:border-[#8b3d6f] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading && coupons.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-[#8b3d6f]" />
            <span className="text-sm font-bold">جاري تحميل الكوبونات...</span>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-gray-500 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <Tag className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-gray-900">لا توجد أكواد خصم</h3>
            <p className="text-xs text-gray-500 max-w-sm">
              لم تقم بإنشاء أي كوبونات ترويجية بعد. اضغط على زر &quot;إنشاء كود خصم جديد&quot; للبدء.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/75 border-b border-gray-200">
                <TableRow>
                  <TableHead className="text-right font-black text-gray-700">رمز الكوبون</TableHead>
                  <TableHead className="text-right font-black text-gray-700">نوع وقيمة الخصم</TableHead>
                  <TableHead className="text-right font-black text-gray-700">مرات الاستخدام</TableHead>
                  <TableHead className="text-right font-black text-gray-700">الحد الأدنى</TableHead>
                  <TableHead className="text-right font-black text-gray-700">تاريخ الانتهاء</TableHead>
                  <TableHead className="text-right font-black text-gray-700">الكورسات المشمولة</TableHead>
                  <TableHead className="text-center font-black text-gray-700">الحالة</TableHead>
                  <TableHead className="text-center font-black text-gray-700">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.map((coupon) => {
                  const isExpired =
                    coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now();
                  const isLimitReached =
                    coupon.usageLimit && coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit;

                  return (
                    <TableRow key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Code */}
                      <TableCell className="font-mono font-black text-base text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-gray-100 rounded-lg border border-gray-200 tracking-wider">
                            {coupon.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(coupon.code)}
                            className="p-1 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-700 transition-colors"
                            title="نسخ الرمز"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {coupon.description && (
                          <div className="text-[11px] font-sans font-normal text-gray-500 mt-1 truncate max-w-xs">
                            {coupon.description}
                          </div>
                        )}
                      </TableCell>

                      {/* Discount Value */}
                      <TableCell>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#8b3d6f]/10 text-[#8b3d6f]">
                          {coupon.discountType === "percentage" ? (
                            <>
                              <Percent className="w-3.5 h-3.5" />
                              <span>{coupon.discountValue}% خصم</span>
                            </>
                          ) : (
                            <>
                              <Coins className="w-3.5 h-3.5" />
                              <span>{coupon.discountValue} د.ت خصم</span>
                            </>
                          )}
                        </div>
                        {coupon.maxDiscountAmount && coupon.discountType === "percentage" && (
                          <div className="text-[10px] text-gray-500 mt-0.5">
                            أقصى خصم: {coupon.maxDiscountAmount} د.ت
                          </div>
                        )}
                      </TableCell>

                      {/* Usage */}
                      <TableCell className="text-sm font-semibold text-gray-700">
                        <span>{coupon.usedCount || 0}</span>
                        <span className="text-gray-400">
                          {coupon.usageLimit && coupon.usageLimit > 0
                            ? ` / ${coupon.usageLimit}`
                            : " (بلا حد)"}
                        </span>
                        {isLimitReached && (
                          <div className="text-[10px] text-amber-600 font-bold mt-0.5">
                            مستنفذ بالكامل
                          </div>
                        )}
                      </TableCell>

                      {/* Min order */}
                      <TableCell className="text-sm text-gray-700 font-semibold">
                        {coupon.minOrderAmount ? `${coupon.minOrderAmount} د.ت` : "بدون حد أدنى"}
                      </TableCell>

                      {/* Expiration */}
                      <TableCell className="text-xs text-gray-600">
                        {coupon.expiresAt ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span className={isExpired ? "text-red-500 font-bold" : ""}>
                              {new Date(coupon.expiresAt).toLocaleDateString("ar-TN")}
                            </span>
                            {isExpired && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-100 text-red-700 font-bold">
                                منتهي
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">دائم (لا ينتهي)</span>
                        )}
                      </TableCell>

                      {/* Courses */}
                      <TableCell className="text-xs text-gray-600">
                        {coupon.courses && coupon.courses.length > 0 ? (
                          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[11px]">
                            {coupon.courses.length} كورسات محددة
                          </span>
                        ) : (
                          <span className="text-gray-500">جميع الكورسات</span>
                        )}
                      </TableCell>

                      {/* Active Status */}
                      <TableCell className="text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(coupon)}
                          className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
                            coupon.active && !isExpired && !isLimitReached
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {coupon.active && !isExpired && !isLimitReached ? "مفعل" : "معطل"}
                        </button>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(coupon.id, coupon.code)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Create Coupon Drawer/Sheet */}
      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto" dir="rtl">
          <SheetHeader className="text-right space-y-1 mb-6">
            <SheetTitle className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#8b3d6f]" />
              <span>إنشاء كود خصم جديد</span>
            </SheetTitle>
            <SheetDescription className="text-xs text-gray-500">
              أدخل تفاصيل الكوبون ونسبة أو قيمة الخصم وشروط التطبيق.
            </SheetDescription>
          </SheetHeader>

          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-right">
            {/* Code */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                رمز الكود (Promo Code) *
              </label>
              <Input
                type="text"
                placeholder="مثال: EID2026 أو SPECIAL20"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="font-mono text-base font-bold uppercase tracking-wider"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                الوصف / ملاحظة داخلية
              </label>
              <Input
                type="text"
                placeholder="مثال: خصم عيد الفطر لطلاب الأكاديمية"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Discount Type & Value */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">نوع الخصم</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8b3d6f]"
                >
                  <option value="percentage">نسبة مئوية (%)</option>
                  <option value="fixed">مبلغ ثابت (DT)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  قيمة الخصم {discountType === "percentage" ? "(%)" : "(د.ت)"} *
                </label>
                <Input
                  type="number"
                  min="0.1"
                  step="any"
                  max={discountType === "percentage" ? 100 : 10000}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            {/* Min order & Max discount */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  الحد الأدنى للطلب (د.ت)
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0 = بدون حد"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  أقصى خصم بالدينار (اختياري)
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="اختياري للنسبة"
                  value={maxDiscountAmount ?? ""}
                  onChange={(e) =>
                    setMaxDiscountAmount(e.target.value ? Number(e.target.value) : undefined)
                  }
                  disabled={discountType === "fixed"}
                />
              </div>
            </div>

            {/* Usage limit & Expiry */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  الحد الأقصى لمرات الاستخدام
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0 = غير محدود"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  تاريخ انتهاء الصلاحية
                </label>
                <Input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
            </div>

            {/* Specific Courses Restriction */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                <span>تحديد كورسات معينة (اختياري)</span>
                <span className="text-[10px] text-gray-400 font-normal">
                  {selectedCourses.length === 0
                    ? "يطبق على جميع الكورسات"
                    : `${selectedCourses.length} كورس محدد`}
                </span>
              </label>
              <div className="max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-xl space-y-1.5 bg-gray-50/50">
                {courses.map((course) => (
                  <label
                    key={course.id}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white text-xs cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course.id)}
                      onChange={() => handleToggleCourse(course.id)}
                      className="rounded text-[#8b3d6f] focus:ring-[#8b3d6f]"
                    />
                    <BookOpen className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate text-gray-800 font-medium">{course.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 flex items-center gap-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#8b3d6f] hover:bg-[#722f5a] text-white font-bold py-2.5 rounded-xl shadow-md"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  "إنشاء الكود وتفعيله"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-xl"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
