# prefect-prom-exporter

This server creates Prometheus metrics from the Prefect 2 REST API. Currently, Prefect 2 Does not expose metrics for Prometheus.

### Setup

Configure a .env file at the root of the project:

```
PORT=4000                                       # The server port
PREFECT_API_URL=http://127.0.0.1:4200/          # The address of your prefect server (include last backslash)
PREFECT_API_KEY=""                              # Prefect api key
PREFECT_ACCOUNT_ID=""                           # Prefect account id (only required for prefect cloud)
PREFECT_WORKSPACE_ID=""                         # Prefect workspace id (only required for prefect cloud)
METRICS_PATH=""                                 # Path to metrics
SCRAPE_INTERVAL=5000                            # Interval that the server calls the prefect rest api to gather metrics
ENV=development                                 # Current environment
```

Note that in Prefect 2 tags can be used to replace project namespacing. Any tags associated with a flow will be used as labels.

Run the server:

```
npm run server:dev
```

Check the metrics endpoint.
