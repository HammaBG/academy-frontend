"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useTicketStore, ITicket } from "@/store/ticket";
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
  Headphones,
  Search,
  Trash2,
  MoreHorizontal,
  Clock,
  CheckCircle,
  AlertTriangle,
  Send,
  Loader2,
  User,
  Phone,
  Mail,
  Filter,
  CheckCircle2,
  Sparkles,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminTicketsPage() {
  const { token } = useAuthStore();
  const {
    adminTickets,
    adminStats,
    isLoading,
    fetchAdminTickets,
    updateTicketStatus,
    deleteTicket,
    addReply,
  } = useTicketStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    if (token) {
      fetchAdminTickets(token, {
        status: selectedStatus,
        category: selectedCategory,
        search: searchTerm,
      });
    }
  }, [token, fetchAdminTickets, selectedStatus, selectedCategory, searchTerm]);

  const handleOpenTicket = (ticket: ITicket) => {
    setSelectedTicket(ticket);
    setAdminNotes(ticket.adminNotes || "");
    setIsSheetOpen(true);
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    if (!token) return;
    try {
      await updateTicketStatus(ticketId, { status: newStatus as any }, token);
      toast.success("تم تحديث حالة التذكرة بنجاح");
      if (selectedTicket && selectedTicket._id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus as any });
      }
    } catch (err: any) {
      toast.error(err.message || "فشل تحديث الحالة");
    }
  };

  const handleSaveNotes = async () => {
    if (!token || !selectedTicket) return;
    try {
      await updateTicketStatus(selectedTicket._id, { adminNotes }, token);
      toast.success("تم حفظ الملاحظات الإدارية");
    } catch (err: any) {
      toast.error(err.message || "فشل حفظ الملاحظات");
    }
  };

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedTicket || !replyText.trim()) return;

    setIsSendingReply(true);
    try {
      await addReply(selectedTicket._id, replyText.trim(), token);
      toast.success("تم إرسال الرد للطالب بنجاح");
      setReplyText("");
      // Refresh current ticket in sheet
      const updated = adminTickets.find((t) => t._id === selectedTicket._id);
      if (updated) setSelectedTicket(updated);
    } catch (err: any) {
      toast.error(err.message || "فشل إرسال الرد");
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (!token) return;
    if (!window.confirm("هل أنت متأكد من رغبتك في حذف هذه التذكرة نهائياً؟")) return;

    try {
      await deleteTicket(id, token);
      toast.success("تم حذف التذكرة بنجاح");
      if (selectedTicket?._id === id) {
        setIsSheetOpen(false);
      }
    } catch (err: any) {
      toast.error(err.message || "فشل حذف التذكرة");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> قيد الانتظار</span>;
      case "in_progress":
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> قيد المتابعة</span>;
      case "resolved":
        return <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> تم الرد والتوجيه</span>;
      case "closed":
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-xs font-bold">مغلقة</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-left" dir="ltr">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-[#2c1a4d] flex items-center gap-3">
            <Headphones className="h-7 w-7 text-[#8b3d6f]" />
            Student Consultations & Tickets
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Review student consultation requests, provide direct guidance, and address their academic needs.
          </p>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Tickets</span>
            <Headphones className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-[#2c1a4d]">{adminStats?.total || adminTickets.length}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Action</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-amber-600">{adminStats?.pending || 0}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">In Progress</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-blue-600">{adminStats?.in_progress || 0}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Resolved / Advised</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{adminStats?.resolved || 0}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by student name, email, subject, or issue keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-gray-50 border-gray-200 text-xs font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#8b3d6f] mb-2" />
            <span className="text-xs font-bold">Loading tickets...</span>
          </div>
        ) : adminTickets.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <Headphones className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <h3 className="text-sm font-bold text-gray-700 mb-1">No consultation tickets found</h3>
            <p className="text-xs text-gray-500">Tickets submitted by users will appear here.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-50/70">
              <TableRow>
                <TableHead className="font-bold text-xs">Student</TableHead>
                <TableHead className="font-bold text-xs">Subject & Goal</TableHead>
                <TableHead className="font-bold text-xs">Category & Level</TableHead>
                <TableHead className="font-bold text-xs">Status</TableHead>
                <TableHead className="font-bold text-xs">Date</TableHead>
                <TableHead className="text-right font-bold text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminTickets.map((ticket) => (
                <TableRow key={ticket._id} className="hover:bg-gray-50/50 cursor-pointer" onClick={() => handleOpenTicket(ticket)}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-sm text-[#2c1a4d]">{ticket.userName}</span>
                      <span className="text-xs text-gray-500">{ticket.userEmail}</span>
                      {ticket.userPhone && <span className="text-[11px] text-gray-400 font-medium">{ticket.userPhone}</span>}
                    </div>
                  </TableCell>

                  <TableCell className="max-w-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-gray-900 truncate">{ticket.subject}</span>
                      <span className="text-xs text-gray-500 line-clamp-1">{ticket.goalOrIssue}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#8b3d6f]">{ticket.category}</span>
                      <span className="text-[11px] text-gray-500 font-medium">{ticket.currentLevel === "single_or_engaged" ? "Engaged / Pre-marriage" : ticket.currentLevel === "married" ? "Married" : ticket.currentLevel === "parent" ? "Parents" : ticket.currentLevel}</span>
                    </div>
                  </TableCell>

                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="cursor-pointer">{getStatusBadge(ticket.status)}</button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => handleStatusChange(ticket._id, "pending")}>Pending</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(ticket._id, "in_progress")}>In Progress</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(ticket._id, "resolved")}>Resolved</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(ticket._id, "closed")}>Closed</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                  <TableCell className="text-xs text-gray-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenTicket(ticket)}
                        className="text-[#8b3d6f] hover:bg-[#8b3d6f]/10 text-xs font-bold cursor-pointer"
                      >
                        Reply & View
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteTicket(ticket._id)}
                        className="text-red-500 hover:bg-red-50 h-8 w-8 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Ticket Details & Action Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-6 text-left" dir="ltr">
          {selectedTicket && (
            <div className="space-y-6">
              <SheetHeader className="text-left border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-lg font-black text-[#2c1a4d]">{selectedTicket.subject}</SheetTitle>
                  {getStatusBadge(selectedTicket.status)}
                </div>
                <SheetDescription className="text-xs text-gray-500">
                  Ticket ID: #{selectedTicket._id.substring(selectedTicket._id.length - 8)} • Submitted on {new Date(selectedTicket.createdAt).toLocaleString()}
                </SheetDescription>
              </SheetHeader>

              {/* Student Bio Card */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Student Profile</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 block">Name:</span>
                    <span className="font-extrabold text-[#2c1a4d]">{selectedTicket.userName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Email:</span>
                    <span className="font-extrabold text-gray-800">{selectedTicket.userEmail}</span>
                  </div>
                  {selectedTicket.userPhone && (
                    <div>
                      <span className="text-gray-500 block">Phone / WhatsApp:</span>
                      <a href={`https://wa.me/${selectedTicket.userPhone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-600 font-bold hover:underline">
                        {selectedTicket.userPhone}
                      </a>
                    </div>
                  )}
                  {selectedTicket.preferredTime && (
                    <div>
                      <span className="text-gray-500 block">Preferred Time:</span>
                      <span className="font-bold text-gray-800">{selectedTicket.preferredTime}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Consultation Details */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Problem & Learning Goal</span>
                <div className="bg-white p-4 rounded-xl border border-gray-200 text-xs text-gray-800 leading-relaxed whitespace-pre-line shadow-xs">
                  {selectedTicket.goalOrIssue}
                </div>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Update Ticket Status</span>
                <div className="flex flex-wrap gap-2">
                  {["pending", "in_progress", "resolved", "closed"].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedTicket._id, st)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer",
                        selectedTicket.status === st
                          ? "bg-[#8b3d6f] text-white border-[#8b3d6f]"
                          : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {st === "pending" ? "Pending" : st === "in_progress" ? "In Progress" : st === "resolved" ? "Resolved" : "Closed"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Internal Notes */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Admin Internal Notes</span>
                <div className="flex gap-2">
                  <Input
                    placeholder="Private notes (visible only to admin team)..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="text-xs"
                  />
                  <Button size="sm" onClick={handleSaveNotes} className="bg-[#2c1a4d] hover:bg-[#2c1a4d]/90 text-white text-xs cursor-pointer">
                    Save
                  </Button>
                </div>
              </div>

              {/* Conversation / Replies History */}
              <div className="space-y-3 pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Conversation & Guidance ({selectedTicket.replies?.length || 0})
                  </span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {(!selectedTicket.replies || selectedTicket.replies.length === 0) ? (
                    <p className="text-xs text-gray-400 text-center py-4 bg-gray-50 rounded-xl">
                      No replies sent yet. Send your academic advice below.
                    </p>
                  ) : (
                    selectedTicket.replies.map((r, i) => {
                      const isAdm = r.senderRole === "admin" || r.senderRole === "instructor";
                      return (
                        <div
                          key={r._id || i}
                          className={cn(
                            "p-3 rounded-xl border text-xs",
                            isAdm
                              ? "bg-purple-50/70 border-purple-200 ml-6"
                              : "bg-gray-50 border-gray-200 mr-6"
                          )}
                        >
                          <div className="flex items-center justify-between font-bold mb-1">
                            <span className={isAdm ? "text-[#8b3d6f]" : "text-gray-800"}>
                              {r.senderName} {isAdm && "(Advisor)"}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{r.message}</p>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Send Reply to Student */}
                <form onSubmit={handleSendAdminReply} className="space-y-2 pt-2">
                  <textarea
                    rows={3}
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your advice, recommendation, or reply to the student..."
                    className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#8b3d6f] resize-none"
                  />
                  <Button
                    type="submit"
                    disabled={isSendingReply}
                    className="w-full bg-[#8b3d6f] hover:bg-[#8b3d6f]/90 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSendingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Send Reply to Student</span>
                  </Button>
                </form>
              </div>

            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
