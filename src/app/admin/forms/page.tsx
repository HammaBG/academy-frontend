"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useFormStore, IForm } from "@/store/form";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ClipboardList, 
  Search, 
  Trash2, 
  MoreHorizontal, 
  MessageSquare, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  DollarSign,
  AlertTriangle,
  Send,
  Loader2
} from "lucide-react";

export default function AdminFormsPage() {
  const { token } = useAuthStore();
  const { 
    forms, 
    stats, 
    isLoading, 
    fetchForms, 
    fetchStats, 
    updateFormStatus, 
    deleteForm, 
    addNote, 
    deleteNote 
  } = useFormStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  // Sheet states for notes
  const [isNotesSheetOpen, setIsNotesSheetOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<IForm | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [isNoteSubmitting, setIsNoteSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
      fetchForms(token);
      fetchStats(token);
    }
  }, [token, fetchForms, fetchStats]);

  const handleStatusChange = async (id: string, newStatus: any) => {
    if (token) {
      try {
        await updateFormStatus(id, { status: newStatus }, token);
        fetchStats(token); // Update cards stats
      } catch (err) {
        console.error("Failed to update status", err);
      }
    }
  };

  const handleDeleteForm = async (id: string) => {
    if (token && window.confirm("هل أنت متأكد من حذف هذا الطلب نهائياً؟")) {
      try {
        await deleteForm(id, token);
        fetchStats(token);
      } catch (err) {
        console.error("Failed to delete form", err);
      }
    }
  };

  const handleOpenNotes = (form: IForm) => {
    setSelectedForm(form);
    setIsNotesSheetOpen(true);
    setNewNoteText("");
  };

  const handleAddNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedForm || !newNoteText.trim()) return;

    setIsNoteSubmitting(true);
    try {
      await addNote(selectedForm.id, newNoteText.trim(), token);
      // Refresh selected form notes in local state
      const updatedForm = useFormStore.getState().forms.find(f => f.id === selectedForm.id);
      if (updatedForm) {
        setSelectedForm(updatedForm);
      }
      setNewNoteText("");
    } catch (err) {
      console.error("Failed to add note", err);
    } finally {
      setIsNoteSubmitting(false);
    }
  };

  const handleDeleteNoteClick = async (noteId: string) => {
    if (!token || !selectedForm) return;
    if (window.confirm("هل أنت متأكد من حذف هذه الملاحظة؟")) {
      try {
        await deleteNote(selectedForm.id, noteId, token);
        const updatedForm = useFormStore.getState().forms.find(f => f.id === selectedForm.id);
        if (updatedForm) {
          setSelectedForm(updatedForm);
        }
      } catch (err) {
        console.error("Failed to delete note", err);
      }
    }
  };

  // Filter forms
  const filteredForms = forms.filter(form => {
    const matchesSearch = 
      form.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.phoneNumber.includes(searchTerm) ||
      form.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || form.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "delivered":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "contacted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "callback":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "not-interested":
      case "not-delivered":
      case "not-available":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "قيد الانتظار";
      case "contacted": return "تم الاتصال";
      case "completed": return "مكتمل";
      case "not-interested": return "غير مهتم";
      case "not-available": return "غير متاح";
      case "callback": return "إعادة اتصال";
      case "delivered": return "تم التسليم";
      case "not-delivered": return "لم يتم التسليم";
      default: return status;
    }
  };

  return (
    <div className="space-y-6 text-right dir-rtl" dir="rtl">
      {/* Page Title */}
      <div className="flex items-center justify-between pb-5 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900">طلبات الدفع عند الاستلام</h1>
          <p className="text-sm text-gray-500 mt-1">إدارة ومتابعة طلبات التسجيل والدفع عند الاستلام للكورسات</p>
        </div>
        <div className="p-3 bg-[#8b3d6f]/10 text-[#8b3d6f] rounded-2xl">
          <ClipboardList className="w-6 h-6" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-gray-400 font-bold">إجمالي الطلبات</p>
            <h3 className="text-xl font-black text-gray-900">{stats?.total || 0}</h3>
          </div>
          <div className="p-3 bg-gray-100 text-gray-500 rounded-xl">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-gray-400 font-bold">قيد الانتظار</p>
            <h3 className="text-xl font-black text-yellow-600">{stats?.pending || 0}</h3>
          </div>
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-gray-400 font-bold">مكتملة ومسلمة</p>
            <h3 className="text-xl font-black text-green-600">{(stats?.completed || 0) + (stats?.delivered || 0)}</h3>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-gray-400 font-bold">طلبات اليوم</p>
            <h3 className="text-xl font-black text-[#8b3d6f]">{stats?.today || 0}</h3>
          </div>
          <div className="p-3 bg-purple-50 text-[#8b3d6f] rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث بالاسم، الهاتف أو الكورس..."
            className="pr-10 text-right bg-gray-50 border-gray-200 focus:bg-white focus:border-[#8b3d6f]"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "الكل" },
            { id: "pending", label: "قيد الانتظار" },
            { id: "contacted", label: "تم الاتصال" },
            { id: "completed", label: "مكتمل" },
            { id: "delivered", label: "تم التسليم" },
            { id: "callback", label: "إعادة اتصال" },
            { id: "not-interested", label: "غير مهتم" },
          ].map(tab => (
            <Button
              key={tab.id}
              variant={selectedStatus === tab.id ? "default" : "outline"}
              onClick={() => setSelectedStatus(tab.id)}
              className={`text-xs font-bold rounded-xl shrink-0 ${
                selectedStatus === tab.id 
                  ? "bg-[#8b3d6f] hover:bg-[#8b3d6f]/90 text-white" 
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 text-[#8b3d6f] animate-spin" />
            <p className="text-sm text-gray-500">جاري تحميل البيانات...</p>
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="font-bold text-gray-700">لا توجد طلبات مطابقة</h3>
            <p className="text-xs text-gray-400">لم يتم العثور على أي طلبات دفع عند الاستلام تناسب البحث الحالي.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="text-right font-bold text-gray-700 text-xs">التاريخ</TableHead>
                  <TableHead className="text-right font-bold text-gray-700 text-xs">الاسم</TableHead>
                  <TableHead className="text-right font-bold text-gray-700 text-xs">الهاتف</TableHead>
                  <TableHead className="text-right font-bold text-gray-700 text-xs">العنوان</TableHead>
                  <TableHead className="text-right font-bold text-gray-700 text-xs">الكورس المطلوب</TableHead>
                  <TableHead className="text-right font-bold text-gray-700 text-xs">السعر</TableHead>
                  <TableHead className="text-right font-bold text-gray-700 text-xs">الحالة</TableHead>
                  <TableHead className="text-center font-bold text-gray-700 text-xs w-28">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredForms.map((form) => (
                  <TableRow key={form.id} className="hover:bg-gray-50/30">
                    <TableCell className="text-xs text-gray-500 font-medium whitespace-nowrap">
                      {new Date(form.createdAt).toLocaleDateString("ar-TN", {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="font-bold text-gray-900 text-sm whitespace-nowrap">{form.fullName}</TableCell>
                    <TableCell className="text-gray-700 text-xs font-mono whitespace-nowrap">{form.phoneNumber}</TableCell>
                    <TableCell className="text-gray-600 text-xs truncate max-w-[150px]" title={form.address}>{form.address}</TableCell>
                    <TableCell className="font-bold text-gray-800 text-xs truncate max-w-[150px]" title={form.courseName}>{form.courseName}</TableCell>
                    <TableCell className="text-xs font-mono font-bold text-brand-primary whitespace-nowrap">{form.coursePrice} DT</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(form.status)}`}>
                        {getStatusLabel(form.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Notes button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenNotes(form)}
                          className="h-8 w-8 rounded-lg text-gray-500 hover:text-[#8b3d6f] hover:bg-[#8b3d6f]/5 relative"
                          title="ملاحظات العميل"
                        >
                          <MessageSquare className="w-4 h-4" />
                          {form.notes && form.notes.length > 0 && (
                            <span className="absolute -top-1 -left-1 bg-[#8b3d6f] text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold border border-white">
                              {form.notes.length}
                            </span>
                          )}
                        </Button>

                        {/* Actions dropmenu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-500 hover:bg-gray-100">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            }
                          />
                          <DropdownMenuContent align="end" className="text-right">
                            {[
                              { status: 'pending', label: 'قيد الانتظار' },
                              { status: 'contacted', label: 'تم الاتصال' },
                              { status: 'callback', label: 'إعادة اتصال' },
                              { status: 'completed', label: 'مكتمل' },
                              { status: 'delivered', label: 'تم التسليم' },
                              { status: 'not-delivered', label: 'لم يتم التسليم' },
                              { status: 'not-interested', label: 'غير مهتم' },
                              { status: 'not-available', label: 'غير متاح' },
                            ].map((opt) => (
                              <DropdownMenuItem
                                key={opt.status}
                                onClick={() => handleStatusChange(form.id, opt.status)}
                                className={`text-xs font-bold cursor-pointer justify-end ${
                                  form.status === opt.status ? "text-[#8b3d6f] bg-purple-50/50" : "text-gray-700"
                                }`}
                              >
                                {opt.label}
                              </DropdownMenuItem>
                            ))}
                            <div className="h-px bg-gray-100 my-1" />
                            <DropdownMenuItem
                              onClick={() => handleDeleteForm(form.id)}
                              className="text-xs font-bold text-red-600 cursor-pointer justify-end hover:bg-red-50"
                            >
                              <span className="flex items-center gap-1">
                                <span>حذف الطلب</span>
                                <Trash2 className="w-3.5 h-3.5" />
                              </span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Slide-over Sheet for Notes */}
      <Sheet open={isNotesSheetOpen} onOpenChange={setIsNotesSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md text-right dir-rtl p-6 overflow-y-auto">
          <SheetHeader className="pb-5 border-b border-gray-150 mb-5">
            <SheetTitle className="text-lg font-black text-gray-900">ملاحظات ومتابعة العميل</SheetTitle>
            <SheetDescription className="text-xs text-gray-500">
              إضافة وتدوين تفاصيل الاتصال مع العميل <strong>{selectedForm?.fullName}</strong>
            </SheetDescription>
          </SheetHeader>

          {/* Notes History */}
          <div className="space-y-4 mb-8">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">سجل الملاحظات</h4>
            
            {!selectedForm?.notes || selectedForm.notes.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-2xl text-center border border-gray-100 text-gray-400 text-xs space-y-1">
                <MessageSquare className="w-6 h-6 mx-auto opacity-30 mb-1" />
                <p>لا توجد ملاحظات مدونة بعد.</p>
                <p className="text-[10px] text-gray-300">استخدم النموذج أدناه لإضافة أول ملاحظة.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedForm.notes.map((note, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-100 p-3 rounded-2xl relative group">
                    <p className="text-xs text-gray-800 leading-relaxed pr-1">{note.text}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100/50 text-[10px] text-gray-400">
                      <span>
                        {new Date(note.createdAt).toLocaleString("ar-TN", {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </span>
                      <button
                        onClick={() => handleDeleteNoteClick(index.toString())}
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity font-bold"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Note Form */}
          <form onSubmit={handleAddNoteSubmit} className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">تدوين ملاحظة جديدة</h4>
            <textarea
              required
              rows={3}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="اكتب تفاصيل المكالمة أو حالة الدفع هنا..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:bg-white focus:border-[#8b3d6f] focus:ring-1 focus:ring-[#8b3d6f]/20 outline-none resize-none transition-all leading-relaxed"
            />
            <Button
              type="submit"
              disabled={isNoteSubmitting}
              className="w-full flex items-center justify-center gap-1.5 py-3 bg-[#8b3d6f] hover:bg-[#8b3d6f]/90 text-white rounded-xl font-bold text-xs shadow-md"
            >
              {isNoteSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري الإرسال...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>حفظ الملاحظة</span>
                </>
              )}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
