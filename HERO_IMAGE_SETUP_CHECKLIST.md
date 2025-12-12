# 📝 Hero Image Upload - Setup Checklist

Ikuti langkah ini untuk mengaktifkan fitur upload hero image:

## ✅ Step 1: Create Supabase Bucket

- [ ] Login ke [Supabase Dashboard](https://supabase.com)
- [ ] Select project: **warung-enin**
- [ ] Go to **Storage** (sidebar kiri)
- [ ] Click **"New Bucket"**
- [ ] Configuration:
  - **Name**: `hero-slides`
  - **Public bucket**: ✅ **ENABLE** (PENTING!)
  - **File size limit**: 5MB (default)
- [ ] Click **"Create Bucket"**

## ✅ Step 2: Configure Policies

- [ ] Click bucket `hero-slides`
- [ ] Go to **Policies** tab

### Policy 1: Public Read

- [ ] Click **"New Policy"**
- [ ] Operation: **SELECT**
- [ ] Template: **"Enable read access for all users"**
- [ ] Click **"Review"** → **"Save policy"**

### Policy 2: Authenticated Insert

- [ ] Click **"New Policy"**
- [ ] Operation: **INSERT**
- [ ] Template: **"Enable insert for authenticated users only"**
- [ ] Click **"Review"** → **"Save policy"**

### Policy 3: Authenticated Delete

- [ ] Click **"New Policy"**
- [ ] Operation: **DELETE**
- [ ] Template: **"Enable delete for authenticated users only"**
- [ ] Click **"Review"** → **"Save policy"**

## ✅ Step 3: Verify Environment Variables

- [ ] Open `.env` file
- [ ] Check these variables exist:
  ```env
  NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
  NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci..."
  SUPABASE_SERVICE_ROLE_KEY="eyJhbGci..."
  ```
- [ ] If missing, get from Supabase:
  - Settings → API → Project URL
  - Settings → API → anon/public key
  - Settings → API → service_role key

## ✅ Step 4: Test Upload

- [ ] Start dev server:

  ```bash
  pnpm dev
  ```

- [ ] Login sebagai admin:

  ```
  http://localhost:3001/admin/login
  ```

- [ ] Go to Hero Slides:

  ```
  http://localhost:3001/dashboard/hero-slides
  ```

- [ ] Click **"+ Tambah Slide"**

- [ ] Test **Upload File** mode:

  - [ ] Click **"Upload File"** button
  - [ ] Select valid image (1920x640, < 2MB)
  - [ ] Verify preview appears
  - [ ] Fill other fields
  - [ ] Click **"Simpan"**
  - [ ] Check success toast

- [ ] Test **Link URL** mode:
  - [ ] Click **"Link URL"** button
  - [ ] Paste image URL
  - [ ] Verify preview appears
  - [ ] Fill other fields
  - [ ] Click **"Simpan"**
  - [ ] Check success toast

## ✅ Step 5: Verify Storage

- [ ] Go back to Supabase Dashboard
- [ ] Storage → `hero-slides` bucket
- [ ] Verify uploaded images appear
- [ ] Check filename format: `hero-{timestamp}-{random}.{ext}`
- [ ] Click image to preview

## ✅ Step 6: Verify Homepage

- [ ] Open homepage:
  ```
  http://localhost:3001
  ```
- [ ] Verify hero slider shows uploaded images
- [ ] Check images load correctly
- [ ] Test slider auto-play

## ✅ Step 7: Test Update & Delete

- [ ] Edit existing slide
- [ ] Change image (upload new)
- [ ] Save
- [ ] Go to Supabase Storage
- [ ] Verify old image is deleted
- [ ] Verify new image exists

- [ ] Delete a slide
- [ ] Go to Supabase Storage
- [ ] Verify image is deleted

## 🎉 Setup Complete!

All checks passed? You're ready to use hero image upload! 🚀

## 📚 References

- [Full Documentation](./HERO_IMAGE_UPLOAD.md)
- [Quick Start Guide](./HERO_IMAGE_QUICK_START.md)
- [Implementation Details](./HERO_IMAGE_IMPLEMENTATION.md)

## 🆘 Troubleshooting

### Upload gagal dengan error "Failed to upload"

→ Check bucket policies (harus ada INSERT policy)

### Image tidak muncul di homepage

→ Check bucket is public (Public Access enabled)

### Error "bucket not found"

→ Verify bucket name: `hero-slides` (exact spelling)

### Error "Invalid file"

→ Check image requirements:

- Max 5MB
- Min 1200x400px
- Aspect ratio 3:1
- Format: JPG/PNG/WebP

---

**Last Updated**: 12 December 2024  
**Status**: ✅ Ready for Production
