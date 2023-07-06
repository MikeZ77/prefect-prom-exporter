![Code Build](https://img.shields.io/badge/build-passing-brightgreen)
![Code Coverage](https://img.shields.io/badge/coverage-61.2%25-yellow)

# prefect-prom-exporter

This server creates Prometheus metrics from the Prefect 2 REST API. Currently, Prefect 2 Does not expose metrics for Prometheus.

### Setup

Configure a .env file at the root of the project:

```
PORT=4000                                       # The server port
PREFECT_API_URL=http://127.0.0.1:4200/          # The address of your on-prem prefect server (overriden if PREFECT_API_KEY is present)
PREFECT_API_KEY=""                              # Prefect api key (if required)
PREFECT_ACCOUNT_ID=""                           # Prefect account id (only required for prefect cloud)
PREFECT_WORKSPACE_ID=""                         # Prefect workspace id (only required for prefect cloud)
METRICS_PATH=""                                 # Path to metrics
SCRAPE_INTERVAL=5000                            # Interval that the server calls the prefect rest api to gather metrics
ENV=development                                 # Either development or production (only turns of logging color in production)
PREFECT_FLOW_RUN_BUCKETS="0,1,10,60,300,1000"   # Prefect flow run histogram buckets (set as a comma seperated list)
```

Note that in Prefect 2 tags can be used to replace project namespacing. Any tags associated with a flow will be used as labels.

Run the server:

```
npm run server:dev
```

Check the metrics endpoint.
