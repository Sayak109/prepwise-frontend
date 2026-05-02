# PrepWise — future features & upgrades

This document captures planned enhancements beyond the current MVP: interview practice, mock tests, and authentication.

## Student experience & monetization

### Subscriptions & premium access

- **Tiered plans** (e.g. free, pro, team) with clear limits on practice questions, mock tests per month, and feature gates.
- **Premium content** — topic packs, company- or role-specific question banks, and timed “exam mode” simulations.
- **Mock tests** — higher limits for subscribers, exclusive test templates, detailed analytics, and downloadable score reports.
- **One-to-one sessions** — booking flow with coaches or mentors (calendar integration, payments, reminders).
- **Certificates / badges** — optional completion credentials for finished tracks or score thresholds.

### Learning & engagement

- **Adaptive difficulty** — adjust question difficulty from recent performance.
- **Spaced repetition** — resurface weak topics automatically.
- **Leaderboards & streaks** — optional, privacy-respecting gamification.
- **Mobile-friendly PWA** — installable app shell for practice on the go.

## Admin & operations

### RBAC (role-based access control)

- **Roles** beyond student: e.g. `ADMIN`, `EDITOR`, `SUPPORT`, `ANALYST`.
- **Scoped permissions** — editors limited to assigned topics or content types; admins full access.
- **Audit log** — who changed what (questions, tests, users) and when.

### Content management (admin module)

- **Unified CMS** — topics, questions (MCQ, short, descriptive), explanations, media, and tags.
- **Test builder** — compose mock tests from the question bank, versioning and publish/draft workflow.
- **Bulk import/export** — CSV/JSON for questions; validation and preview before apply.
- **Localization** — optional multi-language content fields.

### User & billing administration

- **User search & moderation** — suspend, reset sessions, impersonation (strictly audited) for support.
- **Subscription lifecycle** — sync with payment provider, invoices, refunds, and plan changes.

## Platform & quality

- **Notifications** — email or in-app for test reminders, subscription expiry, session bookings.
- **Analytics** — funnel from signup → practice → paid; content performance (hard questions, drop-offs).
- **Performance** — caching, CDN for static assets, optimized API pagination (especially for large topic/test lists).
- **Accessibility & compliance** — WCAG-oriented UI, clearer privacy/consent for analytics and optional marketing.

---
