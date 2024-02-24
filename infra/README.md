# Aproxima Infrastructure

This folder contains configurations and scripts to manage the infrastructure required for the Aproxima applications across all environments. I decided against splitting this up for each application, as the infra shouldn't be too complex and it's easier to manage it all in one place.

## Deployment

Note that the deployment of apps is not managed by Terraform, but by the CI/CD pipeline ([GitHub Actions](../.github/workflows/)). The Terraform scripts are only responsible for setting up the infrastructure. For instance, the Cloudflare Workers are deployed via wrangler, but the worker routes and custom domains are managed via Terraform.

## Integration

Currently, the Terraform state is hosted on Terraform Cloud. A Terraform Cloud OAuth app on GitHub triggers the Terraform runs on push to the `main` branch.