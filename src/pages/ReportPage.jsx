import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import API_BASE_URL from "./config";
import TopNav from "../components/TopNav";
import { toast } from "react-toastify";
import "./ReportPage.css";
import API from "../api/api";


const categorizeAnswers = (stock) => {
  const overview = [];
  const metrics = [];
  const conclusion = [];

  stock.subcategories.forEach((sub) => {
    sub.questions.forEach((q) => {
      const text = q.answerText || "—";
      const name = sub.subCategoryName.toLowerCase();

      if (name.includes("overview") || name.includes("business")) {
        overview.push(text);
      } else if (name.includes("metric") || name.includes("financial")) {
        metrics.push(text);
      } else if (name.includes("conclusion") || name.includes("summary")) {
        conclusion.push(text);
      } else {
        overview.push(text);
      }
    });
  });

  return { overview, metrics, conclusion };
};

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`${API_BASE_URL}/api/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);
  const downloadPDF = (stock = null) => {
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 15;
  const maxWidth = pageWidth - margin * 2;

  let y = 20;

  // 🔹 Helper: add page safely
  const checkPageBreak = (spaceNeeded = 10) => {
    if (y + spaceNeeded > pageHeight - 10) {
      pdf.addPage();
      y = 20;
    }
  };

  // 🔹 Helper: add section title
  const addTitle = (text) => {
    checkPageBreak(10);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(0, 102, 204);
    pdf.text(text, margin, y);
    y += 8;
  };

  // 🔹 Helper: add paragraph (core fix)
  const addParagraph = (text) => {
    if (!text) return;

    const cleanText = text.replace(/\n/g, " ");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);

    const lines = pdf.splitTextToSize(cleanText, maxWidth);

    lines.forEach((line) => {
      checkPageBreak(6);
      pdf.text(line, margin, y);
      y += 6;
    });

    y += 2; // spacing between paragraphs
  };

  // 🔹 Header
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.setTextColor(28, 37, 65);
  pdf.text("Investment Research Report", pageWidth / 2, y, {
    align: "center",
  });
  y += 15;

  const data = stock ? [stock] : reports;

  data.forEach((s, index) => {
    const { overview, metrics, conclusion } = categorizeAnswers(s);

    // 🔹 Stock title
    checkPageBreak(12);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(0, 128, 128);
    pdf.text(`Stock: ${s.stockSymbol}`, margin, y);
    y += 10;

    // 🔹 Sections
    addTitle("Overview");
    overview.forEach(addParagraph);

    addTitle("Metrics");
    metrics.forEach(addParagraph);

    addTitle("Conclusion");
    conclusion.forEach(addParagraph);

    // 🔹 Divider
    if (index !== data.length - 1) {
      checkPageBreak(10);
      pdf.setDrawColor(200);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 10;
    }
  });

  const fileName = stock
    ? `${stock.stockSymbol}_Report.pdf`
    : "Full_Investment_Report.pdf";

  pdf.save(fileName);
};
return (
  <div className="report-page">
    <TopNav title="Investment Reports" />

    <div className="container">
      {reports.map((stock) => {
        const { overview, metrics, conclusion } = categorizeAnswers(stock);

        return (
          <div key={stock.stockSymbol} className="report-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>{stock.stockSymbol}</h2>

              <button onClick={() => downloadPDF(stock)}>
                Download
              </button>
            </div>

            <div>
              <h4>Overview</h4>
              {overview.map((ans, i) => <p key={i}>{ans}</p>)}

              <h4>Metrics</h4>
              {metrics.map((ans, i) => <p key={i}>{ans}</p>)}

              <h4>Conclusion</h4>
              {conclusion.map((ans, i) => <p key={i}>{ans}</p>)}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
};

export default ReportPage;
