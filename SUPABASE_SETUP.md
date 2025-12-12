# Supabase Storage Setup Guide

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - Project Name: `warung-enin`
   - Database Password: (save this)
   - Region: Choose closest to your users
4. Wait for project creation (~2 minutes)

## 2. Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Fill in:
   - Name: `menu-images`
   - Public bucket: **✅ Enable** (so images are publicly accessible)
4. Click "Create bucket"

## 3. Configure Bucket Policies

### Option A: Using Dashboard (Recommended)

1. Click on `menu-images` bucket
2. Go to **Policies** tab
3. Click "New Policy" for SELECT
4. Choose template: "Enable read access for all users"
5. Click "Review" → "Save policy"

### Option B: Using SQL (Advanced)

Run this in SQL Editor:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'menu-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'menu-images');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'menu-images');
```

## 4. Get API Credentials

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** tab
3. Copy these values:

   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...` (long key)
   - **service_role key**: `eyJhbGci...` (different long key)

## 5. Update .env File

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUz..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiI..."
```

## 6. Test Upload

1. Start your dev server: `pnpm dev`
2. Login to dashboard: `http://localhost:3000/admin/login`
3. Go to Menu Management: `http://localhost:3000/dashboard/menu`
4. Click "Tambah Menu"
5. Try uploading an image
6. Check Supabase Storage dashboard to see the uploaded file

## 7. Storage Structure

Images will be stored in this structure:

```
menu-images/
  └── menus/
      ├── 1701234567890-abc123.jpg
      ├── 1701234568901-def456.png
      └── ...
```

## 8. Bucket Settings (Optional)

### File Size Limits

By default, Supabase allows up to 50MB per file. To change:

1. Go to Storage → Settings
2. Adjust "Maximum file size"

### Allowed MIME Types

The `ImageUploader` component accepts: `image/*`

You can restrict further in Supabase bucket settings.

## 9. Production Considerations

### CORS Configuration

If you deploy to a different domain, configure CORS:

1. Go to Storage → Settings → CORS
2. Add your production domain

### CDN & Caching

Supabase Storage uses Cloudflare CDN automatically. Images are cached for:

- Our upload: `cacheControl: "3600"` (1 hour)

To change cache duration, edit `src/lib/storage.ts`:

```typescript
cacheControl: "86400", // 24 hours
```

### Image Optimization

For better performance, consider:

1. **Resize before upload** (client-side with browser-image-compression)
2. **Use Supabase Image Transformation** (Pro plan):
   ```
   https://project.supabase.co/storage/v1/render/image/public/bucket/image.jpg?width=300&height=300
   ```

## 10. Cleanup Old Images

When deleting a menu, you can also delete its images:

```typescript
import { deleteFiles, getPathFromUrl } from "@/lib/storage";

// In your delete action
const paths = menu.images.map((url) => getPathFromUrl(url)).filter(Boolean);
if (paths.length > 0) {
  await deleteFiles(paths);
}
```

## Troubleshooting

### Error: "new row violates row-level security policy"

- Bucket policies not configured correctly
- Make sure SELECT policy allows public access
- INSERT policy requires authenticated user

### Error: "bucket not found"

- Check bucket name is exactly `menu-images`
- Check NEXT_PUBLIC_SUPABASE_URL is correct

### Images not loading

- Check bucket is set to **Public**
- Verify public URL is accessible in browser
- Check browser console for CORS errors

### Upload fails silently

- Check file size (< 50MB)
- Verify anon key is correct
- Check browser console for errors

## Free Tier Limits

Supabase Free Tier includes:

- ✅ 1 GB storage
- ✅ 2 GB bandwidth/month
- ✅ 50 MB max file size
- ✅ Unlimited API requests

For Warung Enin with ~100 menus × 5 images × 200KB average:

- Storage needed: ~100 MB (well within limit)
- Monthly bandwidth: Depends on traffic

## Support

- Supabase Docs: https://supabase.com/docs/guides/storage
- Community: https://github.com/supabase/supabase/discussions
