# Quantitative evaluation contract
Record one event per attempt, including `BLOCKED`. Group by task and revision; rechecks are not independent tasks.
Required: task_id, iteration (positive integer), protocol_version, study_mode `OBSERVATIONAL|CONTROLLED`, requirement_count, discrepancies array, final_gate, evidence_refs.
For each discrepancy record `requirement_id`, category `OMISSION|CONTRADICTION|ADDITION|PROHIBITION|ACCEPTANCE|AMBIGUITY|OTHER`, severity `LOW|MEDIUM|HIGH|CRITICAL`, adjudication `TRUE_POSITIVE|FALSE_POSITIVE|PENDING`.
Optional but encouraged: tokens_input, tokens_output, elapsed_seconds, cost_usd, escaped_defects, model/version and timestamps. Missing quantities use `NOT_AVAILABLE`, **not** zero; all actually measured numeric values must be nonnegative.
Observational detection proves only that discrepancies were flagged, not how many implementation failures were prevented. Collect false alarms, escaped UAT defects and denominator counts. Pre-register matched tasks, fixed model conditions where possible, blinded semantic adjudication, and random assignment to natural-language, ordinary JSON/YAML and full META handoff when measuring relative effectiveness.
Keep project records locally. Transfer only anonymized or aggregate results to master; never client specs or secrets.
