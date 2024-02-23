terraform {
  cloud {
    hostname = "app.terraform.io"
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

resource "cloudflare_worker_route" "core-api-route" {
  zone_id     = var.CLOUDFLARE_APROXIMA_NET_ZONE_ID
  pattern     = "aproxima.net/api/*"
  script_name = cloudflare_worker_script.core-api.name
}

resource "cloudflare_worker_script" "core-api" {
  account_id = var.CLOUDFLARE_ACCOUNT_ID
  name = "core-api"
  content = "console.log('Hello, world!')"
}

