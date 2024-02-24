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

variable "CLOUDFLARE_APROXIMA_NET_ZONE_ID" {
  description = "The zone ID for the domain aproxima.net. Variable set on Terraform Cloud as a sensitive environment variable: TF_VAR_CLOUDFLARE_APROXIMA_NET_ZONE_ID."
  type        = string
  sensitive   = true
}

resource "cloudflare_worker_route" "core-api-route" {
  zone_id     = var.CLOUDFLARE_APROXIMA_NET_ZONE_ID
  pattern     = "aproxima.net/api/*"
  script_name = "core-api"
}


