# ✅ Hero Image Upload - Implementation Summary

## 🎯 What's Implemented

### 1. Image Upload Utility ([upload-hero-image.ts](../src/lib/upload-hero-image.ts))

**Features:**

- ✅ File validation (size, format, dimensions, aspect ratio)
- ✅ Upload to Supabase Storage bucket `hero-slides`
- ✅ Auto-generate unique filenames
- ✅ Get public URL after upload
- ✅ Delete images from storage

**Validation Rules:**

```typescript
MAX_SIZE: 5MB
MIN_WIDTH: 1200px
MIN_HEIGHT: 400px
ASPECT_RATIO: 3:1 (±20% tolerance)
FORMATS: JPG, PNG, WebP
```

### 2. Dual Input Mode ([HeroSlideModal.tsx](../src/modules/hero/components/HeroSlideModal.tsx))

**Two ways to add images:**

**📎 Link URL Mode:**

- Paste image URL from internet
- Instant preview
- No upload needed

**📤 Upload File Mode:**

- Drag & drop or click to select
- Real-time validation
- Upload to Supabase
- Auto preview after upload
- Loading states

**UI Improvements:**

- Toggle buttons for mode selection
- Image preview with aspect ratio 3:1
- Upload progress indicator
- Error handling with toast notifications

### 3. Auto Cleanup ([actions.ts](../src/modules/hero/actions.ts))

**Smart Image Management:**

- ✅ **Update slide**: Deletes old image when changing
- ✅ **Delete slide**: Removes image from storage
- ✅ **External URLs**: Skips deletion (only Supabase URLs)

## 📋 Supabase Setup Required

### Steps (One-time setup):

1. **Create Bucket**

   ```
   Name: hero-slides
   Type: Public ✅
   ```

2. **Add Policies**

   - SELECT: Public read access
   - INSERT: Authenticated users
   - DELETE: Authenticated users

3. **Verify .env**
   ```env
   NEXT_PUBLIC_SUPABASE_URL="..."
   NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
   SUPABASE_SERVICE_ROLE_KEY="..."
   ```

📖 **Full guide**: [HERO_IMAGE_UPLOAD.md](./HERO_IMAGE_UPLOAD.md)  
⚡ **Quick start**: [HERO_IMAGE_QUICK_START.md](./HERO_IMAGE_QUICK_START.md)

## 🎨 Image Specs

### Requirements (Enforced)

- Max file size: **5MB**
- Min dimensions: **1200x400px**
- Aspect ratio: **3:1** (landscape, ±20% tolerance)
- Formats: **JPG, PNG, WebP**

### Recommended (Best Practice)

- Dimensions: **1920x640** atau **2400x800**
- File size: **< 2MB** (use compression)
- Format: **WebP** (best compression)
- Quality: **80-85%**

## 🧪 Testing Checklist

### Before Testing

- [ ] Supabase bucket `hero-slides` created
- [ ] Bucket is **public**
- [ ] Policies are set (SELECT, INSERT, DELETE)
- [ ] .env has Supabase credentials
- [ ] Dev server running: `pnpm dev`

### Test Cases

**✅ Valid Upload:**

```
Image: 1920x640, 1.5MB, WebP
Expected: Upload success, preview shown
```

**❌ Size Too Large:**

```
Image: 8MB
Expected: Error "Ukuran file terlalu besar"
```

**❌ Dimensions Too Small:**

```
Image: 800x600
Expected: Error "Dimensi gambar terlalu kecil"
```

**❌ Wrong Aspect Ratio:**

```
Image: 1200x800 (1.5:1)
Expected: Error "Rasio aspek tidak sesuai"
```

**✅ URL Input:**

```
URL: https://example.com/image.jpg
Expected: Preview shown, no upload
```

**✅ Update Slide:**

```
Action: Change image
Expected: Old image deleted, new image uploaded
```

**✅ Delete Slide:**

```
Action: Delete slide
Expected: Slide deleted, image removed from Supabase
```

## 🚀 How to Use

### Via Dashboard

```bash
# 1. Login as admin
http://localhost:3001/admin/login

# 2. Go to Hero Slides
http://localhost:3001/dashboard/hero-slides

# 3. Create/Edit slide
- Click "Tambah Slide" or Edit button
- Choose input mode:
  • Link URL → Paste image URL
  • Upload File → Select file from computer
- Preview will appear automatically
- Fill other fields (title, subtitle, etc.)
- Click "Simpan"

# 4. Verify on homepage
http://localhost:3001
```

## 📁 File Structure

```
src/
  ├── lib/
  │   └── upload-hero-image.ts          ← Upload utility
  ├── modules/
  │   └── hero/
  │       ├── actions.ts                ← Server actions (with cleanup)
  │       └── components/
  │           └── HeroSlideModal.tsx    ← Dual input UI

docs/
  ├── HERO_IMAGE_UPLOAD.md              ← Full documentation
  └── HERO_IMAGE_QUICK_START.md         ← Quick reference

Supabase Storage:
  hero-slides/
    ├── hero-1701234567890-abc123.jpg
    └── hero-1701234568901-def456.webp
```

## 🎯 Key Features

### Validation

- Client-side validation before upload
- Real-time feedback with toast messages
- Prevents invalid uploads

### Storage

- All images in Supabase `hero-slides` bucket
- Unique filenames (timestamp + random)
- Public access for display
- Auto cleanup on update/delete

### UX

- Two input modes (URL / Upload)
- Live preview
- Loading states
- Error messages
- Responsive design

### Performance

- Optimized image requirements
- Compression recommendations
- Aspect ratio enforcement for responsive display

## 🔄 Migration Path

Existing slides with local images (`/banner1.jpg`):

1. Continue working (backward compatible)
2. Edit slide → Upload file mode → Choose image
3. Old local path replaced with Supabase URL
4. No manual migration needed

## 📊 Comparison

| Feature        | Before         | After                   |
| -------------- | -------------- | ----------------------- |
| Input          | URL only       | URL + Upload            |
| Storage        | Local/external | Supabase                |
| Validation     | None           | Size, dimensions, ratio |
| Preview        | Manual         | Auto                    |
| Cleanup        | Manual         | Auto                    |
| Max Size       | Unlimited      | 5MB                     |
| Min Dimensions | Any            | 1200x400                |

## 🎉 Ready to Test!

```bash
# Start server
pnpm dev

# Open dashboard
http://localhost:3001/dashboard/hero-slides

# Try uploading your first hero image! 🚀
```

---

**Need help?** Check:

- [HERO_IMAGE_UPLOAD.md](./HERO_IMAGE_UPLOAD.md) - Full documentation
- [HERO_IMAGE_QUICK_START.md](./HERO_IMAGE_QUICK_START.md) - Quick reference
- [SUPABASE_SETUP.md](../SUPABASE_SETUP.md) - Supabase general setup
