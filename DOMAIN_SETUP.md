# Domain Setup Guide - digg-ct.co.za

## Current Setup
- **Domain:** digg-ct.co.za
- **Current Nameservers:** GoDaddy (ns77.domaincontrol.com, ns78.domaincontrol.com)

## Option 1: Use Vercel Nameservers (Recommended)

This is the easiest method - Vercel manages all DNS.

### Steps:

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Domains
   - Add domain: `digg-ct.co.za`
   - Vercel will show you nameservers (usually something like):
     - `ns1.vercel-dns.com`
     - `ns2.vercel-dns.com`

2. **In GoDaddy (or your domain registrar):**
   - Go to Domain Settings → Nameservers
   - Change from "Using default nameservers" to "Custom nameservers"
   - Enter the nameservers Vercel provided
   - Save

3. **Wait for DNS Propagation:**
   - Usually takes 24-48 hours
   - Vercel will show status: "Valid Configuration" when ready

**Benefits:**
- ✅ Vercel manages all DNS automatically
- ✅ SSL certificate handled automatically
- ✅ Easy to manage

## Option 2: Keep GoDaddy Nameservers (Add DNS Records)

If you want to keep GoDaddy nameservers, add DNS records instead.

### Steps:

1. **In Vercel Dashboard:**
   - Add domain: `digg-ct.co.za`
   - Vercel will show DNS records to add:
     - Type: `A` or `CNAME`
     - Name: `@` (for root domain) or `www`
     - Value: (Vercel provides this)

2. **In GoDaddy:**
   - Go to DNS Management
   - Add the DNS records Vercel provides:
     - For root domain (`digg-ct.co.za`): Add `A` record pointing to Vercel IP
     - For `www.digg-ct.co.za`: Add `CNAME` record pointing to Vercel

3. **Wait for DNS Propagation:**
   - 24-48 hours typically

**Note:** Vercel will provide exact DNS records when you add the domain.

## Recommended: Use Vercel Nameservers

**Why?**
- Simpler setup
- Automatic SSL
- Better performance
- Easier management

## Step-by-Step: Vercel Nameservers

### 1. Add Domain in Vercel
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Click "Add Domain"
3. Enter: `digg-ct.co.za`
4. Click "Add"
5. Vercel will show you nameservers to use

### 2. Update Nameservers in GoDaddy
1. Login to GoDaddy
2. Go to My Products → Domains
3. Click on `digg-ct.co.za`
4. Scroll to "Additional Settings" → "Manage DNS"
5. Click "Change" next to Nameservers
6. Select "Custom"
7. Enter the nameservers Vercel provided
8. Save

### 3. Wait for Propagation
- Check status in Vercel Dashboard
- Status will change to "Valid Configuration" when ready
- Can take up to 48 hours (usually faster)

## Verify Setup

Once configured, test:
- `https://digg-ct.co.za` - Should load your site
- `https://www.digg-ct.co.za` - Should also work (if configured)
- SSL certificate should be automatic (HTTPS)

## Troubleshooting

**Domain not working after 48 hours?**
- Check nameservers are correct in GoDaddy
- Verify domain is added in Vercel
- Check Vercel domain status page

**SSL certificate issues?**
- Vercel handles SSL automatically
- Wait for DNS to fully propagate
- Check Vercel dashboard for SSL status

## Important Notes

- **Don't change nameservers until Vercel deployment is complete**
- **Keep a backup of current DNS records** (if you have any)
- **Both www and non-www can work** - Vercel can configure both

## Quick Reference

**Current Nameservers (GoDaddy):**
- ns77.domaincontrol.com
- ns78.domaincontrol.com

**New Nameservers (from Vercel):**
- Will be provided when you add domain in Vercel
- Usually: `ns1.vercel-dns.com` and `ns2.vercel-dns.com` (example)
