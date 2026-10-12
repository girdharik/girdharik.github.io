"""
Model Performance Validation Pipeline
======================================
PySpark pipeline for computing performance metrics
across Binary, Multinomial, Regression, Recommendation,
and Custom Binary (JET) model types.
"""

from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.window import Window
from sklearn.metrics import roc_auc_score, average_precision_score
import logging

logger = logging.getLogger(__name__)


class PerformanceValidator:
    """Computes and validates model performance metrics."""

    DRIFT_THRESHOLDS = {
        "critical": -0.08,  # -8% for Tier 1 models
        "standard": -0.10,  # -10% for Tier 2/3 models
    }

    SUPPORTED_METRICS = {
        "binary": ["au_roc", "au_pr", "lift", "precision", "recall"],
        "multinomial": ["top_k_accuracy", "per_class_precision"],
        "regression": ["rmse", "mae", "mape"],
        "recommendation": ["precision_at_k", "ndcg", "mrr"],
        "custom_binary": ["au_roc", "au_pr", "lift"],
    }

    def __init__(self, spark: SparkSession, config: dict):
        self.spark = spark
        self.config = config
        self.bq_project = config["gcp_project"]
        self.dataset = config["bq_dataset"]

    def run(self, model_id: str, rpt_dt: str):
        """Execute the full validation pipeline for a model."""
        logger.info(f"Starting validation for model={model_id}, rpt_dt={rpt_dt}")

        # Step 1: Fetch model metadata
        metadata = self._get_metadata(model_id)
        target_type = metadata["target_type"]
        tier = metadata["model_tier"]

        # Step 2: Load scores and labels
        scores_df = self._load_scores(model_id, rpt_dt)
        labels_df = self._load_labels(model_id, rpt_dt)
        joined_df = scores_df.join(labels_df, on="entity_id", how="inner")

        # Step 3: Compute metrics based on target_type
        metrics = self._compute_metrics(joined_df, target_type)

        # Step 4: Load baseline metrics for drift comparison
        baseline = self._load_baseline(model_id)

        # Step 5: Detect drift
        drift_results = self._detect_drift(metrics, baseline, tier)

        # Step 6: Write results to BigQuery
        self._write_results(model_id, rpt_dt, metrics, drift_results)

        logger.info(f"Validation complete for model={model_id}: {drift_results['status']}")
        return drift_results

    def _compute_metrics(self, df, target_type: str):
        """Compute target-type-specific metrics."""
        metrics = {}

        if target_type in ("binary", "custom_binary"):
            scores = df.select("score").rdd.flatMap(lambda x: x).collect()
            labels = df.select("label").rdd.flatMap(lambda x: x).collect()

            metrics["au_roc"] = round(roc_auc_score(labels, scores), 4)
            metrics["au_pr"] = round(average_precision_score(labels, scores), 4)
            metrics["lift"] = self._compute_lift(df)

            # Decile-level analysis
            metrics["decile_metrics"] = self._compute_decile_metrics(df)

        elif target_type == "regression":
            metrics["rmse"] = self._compute_rmse(df)
            metrics["mae"] = self._compute_mae(df)
            metrics["mape"] = self._compute_mape(df)

        elif target_type == "multinomial":
            metrics["top_k_accuracy"] = self._compute_top_k(df, k=3)

        return metrics

    def _detect_drift(self, current, baseline, tier):
        """Compare current vs baseline with tier-based thresholds."""
        threshold = self.DRIFT_THRESHOLDS.get(tier, self.DRIFT_THRESHOLDS["standard"])
        primary_metric = list(current.keys())[0]

        if primary_metric not in baseline:
            return {"status": "No Baseline", "drift_pct": None}

        drift_pct = (current[primary_metric] - baseline[primary_metric]) / baseline[primary_metric]
        status = "Drifted" if drift_pct < threshold else "Healthy"

        return {
            "status": status,
            "drift_pct": round(drift_pct * 100, 2),
            "threshold": threshold * 100,
            "metric": primary_metric,
        }

    def _compute_lift(self, df):
        """Compute lift at top decile."""
        w = Window.orderBy(F.desc("score"))
        ranked = df.withColumn("rank", F.percent_rank().over(w))
        top_decile = ranked.filter(F.col("rank") <= 0.1)
        overall_rate = df.agg(F.mean("label")).first()[0]
        decile_rate = top_decile.agg(F.mean("label")).first()[0]
        return round(decile_rate / overall_rate, 2) if overall_rate > 0 else 0.0

    def _compute_rmse(self, df):
        return round(df.select(F.sqrt(F.mean(F.pow(F.col("label") - F.col("score"), 2)))).first()[0], 4)

    def _compute_mae(self, df):
        return round(df.select(F.mean(F.abs(F.col("label") - F.col("score")))).first()[0], 4)

    def _compute_mape(self, df):
        safe = df.filter(F.col("label") != 0)
        return round(safe.select(F.mean(F.abs((F.col("label") - F.col("score")) / F.col("label")))).first()[0] * 100, 2)


if __name__ == "__main__":
    spark = SparkSession.builder.appName("PerfValidation").getOrCreate()
    config = {"gcp_project": "company-project-...", "bq_dataset": "ds_models_perf"}
    validator = PerformanceValidator(spark, config)
    result = validator.run(model_id="churn_v3", rpt_dt="2025-05-01")
    print(result)
