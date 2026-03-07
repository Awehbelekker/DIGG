# Error monitoring

The app includes a **global error boundary** (`app/global-error.tsx`) that catches uncaught errors and shows a friendly "Something went wrong" page with a "Try again" button. In development, the error message is shown for debugging.

## Optional: Sentry

To report errors to [Sentry](https://sentry.io):

1. Create a project at sentry.io (Next.js).
2. Install: `npm install @sentry/nextjs`
3. Run the Sentry wizard: `npx @sentry/wizard@latest -i nextjs`
4. Set `SENTRY_DSN` in Vercel (or `.env.local`) from your Sentry project settings.
5. The wizard adds `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts` and instruments the app. The global error boundary will still show the friendly page; Sentry will receive the error in the background.

## Vercel

On Vercel, check **Logs** and **Functions** for runtime errors. For more visibility, use Vercel's integration with Sentry or another provider.
