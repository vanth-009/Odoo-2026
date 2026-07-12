const express = require("express");
const { Company } = require("../models");

const router = express.Router();

function formatCompany(company) {
  if (!company) return null;
  const data = company.toJSON ? company.toJSON() : company;
  return {
    ...data,
    _id: String(data.id)
  };
}

// Create company from registration form
router.post("/register", async (req, res) => {
    try {
        const { tier, formData } = req.body;

        if (!tier || !formData) {
            return res.status(400).json({ success: false, message: "tier and formData are required" });
        }

        const company = await Company.create({
            tier,
            companyData: formData
        });

        res.status(201).json({
            success: true,
            message: "Company registered successfully",
            data: formatCompany(company)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all companies
router.get("/", async (req, res) => {
    try {
        const { tier, search } = req.query;

        const filter = {};
        if (tier) filter.tier = tier;

        let companies = await Company.findAll({
            where: filter,
            order: [["createdAt", "DESC"]]
        });

        let formatted = companies.map(formatCompany);

        if (search) {
            const q = search.toLowerCase();
            formatted = formatted.filter((c) => {
                const name = String(c.companyData?.companyName || "").toLowerCase();
                const email = String(c.companyData?.officialCompanyEmail || "").toLowerCase();
                return name.includes(q) || email.includes(q);
            });
        }

        res.json({ success: true, data: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get one company
router.get("/:id", async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);
        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }
        res.json({ success: true, data: formatCompany(company) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update company tier
router.put("/:id/role", async (req, res) => {
    try {
        const { role } = req.body;
        const company = await Company.findByPk(req.params.id);
        if (!company) return res.status(404).json({ success: false, message: "Company not found" });

        company.tier = role;
        await company.save();

        res.json({ success: true, data: formatCompany(company) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Toggle company status
router.put("/:id/status", async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);
        if (!company) return res.status(404).json({ success: false, message: "Company not found" });

        company.status = company.status === "active" ? "inactive" : "active";
        await company.save();
        res.json({ success: true, data: formatCompany(company) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete company
router.delete("/:id", async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);
        if (!company) return res.status(404).json({ success: false, message: "Company not found" });

        await company.destroy();
        res.json({ success: true, message: "Company deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
