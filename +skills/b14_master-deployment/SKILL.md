---
name: master-deployment
description: Design, develop, document, test, and update portable and licensable AI products following the Master → Deployment architecture. Use when creating or substantially changing a skill, GPT, agent, automation, or other repeatedly deployable AI solution, especially when the user mentions master, customer instance, deployment, license, authorship, handover to a customer, repeated deployment, versioning, updates, or using the solution for multiple customers. Also use when Ladislav Goc develops a new AI product for his own use; treat his own use as a licensed deployment of the author. The skill is the author's private development standard and is not intended to automatically govern customers' work.
---

# Master–Deployment

## Version and administration

The current version of the skill is **1.4.0**.

Use SemVer:

- **PATCH** – a fix without a change in expected behavior.
- **MINOR** – a new backward-compatible capability or rule.
- **MAJOR** – a change of architecture, responsibilities, or compatibility.

**Author, master owner, and expert administrator:** Ladislav Goc  
Copyright © 2026 Ladislav Goc. All rights reserved.

This skill is a master, and its installation at the author's is the author's licensed development deployment. Every further deployment requires the author's separate authorization. Official changes and updates are made by the author. An unmodified customer instance is technically owned by the customer unless the deployment documentation or contract states otherwise; this does not transfer authorship of the general logic.

## Purpose

Create AI solutions as manageable products, not as one-off conversational configurations. Separate the stable, reusable master from each specific deployment. Preserve portability, authorship, licensability, controlled updates, protection of customer data, and the ability to generalize experience into further versions of the master.

Apply this skill together with domain and implementation skills. It does not replace domain correctness, the technical documentation of the platform used, or legal assessment of a license agreement.

## Basic model

Treat every product as licensable from the start:

```text
MASTER
  ├── author's license → author's development deployment
  ├── license → customer A deployment
  └── license → customer B deployment
```

Distinguish:

- **Master** – general logic, workflow, data model, rules, templates, tests, configuration model, and deployment procedure.
- **Deployment** – a specific installation of the master for a license holder.
- **Customer configuration** – data, options, integrations, permissions, and deviations valid only for the given deployment.
- **Customer instance** – the technical realization of a deployment in the customer's environment.
- **Back-generalization** – an anonymized, generally applicable lesson incorporated into a new version of the master.

Do not treat the author's own use as an exception. Record the author simultaneously as a license holder and label the deployment, for example, `author-development`.

## Mandatory workflow

### 1. Determine the product and phase

First determine the purpose and users of the product, its type, phase, expected level of autonomy, human checkpoints, boundaries of the current version, and deferred functions.

Distinguish phases: intent, experiment, prototype, master in development, pilot, production deployment, and update. For an experiment, do not enforce complete production documentation, but record what must be added before the pilot. For a customer pilot or production deployment, apply the full standard.

### 2. Define the master

Include in the master only stable and reusable elements:

- process and decision logic;
- data and state model;
- general rules and safety boundaries;
- input and output schemas;
- universal templates and configuration interfaces;
- test scenarios and expected results;
- installation and update procedure.

Do not store customer documents, personal data, access credentials, identifiable conversations, or a specific customer's configuration in the master.

### 3. Define the deployment

For each deployment, determine at minimum:

- the license holder and the technical owner of the instance;
- authorized users, editors, and administrators;
- the master version and deployment revision;
- customer configuration and approved deviations;
- environment, integrations, and required permissions;
- scope of support, updates, and maintenance;
- testing and acceptance status;
- the procedure for returning to the previous verified version;
- conditions for termination or handover of administration.

### 4. Separate ownership and authorship

Always state separately the author and owner of the master, the license holder, the technical owner of the customer instance, the owner of customer data, the expert administrator, and the persons authorized to make changes.

Do not present technical ownership of an instance as a transfer of authorship of the master. Do not present the skill's general licensing framework as a complete legal assessment of a specific contract.

### 5. Version

Version the master per SemVer. Label a customer deployment so it is clear which master version it is based on, for example `1.2.0-CUSTOMER01.3`.

Record the master version, deployment revision, date and author of the change, reason and scope of the change, compatibility, tests performed, deployment status, and the possibility of rollback. Do not use chat history as the only change record.

### 6. Maintain the source of truth

Do not treat the configuration in the user interface of a GPT, agent, or skill as the only source of the product. Maintain a reproducible master package appropriate to the product type, typically containing:

- main instructions or source files;
- workflow, data model, and configuration schema;
- tests and expected results;
- deployment and acceptance checklist;
- authorship and license information;
- a record of versions and changes.

Do not create documents with no practical role. Adapt names and formats to the platform and the complexity of the product.

### 6a. Distinguish context, memory, and controlled learning

Do not present working with the context of the current session as permanent learning of the product. Distinguish:

- the temporary state of a single session or batch;
- shared deployment configuration and registries;
- an approved customer precedent;
- a general change in a new version of the master.

Do not introduce storage of precedents, adaptive rules, or other behavior carried across users or sessions until the deployment has a shared repository available to authorized users, a designated data owner, permission management, change audit, versioning, and an approval procedure.

Until then, use decisions only within the scope of the current session or batch, and record any future persistence as a deferred function. Do not pretend sharing or permanent memory that the technical environment does not provide.

Once a shared repository is introduced, store a new rule only through a controlled procedure: proposal → expert approval → write to the shared registry → version and audit → use in further cases. Distinguish a client rule, an organization rule, and a generalization suitable for the master; do not carry a customer precedent into another deployment.

### 7. Test in layers

Divide verification into:

1. master test on anonymized or own data;
2. customer configuration test;
3. pilot in a safe or virtual environment;
4. customer acceptance;
5. production deployment;
6. follow-up monitoring and tuning.

Define in advance measurable success conditions, error cases, human approval points, and prohibited actions. Do not label a deployment verified without corresponding tests.

### 8. Manage changes and updates

For each change, determine whether it is a fix for a single deployment only, a new customer deviation, a general improvement suitable for the master, or a security or compatibility change requiring an update of multiple deployments.

First generalize and anonymize the suitable lesson, then incorporate it into a new version of the master and test it. Only afterward deploy it to customer instances. Do not change all deployments automatically without assessing compatibility and authorization.

### 9. Protect data and know-how

Do not carry the following into the master or another deployment without explicit authorization:

- customer data and documents;
- personal or identification data;
- lists of clients, suppliers, or employees;
- access credentials and secret values;
- internal configuration and customer know-how;
- identifiable examples, conversations, or results.

Carry over only generalized rules, anonymized error scenarios, and generally usable improvements. If information cannot be safely generalized, keep it only in the relevant deployment.

### 10. Prepare the handover

Before a customer pilot or production deployment, confirm the completeness of the deployment package, ownership and authorization, the license holder, data separation, version and compatibility, tests and acceptance, human checkpoints, the update and rollback procedure, and responsibility for support.

## Decision rules

- Prefer one configurable master over separate copies of the general logic.
- Allow a customer deviation only when it cannot be safely resolved by configuration or a change to the master.
- Do not enlarge the product with future automation not needed for the current verified step.
- Keep a human at the approval point when the result is professionally, financially, legally, or operationally significant.
- Distinguish a prepared basis, a tested result, a deployed change, and verified operation.
- Do not return a customer fix to the master by mechanical copying.
- Preserve the ability to reproduce a specific deployment from the recorded master version and configuration.
- Do not confuse session context with permanent learning; activate rule persistence only after a controlled shared repository is introduced.

## User interface and internal model

When designing an application, Site, GPT, agent, or other user interface, consistently separate the internal data and state model from texts intended for users:

- keep stable internal codes for automation, audit, diagnostics, export, and integrations;
- do not show an ordinary user variable names, enums, status codes, technical IDs, or serialized data unless they explicitly need them for diagnostics;
- convert every visible state through a central mapping to a human-readable name, a brief explanation, and a concrete next step in the user's language;
- do not compose a user message by directly joining an internal code with ordinary text;
- make technical values available only in a clearly labeled audit or diagnostic mode;
- distinguish a data error, a professional check, a non-blocking warning, an operation in progress, and a completed state also visually and procedurally;
- display a bulk status once per batch unless it requires a different action for individual items;
- include in acceptance tests a check that an ordinary screen contains no untranslated internal codes and that every message gives the user a feasible next step.

Never remove an internal code merely because of presentation. Fix the presentation layer; preserve the audit and integration meaning.

### User intent and state transitions

Design controls around the user's goal, not around the system's internal steps:

- for the ordinary successful path, offer one main action that atomically saves changes, accepts unchanged suggestions, performs validation, approves the item, and derives its next state;
- do not expose several buttons for technical intermediate states unless they represent separate decisions significant to the user;
- let the system drive status and derived values, such as inclusion in an export, the export route, or the workflow state, and do not normally allow them to be overwritten manually;
- do not change an item's state merely by opening, displaying, or browsing it; make the change only on an explicit user action;
- offer separately only genuine alternatives, such as saving a draft, discarding an item, canceling it, or postponing the decision;
- on failure, do not perform a partial state transition, leave the form open, and state in human terms exactly what must be completed;
- during a longer operation, show progress or at least an unambiguous working state, block duplicate launches, and ensure idempotent processing of a repeated request;
- include in acceptance tests an ordinary successful scenario completed with a single main action without re-entering or re-confirming the same information.

The text of the main action should describe its user outcome, for example `Approve and include in export`, not an internal operation such as `Set status APPROVED`.

## Mandatory output when designing or changing a product

Depending on the phase, briefly capture:

1. **Product and purpose** – what is being developed, for whom, and with what level of autonomy.
2. **Phase** – experiment, prototype, pilot, production, or update.
3. **Master** – general logic and stable parts.
4. **Deployment** – license holder, instance, configuration, and deviations.
5. **Ownership and administration** – author, owners, administrator, and permissions.
6. **Version** – master and deployment revision.
7. **Source of truth** – where the reproducible materials are.
8. **Testing** – status, acceptance criteria, and human checkpoints.
9. **Data protection** – what stays only with the customer.
10. **Changes for the master** – what can be generalized after anonymization.
11. **Next step** – the nearest concrete decision or implementation.

Do not always create an extensive report. Keep the output proportionate to the phase and risk. If project documentation already exists, update it instead of creating a parallel source.

## Self-check of this skill

When changing this skill, apply its own rules:

- keep Ladislav Goc as author, master owner, and expert administrator;
- version the change per SemVer;
- keep the master separate from any customer deployments;
- do not carry customer configurations or data into the master;
- before release, validate the change and verify it on realistic development scenarios;
- record which master version is deployed in each deployment.


## 1.4.0 – Proportionate experimental development and pilot

In the author's own development instance, distinguish between `DEVELOPMENT`, `PILOT_WITH_REAL_DATA`, and `PRODUCTION`. For a short development cycle, do not require the full customer deployment package, a repeated license/checklist, or a revision of the whole master with every bugfix. A Git commit/version, a clear owner and target, a targeted test, and UAT are enough. A new generally usable lesson can be written up later during a controlled update of the master; it is not a gate for fixing the product. Identified consumable test data in a demonstrably development environment may be disposed of on the basis of a pre-approved scope without additional backups; preserve the separation of real client data, tenants, and legal retention obligations. In an active DEVELOPMENT mode, this clarification takes precedence over the general documentation obligation above, but not over data protection or copyright.
