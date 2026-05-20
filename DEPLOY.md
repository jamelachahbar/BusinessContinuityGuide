# Deploy BoltPlan to Azure

Two officially supported deployment modes — both use **Azure Static Web Apps** (SWA) and ship via the **Azure Developer CLI (`azd`)**. One command, no backend, free SSL, global CDN.

| Mode | SKU | Access | Cost | Use case |
|------|-----|--------|------|----------|
| **Public** | SWA **Free** | Anonymous, anyone with the URL | **$0** | Demos, internal-only-by-obscurity workshops, OSS reference deployment. |
| **Private** | SWA **Standard** + Entra ID | Microsoft account login required; route-level RBAC enforced | ~**$9 / app / month** | Customer / partner production deployments, internal corporate use. |

> Both modes deploy the same source — only the SKU and the `staticwebapp.config.json` differ. Switching modes is a re-deploy, no code change.

---

## Prerequisites (one-time)

| Tool | Install |
|------|---------|
| Azure subscription | [portal.azure.com](https://portal.azure.com) |
| Azure Developer CLI (`azd`) | [aka.ms/azd-install](https://aka.ms/azd-install) — `winget install Microsoft.Azd` |
| Node.js 18+ | [nodejs.org](https://nodejs.org) |
| Git | [git-scm.com](https://git-scm.com) |

```pwsh
azd version       # confirm install
az login          # optional, only if you also use az cli
azd auth login    # mandatory
```

---

## Option 1 — Public deployment (Free, anonymous)

For demos, internal POCs, or open-source sharing.

```pwsh
git clone https://github.com/Azure/BusinessContinuityGuide.git
cd BusinessContinuityGuide

azd env new boltplan-public
azd env set DEPLOYMENT_MODE public
azd env set AZURE_LOCATION westeurope    # or eastus2, centralus, westus2, eastasia

azd up
```

`azd up` will:

1. Prompt for the Azure subscription.
2. Provision a resource group `rg-boltplan-public` containing one Free-tier Static Web App.
3. Build `web-app` (`npm install && npm run build`).
4. Apply `staticwebapp.public.config.json` for SPA routing + security headers.
5. Upload the build via SWA deployment token.

When it finishes, the deployed URL is printed (e.g. `https://swa-boltplan-public-xxx.azurestaticapps.net`).

### Tear down

```pwsh
azd down --force --purge
```

---

## Option 2 — Private deployment (Entra ID required)

For customer-facing or internal corporate use where access must be gated.

```pwsh
git clone https://github.com/Azure/BusinessContinuityGuide.git
cd BusinessContinuityGuide

azd env new boltplan-private
azd env set DEPLOYMENT_MODE private
azd env set AZURE_LOCATION westeurope

azd up
```

What changes vs. the public mode:

| Aspect | Public | Private |
|--------|--------|---------|
| SKU | Free | **Standard** |
| `staticwebapp.config.json` | Open routing only | All routes require `authenticated` role; 401 → redirect to `/.auth/login/aad` |
| Auth provider | None | **Microsoft Entra ID** (built-in `aad` provider) |
| Other providers | n/a | GitHub / X explicitly disabled (return 404) |
| Cost | $0 | ~$9 / month |

> First visit to the deployed URL will redirect to Microsoft sign-in. Any Microsoft Entra ID account can sign in by default — see *Restricting access* below to limit to your tenant or to specific users.

### Restricting access to your tenant (recommended for production)

The built-in `aad` provider authenticates against the **common** endpoint (any Microsoft account). To lock down to a single tenant, use one of these patterns:

#### Pattern A — Invite-only via SWA roles (no Entra app registration required)

1. Go to your Static Web App in the Azure portal → **Role management** → **Invite**.
2. Provide the user's email, set the role to `authenticated`, and send.
3. Only invited users land on a valid session. Everyone else is denied.

#### Pattern B — Custom Entra app + single-tenant lock (full enterprise pattern)

1. In Entra ID → **App registrations** → **New registration**.
   - Name: `BoltPlan SWA`
   - Supported account types: **Accounts in this organizational directory only (single tenant)**
   - Redirect URI: `https://<your-swa>.azurestaticapps.net/.auth/login/aad/callback`
2. Add a client secret. Copy the **Application (client) ID** and **secret**.
3. In your Static Web App → **Configuration** → add app settings:
   - `AZURE_CLIENT_ID` = the client ID
   - `AZURE_CLIENT_SECRET` = the secret
4. Replace `staticwebapp.private.config.json` with the custom-OIDC variant (snippet below) and re-deploy with `azd deploy`.

```jsonc
// staticwebapp.private.config.json (custom Entra app variant — single-tenant)
{
  "auth": {
    "identityProviders": {
      "azureActiveDirectory": {
        "registration": {
          "openIdIssuer": "https://login.microsoftonline.com/<YOUR-TENANT-ID>/v2.0",
          "clientIdSettingName": "AZURE_CLIENT_ID",
          "clientSecretSettingName": "AZURE_CLIENT_SECRET"
        }
      }
    }
  },
  "routes": [
    { "route": "/login",  "rewrite": "/.auth/login/aad" },
    { "route": "/logout", "redirect": "/.auth/logout" },
    { "route": "/*", "allowedRoles": ["authenticated"] }
  ],
  "responseOverrides": {
    "401": { "redirect": "/.auth/login/aad", "statusCode": 302 }
  },
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*", "/*.{png,jpg,jpeg,svg,ico,webp,json,txt,xml,map}"]
  }
}
```

Replace `<YOUR-TENANT-ID>` with your tenant GUID. Only users in that tenant can sign in.

### Optional — Private endpoint (network isolation)

SWA Standard supports private endpoints (preview). To make the app reachable **only** from a VNet:

1. In the SWA → **Networking** → **Private endpoints** → **Add**.
2. Select the VNet/subnet your users (or VPN/ExpressRoute) connect through.
3. SWA's public hostname will return 403 from the public internet; resolution from the VNet returns the private IP.

Docs: [Private endpoint for Static Web Apps](https://learn.microsoft.com/azure/static-web-apps/private-endpoint).

---

## Updating an already-deployed app

```pwsh
cd BusinessContinuityGuide
git pull                # get latest BoltPlan changes
azd deploy              # rebuild + redeploy (no infra changes)

# Switch a deployment from public → private:
azd env set DEPLOYMENT_MODE private
azd provision           # re-runs Bicep (changes SKU to Standard)
azd deploy              # ships the private staticwebapp.config.json
```

---

## CI/CD (optional)

`azd pipeline config` will generate a GitHub Actions workflow:

```pwsh
azd pipeline config
```

It registers a federated identity, sets the right secrets, and produces `.github/workflows/azure-dev.yml` that runs `azd provision && azd deploy` on push.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Static Web Apps Free tier is not available in <region>` | Set `AZURE_LOCATION` to one of `eastus2 / centralus / westus2 / westeurope / eastasia`. |
| `401` loop on private mode | You opened the public-mode URL after switching the env to private without `azd provision`. Re-run `azd provision`, then re-deploy. |
| Build fails on `npm install` | Ensure Node 18+ (`node --version`). Run `npm ci` inside `web-app/` to reproduce locally. |
| Need to inspect provisioned config | `azd env get-values` shows every output (`WEB_URI`, `AZURE_LOCATION`, …). |

---

## What's in `infra/`

```
infra/
├── main.bicep                 # subscription-scope: creates RG, calls module
├── main.parameters.json       # azd parameter file (reads env vars)
└── modules/
    └── staticwebapp.bicep     # the Static Web App resource
azure.yaml                      # azd entrypoint + predeploy hook that picks the auth config
web-app/
├── staticwebapp.public.config.json     # used when DEPLOYMENT_MODE=public
└── staticwebapp.private.config.json    # used when DEPLOYMENT_MODE=private
```

The `azure.yaml` predeploy hook copies the right `staticwebapp.*.config.json` into `web-app/dist/staticwebapp.config.json` before `azd` uploads the artifact, so the SWA runtime picks up the correct routing + auth rules.
