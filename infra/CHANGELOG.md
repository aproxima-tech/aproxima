# Changelog

## 0.0.0

Decided to try out Terraform to manage the Cloudflare infrastructure. Since this repository is open source, infrastructure as code makes it easier for others to understand how the infrastructure is set up. This is the first time I'm using Terraform, so I'm excited to see how it goes!

Initialized a new Terraform project with the following command:

```bash
cd infra/
terraform init
```

Created a Terraform Cloud account. All Terraform plan & apply runs execute on Terraform Cloud, which eases Terraform state management. I linked Terraform Cloud as an OAuth application to my GitHub account, so that Terraform Cloud can automatically apply changes to the infrastructure when changes are pushed to the repository.

Created a `main.tf` file to define the Cloudflare infrastructure for the production environment. Added the secrets to Terraform Cloud as environment variables, prefixed with `TF_VAR_`. This is done to avoid storing secrets in the repository.

Next, I added my domain (aproxima.net) to Cloudflare and updated the name servers through my domain registrar (name.com) to my assigned name servers from Cloudflare. I also deleted all existing domain recordings on Cloudflare. This was done manually as I first needed the domain zone id for setting up the DNS records in Terraform.

Changes can be reviewed with the following command:

```bash
terraform plan
```

### Resources

- [Terraform](https://www.terraform.io/)
- [Cloudflare with Terraform Guide](https://technotim.live/posts/terraform-cloudflare-github/)