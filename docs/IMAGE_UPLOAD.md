# Image Upload with Supabase Storage

## Overview

Project ini menggunakan **Supabase Storage** untuk upload gambar menu. URL gambar disimpan di database sebagai array string, sedangkan file gambar disimpan di Supabase Storage bucket.

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Browser   │──────│  Next.js App │──────│  Supabase   │
│             │      │              │      │  Storage    │
│ ImageUploader├─────▶│ uploadFiles()├─────▶│             │
│  Component  │      │              │      │ menu-images │
│             │◀─────┤  Returns URL │◀─────┤   bucket    │
└─────────────┘      └──────────────┘      └─────────────┘
       │                     │
       │                     ▼
       │              ┌──────────────┐
       └─────────────▶│  PostgreSQL  │
        (Save URLs)   │   Database   │
                      │ menu.images  │
                      │   (array)    │
                      └──────────────┘
```

## Components

### 1. **ImageUploader** (Reusable Component)

Path: `src/shared/ui/ImageUploader.tsx`

**Features:**

- ✅ Multiple file upload (drag & drop support coming)
- ✅ Preview dengan thumbnail
- ✅ Remove image functionality
- ✅ Upload progress indicator
- ✅ Maximum file limit (default 5)
- ✅ Image validation
- ✅ Responsive grid layout

**Usage:**

```tsx
import { ImageUploader } from "@/shared/ui/ImageUploader";

function MyForm() {
  const [images, setImages] = useState<string[]>([]);

  return (
    <ImageUploader
      images={images}
      onChange={setImages}
      maxImages={5}
      folder="menus"
      disabled={false}
    />
  );
}
```

**Props:**

```typescript
{
  images: string[];           // Array of image URLs
  onChange: (urls: string[]) => void; // Callback when images change
  maxImages?: number;         // Max number of images (default: 5)
  folder?: string;            // Storage folder (default: "menus")
  disabled?: boolean;         // Disable upload (default: false)
}
```

### 2. **Storage Library**

Path: `src/lib/storage.ts`

**Available Functions:**

```typescript
// Upload single file
const result = await uploadFile(file, "menus");
// Returns: { url: string, path: string }

// Upload multiple files
const results = await uploadFiles([file1, file2], "menus");
// Returns: Array<{ url: string, path: string }>

// Delete single file
await deleteFile("menus/1234-abc.jpg");

// Delete multiple files
await deleteFiles(["menus/1234-abc.jpg", "menus/5678-def.png"]);

// Extract path from URL
const path = getPathFromUrl(publicUrl);
// "https://xxx.supabase.co/storage/v1/object/public/menu-images/menus/123.jpg"
// Returns: "menus/123.jpg"
```

### 3. **Supabase Client**

Path: `src/lib/supabase.ts`

```typescript
import { supabase } from "@/lib/supabase"; // Client-side
import { supabaseAdmin } from "@/lib/supabase"; // Server-side (admin)
```

## Storage Structure

```
Supabase Storage
└── menu-images (bucket)
    ├── menus/
    │   ├── 1701234567890-abc123.jpg
    │   ├── 1701234568901-def456.png
    │   └── ...
    ├── profiles/  (for future use)
    └── banners/   (for future use)
```

## Database Schema

```sql
-- Menu table stores URLs only, not the actual files
model Menu {
  id          String   @id @default(cuid())
  name        String
  images      String[] // Array of Supabase public URLs
  // ... other fields
}
```

## Usage Examples

### Example 1: Menu Create Form

```tsx
// src/app/dashboard/menu/create/page.tsx

import { ImageUploader } from "@/shared/ui/ImageUploader";

function MenuCreateForm() {
  const { setValue, watch } = useForm();
  const images = watch("images");

  return (
    <form>
      {/* Other fields... */}

      <ImageUploader
        images={images}
        onChange={(urls) => setValue("images", urls)}
        maxImages={5}
        folder="menus"
      />

      <button type="submit">Save</button>
    </form>
  );
}
```

### Example 2: With Manual Upload

```tsx
import { uploadFile } from "@/lib/storage";

async function handleUpload(file: File) {
  try {
    const result = await uploadFile(file, "menus");
    console.log("Uploaded:", result.url);
    // Save result.url to database
  } catch (error) {
    console.error("Upload failed:", error);
  }
}
```

### Example 3: Delete Old Images

```tsx
import { deleteFiles, getPathFromUrl } from "@/lib/storage";

async function deleteMenuImages(imageUrls: string[]) {
  const paths = imageUrls
    .map((url) => getPathFromUrl(url))
    .filter((path) => path !== null);

  if (paths.length > 0) {
    await deleteFiles(paths);
  }
}
```

## File Naming Convention

Format: `{folder}/{timestamp}-{random}.{ext}`

Example: `menus/1701234567890-k9x2m1p.jpg`

- **timestamp**: Ensures uniqueness and chronological order
- **random**: 7-character random string for extra uniqueness
- **ext**: Original file extension (jpg, png, webp, etc.)

## Image Validation

Client-side validation:

- ✅ File type: `image/*` (jpg, png, webp, gif)
- ✅ Max size: 5MB per file (configurable in Supabase)
- ✅ Max count: Configurable via `maxImages` prop

## Security

### 1. Bucket Policies (RLS)

```sql
-- Public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'menu-images');

-- Authenticated upload only
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'menu-images');
```

### 2. Server vs Client

- **Client-side**: Uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` (safe to expose)
- **Server-side**: Uses `SUPABASE_SERVICE_ROLE_KEY` (keep secret)

## Performance Optimization

### 1. Image Optimization

Consider using:

- Browser Image Compression before upload
- Next.js Image component for display
- WebP format for better compression

### 2. Lazy Loading

```tsx
<Image src={imageUrl} alt="Menu" loading="lazy" width={300} height={300} />
```

### 3. Caching

Supabase automatically caches images via CDN:

- Default cache: 1 hour (`cacheControl: "3600"`)
- Customize in `src/lib/storage.ts`

## Migration from Uploadthing

If migrating from Uploadthing:

1. ✅ **Removed**: `uploadthing` and `@uploadthing/react` packages
2. ✅ **Removed**: `src/app/api/uploadthing/` directory
3. ✅ **Replaced**: `UploadButton` with `ImageUploader`
4. ✅ **Updated**: `.env` to use Supabase credentials

Old code:

```tsx
<UploadButton
  endpoint="menuImageUploader"
  onClientUploadComplete={(res) => {
    const urls = res.map((f) => f.url);
    setImages(urls);
  }}
/>
```

New code:

```tsx
<ImageUploader images={images} onChange={setImages} maxImages={5} />
```

## Troubleshooting

### Upload fails with "401 Unauthorized"

- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Verify bucket policies allow public INSERT

### Images not displaying

- Check bucket is set to **Public**
- Verify URL format: `https://xxx.supabase.co/storage/v1/object/public/menu-images/...`
- Check browser console for CORS errors

### "Bucket not found" error

- Ensure bucket name is exactly `menu-images`
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct

## Testing Checklist

- [ ] Create menu with images
- [ ] Edit menu and add more images
- [ ] Remove individual images
- [ ] Upload different file types (jpg, png, webp)
- [ ] Test max images limit
- [ ] Verify images display correctly
- [ ] Check Supabase storage dashboard

## Future Enhancements

1. **Drag & Drop**: Add drag-drop file selection
2. **Image Cropping**: Add cropper before upload
3. **Compression**: Auto-compress large images
4. **Multiple Folders**: Support different image types
5. **Cleanup**: Auto-delete unused images
6. **Bulk Upload**: Upload multiple menus at once

## Resources

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Component Demo](http://localhost:3000/dashboard/menu/create)
