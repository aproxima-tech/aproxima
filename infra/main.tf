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
# - aproxima.net     -> shop.aproxima.net
# - www.aproxima.net -> shop.aproxima.net
# - api.aproxima.net: Core REST API (/core-api)
# - auth.aproxima.net: Authentication web app (/auth)
# - home.aproxima.net: Home automation web app (/home)
# - shop.aproxima.net: E-commerce web app (/shop)
variable "CLOUDFLARE_APROXIMA_NET_ZONE_ID" {
  description = "The zone ID for the domain aproxima.net. Variable set on Terraform Cloud as a sensitive environment variable: TF_VAR_CLOUDFLARE_APROXIMA_NET_ZONE_ID."
  type        = string
  sensitive   = true
}

# redirect to shop.aproxima.net
resource "cloudflare_record" "aproxima_net" {
  zone_id = var.CLOUDFLARE_APROXIMA_NET_ZONE_ID
  name    = "aproxima.net"
  type    = "CNAME"
  value   = "shop.aproxima.net"
  proxied = true
}

# redirect to shop.aproxima.net
resource "cloudflare_record" "www_aproxima_net" {
  zone_id = var.CLOUDFLARE_APROXIMA_NET_ZONE_ID
  name    = "www"
  type    = "CNAME"
  value   = "shop.aproxima.net"
  proxied = true
}

# redirect www.shop to shop.aproxima.net
resource "cloudflare_record" "www_shop_aproxima_net" {
  zone_id = var.CLOUDFLARE_APROXIMA_NET_ZONE_ID
  name    = "www"
  type    = "CNAME"
  value   = "shop.aproxima.net"
  proxied = true
}

# redirect www.home to home.aproxima.net
resource "cloudflare_record" "www_home_aproxima_net" {
  zone_id = var.CLOUDFLARE_APROXIMA_NET_ZONE_ID
  name    = "www"
  type    = "CNAME"
  value   = "home.aproxima.net"
  proxied = true
}

# redirect www.auth to auth.aproxima.net
resource "cloudflare_record" "www_auth_aproxima_net" {
  zone_id = var.CLOUDFLARE_APROXIMA_NET_ZONE_ID
  name    = "www"
  type    = "CNAME"
  value   = "auth.aproxima.net"
  proxied = true
}

# core-api worker must be deployed first before the domain can be added to it.
resource "cloudflare_worker_domain" "core-api" {
  account_id = var.CLOUDFLARE_ACCOUNT_ID
  zone_id    = var.CLOUDFLARE_APROXIMA_NET_ZONE_ID
  hostname   = "api.aproxima.net"
  service    = "core-api"
}

# auth worker must be deployed first before the domain can be added to it.
resource "cloudflare_worker_domain" "auth" {
  account_id = var.CLOUDFLARE_ACCOUNT_ID
  zone_id    = var.CLOUDFLARE_APROXIMA_NET_ZONE_ID
  hostname   = "auth.aproxima.net"
  service    = "auth"
}

# shop worker must be deployed first before the domain can be added to it.
resource "cloudflare_worker_domain" "shop" {
  account_id = var.CLOUDFLARE_ACCOUNT_ID
  zone_id    = var.CLOUDFLARE_APROXIMA_NET_ZONE_ID
  hostname   = "shop.aproxima.net"
  service    = "shop"
}

# home worker must be deployed first before the domain can be added to it.
resource "cloudflare_worker_domain" "home" {
  account_id = var.CLOUDFLARE_ACCOUNT_ID
  zone_id    = var.CLOUDFLARE_APROXIMA_NET_ZONE_ID
  hostname   = "home.aproxima.net"
  service    = "home"
}


