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

variable "CLOUDFLARE_APROXIMA_NET_ZONE_ID" {
  description = "The zone ID for the domain aproxima.net. Variable set on Terraform Cloud as a sensitive environment variable: TF_VAR_CLOUDFLARE_APROXIMA_NET_ZONE_ID."
  type        = string
  sensitive   = true
}

# DNS records

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
