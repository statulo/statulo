# ⚡Statulo/scout

The reliable checking component of the Statulo infrastructure. Scout communicates with the Orchestration API to run uptime checks.

## 🔥Features

- Lightweight, stable and highly reliable.
- Runs uptime checks and reports back to the Orchestration API.
- Great for closed networks thanks to the pull-only model.
- Prometheus compatible metrics.

> [!IMPORTANT]
> This app is still in active development. Do not use in production!

## 🔥Usage
```
scout --token <YOUR_TOKEN>
```

| Argument              | Description                               | Default           | Environment variables |
| --------------------- | ----------------------------------------- | ----------------- | --------------------- |
| `--url <URL>`         | Url of the statulo server.                | Production server | `SCOUT_URL`           |
| `--metrics <IP:PORT>` | Metrics endpoint in `IP:PORT` format.     | Off               | `SCOUT_METRICS_URL`   |
| `--log <FORMAT>`      | Log output format (e.g., `json`, `text`). | `text`            | `SCOUT_LOG_FORMAT`    |
| `--debug`             | Enables verbose debug output.             | Off               | `SCOUT_DEBUG`         |
| `--token <TOKEN>`     | Agent registration token.                 | Required          | `SCOUT_TOKEN`         |

> [!TIP]
> CLI arguments always override environment variables
