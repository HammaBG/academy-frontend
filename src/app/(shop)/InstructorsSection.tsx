import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";

const bgColors = [
  "bg-[#38b2ac]", // Teal
  "bg-[#71b19a]", // Mint/Sage
  "bg-[#80d768]", // Apple Green
  "bg-[#ab6b9c]", // Purple/Mauve
  "bg-[#4299e1]", // Blue
  "bg-[#ed64a6]", // Pink
];

export function InstructorsSection() {
  const { instructors, isDataLoading, getInstructors } = useAuthStore();

  useEffect(() => {
    getInstructors();
  }, [getInstructors]);

  if (isDataLoading && instructors.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-20 border-t border-white/5">
        <div className="text-right mb-16">
          <h2 className="text-4xl text-white font-black mb-4 inline-block relative">
            المُعلِّمون
            <div className="absolute -bottom-2 right-0 w-2/3 h-1 bg-[#fbad26] rounded-full"></div>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-white/5 rounded-3xl h-[280px]" />
          ))}
        </div>
      </section>
    );
  }

  if (instructors.length === 0) {
    return null; // Don't show the section if no instructors
  }

  return (
    <section className="w-full bg-[#f6f7f9] border-t border-white/5 py-20" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-right mb-16 flex justify-start">
          <h2 className="text-4xl text-[#6b254a] font-extrabold mb-4 inline-block relative">
            المُعلِّمون
            <div className="absolute -bottom-3 right-0 w-[50px] h-1 bg-[#fcca3b]"></div>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {instructors.slice(0, 8).map((instructor, index) => (
            <div key={instructor.id} className="flex flex-col items-center">
              <div 
                className={`w-full aspect-square rounded-[1.5rem] overflow-hidden ${bgColors[index % bgColors.length]}`}
              >
                {instructor.avatar_url ? (
                  <img 
                    src={instructor.avatar_url} 
                    alt={instructor.first_name || "Instructor"} 
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/50 space-y-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="mt-6 text-center">
                <h3 className="text-xl font-extrabold text-[#3d5a73] mb-1">
                  {instructor.first_name} {instructor.last_name}
                </h3>
                {instructor.title && (
                  <p className="text-sm font-medium text-gray-500">
                    {instructor.title}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
