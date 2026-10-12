-- =============================================================
-- Model Performance Validation — BigQuery DDLs
-- =============================================================
-- Tables for storing computed performance metrics,
-- drift results, and baseline references.
-- =============================================================

-- Model metadata reference table
CREATE TABLE IF NOT EXISTS `project.dataset.ds_models_metadata` (
  model_id        STRING    NOT NULL,
  model_name      STRING,
  target_type     STRING    NOT NULL,  -- binary|multinomial|regression|recommendation|custom_binary
  level           STRING,              -- wireless|wireline|value
  line_of_business STRING,
  model_tier      STRING    DEFAULT 'standard',  -- critical|standard
  base_date       DATE,
  status_ind      STRING    DEFAULT 'c',  -- c=current, o=old
  model_perf_validation_frequency STRING DEFAULT 'monthly',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY DATE_TRUNC(created_at, MONTH)
CLUSTER BY model_id, target_type
OPTIONS (description = 'Master metadata table for all monitored models');


-- Performance metrics results table
CREATE TABLE IF NOT EXISTS `project.dataset.ds_models_perf_metrics` (
  model_id        STRING    NOT NULL,
  rpt_dt          DATE      NOT NULL,
  target_type     STRING    NOT NULL,
  au_roc          FLOAT64,
  au_pr           FLOAT64,
  lift_at_10      FLOAT64,
  precision_val   FLOAT64,
  recall_val      FLOAT64,
  rmse            FLOAT64,
  mae             FLOAT64,
  mape            FLOAT64,
  top_k_accuracy  FLOAT64,
  drift_pct       FLOAT64,
  drift_flag      STRING,   -- Healthy|Drifted|Watch|No Baseline
  drift_comments  STRING,
  base_date       DATE,
  run_timestamp   TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY rpt_dt
CLUSTER BY model_id, target_type
OPTIONS (description = 'Computed performance metrics per model per reporting date');


-- Decile-level performance breakdown
CREATE TABLE IF NOT EXISTS `project.dataset.ds_models_perf_decile` (
  model_id        STRING    NOT NULL,
  rpt_dt          DATE      NOT NULL,
  decile          INT64     NOT NULL,  -- 1-10
  population_pct  FLOAT64,
  cumulative_pct  FLOAT64,
  event_rate      FLOAT64,
  cumulative_lift FLOAT64,
  ks_statistic    FLOAT64,
  run_timestamp   TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY rpt_dt
CLUSTER BY model_id
OPTIONS (description = 'Decile-level metrics for rank ordering validation');


-- Performance drift alerts log
CREATE TABLE IF NOT EXISTS `project.dataset.ds_models_perf_alerts` (
  alert_id        STRING    NOT NULL,
  model_id        STRING    NOT NULL,
  rpt_dt          DATE      NOT NULL,
  alert_type      STRING,   -- drift|threshold|anomaly
  severity        STRING,   -- critical|warning|info
  metric_name     STRING,
  current_value   FLOAT64,
  baseline_value  FLOAT64,
  drift_pct       FLOAT64,
  threshold_used  FLOAT64,
  jira_ticket     STRING,
  resolved        BOOL      DEFAULT FALSE,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY rpt_dt
CLUSTER BY model_id, severity
OPTIONS (description = 'Performance drift alerts and incident tracking');
