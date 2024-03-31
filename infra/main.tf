terraform {
  cloud {
    hostname     = "app.terraform.io"
    organization = "Aproxima"

    workspaces {
      name = "Aproxima"
    }
  }
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.CLOUDFLARE_API_TOKEN
}

variable "CLOUDFLARE_API_TOKEN" {
  description = "API token for Cloudflare provider. Variable set on Terraform Cloud as a sensitive environment variable: TF_VAR_CLOUDFLARE_API_TOKEN."
  type        = string
  sensitive   = true
}

variable "CLOUDFLARE_ACCOUNT_ID" {
  description = "The account ID for the Cloudflare account. Variable set on Terraform Cloud as a sensitive environment variable: TF_VAR_CLOUDFLARE_ACCOUNT_ID."
  type        = string
  sensitive   = true
}

# aproxima.net:
# - aproxima.net: Core web app (/core-web)
# - www.aproxima.net: Core web app (/core-web)
# - api.aproxima.net: Core REST API (/core-api)
# - auth.aproxima.net: Authentication web app (/auth)
# - home.aproxima.net: Home automation web app (/home)
# - shop.aproxima.net: E-commerce web app (/shop)
variable "CLOUDFLARE_APROXIMA_NET_ZONE_ID" {
  description = "The zone ID for the domain aproxima.net. Variable set on Terraform Cloud as a sensitive environment variable: TF_VAR_CLOUDFLARE_APROXIMA_NET_ZONE_ID."
  type        = string
  sensitive   = true
}

# Databases

# Core database for shop, home, and auth.
resource "cloudflare_d1_database" "core-db" {
  account_id = var.CLOUDFLARE_ACCOUNT_ID
  name       = "core-db"
}

# Cloudflare Pages (Workers created via wrangler.toml deployments)

resource "cloudflare_pages_project" "core-web" {
  account_id        = var.CLOUDFLARE_ACCOUNT_ID
  name              = "core-web"
  production_branch = "main"
}

resource "cloudflare_pages_project" "auth" {
  account_id        = var.CLOUDFLARE_ACCOUNT_ID
  name              = "auth"
  production_branch = "main"
}

resource "cloudflare_pages_project" "home" {
  account_id        = var.CLOUDFLARE_ACCOUNT_ID
  name              = "home"
  production_branch = "main"
}

resource "cloudflare_pages_project" "shop" {
  account_id        = var.CLOUDFLARE_ACCOUNT_ID
  name              = "shop"
  production_branch = "main"
}

# Secrets

# TODO: This is a temporary way of protecting the core-api POST endpoints. This will be replaced with user auth.
variable "CLOUDFLARE_CORE_API_API_KEY" {
  description = "The API key to communicate with the core api. Variable set on Terraform Cloud as a sensitive environment variable: TF_VAR_CLOUDFLARE_CORE_API_API_KEY."
  type        = string
  sensitive   = true
}

resource "cloudflare_worker_secret" "core-api-api-key" {
  account_id  = var.CLOUDFLARE_ACCOUNT_ID
  name        = "CORE_API_API_KEY"
  script_name = "core-api"
  secret_text = var.CLOUDFLARE_CORE_API_API_KEY
}

variable "CLOUDFLARE_AUTH_SESSION_COOKIE_SECRET_ONE" {
  description = "The first secret used to sign the user session cookie. Variable set on Terraform Cloud as a sensitive environment variable: TF_VAR_CLOUDFLARE_AUTH_SESSION_COOKIE_SECRET_ONE"
  type        = string
  sensitive   = true
}

# DNS records

resource "cloudflare_pages_domain" "core-web-domain" {
  account_id   = var.CLOUDFLARE_ACCOUNT_ID
  project_name = "core-web"
  domain       = "aproxima.net"
}

# core-api worker must be deployed first before the domain can be added to it.
resource "cloudflare_worker_domain" "core-api" {
  account_id = var.CLOUDFLARE_ACCOUNT_ID
  zone_id    = var.CLOUDFLARE_APROXIMA_NET_ZONE_ID
  hostname   = "api.aproxima.net"
  service    = "core-api"
}

# Verify domain ownership for GitHub Pages
resource "cloudflare_record" "aproxima_net_github_domain_verification_txt" {
  zone_id = var.CLOUDFLARE_APROXIMA_NET_ZONE_ID
  name    = "_github-challenge-aproxima-tech-org.aproxima.net"
  type    = "TXT"
  value   = "7ac9a94d15"
}

# CNAME storybook.aproxima.net to aproxima-tech.github.io
resource "cloudflare_record" "storybook_aproxima_net_cname" {
  zone_id = var.CLOUDFLARE_APROXIMA_NET_ZONE_ID
  name    = "storybook"
  type    = "CNAME"
  value   = "aproxima-tech.github.io"
}
