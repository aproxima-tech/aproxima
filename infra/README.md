# Aproxima Infrastructure

This folder contains configurations and scripts to manage the infrastructure required for the Aproxima applications.

## Infra Provisioning

The infrastructure is provisioned using [Terraform](https://www.terraform.io/). DNS records are managed via [Cloudflare](https://www.cloudflare.com/) and configured via [main.tf](main.tf). Currently, the Terraform state is hosted on Terraform Cloud. A Terraform Cloud OAuth app on GitHub triggers the Terraform runs on push to the `main` branch.

## Deployment

Note that the deployment of apps is not managed by Terraform, but as part of the CI/CD pipeline on ([GitHub Actions](../.github/workflows/)).

## Secret Management

Secrets are managed via Terraform Cloud and [HashiCorp Vault](https://www.hashicorp.com/products/vault). Terraform environment variables are stored in Terraform Cloud and are injected into the Terraform runs. GitHub Action secrets are stored in HashiCorp Vault and automatically synced with GitHub Actions via the Vault GitHub App.
