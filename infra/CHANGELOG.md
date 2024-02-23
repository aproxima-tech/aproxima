# Changelog

## 0.0.0

Decided to try out Terraform to manage the Cloudflare infrastructure. Since this repository is open source, infrastructure as code makes it easier for others to understand how the infrastructure is set up. This is the first time I'm using Terraform, so I'm excited to see how it goes!

Initialized a new Terraform project with the following command:

```bash
terraform init
```

Created a `main.tf` file to define the Cloudflare infrastructure for the production environment.

Next, I added my domain (aproxima.net) to Cloudflare and updated the name servers through my domain registrar (name.com) to my assigned name servers from Cloudflare. I also deleted all existing domain recordings on Cloudflare. This was done manually as I first needed the domain zone id for setting up the DNS records in Terraform.

### Resources

- [Terraform](https://www.terraform.io/)
- [Cloudflare with Terraform Guide](https://technotim.live/posts/terraform-cloudflare-github/)