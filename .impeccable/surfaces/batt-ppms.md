# BATT PPMS · product operations

## FORM

Mode: Operate. New web product. Source: user's detailed Vietnamese prototype brief and shape work. Direction seed reference: `seed:99c014f2e7acae02`. The direction is grounded in the user's required traceability and lot handoffs; no visual comp was approved.

## Job and audience

Eight internal roles need to finish assigned work across procurement, production and QC, machine maintenance, warehouse, shipment, finance, and account administration. Success is completing connected workflow steps with clear ownership, state, evidence, and role-limited actions.

## Direction

Assigned direction 6, traceability-led: a serialized lot-mark grammar inspired by the printed batch codes and ink stamps used to identify physical sacks and production lots. The system lends a warm mineral-paper ground, deep evergreen shell, kiln-rust and muted brass for semantic signals, a tabular grotesk for readable data, and compact monospaced lot identifiers. Its signature move is one persistent batch identity marker that appears at every permitted handoff and links supplier purchase, shift, bag sequence, warehouse, and dispatch. Navigation and controls remain standard web application patterns. The first viewport is the role-appropriate shell followed by the active work queue and its states, then the visible batch context. No document imitation, terminal motif, or decorative industrial texture.

Seven grounded directions considered: (1) production ledger, (2) weighbridge receipt, (3) shift timetable, (4) equipment service bulletin, (5) customer waybill, (6) serialized sack/lot marking, (7) warehouse bay mapping. The user requested a code-built, interactive application. The Operate workflow is code-first for app screens, but the local build-phase launcher opened a three-comp gate and refused force-advance because no comp image existed. Work proceeded from the user's brief and the documented shape direction; the gate remains open as a launcher mismatch, not as a claim that a comp was reviewed or approved.

## First viewport and interaction

Desktop: evergreen role rail; slim top bar with page title and profile; a work area with the active handoff queue, list-level search/filter controls, and a compact batch trace summary. Readable table rows use a strong hierarchy and neutral semantic state chips. Mobile collapses navigation behind a labeled menu and turns wide records into horizontally scrollable tables. Record detail stays on one page, with history and permitted next actions adjacent to core values. The lot marker links to related records without implying new process states.

## Scope and boundaries

Full responsive browser prototype in HTML/CSS/vanilla JS. LocalStorage sample persistence only. Eight role-specific accounts, simulated sign-in/OTP, operational areas and connected sample flows per PRODUCT.md and docs/WORKFLOW_SPEC.md. No backend, production security, real company data, external messaging, public registration, draft records, payment fields on weighbridge forms, inventory decrement at proposal time, or unconfirmed workflow transitions.

## States and open decisions

Use exactly the states documented in `docs/WORKFLOW_SPEC.md`. Confirmed actions show success feedback; invalid forms explain recovery; empty filters show an actionable clear-filters option. Data density is moderate on phones and higher on desktop. Details marked **Cần xác nhận** in the workflow specification remain undecided.

## Constraints

Vietnamese UI, VNĐ, familiar Vietnam date/time format, keyboard operation, visible focus, responsive desktop/tablet/phone. Do not display supplier/customer data beyond role scope. Do not add business claims. Prototype sign-in, permissions, OTP, and local persistence are not production security.
