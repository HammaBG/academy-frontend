"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import {
  MoreHorizontal,
  Search,
  UserPlus,
  Mail,
  Shield,
  Trash2,
  Edit,
  Loader2
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth";

export default function UsersPage() {
  const { users, isDataLoading, getAllUsers, updateUser, error } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");

  // Instructor Promotion States
  const [selectedUserToPromote, setSelectedUserToPromote] = useState<any>(null);
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  const [instructorTitle, setInstructorTitle] = useState("");
  const [instructorAvatar, setInstructorAvatar] = useState("");
  const [isPromoting, setIsPromoting] = useState(false);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setInstructorAvatar(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePromote = async () => {
    if (!selectedUserToPromote) return;
    try {
      setIsPromoting(true);
      await updateUser(selectedUserToPromote.id, {
        role: "instructor",
        title: instructorTitle,
        avatar_url: instructorAvatar,
      });
      toast.success(`${selectedUserToPromote.first_name} is now an Instructor!`);
      setPromoteDialogOpen(false);
      setSelectedUserToPromote(null);
      setInstructorTitle("");
      setInstructorAvatar("");
    } catch (err: any) {
      toast.error(err.message || "Failed to promote user");
    } finally {
      setIsPromoting(false);
    }
  };

  const filteredUsers = (users || []).filter(user =>
    (user.first_name + " " + user.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#2c1a4d]">User Management</h1>
          <p className="text-gray-500 font-medium mt-1">View, manage and update user permissions.</p>
        </div>
        <Button className="bg-[#8b3d6f] hover:bg-[#7c3663] text-white font-bold gap-2">
          <UserPlus className="w-4 h-4" />
          Add New User
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold flex items-center gap-2">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          Error: {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isDataLoading && <Loader2 className="w-5 h-5 text-[#8b3d6f] animate-spin" />}
        </div>

        <Table>
          <TableHeader className="bg-gray-100/50">
            <TableRow>
              <TableHead className="font-bold text-[#2c1a4d]">User</TableHead>
              <TableHead className="font-bold text-[#2c1a4d]">Email</TableHead>
              <TableHead className="font-bold text-[#2c1a4d]">Role</TableHead>
              <TableHead className="font-bold text-[#2c1a4d]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isDataLoading && filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50/80 transition-colors border-b border-gray-50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-gray-200 shadow-sm">
                      <AvatarFallback className="bg-[#8b3d6f] text-white font-bold text-xs uppercase">
                        {user.first_name ? user.first_name[0] : ""}
                        {user.last_name ? user.last_name[0] : ""}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#2c1a4d] text-[15px]">{user.first_name} {user.last_name}</span>
                      <span className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase">{user.id.substring(0, 8)}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 font-bold text-[14px]">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#8b3d6f]/60" />
                    {user.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${user.role === 'admin' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      user.role === 'instructor' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                        'bg-gray-50 text-gray-400 border border-gray-100'
                      }`}>
                      {user.role || 'user'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-gray-100 text-gray-400">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    } />
                    <DropdownMenuContent align="end" className="w-56 font-bold shadow-xl border-gray-100 p-2">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-gray-400 uppercase text-[10px] py-2 px-3 tracking-widest">User Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-3 py-2.5 px-3 hover:bg-gray-50 transition-colors cursor-pointer rounded-md">
                          <Edit className="w-4 h-4 text-blue-600" />
                          <span>Edit Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUserToPromote(user);
                            setPromoteDialogOpen(true);
                          }}
                          className="gap-3 py-2.5 px-3 hover:bg-gray-50 transition-colors cursor-pointer rounded-md"
                        >
                          <Shield className="w-4 h-4 text-purple-600" />
                          <span>Promote to Instructor</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-3 py-2.5 px-3 hover:bg-red-50 text-red-600 focus:text-red-700 transition-colors cursor-pointer rounded-md mt-1">
                          <Trash2 className="w-4 h-4" />
                          <span>Delete User</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>

                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!isDataLoading && filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-12 h-12 text-gray-100 mb-4" />
            <p className="text-gray-400 font-bold text-lg">No matches found</p>
            <p className="text-gray-300 text-sm">Try adjusting your search criteria</p>
          </div>
        )}

        {isDataLoading && (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-[#8b3d6f] animate-spin mb-4" />
            <p className="text-[#8b3d6f] font-bold animate-pulse">Syncing user database...</p>
          </div>
        )}
      </div>

      <Dialog open={promoteDialogOpen} onOpenChange={setPromoteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#2c1a4d] font-black text-xl">Promote to Instructor</DialogTitle>
            <DialogDescription className="text-gray-500 font-medium">
              Update {selectedUserToPromote?.first_name}'s profile to give them teaching privileges.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#2c1a4d] font-bold">Professional Title</Label>
              <Input
                id="title"
                placeholder="e.g. Senior Software Engineer"
                value={instructorTitle}
                onChange={(e) => setInstructorTitle(e.target.value)}
                className="bg-gray-50 py-2 border-gray-200"
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[#2c1a4d] font-bold">Profile Photo</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-gray-100 shadow-sm">
                  {instructorAvatar ? (
                    <img src={instructorAvatar} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-gray-100 text-gray-400 font-bold">
                      <UserPlus className="w-6 h-6" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 space-y-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="cursor-pointer file:bg-[#8b3d6f] file:text-white file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 file:hover:bg-[#7c3663] text-sm text-gray-500"
                  />
                  <p className="text-[11px] text-gray-400 font-medium">Max file size: 2MB. Recommended 400x400px.</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-between border-t border-gray-100 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPromoteDialogOpen(false)}
              className="font-bold border-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handlePromote}
              disabled={isPromoting || !instructorTitle}
              className="bg-[#fbad26] hover:bg-[#e09a1f] text-[#2c1a4d] font-bold min-w-[120px]"
            >
              {isPromoting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Promoting...
                </>
              ) : (
                "Confirm Promotion"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
