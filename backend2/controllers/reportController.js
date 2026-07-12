const { Company, Document } = require("../models");
const { Op } = require("sequelize");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 200;

function toDateOnly(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function toStatus(expiryDate) {
  if (!expiryDate) return "In Progress";
  return new Date(expiryDate).getTime() < Date.now() ? "Overdue" : "Completed";
}

function toAmount(document, company) {
  const raw =
    document?.amount ??
    company?.companyData?.amount ??
    company?.companyData?.paidUpCapital ??
    0;

  const amount = Number(raw);
  return Number.isFinite(amount) ? amount : 0;
}

function toPan(company) {
  return (
    company?.companyData?.pan ||
    company?.companyData?.companyPan ||
    company?.companyData?.panNumber ||
    "N/A"
  );
}

function toCompanyName(company) {
  return company?.companyData?.companyName || "Unknown Company";
}

function mapCategoryToIds(categoryKey) {
  if (!categoryKey) return [];

  const mapping = {
    tds: ["tds-report", "tds"],
    "company-pan-register": ["pan-register", "company-pan-register"],
    "company-document-register": ["document-register", "company-document-register"],
    "pending-tax": ["pending-tax"],
    "tax-payment-history": ["tax-payment-history"],
    "compliance-status": ["compliance-status-report", "compliance-status"],
    "company-registration": ["registration-report", "company-registration"],
    "gst-filing": ["gst-filing-report", "gst-filing"],
    "document-expiry": ["document-expiry-report", "document-expiry"],
    audit: ["audit-report", "audit"],
    "user-activity": ["user-activity-report", "user-activity"],
    roc: ["roc-report", "roc"]
  };

  return mapping[categoryKey] || [categoryKey];
}

function toReportRow(document) {
  const docData = document.toJSON ? document.toJSON() : document;
  const company = docData.company;

  return {
    id: String(docData.id),
    reportId: docData.reportId || null,
    companyId: company?.id ? String(company.id) : null,
    categoryId: docData.categoryId,
    title: docData.title,
    companyName: toCompanyName(company),
    pan: toPan(company),
    reportDate: toDateOnly(docData.registeredAt || docData.uploadedAt || docData.createdAt),
    amount: toAmount(docData, company),
    status: toStatus(docData.expiryDate),
    registeredAt: docData.registeredAt || null,
    uploadedAt: docData.uploadedAt,
    expiryDate: docData.expiryDate,
    fileName: docData.fileName,
    filePath: docData.filePath,
    mimeType: docData.mimeType,
    size: docData.size,
    tier: company?.tier || null,
    companyEmail: company?.companyData?.officialCompanyEmail || null
  };
}

function parsePositiveInt(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.floor(n);
}

function buildSort(sortBy = "registeredAt", order = "desc") {
  const allowedSort = new Set(["registeredAt", "uploadedAt", "createdAt", "title", "categoryId", "reportId"]);
  const field = allowedSort.has(sortBy) ? sortBy : "registeredAt";
  const direction = String(order).toUpperCase() === "ASC" ? "ASC" : "DESC";
  return [[field, direction], ["createdAt", "DESC"]];
}

function buildBaseFilter({ categoryKey, search }) {
  const filter = { docType: "report" };

  if (categoryKey) {
    const categoryIds = mapCategoryToIds(categoryKey);
    if (categoryIds.length) {
      filter.categoryId = { [Op.in]: categoryIds };
    }
  }

  if (search && search.trim()) {
    const searchVal = `%${search.trim()}%`;
    filter[Op.or] = [
      { title: { [Op.like]: searchVal } },
      { categoryId: { [Op.like]: searchVal } },
      { reportId: { [Op.like]: searchVal } },
      { originalName: { [Op.like]: searchVal } }
    ];
  }

  return filter;
}

function parseReportSequenceId(id) {
  const match = /^rpt-(\d+)$/i.exec(String(id || "").trim());
  if (!match) return null;
  return Number(match[1]);
}

async function fetchSingleReportDocument(id) {
  if (!isNaN(Number(id))) {
    const byObjectId = await Document.findByPk(Number(id), {
      include: [{ model: Company, as: "company", attributes: ["companyData", "tier"] }]
    });

    if (byObjectId) return byObjectId;
  }

  const byReportId = await Document.findOne({
    where: { docType: "report", reportId: id },
    include: [{ model: Company, as: "company", attributes: ["companyData", "tier"] }]
  });

  if (byReportId) return byReportId;

  // Backward-compatible fallback
  const sequence = parseReportSequenceId(id);
  if (!sequence || sequence <= 0) return null;

  const bySequence = await Document.findOne({
    where: { docType: "report" },
    order: buildSort("registeredAt", "desc"),
    offset: sequence - 1,
    include: [{ model: Company, as: "company", attributes: ["companyData", "tier"] }]
  });

  return bySequence;
}

async function fetchReportsPage({ categoryKey, search, page, limit, sortBy, order }) {
  const filter = buildBaseFilter({ categoryKey, search });
  const sort = buildSort(sortBy, order);

  const { rows: docs, count: total } = await Document.findAndCountAll({
    where: filter,
    include: [{ model: Company, as: "company", attributes: ["companyData", "tier"] }],
    order: sort,
    offset: (page - 1) * limit,
    limit: limit
  });

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    rows: docs.map(toReportRow),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages
    }
  };
}

async function fetchRowsForExport({ id, categoryKey }) {
  if (id) {
    const doc = await fetchSingleReportDocument(id);
    return doc ? [toReportRow(doc)] : [];
  }

  const filter = buildBaseFilter({ categoryKey });
  const sort = buildSort("registeredAt", "desc");

  const docs = await Document.findAll({
    where: filter,
    include: [{ model: Company, as: "company", attributes: ["companyData", "tier"] }],
    order: sort
  });

  return docs.map(toReportRow);
}

function asCsv(rows) {
  const header = [
    "Company Name",
    "PAN",
    "Report Date",
    "Amount (INR)",
    "Status",
    "Category"
  ];

  const lines = rows.map((row) => [
    row.companyName,
    row.pan,
    row.reportDate,
    String(row.amount),
    row.status,
    row.title || row.categoryId
  ]);

  return [header, ...lines]
    .map((line) => line.map((cell) => `"${String(cell || "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

function asExcel(rows) {
  const header = [
    "Company Name",
    "PAN",
    "Report Date",
    "Amount (INR)",
    "Status",
    "Category"
  ];

  const lines = rows.map((row) => [
    row.companyName,
    row.pan,
    row.reportDate,
    String(row.amount),
    row.status,
    row.title || row.categoryId
  ]);

  return [header, ...lines].map((line) => line.join("\t")).join("\n");
}

function escapePdfText(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function asSimplePdf(rows, title) {
  const printableRows = rows.length
    ? rows
    : [{ companyName: "No data", pan: "-", reportDate: "-", amount: 0, status: "-" }];

  const lines = printableRows.slice(0, 28).map(
    (row, index) =>
      `${index + 1}. ${row.companyName} | ${row.pan} | ${row.reportDate} | INR ${Number(
        row.amount || 0
      ).toLocaleString("en-IN")} | ${row.status}`
  );

  const contentParts = [
    "BT",
    "/F1 12 Tf",
    "50 790 Td",
    `(${escapePdfText(title)}) Tj`,
    "/F1 10 Tf"
  ];

  lines.forEach((line) => {
    contentParts.push("0 -18 Td");
    contentParts.push(`(${escapePdfText(line)}) Tj`);
  });

  contentParts.push("ET");

  const stream = contentParts.join("\n");
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}\nendstream\nendobj\n`
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += object;
  }

  const xrefStart = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return Buffer.from(pdf, "utf8");
}

exports.getReports = async (req, res) => {
  try {
    const page = parsePositiveInt(req.query.page, DEFAULT_PAGE);
    const limit = Math.min(parsePositiveInt(req.query.limit, DEFAULT_LIMIT), MAX_LIMIT);

    const debugFilter = buildBaseFilter({
      categoryKey: req.query.category,
      search: req.query.search
    });
    console.log("[Reports] getReports filter:", debugFilter);

    const { rows, pagination } = await fetchReportsPage({
      categoryKey: req.query.category,
      search: req.query.search,
      sortBy: req.query.sort,
      order: req.query.order,
      page,
      limit
    });

    return res.json({ success: true, data: rows, pagination });
  } catch (error) {
    console.error("[Reports] getReports error:", {
      message: error.message,
      stack: error.stack,
      query: req.query
    });
    return res.status(500).json({ success: false, message: "Failed to fetch reports" });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const id = String(req.params.id || "").trim();
    if (!id) {
      return res.status(400).json({ success: false, message: "Report id is required" });
    }

    console.log("[Reports] getReportById identifier:", { id });
    const doc = await fetchSingleReportDocument(id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    return res.json({ success: true, data: toReportRow(doc) });
  } catch (error) {
    console.error("[Reports] getReportById error:", {
      id: req.params.id,
      message: error.message,
      stack: error.stack
    });
    return res.status(500).json({
      success: false,
      message: "Failed to fetch report details"
    });
  }
};

exports.exportPdf = async (req, res) => {
  try {
    const rows = await fetchRowsForExport({ id: req.params.id, categoryKey: req.query.category });

    if (req.params.id && !rows.length) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    const buffer = asSimplePdf(rows, "Company Report Export");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${req.params.id ? "company-report" : "all-reports"}.pdf"`
    );

    return res.send(buffer);
  } catch (error) {
    console.error("[Reports] exportPdf error:", { message: error.message, stack: error.stack });
    return res.status(500).json({ success: false, message: "Failed to export PDF" });
  }
};

exports.exportExcel = async (req, res) => {
  try {
    const rows = await fetchRowsForExport({ id: req.params.id, categoryKey: req.query.category });

    if (req.params.id && !rows.length) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    const content = asExcel(rows);
    res.setHeader("Content-Type", "application/vnd.ms-excel; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${req.params.id ? "company-report" : "all-reports"}.xls"`
    );

    return res.send(content);
  } catch (error) {
    console.error("[Reports] exportExcel error:", { message: error.message, stack: error.stack });
    return res.status(500).json({ success: false, message: "Failed to export Excel" });
  }
};

exports.exportCsv = async (req, res) => {
  try {
    const rows = await fetchRowsForExport({ id: req.params.id, categoryKey: req.query.category });

    if (req.params.id && !rows.length) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    const content = asCsv(rows);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${req.params.id ? "company-report" : "all-reports"}.csv"`
    );

    return res.send(content);
  } catch (error) {
    console.error("[Reports] exportCsv error:", { message: error.message, stack: error.stack });
    return res.status(500).json({ success: false, message: "Failed to export CSV" });
  }
};
