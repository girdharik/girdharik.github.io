/**
 * ============================================================
 *  SITE DATA — Single source of truth
 * ============================================================
 *  Edit ONLY this file to update content.
 *
 *  PAGES  – defined by the `pages` array; router picks them up
 *           automatically. Add a page → nav link + route appear.
 *
 *  PROJECTS – each item in `projects` gets a card on /projects
 *           AND its own deep-dive page at /projects/<slug>.
 *           Add a `detail` object with sections array to build
 *           an interactive project showcase page.
 *
 *  Section types available inside project detail:
 *    "text"        – paragraphs / rich description
 *    "metrics"     – counter cards
 *    "architecture"– diagram image + caption
 *    "features"    – bullet feature list with icons
 *    "tech"        – tech stack badges
 *    "gallery"     – image carousel / grid
 *    "code"        – code snippet block
 *    "timeline"    – step-by-step process
 *    "chart"       – Chart.js graph (bar, line, doughnut, radar)
 *    "table"       – interactive sortable/filterable data table
 * ============================================================
 */

const SITE = {
  meta:  {
    name:  "Girdhari Kumar",
    shortName:  "GK",
    title:  "Senior AI Engineer | Generative AI, LLMs & Multi-Agent Systems",
    tagline:  "Generative AI · LangGraph · RAG · Vertex AI · FastAPI · MLOps · GCP",
    email:  "gknandan117@gmail.com",
    phone:  "",
    location:  "Chennai, India",
    linkedin:  "https://linkedin.com/in/girdhari-kumar",
    github:  "https://github.com/girdharik",
    photo:  ""
  },
  pages:  [
    {
      id:  "home",
      label:  "Home",
      icon:  "home"
    },
    {
      id:  "experience",
      label:  "Experience",
      icon:  "briefcase"
    },
    {
      id:  "projects",
      label:  "Projects",
      icon:  "rocket"
    },
    {
      id:  "skills",
      label:  "Skills",
      icon:  "tools"
    },
    {
      id:  "about",
      label:  "About",
      icon:  "user"
    },
    {
      id:  "documents",
      label:  "Documents",
      icon:  "fileText"
    }
  ],
  home:  {
    hero:  {
      greeting:  "Hi, I'm",
      support:  "I ship Generative AI systems that work in production — LLM copilots, multi-agent workflows, and Retrieval-Augmented Generation (RAG) on Google Cloud — plus the ML monitoring and data pipelines that keep models reliable at scale.",
      pipeline:  [
        {
          label:  "User Question",
          sub:  "Natural language"
        },
        {
          label:  "LangGraph Agent",
          sub:  "Plan · tool calling · reason"
        },
        {
          label:  "Safe Tools + RAG",
          sub:  "BigQuery · vector search"
        },
        {
          label:  "Live Answer",
          sub:  "Streaming · metrics · root cause"
        }
      ]
    },
    highlights:  [
      {
        value:  "300+",
        label:  "Models in Production"
      },
      {
        value:  "7",
        label:  "Monitoring Frameworks"
      },
      {
        value:  "~4K",
        label:  "Tokens Saved / Step"
      },
      {
        value:  "60%",
        label:  "Cloud Cost Reduced"
      },
      {
        value:  "100%",
        label:  "SLA Met"
      },
      {
        value:  "40%",
        label:  "Faster Incident Response"
      }
    ]
  },
  experience:  [
    {
      company:  "Verizon",
      logo:  "https://cdn.simpleicons.org/verizon/CD040B",
      location:  "Chennai, India",
      roles:  [
        {
          title:  "Engineer-II AI/ML Engineering",
          start:  "2024-02-21",
          end:  "",
          bullets:  [
            "Built production Generative AI / LLM systems with LangGraph, Google Vertex AI (Gemini), FastAPI, and Streamlit — including a Model Health Copilot that streams live reasoning and answers questions on model performance, drift, explainability, and root cause analysis.",
            "Implemented safe LLM tool calling into BigQuery with multi-layer execution controls (read-only, write blocking, project lock, dry-run cost caps, timeouts), cutting ~2.5K–4K tokens per agent step without losing answer quality.",
            "Designed multi-agent / agentic workflows for Airflow / Cloud Composer failures — supervisor + specialist agents with Hybrid Retrieval-Augmented Generation (RAG) on Elasticsearch (keyword BM25 + embeddings / vector search) — cutting manual incident response ~40% across 100+ weekly alerts.",
            "Automated ML deployment with an LLM-driven pipeline: repo validation, SQL parameterization, data quality checks, Airflow DAG generation, and GitLab / Jenkins CI/CD — plus a Python CLI with 40+ tools for AI coding assistants.",
            "Owned MLOps / model monitoring for 300+ production models on GCP (BigQuery, Dataproc, PySpark): performance metrics, PSI score drift, feature drift, SHAP explainability, confusion matrix, fairness evaluation, and champion-vs-challenger comparison.",
            "Built automated root cause analysis that links performance drop, score shift, feature importance change, feature drift, and data quality into clear severity-ranked diagnostics for data science and business teams.",
            "Partnered with Legal on Responsible AI / fairness evaluation across demographic groups; onboarded models with historical metrics and cost labels for cloud spend attribution.",
            "Ran Apache Airflow / Cloud Composer at scale — TaskGroups, auto-healing, Black Friday peak support for batch and real-time serving — meeting 100% SLA with zero missed deliveries.",
            "Built ETL/ELT-style PySpark feature and scoring pipelines on Dataproc, BigQuery data quality checks, environment-aware dataset routing, and Cloud Functions deploy automation via GitLab + Jenkins.",
            "Reduced cloud cost ~60% through Dataproc right-sizing, cost tagging, and BigQuery dry-run blocks on queries scanning more than 200 GB."
          ]
        }
      ]
    },
    {
      company:  "Cognizant",
      logo:  "https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg",
      location:  "Hyderabad, India",
      roles:  [
        {
          title:  "Programmer Analyst — GCP Data & ML Engineering",
          start:  "2022-02-03",
          end:  "2024-02-19",
          bullets:  [
            "Delivered hands-on Google Cloud Platform solutions for enterprise customers across BigQuery, Dataproc, Cloud Composer (Apache Airflow), Dataflow, Pub/Sub, Dataplex, and Cloud Storage — fixing production failures and improving pipeline reliability.",
            "Tuned BigQuery data warehousing for performance and cost: SQL optimization, job/slot planning, IAM and dataset design — unblocking analytics and ETL/ELT workloads with customer data engineering teams.",
            "Stabilized Dataproc Spark clusters and Cloud Composer DAGs — sizing, job failures, scheduling, and environment health — for batch processing and orchestration at scale.",
            "Ran deep root cause analysis with logs and metrics; reproduced platform defects with Google engineering and shipped practical workarounds for customers.",
            "Coached customer engineers on GCP data practices — BigQuery query/cost patterns, Dataproc right-sizing, and Airflow / Composer DAG design.",
            "Worked across Vertex AI training jobs, notebooks, model endpoints, quotas, and IAM — connecting data pipelines to ML training and serving on GCP."
          ]
        }
      ]
    }
  ],
  projects:  [
    {
      slug:  "model-health-copilot",
      title:  "Model Health Copilot",
      subtitle:  "LLM copilot for model monitoring — streaming answers with safe BigQuery tool calling",
      icon:  "bot",
      tags:  [
        "LangGraph",
        "LLMs",
        "Vertex AI",
        "FastAPI",
        "RAG",
        "BigQuery"
      ],
      description:  "Production Generative AI copilot for ML model health. Streams live LLM reasoning over FastAPI, answers natural-language questions on performance and drift, and calls BigQuery tools under strict safety controls.",
      detail:  {
        sections:  [
          {
            type:  "text",
            title:  "Overview",
            content:  [
              "A production Copilot that lets ML engineers and data scientists ask about model health in natural language — performance, drift, SHAP explainability, and root cause — while the agent safely runs analytical queries.",
              "Built with LangGraph + Gemini on Vertex AI, FastAPI for the API layer, streaming responses for live reasoning, and Streamlit for the conversational UI."
            ]
          },
          {
            type:  "metrics",
            title:  "Impact",
            items:  [
              {
                value:  "300+",
                label:  "Models Queryable"
              },
              {
                value:  "~4K",
                label:  "Tokens Saved / Step"
              },
              {
                value:  "6",
                label:  "BQ Guardrail Layers"
              },
              {
                value:  "~2.5K",
                label:  "Fixed Prompt Overhead"
              }
            ]
          },
          {
            type:  "features",
            title:  "Key Capabilities",
            items:  [
              "Streams live LLM reasoning to the UI as the answer is built",
              "Strips hidden reasoning from chat history — saves ~2,500–4,000 tokens per agent step",
              "Loads focused skills on demand so prompts stay lean",
              "Six BigQuery safety layers: read-only, write blocking, project lock, allowlist, dry-run cost caps, timeouts",
              "Formats answers for data science vs business audiences"
            ]
          },
          {
            type:  "tech",
            title:  "Tech Stack",
            items:  [
              {
                name:  "LangGraph",
                icon:  "https://cdn.simpleicons.org/langgraph"
              },
              {
                name:  "Vertex AI / Gemini",
                icon:  "https://cdn.simpleicons.org/googlecloud"
              },
              {
                name:  "FastAPI",
                icon:  "https://cdn.simpleicons.org/fastapi"
              },
              {
                name:  "Streamlit",
                icon:  "https://cdn.simpleicons.org/streamlit"
              },
              {
                name:  "BigQuery",
                icon:  "https://cdn.simpleicons.org/googlebigquery"
              },
              {
                name:  "Python",
                icon:  "https://cdn.simpleicons.org/python"
              }
            ]
          },
          {
            type:  "timeline",
            title:  "How It Works",
            steps:  [
              {
                title:  "Intent",
                desc:  "User asks a model-health question in natural language"
              },
              {
                title:  "Plan",
                desc:  "LangGraph agent selects skills and tools for the query"
              },
              {
                title:  "Guard",
                desc:  "BigQuery tool calls pass through multi-layer safety checks"
              },
              {
                title:  "Stream",
                desc:  "Reasoning traces and final answer stream to the UI via SSE"
              }
            ]
          },
          {
            type:  "text",
            title:  "Architecture",
            content:  [
              "A LangGraph agent loads the right skills for each question, then FastAPI streams live reasoning to a Streamlit UI. Hidden reasoning is stripped from history so each step stays cheap on tokens.",
              "BigQuery tool calls pass through layered safety checks (read-only, write blocking, project lock, dry-run cost caps, timeouts) so the Copilot can query model health safely in production."
            ]
          },
          {
            type:  "chart",
            title:  "Agent Skill Coverage",
            chartType:  "radar",
            csvFile:  "data/agent-skill-coverage.csv",
            colors:  [
              "#2EE6A8",
              "#5B8CFF"
            ],
            options:  {
              scales:  {
                r:  {
                  min:  50,
                  max:  100,
                  grid:  {
                    color:  "rgba(255,255,255,0.08)"
                  },
                  angleLines:  {
                    color:  "rgba(255,255,255,0.08)"
                  },
                  pointLabels:  {
                    color:  "#8B9BB0"
                  },
                  ticks:  {
                    color:  "#8B9BB0",
                    backdropColor:  "transparent"
                  }
                }
              }
            }
          }
        ]
      }
    },
    {
      slug:  "pipeline-incident-agents",
      title:  "Pipeline Incident Response Agents",
      subtitle:  "Multi-agent LLM system that triages Airflow failures with Hybrid RAG",
      icon:  "microscope",
      tags:  [
        "Multi-Agent",
        "LangGraph",
        "RAG",
        "Embeddings",
        "Airflow"
      ],
      description:  "Multi-agent Generative AI system that detects, classifies, and resolves Airflow / Cloud Composer failures. Hybrid Retrieval-Augmented Generation (RAG) on Elasticsearch grounds answers in past incident resolutions.",
      detail:  {
        sections:  [
          {
            type:  "text",
            title:  "Overview",
            content:  [
              "A multi-agent incident response system for ML pipeline failures. A Supervisor orchestrates Log Classifier, JIRA Manager, and Rerun agents to automate L1/L2 support workflows.",
              "Context for the LLM comes from Hybrid RAG on Elasticsearch — keyword search (BM25) plus embeddings / vector similarity over past incident resolutions."
            ]
          },
          {
            type:  "metrics",
            title:  "Impact",
            items:  [
              {
                value:  "40%",
                label:  "Faster Incident Response"
              },
              {
                value:  "4",
                label:  "Specialist Agents"
              },
              {
                value:  "Hybrid",
                label:  "BM25 + Vector RAG"
              },
              {
                value:  "0",
                label:  "Manual L1 Triage Goal"
              }
            ]
          },
          {
            type:  "features",
            title:  "Key Capabilities",
            items:  [
              "LangGraph multi-agent orchestration with Gemini — plan, call tools, act",
              "Hybrid retrieval: keyword search (BM25) + vector search for past fixes",
              "CPU-gated Composer reruns so peaks do not overload the cluster",
              "Creates Jira tickets with classified root causes automatically",
              "Retrieves past incident resolutions from a searchable knowledge base"
            ]
          },
          {
            type:  "tech",
            title:  "Tech Stack",
            items:  [
              {
                name:  "LangGraph",
                icon:  "https://cdn.simpleicons.org/langgraph"
              },
              {
                name:  "Elasticsearch",
                icon:  "https://cdn.simpleicons.org/elasticsearch"
              },
              {
                name:  "Airflow",
                icon:  "https://cdn.simpleicons.org/apacheairflow"
              },
              {
                name:  "Gemini",
                icon:  "https://cdn.simpleicons.org/googlecloud"
              },
              {
                name:  "Python",
                icon:  "https://cdn.simpleicons.org/python"
              }
            ]
          },
          {
            type:  "text",
            title:  "Architecture",
            content:  [
              "A Supervisor agent orchestrates specialist Log Classifier, Jira, and Rerun agents on Airflow DAG failures. Hybrid RAG on Elasticsearch (keyword + vector search) grounds answers in past incident fixes.",
              "Composer reruns are CPU-gated during peak windows, and classified root causes flow into automated Jira tickets so L1/L2 triage needs less manual work."
            ]
          }
        ]
      }
    },
    {
      slug:  "ml-deploy-copilot",
      title:  "ML Deploy Copilot",
      subtitle:  "LLM-driven CI/CD — validate, generate Airflow DAGs, deploy with GitLab & Jenkins",
      icon:  "rocket",
      tags:  [
        "LangChain",
        "LLMs",
        "CI/CD",
        "Airflow",
        "MLOps"
      ],
      description:  "LLM-powered ML deployment pipeline: validates repositories, parameterizes SQL, runs data quality checks, generates Airflow DAGs, and deploys through GitLab / Jenkins with BigQuery dry-run cost checks.",
      detail:  {
        sections:  [
          {
            type:  "text",
            title:  "Overview",
            content:  [
              "Automates the ML deployment lifecycle so data scientists invoke a skill from their IDE instead of manually navigating CI/CD. A 7-stage LLM pipeline clones, validates, parameterizes, sanity-checks, builds DAGs, validates, and deploys.",
              "Also ships as a Python CLI skill provider for AI coding assistants — exposing a deterministic tool registry for deployment automation."
            ]
          },
          {
            type:  "metrics",
            title:  "Impact",
            items:  [
              {
                value:  "7",
                label:  "Pipeline Stages"
              },
              {
                value:  "40+",
                label:  "Deterministic Tools"
              },
              {
                value:  "AST",
                label:  "Repo Validation"
              },
              {
                value:  "Dry-Run",
                label:  "BQ Cost Check"
              }
            ]
          },
          {
            type:  "features",
            title:  "Key Capabilities",
            items:  [
              "Validates ML repos before deploy (structure and schema checks)",
              "Parameterizes SQL configs per environment with Jinja",
              "Generates Airflow DAGs from templates",
              "BigQuery dry-run cost checks that block oversized scans",
              "GitLab / Jenkins deploy with secure identity and audit logging"
            ]
          },
          {
            type:  "tech",
            title:  "Tech Stack",
            items:  [
              {
                name:  "LangChain",
                icon:  "https://cdn.simpleicons.org/langchain"
              },
              {
                name:  "Python",
                icon:  "https://cdn.simpleicons.org/python"
              },
              {
                name:  "Airflow",
                icon:  "https://cdn.simpleicons.org/apacheairflow"
              },
              {
                name:  "Jenkins",
                icon:  "https://cdn.simpleicons.org/jenkins"
              },
              {
                name:  "GitLab",
                icon:  "https://cdn.simpleicons.org/gitlab"
              },
              {
                name:  "BigQuery",
                icon:  "https://cdn.simpleicons.org/googlebigquery"
              }
            ]
          },
          {
            type:  "timeline",
            title:  "Pipeline Stages",
            steps:  [
              {
                title:  "Clone",
                desc:  "Pull ML repository via CI credentials"
              },
              {
                title:  "Validate",
                desc:  "AST parse + schema checks on artifacts"
              },
              {
                title:  "Parameterize",
                desc:  "Jinja-render SQL and env configs"
              },
              {
                title:  "Sanity SQL",
                desc:  "Generate and dry-run data quality checks"
              },
              {
                title:  "DAG Build",
                desc:  "Synthesize Airflow DAG from templates"
              },
              {
                title:  "Validate DAG",
                desc:  "Parse and smoke-test generated DAG"
              },
              {
                title:  "Deploy",
                desc:  "Push via GitLab/Jenkins and write audit ledger"
              }
            ]
          },
          {
            type:  "text",
            title:  "Architecture",
            content:  [
              "An LLM-driven pipeline clones the ML repo, validates artifacts via AST, Jinja-parameterizes SQL, generates sanity checks with BigQuery dry-runs, synthesizes Airflow DAGs, then deploys through GitLab/Jenkins with an audit ledger.",
              "A companion CLI skill provider exposes the same deterministic tools to AI coding assistants so deploy steps can run from the IDE without hand-navigating CI/CD."
            ]
          }
        ]
      }
    },
    {
      slug:  "perf-validation",
      title:  "Model Performance Validation Framework",
      subtitle:  "Automated performance monitoring for 300+ production models",
      icon:  "chartLine",
      tags:  [
        "MLOps",
        "Model Monitoring",
        "PySpark",
        "BigQuery",
        "Airflow"
      ],
      description:  "End-to-end automated performance monitoring for Binary, Multinomial, Regression, Recommendation and custom_binary models with tier-based drift thresholds.",
      detail:  {
        banner:  "",
        sections:  [
          {
            type:  "text",
            title:  "Overview",
            content:  [
              "The cornerstone of the ML monitoring platform at Verizon — automated, scheduled computation of key performance metrics for every production model across wireless, wireline, and value segment lines.",
              "Supports five model types — Binary, Multinomial, Regression, Recommendation, and custom_binary — each with tailored metric suites and drift detection logic."
            ]
          },
          {
            type:  "metrics",
            title:  "Impact",
            items:  [
              {
                value:  "300+",
                label:  "Models Monitored"
              },
              {
                value:  "5",
                label:  "Model Types Supported"
              },
              {
                value:  "15+",
                label:  "Teams Served"
              },
              {
                value:  "0",
                label:  "Missed SLAs"
              }
            ]
          },
          {
            type:  "features",
            title:  "Key Capabilities",
            items:  [
              "AU-ROC, AU-PR, Lift, Precision, Recall for binary models",
              "RMSE, MAE, MAPE for regression with ±30% threshold alerting",
              "Decile-level monotonic rank ordering validation",
              "Tier-based drift thresholds: -8% critical, -10% standard",
              "Configurable validation frequencies (weekly, monthly, quarterly)"
            ]
          },
          {
            type:  "tech",
            title:  "Tech Stack",
            items:  [
              {
                name:  "Python",
                icon:  "https://cdn.simpleicons.org/python"
              },
              {
                name:  "PySpark",
                icon:  "https://cdn.simpleicons.org/apachespark/E25A1C"
              },
              {
                name:  "BigQuery",
                icon:  "https://cdn.simpleicons.org/googlebigquery"
              },
              {
                name:  "Airflow",
                icon:  "https://cdn.simpleicons.org/apacheairflow"
              },
              {
                name:  "Dataproc",
                icon:  "https://cdn.simpleicons.org/googledataproc"
              }
            ]
          },
          {
            type:  "timeline",
            title:  "How It Works",
            steps:  [
              {
                title:  "Model Onboarding",
                desc:  "Metadata registered with target_type, frequency, and tier"
              },
              {
                title:  "Data Ingestion",
                desc:  "Scores and labels pulled from BigQuery on schedule"
              },
              {
                title:  "Metric Computation",
                desc:  "Type-specific metrics via PySpark on Dataproc"
              },
              {
                title:  "Drift Detection",
                desc:  "Current vs baseline with tier-based thresholds"
              },
              {
                title:  "Alert & Report",
                desc:  "Portal alerts + auto-Jira for critical models"
              }
            ]
          },
          {
            type:  "chart",
            title:  "Performance Trends (Sample)",
            chartType:  "line",
            csvFile:  "data/perf-trends.csv"
          },
          {
            type:  "chart",
            title:  "Models by Type",
            chartType:  "doughnut",
            csvFile:  "data/models-by-type.csv",
            colors:  [
              "#2EE6A8",
              "#5B8CFF",
              "#34d399",
              "#f59e0b",
              "#94a3b8"
            ]
          },
          {
            type:  "table",
            title:  "Model Performance Summary",
            filterable:  true,
            csvFile:  "data/model-performance-summary.csv"
          },
          {
            type:  "files",
            title:  "Source Files & Notebooks",
            items:  [
              {
                name:  "perf_validation_pipeline.py",
                path:  "files/perf_validation_pipeline.py",
                description:  "Main PySpark pipeline for metric computation"
              },
              {
                name:  "model_metrics_analysis.ipynb",
                path:  "files/model_metrics_analysis.ipynb",
                description:  "EDA notebook — metric trends & anomalies"
              },
              {
                name:  "perf_validation_ddl.sql",
                path:  "files/perf_validation_ddl.sql",
                description:  "BigQuery table DDLs for performance tables"
              },
              {
                name:  "perf-trends.csv",
                path:  "data/perf-trends.csv",
                description:  "Monthly AU-ROC/AU-PR trend data"
              }
            ]
          }
        ]
      }
    },
    {
      slug:  "score-drift",
      title:  "Score Stability & Drift Monitoring",
      subtitle:  "PSI-based score distribution tracking with bin stability analysis",
      icon:  "chartDown",
      tags:  [
        "Drift Detection",
        "PSI",
        "MLOps",
        "BigQuery"
      ],
      description:  "PSI-based score distribution monitoring with smoothed bin construction, bin stability tracking, and two-pass base-date logic for custom_binary models.",
      detail:  {
        sections:  [
          {
            type:  "text",
            title:  "Overview",
            content:  [
              "Monitors how model score distributions shift over time using Population Stability Index (PSI). Early detection of score drift prevents silent model degradation.",
              "Supports binary, multinomial, regression, and custom_binary models with type-specific logic."
            ]
          },
          {
            type:  "features",
            title:  "Key Capabilities",
            items:  [
              "Smoothed 10-bin PSI with per-bin and total PSI",
              "Bin stability at decile and centile granularity",
              "Cohen's d for regression score drift",
              "Two-pass base-date logic for custom_binary models",
              "Sentinel value handling and automated base-date lifecycle"
            ]
          },
          {
            type:  "tech",
            title:  "Tech Stack",
            items:  [
              {
                name:  "Python",
                icon:  "https://cdn.simpleicons.org/python"
              },
              {
                name:  "BigQuery",
                icon:  "https://cdn.simpleicons.org/googlebigquery"
              },
              {
                name:  "PySpark",
                icon:  "https://cdn.simpleicons.org/apachespark/E25A1C"
              }
            ]
          },
          {
            type:  "chart",
            title:  "PSI Trend Over Time",
            chartType:  "bar",
            csvFile:  "data/psi-trend.csv",
            seriesConfig:  [
              {
                backgroundColor:  "rgba(46,230,168,0.7)",
                borderRadius:  4
              },
              {
                type:  "line",
                borderColor:  "#ef4444",
                backgroundColor:  "transparent",
                borderDash:  [
                  6,
                  3
                ],
                pointRadius:  0,
                fill:  false
              }
            ]
          },
          {
            type:  "chart",
            title:  "Score Distribution — Base vs Current",
            chartType:  "bar",
            csvFile:  "data/score-distribution.csv",
            colors:  [
              "rgba(46,230,168,0.5)",
              "rgba(91,140,255,0.5)"
            ]
          },
          {
            type:  "table",
            title:  "Bin-Level PSI Breakdown",
            filterable:  true,
            csvFile:  "data/bin-level-psi.csv"
          }
        ]
      }
    },
    {
      slug:  "feature-drift",
      title:  "Feature Drift & Data Quality",
      subtitle:  "Auto-categorization of 1000+ features with type-specific drift detection",
      icon:  "search",
      tags:  [
        "Feature Drift",
        "Data Quality",
        "PySpark",
        "BigQuery"
      ],
      description:  "Auto-categorization engine for 1000+ features across 5 types with type-specific drift detection and SHAP-importance cross-referencing.",
      detail:  {
        sections:  [
          {
            type:  "text",
            title:  "Overview",
            content:  [
              "Monitors input feature distributions to detect upstream data quality issues and concept drift before they show up as performance degradation.",
              "Automatically categorizes features into continuous, categorical, sequence, misc, and identifier types."
            ]
          },
          {
            type:  "features",
            title:  "Key Capabilities",
            items:  [
              "Auto-categorization of 1000+ features into 5 types",
              "Cohen's d for continuous, PSI for categorical, null-rate for sequence",
              "Alert cross-referencing with SHAP importance — model-relevant drift only",
              "Descriptive stats: mean, std, min, max, null rate, distinct count"
            ]
          },
          {
            type:  "tech",
            title:  "Tech Stack",
            items:  [
              {
                name:  "PySpark",
                icon:  "https://cdn.simpleicons.org/apachespark/E25A1C"
              },
              {
                name:  "BigQuery",
                icon:  "https://cdn.simpleicons.org/googlebigquery"
              },
              {
                name:  "Dataproc",
                icon:  "https://cdn.simpleicons.org/googledataproc"
              }
            ]
          },
          {
            type:  "chart",
            title:  "Feature Type Distribution",
            chartType:  "doughnut",
            csvFile:  "data/feature-distribution.csv",
            colors:  [
              "#2EE6A8",
              "#5B8CFF",
              "#34d399",
              "#f59e0b",
              "#94a3b8"
            ]
          },
          {
            type:  "chart",
            title:  "Top Drifting Features — Cohen's d",
            chartType:  "bar",
            csvFile:  "data/feature-drift.csv",
            options:  {
              indexAxis:  "y"
            },
            seriesConfig:  [
              {
                borderRadius:  4,
                colorThresholds:  [
                  {
                    above:  0.5,
                    color:  "#ef4444"
                  },
                  {
                    above:  0.3,
                    color:  "#f59e0b"
                  },
                  {
                    color:  "#10b981"
                  }
                ]
              }
            ]
          },
          {
            type:  "table",
            title:  "Feature Health Dashboard",
            filterable:  true,
            csvFile:  "data/feature-health-dashboard.csv"
          }
        ]
      }
    },
    {
      slug:  "xai-shap",
      title:  "SHAP Explainability (XAI)",
      subtitle:  "Global feature importance at population, decile, and centile levels",
      icon:  "brain",
      tags:  [
        "SHAP",
        "Explainability",
        "MLOps",
        "PySpark"
      ],
      description:  "Mean absolute SHAP aggregation at population, decile, and centile levels. Extended to cohort-level and real-time non-deep-learning models.",
      detail:  {
        sections:  []
      }
    },
    {
      slug:  "fairml",
      title:  "Fairness & Bias Framework",
      subtitle:  "Demographic fairness evaluation with legal compliance",
      icon:  "scale",
      tags:  [
        "Responsible AI",
        "Fairness",
        "MLOps"
      ],
      description:  "Bias evaluation integrating demographic data to compute fairness metrics across protected groups with representation analysis — partnered with Legal.",
      detail:  {
        sections:  []
      }
    },
    {
      slug:  "rca-workflow",
      title:  "Cross-Framework Root Cause Analysis",
      subtitle:  "8-step automated root cause analysis across all frameworks",
      icon:  "microscope",
      tags:  [
        "Root Cause Analysis",
        "Model Monitoring",
        "MLOps"
      ],
      description:  "8-step automated root cause analysis correlating performance drift, score distribution, SHAP shifts, feature drift, and data quality into severity-ranked diagnostics.",
      detail:  {
        sections:  []
      }
    },
    {
      slug:  "confusion-matrix",
      title:  "Confusion Matrix & Threshold Optimization",
      subtitle:  "Classification threshold analysis for campaign targeting",
      icon:  "target",
      tags:  [
        "Model Evaluation",
        "Python",
        "BigQuery"
      ],
      description:  "Threshold-based classification metrics at probability, decile, and centile thresholds for optimal campaign targeting.",
      detail:  {
        sections:  []
      }
    },
    {
      slug:  "gcp-data-platforms",
      title:  "GCP Data Platforms & Cost Guardrails",
      subtitle:  "ETL/ELT on BigQuery & Dataproc — data quality, Airflow ops, cloud cost control",
      icon:  "tools",
      tags:  [
        "GCP",
        "BigQuery",
        "ETL/ELT",
        "Dataproc",
        "Airflow",
        "PySpark"
      ],
      description:  "Google Cloud data engineering at scale — PySpark feature and scoring pipelines, BigQuery data quality checks, dry-run cost caps, environment-aware routing, and Cloud Composer reliability.",
      detail:  {
        sections:  [
          {
            type:  "text",
            title:  "Overview",
            content:  [
              "Alongside GenAI and MLOps work, I design and operate the GCP data layer that feeds monitoring and scoring systems — Dataproc/PySpark pipelines, BigQuery warehouses, and Airflow orchestration.",
              "Focus areas: data quality automation, cloud cost guardrails, and zero-missed-SLA operations during peak traffic."
            ]
          },
          {
            type:  "metrics",
            title:  "Impact",
            items:  [
              {
                value:  "60%",
                label:  "Compute Cost Cut"
              },
              {
                value:  "200GB",
                label:  "Dry-Run Scan Cap"
              },
              {
                value:  "100%",
                label:  "SLA Compliance"
              },
              {
                value:  "3",
                label:  "Env Auto-Deploy"
              }
            ]
          },
          {
            type:  "features",
            title:  "Key Capabilities",
            items:  [
              "PySpark pipelines on Dataproc for large-scale feature engineering and scoring",
              "Automated Data Sanity Check engine — nulls, duplicates, uniqueness, bounds, referential integrity",
              "BigQuery dry-run cost checks that block queries scanning >200 GB",
              "Environment-aware dataset routing (Dev / PLE / Prod) driven by CI/CD variables",
              "Dataproc CPU utilization analysis for cluster right-sizing",
              "Cloud Function multi-env deployment automation via GitLab + Jenkins",
              "Airflow TaskGroup migrations and peak-event (BFCM) operational readiness"
            ]
          },
          {
            type:  "tech",
            title:  "Tech Stack",
            items:  [
              {
                name:  "GCP",
                icon:  "https://cdn.simpleicons.org/googlecloud"
              },
              {
                name:  "BigQuery",
                icon:  "https://cdn.simpleicons.org/googlebigquery"
              },
              {
                name:  "Dataproc",
                icon:  "https://cdn.simpleicons.org/googledataproc"
              },
              {
                name:  "Airflow",
                icon:  "https://cdn.simpleicons.org/apacheairflow"
              },
              {
                name:  "PySpark",
                icon:  "https://cdn.simpleicons.org/apachespark/E25A1C"
              },
              {
                name:  "Python",
                icon:  "https://cdn.simpleicons.org/python"
              }
            ]
          },
          {
            type:  "timeline",
            title:  "Typical Pipeline Flow",
            steps:  [
              {
                title:  "Ingest",
                desc:  "Raw / curated tables in BigQuery or GCS"
              },
              {
                title:  "Transform",
                desc:  "PySpark on Dataproc with feature logic"
              },
              {
                title:  "Validate",
                desc:  "Generated sanity SQL + dry-run cost checks"
              },
              {
                title:  "Orchestrate",
                desc:  "Airflow / Composer schedules and TaskGroups"
              },
              {
                title:  "Serve",
                desc:  "Score tables + monitoring frameworks consume outputs"
              }
            ]
          }
        ]
      }
    }
  ],
  skills:  [
    {
      category:  "Generative AI & LLMs",
      items:  [
        {
          name:  "Generative AI",
          icon:  "bot"
        },
        {
          name:  "Large Language Models (LLMs)",
          icon:  "brain"
        },
        {
          name:  "Agentic AI",
          icon:  "bot"
        },
        {
          name:  "Prompt Engineering",
          icon:  "bot"
        },
        {
          name:  "Google Vertex AI",
          icon:  "https://cdn.simpleicons.org/googlecloud"
        },
        {
          name:  "Gemini",
          icon:  "https://cdn.simpleicons.org/google"
        },
        {
          name:  "Retrieval-Augmented Generation (RAG)",
          icon:  "https://cdn.simpleicons.org/elasticsearch"
        },
        {
          name:  "Embeddings",
          icon:  "search"
        },
        {
          name:  "Vector Search",
          icon:  "search"
        },
        {
          name:  "Hybrid Search",
          icon:  "https://cdn.simpleicons.org/elasticsearch"
        },
        {
          name:  "LLM Tool Calling",
          icon:  "tools"
        },
        {
          name:  "Streaming Responses",
          icon:  "https://cdn.simpleicons.org/fastapi"
        },
        {
          name:  "Token Cost Optimization",
          icon:  "chartLine"
        },
        {
          name:  "AI Guardrails",
          icon:  "scale"
        }
      ]
    },
    {
      category:  "Agents & APIs",
      items:  [
        {
          name:  "LangGraph",
          icon:  "https://cdn.simpleicons.org/langgraph"
        },
        {
          name:  "LangChain",
          icon:  "https://cdn.simpleicons.org/langchain"
        },
        {
          name:  "Multi-Agent Systems",
          icon:  "bot"
        },
        {
          name:  "Google ADK",
          icon:  "https://cdn.simpleicons.org/google"
        },
        {
          name:  "FastAPI",
          icon:  "https://cdn.simpleicons.org/fastapi"
        },
        {
          name:  "Streamlit",
          icon:  "https://cdn.simpleicons.org/streamlit"
        },
        {
          name:  "REST APIs",
          icon:  "send"
        },
        {
          name:  "Python CLI Tools",
          icon:  "https://cdn.simpleicons.org/python"
        }
      ]
    },
    {
      category:  "GCP Data Engineering",
      items:  [
        {
          name:  "Google Cloud Platform (GCP)",
          icon:  "https://cdn.simpleicons.org/googlecloud"
        },
        {
          name:  "BigQuery",
          icon:  "https://cdn.simpleicons.org/googlebigquery"
        },
        {
          name:  "Data Warehousing",
          icon:  "https://cdn.simpleicons.org/googlebigquery"
        },
        {
          name:  "Cloud Composer",
          icon:  "https://cdn.simpleicons.org/apacheairflow"
        },
        {
          name:  "Apache Airflow",
          icon:  "https://cdn.simpleicons.org/apacheairflow"
        },
        {
          name:  "Dataproc",
          icon:  "https://cdn.simpleicons.org/googledataproc"
        },
        {
          name:  "Dataflow",
          icon:  "https://cdn.simpleicons.org/googledataflow"
        },
        {
          name:  "Pub/Sub",
          icon:  "https://cdn.simpleicons.org/googlepubsub"
        },
        {
          name:  "Cloud Storage (GCS)",
          icon:  "https://cdn.simpleicons.org/googlecloudstorage"
        },
        {
          name:  "Cloud Functions",
          icon:  "https://cdn.simpleicons.org/googlecloud/4285F4"
        },
        {
          name:  "Cloud Run",
          icon:  "https://cdn.simpleicons.org/googlecloud/EA4335"
        },
        {
          name:  "ETL / ELT",
          icon:  "https://cdn.simpleicons.org/googlebigquery"
        },
        {
          name:  "Data Pipelines",
          icon:  "https://cdn.simpleicons.org/apacheairflow"
        },
        {
          name:  "Data Quality",
          icon:  "https://cdn.simpleicons.org/googlebigquery"
        },
        {
          name:  "Cloud Cost Optimization",
          icon:  "https://cdn.simpleicons.org/googlecloud"
        },
        {
          name:  "IAM",
          icon:  "https://cdn.simpleicons.org/googlecloud"
        }
      ]
    },
    {
      category:  "MLOps & Model Observability",
      items:  [
        {
          name:  "MLOps",
          icon:  "chartLine"
        },
        {
          name:  "Model Monitoring",
          icon:  "chartLine"
        },
        {
          name:  "Model Deployment",
          icon:  "rocket"
        },
        {
          name:  "Feature Engineering",
          icon:  "tools"
        },
        {
          name:  "Drift Detection",
          icon:  "chartDown"
        },
        {
          name:  "PSI",
          icon:  "https://cdn.simpleicons.org/scipy"
        },
        {
          name:  "SHAP Explainability",
          icon:  "brain"
        },
        {
          name:  "Champion vs Challenger",
          icon:  "target"
        },
        {
          name:  "Responsible AI",
          icon:  "scale"
        },
        {
          name:  "Root Cause Analysis",
          icon:  "microscope"
        }
      ]
    },
    {
      category:  "Languages & Processing",
      items:  [
        {
          name:  "Python",
          icon:  "https://cdn.simpleicons.org/python"
        },
        {
          name:  "PySpark",
          icon:  "https://cdn.simpleicons.org/apachespark/E25A1C"
        },
        {
          name:  "SQL",
          icon:  "https://cdn.simpleicons.org/postgresql"
        },
        {
          name:  "Jinja",
          icon:  "https://cdn.simpleicons.org/jinja"
        },
        {
          name:  "Elasticsearch",
          icon:  "https://cdn.simpleicons.org/elasticsearch"
        },
        {
          name:  "PostgreSQL",
          icon:  "https://cdn.simpleicons.org/postgresql"
        },
        {
          name:  "Batch Processing",
          icon:  "https://cdn.simpleicons.org/apachespark/E25A1C"
        }
      ]
    },
    {
      category:  "CI/CD & DevOps",
      items:  [
        {
          name:  "CI/CD",
          icon:  "https://cdn.simpleicons.org/gitlab"
        },
        {
          name:  "GitLab",
          icon:  "https://cdn.simpleicons.org/gitlab"
        },
        {
          name:  "Jenkins",
          icon:  "https://cdn.simpleicons.org/jenkins"
        },
        {
          name:  "Docker",
          icon:  "https://cdn.simpleicons.org/docker"
        },
        {
          name:  "Git",
          icon:  "https://cdn.simpleicons.org/git"
        }
      ]
    }
  ],
  about:  {
    bio:  [
      "I'm Girdhari Kumar, a Senior AI Engineer in Chennai. I build Generative AI products on Large Language Models (LLMs) — copilots, multi-agent systems, and Retrieval-Augmented Generation (RAG) — and ship them with the same rigor I bring to MLOps and Google Cloud data platforms.",
      "At Verizon I own production AI and model monitoring for 300+ models: LangGraph agents, Vertex AI (Gemini), safe tool calling, Hybrid RAG on Elasticsearch, token cost controls, and end-to-end drift / explainability frameworks — with measurable impact on incidents, tokens, and cloud spend.",
      "I also bring strong GCP Data Engineering — BigQuery, Dataproc, Cloud Composer / Airflow, PySpark, ETL/ELT, data quality, and cost control — backed by Google Cloud Professional Data Engineer, Professional Machine Learning Engineer, and Associate Cloud Engineer certifications."
    ],
    education:  [
      {
        degree:  "B.E, Construction Engineering",
        institution:  "Jadavpur University, Kolkata",
        period:  "2017 — 2021",
        logo:  "https://upload.wikimedia.org/wikipedia/en/thumb/5/58/Jadavpur_University_Logo.svg/330px-Jadavpur_University_Logo.svg.png"
      }
    ],
    certifications:  [
      {
        name:  "Professional Machine Learning Engineer",
        provider:  "Google Cloud",
        logo:  "https://cdn.simpleicons.org/googlecloud",
        image:  "certs/gcp-pmle.png",
        pdf:  "certs/gcp-pmle.pdf",
        issued:  "2023-09-04",
        expires:  "2025-09-04",
        credentialId:  "JZHaTK"
      },
      {
        name:  "Professional Data Engineer",
        provider:  "Google Cloud",
        logo:  "https://cdn.simpleicons.org/googlecloud",
        image:  "certs/gcp-pde.png",
        pdf:  "certs/gcp-pde.pdf",
        issued:  "2022-10-12",
        expires:  "2024-10-12",
        credentialId:  "P5zRpA"
      },
      {
        name:  "Associate Cloud Engineer",
        provider:  "Google Cloud",
        logo:  "https://cdn.simpleicons.org/googlecloud",
        image:  "certs/gcp-ace.png",
        pdf:  "certs/gcp-ace.pdf",
        issued:  "2022-05-13",
        expires:  "2024-05-13",
        credentialId:  "NrEAbX"
      },
      {
        name:  "Machine Learning Specialization",
        provider:  "Andrew Ng / Coursera",
        logo:  "https://cdn.simpleicons.org/coursera"
      },
      {
        name:  "LangGraph for Agentic AI",
        provider:  "LangChain Academy",
        logo:  "https://cdn.simpleicons.org/langchain"
      }
    ]
  },
  /* Docs space — folders + markdown/HTML pages (editable in admin) */
  docs: {
    folders: [
      { id: "notes", name: "Notes", description: "Working notes and write-ups" },
      { id: "guides", name: "Guides", description: "How-tos and runbooks" },
    ],
    items: [
      {
        id: "welcome",
        title: "Welcome to Documents",
        folderId: "notes",
        format: "markdown",
        updated: "2026-10-12",
        published: true,
        body: "## Documents\n\nUse this space like a simple wiki.\n\n- Create **folders** for topics\n- Write in **Markdown** (or paste HTML)\n- **Import** `.md`, `.txt`, or `.html` files from your computer\n- Preview live in admin, then Save & Publish\n\n### Example\n\n| Skill | Focus |\n| --- | --- |\n| Generative AI | LangGraph, RAG, Vertex AI |\n| MLOps | Monitoring, drift, SHAP |\n| GCP | BigQuery, Composer, PySpark |\n",
      },
    ],
  },

  customPages: {},
};
