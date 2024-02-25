# Aproxima Infrastructure

This folder contains configurations and scripts to manage the infrastructure required for the Aproxima applications across all environments. I decided against splitting this up for each application, as the infra shouldn't be too complex and it's easier to manage it all in one place.

## Infra Provisioning

The infrastructure is provisioned using [Terraform](https://www.terraform.io/). Currently, the infrastructure is hosted exclusively on [Cloudflare](https://www.cloudflare.com/) and configured via [main.tf](main.tf). Currently, the Terraform state is hosted on Terraform Cloud. A Terraform Cloud OAuth app on GitHub triggers the Terraform runs on push to the `main` branch.

## Deployment

Note that the deployment of apps is not managed by Terraform, but by [wrangler](https://developers.cloudflare.com/workers/wrangler/) as part of the CI/CD pipeline on ([GitHub Actions](../.github/workflows/)). For instance, the `core-api` worker script is deployed on push to `main`, while the worker custom domains are managed and updated via Terraform on Terraform Cloud.

## Secret Management

Secrets are managed via Terraform Cloud and [HashiCorp Vault](https://www.hashicorp.com/products/vault). Terraform environment variables are stored in Terraform Cloud and are injected into the Terraform runs. GitHub Action secrets are stored in HashiCorp Vault and automatically synced with GitHub Actions via the Vault GitHub App.
