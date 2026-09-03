"use client";

import { useRef, useState } from "react";
import { X, Download, Award, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../public/ossosacademy.jpg";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  courseTitle: string;
  completionDate?: string;
  certificateId?: string;
}

export function CertificateModal({
  isOpen,
  onClose,
  studentName,
  courseTitle,
  completionDate,
  certificateId,
}: CertificateModalProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const formattedDate =
    completionDate ||
    new Date().toLocaleDateString("ar-TN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const uniqueId =
    certificateId ||
    `OSSOS-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}-${new Date().getFullYear()}`;

  const handleDownloadPDF = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    const element = certificateRef.current;
    if (!element) return;

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",

        onclone: (clonedDoc) => {
          // Clean oklab / lab / oklch CSS colors
          // for html2canvas compatibility
          const styles = clonedDoc.querySelectorAll("style");

          styles.forEach((style) => {
            if (style.textContent) {
              style.textContent = style.textContent
                .replace(/oklab\([^)]+\)/g, "#F95353")
                .replace(/oklch\([^)]+\)/g, "#F95353")
                .replace(/lab\([^)]+\)/g, "#F95353");
            }
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        canvas.width,
        canvas.height
      );

      const safeName = (studentName || "طالب").replace(/\s+/g, "_");

      pdf.save(`شهادة-إكمال-${safeName}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div
        className="relative w-full max-w-5xl bg-[#1e1b2e] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================= */}
        {/* TOP CONTROL BAR */}
        {/* ========================================================= */}

        <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-[#171424]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F95353]/20 border border-[#F95353]/40 flex items-center justify-center text-[#F95353]">
              <Award className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">
                شهادة إكمال الدورة
              </h3>

              <p className="text-[11px] font-bold text-gray-400">
                أكاديمية أسس للتعليم الرقمي
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Download Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F95353] hover:bg-[#d94343] disabled:opacity-50 text-white font-extrabold text-xs transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري إنشاء الـ PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>تحميل الشهادة (PDF)</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CERTIFICATE DISPLAY */}
        {/* ========================================================= */}

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#110e1c] flex items-center justify-center">
          <div
            ref={certificateRef}
            className="relative w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden text-center"
            dir="rtl"
            style={{
              backgroundColor: "#ffffff",
              color: "#1a1a1a",
              padding: "48px 32px",
              border: "12px solid #F95353",
              backgroundImage:
                "radial-gradient(#F9535312 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          >
            {/* ===================================================== */}
            {/* INNER GOLD FRAME */}
            {/* ===================================================== */}

            <div
              className="absolute pointer-events-none"
              style={{
                top: "12px",
                bottom: "12px",
                left: "12px",
                right: "12px",
                border: "2px solid #D4AF37",
                borderRadius: "8px",
                opacity: 0.6,
              }}
            />

            {/* ===================================================== */}
            {/* CORNER DECORATIONS */}
            {/* ===================================================== */}

            <div
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "48px",
                height: "48px",
                borderTop: "4px solid #D4AF37",
                borderRight: "4px solid #D4AF37",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                width: "48px",
                height: "48px",
                borderTop: "4px solid #D4AF37",
                borderLeft: "4px solid #D4AF37",
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: "16px",
                right: "16px",
                width: "48px",
                height: "48px",
                borderBottom: "4px solid #D4AF37",
                borderRight: "4px solid #D4AF37",
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                width: "48px",
                height: "48px",
                borderBottom: "4px solid #D4AF37",
                borderLeft: "4px solid #D4AF37",
              }}
            />

            {/* ===================================================== */}
            {/* HEADER */}
            {/* ===================================================== */}

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "32px",
                width: "100%",
                direction: "rtl",
              }}
            >
              {/* ================================================= */}
              {/* ACADEMY LOGO */}
              {/* ================================================= */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  direction: "rtl",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={logo.src}
                    alt="Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <span
                  style={{
                    fontWeight: 900,
                    fontSize: "18px",
                    color: "#2c1a4d",
                    letterSpacing: "normal",
                    whiteSpace: "nowrap",
                  }}
                >
                  أكاديمية أسس
                </span>
              </div>

              {/* ================================================= */}
              {/* OFFICIAL CERTIFICATE SEAL */}
              {/* ================================================= */}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "150px",
                  direction: "rtl",
                }}
              >
                {/* Seal */}
                <div
                  style={{
                    width: "62px",
                    height: "62px",
                    borderRadius: "50%",
                    border: "2px solid #D4AF37",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    backgroundColor: "#fffdf5",
                    boxShadow:
                      "0 2px 8px rgba(212,175,55,0.15)",
                  }}
                >
                  {/* Inner Circle */}
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      border: "1px solid #D4AF37",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "8px",
                        fontWeight: 900,
                        color: "#2c1a4d",
                        lineHeight: "1.3",
                      }}
                    >
                      أكاديمية
                      <br />
                      أسس
                    </span>
                  </div>

                  {/* Top Star */}
                  <span
                    style={{
                      position: "absolute",
                      top: "4px",
                      fontSize: "8px",
                      color: "#F95353",
                    }}
                  >
                    ✦
                  </span>

                  {/* Bottom Star */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: "4px",
                      fontSize: "8px",
                      color: "#F95353",
                    }}
                  >
                    ✦
                  </span>
                </div>

                {/* Seal Text */}
                <div
                  style={{
                    marginTop: "6px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 900,
                      color: "#F95353",
                      whiteSpace: "nowrap",
                    }}
                  >
                    شهادة موثقة
                  </div>

                  <div
                    style={{
                      fontSize: "7px",
                      fontWeight: 700,
                      color: "#9ca3af",
                      letterSpacing: "1.2px",
                      direction: "ltr",
                      marginTop: "2px",
                    }}
                  >
                    VERIFIED CERTIFICATE
                  </div>
                </div>
              </div>
            </div>

            {/* ===================================================== */}
            {/* CERTIFICATE HEADING */}
            {/* ===================================================== */}

            <div
              style={{
                margin: "24px 0",
              }}
            >
              <h1
                style={{
                  fontSize: "38px",
                  fontWeight: 900,
                  color: "#F95353",
                  letterSpacing: "normal",
                  marginBottom: "8px",
                  lineHeight: "1.3",
                }}
              >
                شهادة إكمال دورة
              </h1>

              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#6b7280",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                CERTIFICATE OF COURSE COMPLETION
              </p>
            </div>

            {/* ===================================================== */}
            {/* RECIPIENT */}
            {/* ===================================================== */}

            <div
              style={{
                margin: "32px 0",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#4b5563",
                  letterSpacing: "normal",
                }}
              >
                تشهد أكاديمية أسس بأن الطالب(ة):
              </p>

              <h2
                style={{
                  fontSize: "34px",
                  fontWeight: 900,
                  color: "#2c1a4d",
                  textDecoration: "underline",
                  textDecorationColor: "#D4AF37",
                  textUnderlineOffset: "8px",
                  margin: "12px 0",
                  letterSpacing: "normal",
                }}
              >
                {studentName}
              </h2>

              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#4b5563",
                  paddingTop: "8px",
                  letterSpacing: "normal",
                }}
              >
                قد أتم(ت) بنجاح جميع متطلبات واختبارات الدورة التدريبية
                بعنوان:
              </p>

              <h3
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "#F95353",
                  paddingTop: "6px",
                  letterSpacing: "normal",
                }}
              >
                "{courseTitle}"
              </h3>
            </div>

            {/* ===================================================== */}
            {/* FOOTER */}
            {/* ===================================================== */}

            <div
              style={{
                marginTop: "40px",
                paddingTop: "24px",
                borderTop: "1px solid #e5e7eb",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
                textAlign: "right",
              }}
            >
              {/* ================================================= */}
              {/* ISSUE DATE & ID */}
              {/* ================================================= */}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#9ca3af",
                      letterSpacing: "normal",
                    }}
                  >
                    تاريخ الإصدار:
                  </p>

                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 900,
                      color: "#1f2937",
                      letterSpacing: "normal",
                    }}
                  >
                    {formattedDate}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#9ca3af",
                      letterSpacing: "normal",
                    }}
                  >
                    رقم التسجيل والتحقق:
                  </p>

                  <p
                    style={{
                      fontSize: "12px",
                      fontFamily: "monospace",
                      fontWeight: 900,
                      color: "#1c1130",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {uniqueId}
                  </p>
                </div>
              </div>

              {/* ================================================= */}
              {/* OFFICIAL STAMP & SIGNATURE */}
              {/* ================================================= */}

              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "220px",
                  minHeight: "110px",
                }}
              >
                {/* Official Stamp */}
                <div
                  style={{
                    width: "95px",
                    height: "95px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.85,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 268.77 269.04"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <g fill="#F95353">
                      <path
                        d="M131.29,108a11.25,11.25,0,0,1-16.63-2.44A12.17,12.17,0,0,1,112,96.37c.44-3.13,2.21-5.83,5.28-8.1A11.45,11.45,0,0,1,126,85.86a11.62,11.62,0,0,1,7.68,5q3.41,4.62,2.71,9.27A11.93,11.93,0,0,1,131.29,108ZM130,106.18a9,9,0,0,0,3.92-6.1,10,10,0,0,0-2.3-7.29c-1.85-2.51-3.94-4-6.25-4.4a8.63,8.63,0,0,0-6.88,1.87,8.78,8.78,0,0,0-3.76,6.15,11.27,11.27,0,0,0,8.4,11.52A8.52,8.52,0,0,0,130,106.18Z"
                        transform="translate(-62.49 -62.33)"
                      />

                      <path
                        d="M145.44,96.25,146,94a11.7,11.7,0,0,0,3.42.13,12.38,12.38,0,0,0,3.46-1A6.57,6.57,0,0,0,156,90.6a3.62,3.62,0,0,0,.2-3.46A3.48,3.48,0,0,0,154,85.06a12.08,12.08,0,0,0-4.55-.22,15.37,15.37,0,0,1-6-.39,5,5,0,0,1-3.09-3,5.63,5.63,0,0,1,.22-5.1,9.05,9.05,0,0,1,4.68-3.88,13.93,13.93,0,0,1,3.16-.91,14.29,14.29,0,0,1,3.42-.16l-.32,2.3a11.18,11.18,0,0,0-5.58.92A6,6,0,0,0,143,77a3.36,3.36,0,0,0-.16,3.16,3.1,3.1,0,0,0,2.15,1.88,14.17,14.17,0,0,0,4.58.16,13.91,13.91,0,0,1,6,.43,5.5,5.5,0,0,1,3.11,3.19,6.05,6.05,0,0,1-.16,5.3,9.19,9.19,0,0,1-4.91,4.12,14.64,14.64,0,0,1-4,1.11A13.73,13.73,0,0,1,145.44,96.25Z"
                        transform="translate(-62.49 -62.33)"
                      />

                      <path
                        d="M166.35,88.08l1-2.14a12,12,0,0,0,3.33.81,12.92,12.92,0,0,0,3.58-.26,6.47,6.47,0,0,0,3.6-1.85,3.63,3.63,0,0,0,.89-3.36,3.49,3.49,0,0,0-1.79-2.48,12.16,12.16,0,0,0-4.41-1.11,15.23,15.23,0,0,1-5.77-1.57,5,5,0,0,1-2.45-3.52,5.62,5.62,0,0,1,1.23-5,9.08,9.08,0,0,1,5.36-2.87,13.89,13.89,0,0,1,3.28-.27,15.08,15.08,0,0,1,3.38.52l-.77,2.19a11.41,11.41,0,0,0-5.65-.21,6,6,0,0,0-3.4,1.75,3.36,3.36,0,0,0-.79,3.07,3.1,3.1,0,0,0,1.74,2.26,14.16,14.16,0,0,0,4.45,1.07,13.88,13.88,0,0,1,5.81,1.61,5.52,5.52,0,0,1,2.42,3.74,6.11,6.11,0,0,1-1.21,5.17,9.18,9.18,0,0,1-5.63,3.06,14.86,14.86,0,0,1-4.19.29A14.06,14.06,0,0,1,166.35,88.08Z"
                        transform="translate(-62.49 -62.33)"
                      />

                      <rect
                        x="126.66"
                        y="113.67"
                        width="53.4"
                        height="83.29"
                        fill="#F95353"
                      />

                      <path
                        d="M223.46,194.5h-57.3a56.28,56.28,0,0,1,54.37-42V128.31a80.36,80.36,0,0,0-80.36,80.36V241.6h83.29Z"
                        transform="translate(-62.49 -62.33)"
                        fill="#F95353"
                      />
                    </g>
                  </svg>
                </div>

                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 900,
                    color: "#F95353",
                    letterSpacing: "normal",
                    marginTop: "2px",
                  }}
                >
                  ختم الأكاديمية الرسمي
                </span>

                {/* ================================================= */}
                {/* SIGNATURE */}
                {/* ================================================= */}

                <div
                  style={{
                    position: "absolute",
                    top: "14px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transform: "rotate(-5deg)",
                    pointerEvents: "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        "Georgia, 'Times New Roman', serif",
                      fontSize: "22px",
                      fontWeight: 900,
                      color: "#1c1130",
                      fontStyle: "italic",
                      letterSpacing: "normal",
                      textShadow:
                        "0 0 4px rgba(255,255,255,0.9)",
                    }}
                  >
                    أكاديمية أسس
                  </span>

                  <svg
                    width="120"
                    height="12"
                    viewBox="0 0 120 12"
                    fill="none"
                    style={{
                      marginTop: "-3px",
                    }}
                  >
                    <path
                      d="M2 9C30 3 80 11 118 4"
                      stroke="#F95353"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}