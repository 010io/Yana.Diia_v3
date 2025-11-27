# Basic Authentication Setup

## Overview

The Yana.Diia v3 application is protected with Basic Authentication to ensure only authorized team members can access the Flow-to-LEGO Importer and other features.

## Credentials

**Username:** `YAnaDiia`  
**Password:** `Be.TRUE_3.1415...454592...7`

## How It Works

1. When you access any page of the application, your browser will prompt for credentials
2. Enter the username and password above
3. Your browser will cache these credentials for the session
4. When you close the browser, you'll need to authenticate again

## Implementation Details

### Middleware

The authentication is implemented in `middleware.ts` at the root level using Next.js middleware.

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !verifyCredentials(authHeader)) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Yana.Diia v3"',
      },
    });
  }
  
  return NextResponse.next();
}
```

### Protected Routes

All routes are protected except:
- Static files (`_next/static`)
- Image optimization (`_next/image`)
- Public assets (favicon, images)

### Security Considerations

⚠️ **Important Security Notes:**

1. **HTTPS Required in Production**: Basic Auth credentials are base64 encoded (NOT encrypted). Always use HTTPS in production to protect credentials in transit.

2. **Environment Variables**: For production deployment, store credentials in environment variables:
   ```env
   BASIC_AUTH_USERNAME=YAnaDiia
   BASIC_AUTH_PASSWORD=Be.TRUE_3.1415...454592...7
   ```

3. **Browser Caching**: Browsers cache Basic Auth credentials until the browser is closed. Users don't need to re-enter credentials for each page.

4. **Failed Attempts**: Failed authentication attempts are logged by the browser. Consider adding server-side logging for security monitoring.

## Development

### Local Development

The credentials are hardcoded in `middleware.ts` for development. No additional setup needed.

### Production Deployment

For production, update `middleware.ts` to use environment variables:

```typescript
const TEAM_USERNAME = process.env.BASIC_AUTH_USERNAME || 'YAnaDiia';
const TEAM_PASSWORD = process.env.BASIC_AUTH_PASSWORD || 'Be.TRUE_3.1415...454592...7';
```

Then set environment variables in your deployment platform (Vercel, Netlify, etc.).

## Testing

### Manual Testing

1. Start the development server: `npm run dev`
2. Open `http://localhost:3000`
3. Browser will prompt for credentials
4. Enter username and password
5. You should be able to access all pages

### Automated Testing

For E2E tests with Playwright, you can pass credentials in the URL:

```typescript
await page.goto('http://YAnaDiia:Be.TRUE_3.1415...454592...7@localhost:3000');
```

Or set authorization header:

```typescript
await page.setExtraHTTPHeaders({
  'Authorization': 'Basic ' + Buffer.from('YAnaDiia:Be.TRUE_3.1415...454592...7').toString('base64')
});
```

## Troubleshooting

### "Authentication required" keeps appearing

- Clear your browser cache and cookies
- Try a different browser
- Check that you're entering the exact credentials (case-sensitive)

### Can't access API routes

If you need to protect API routes too, update the `matcher` in `middleware.ts`:

```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Need to bypass auth for specific routes

Add exclusions to the matcher pattern:

```typescript
matcher: [
  '/((?!api/public|_next/static|_next/image|favicon.ico).*)',
],
```

## Future Enhancements

Consider implementing:
- Rate limiting to prevent brute force attacks
- Server-side logging of failed attempts
- IP-based access control
- JWT tokens for API authentication
- OAuth2 for more secure authentication
