# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

HTML, CSS, and vanilla JavaScript; the user specified this stack. Frontend prototype with localStorage; no backend, database, or API.

## Users

Eight internal roles at a pellet manufacturing business: Owner, Manager, Production Staff, Purchasing Staff, Warehouse Staff, QC Staff, Maintenance Staff, and Admin. Staff use role-specific workflows to operate procurement, production, quality inspection, inventory, maintenance, shipment, finance, and accounts.

## Product Purpose

BATT PPMS is an internal operations system for managing a pellet manufacturing business. The prototype should let users explore role-specific work and carry sample records through the four defined workflows: raw-material procurement, production and QC, machine incidents and maintenance, and proposed shipment and delivery. Success is completing connected workflow actions with consistent sample data and visible feedback.

## Positioning

A role-oriented operating system that connects procurement, production, QC, warehouse movement, maintenance, delivery, and financial records for a pellet plant.

## Operating Context

Internal desktop, tablet, and phone web use. External supplier and customer contact happens outside the system. The frontend simulates authentication, role access, OTP, and persistence; none is production security. No public registration, real SMS/Zalo OTP, internal chat, or internal calling.

## Capabilities and Constraints

- Eight sample accounts and role-specific navigation; admin manages accounts and permissions but receives no business access by default.
- Functional search, filters, sorting, pagination, record details, forms, submission, approval, confirmation, validation, and feedback on sample data persisted in localStorage. Return is modeled only for the shipment recipient/vehicle mismatch where specified; other return/rejection behavior is not invented.
- The four supplied workflows and permission rules are authoritative. Approval and adjustment are separate actions. No draft state or save-draft action.
- There is one fixed input category, “Nguyên vật liệu thô”, and one output category, “Viên nén thành phẩm”. Directory records are retained and can be marked “Ngừng hợp tác”; there is no hard delete.
- The two finished-goods locations are named only Kho A and Kho B; do not attach quality or commercial meanings to them. No rework flow.
- Purchase-weight records are not payment records. Finance separately records supplier payments, customer receipts, and operating expenses.
- Finance displays “Đã thu/Chưa thu” and “Đã trả/Chưa trả”. No profit metric or profit formula is displayed.
- No real company data or claims. Use coherent synthetic examples. Currency is VNĐ; dates use familiar Vietnamese formatting.
- Unspecified number tolerances, QC units/thresholds, stock reservation and partial dispatch behavior, kg-to-bag conversion, granular account-permission model, and some field-level requirements remain **Cần xác nhận**. Password recovery uses the fixed prototype OTP specified in the brief. Do not turn assumptions into system rules.

## Evidence on Hand

The user's product brief is the source for requirements. There are no supplied real company records, logos, testimonials, customer evidence, or operational assets. Use synthetic data only and do not fabricate business claims.

## Product Principles

- Keep each role focused on its assigned work and reveal only permitted data and actions.
- Keep handoffs and approval ownership explicit across the four workflows.
- Preserve traceability from raw-material purchase, production shift, and individual bags through warehouse and shipment records.
- Separate machine incident severity from the machine's current operating state.
- Keep prototype authentication and persistence visibly scoped as simulation, not production security.
