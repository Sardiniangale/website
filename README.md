# website
-long term website

## Cloudflare Pages Deployment

To deploy this website to Cloudflare Pages, you need to set the following environment variables in your Cloudflare Pages project settings:

- `GOOGLE_CLIENT_ID`: Your Google Client ID.
- `ADMIN_EMAIL`: The admin email address.
- `CLOUDFLARE_SITE_KEY`: Your Cloudflare site key.

Then, set the build command to:

```bash
sed -i "s|__GOOGLE_CLIENT_ID__|$GOOGLE_CLIENT_ID|g" prism.html && sed -i "s|__ADMIN_EMAIL__|$ADMIN_EMAIL|g" src/auth.js && sed -i "s|__CLOUDFLARE_SITE_KEY__|$CLOUDFLARE_SITE_KEY|g" prism.html
```

And set the build output directory to `/`.
