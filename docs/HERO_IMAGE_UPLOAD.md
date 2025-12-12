# Hero Slides Image Upload Setup

## 📋 Overview

Hero slides sekarang mendukung upload gambar ke **Supabase Storage** dengan validasi otomatis untuk size dan dimensi.

## 🎯 Image Requirements

- **Max Size**: 5MB
- **Min Dimensions**: 1200x400 pixels
- **Recommended Aspect Ratio**: 3:1 (landscape)
- **Supported Formats**: JPG, PNG, WebP

## 🔧 Supabase Setup

### 1. Create Storage Bucket

1. Login ke [Supabase Dashboard](https://supabase.com)
2. Pilih project **warung-enin**
3. Go to **Storage** (sidebar)
4. Click **"New Bucket"**
5. Configure:
   - **Name**: `hero-slides`
   - **Public bucket**: ✅ **ENABLE** (untuk akses publik)
   - **File size limit**: 5MB (default)
6. Click **"Create Bucket"**

### 2. Set Bucket Policies

#### Option A: Via Dashboard (Recommended)

1. Click bucket `hero-slides`
2. Go to **Policies** tab
3. Click **"New Policy"** untuk SELECT operation
4. Pilih template: **"Enable read access for all users"**
5. Click **"Review"** → **"Save policy"**

6. Click **"New Policy"** untuk INSERT operation
7. Pilih template: **"Enable insert for authenticated users only"**
8. Click **"Review"** → **"Save policy"**

9. Click **"New Policy"** untuk DELETE operation
10. Pilih template: **"Enable delete for authenticated users only"**
11. Click **"Review"** → **"Save policy"**

#### Option B: Via SQL (Advanced)

Buka **SQL Editor** dan jalankan:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'hero-slides');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hero-slides');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'hero-slides');
```

### 3. Verify .env Configuration

Pastikan file `.env` sudah memiliki Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiI..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiI..."
```

## 💡 Features

### Dual Input Mode

**1. Link URL**

- Paste image URL dari internet
- Langsung preview

**2. Upload File**

- Drag & drop atau click untuk pilih file
- Auto validation:
  - ✅ File size (max 5MB)
  - ✅ Dimensions (min 1200x400px)
  - ✅ Aspect ratio (3:1 ±20% tolerance)
  - ✅ Format (JPG, PNG, WebP)
- Upload ke Supabase
- Auto preview

### Auto Cleanup

- **Update slide**: Old image otomatis dihapus dari Supabase
- **Delete slide**: Image otomatis dihapus dari Supabase
- **External URLs**: Tidak dihapus (only Supabase URLs)

## 📁 Storage Structure

Images disimpan dengan naming convention:

```
hero-slides/
  ├── hero-1701234567890-abc123.jpg
  ├── hero-1701234568901-def456.png
  └── hero-1701234569012-ghi789.webp
```

Format: `hero-{timestamp}-{random}.{ext}`

## 🚀 Usage

### Via Dashboard

1. Login sebagai **Admin**
2. Go to **Dashboard** → **Hero Slides**
3. Click **"+ Tambah Slide"** atau **Edit** existing slide
4. Di bagian **Gambar Hero**:
   - **Link URL**: Paste URL gambar
   - **Upload File**: Click area upload → Pilih file
5. Preview akan muncul otomatis
6. Click **"Simpan"**

### Validation Messages

- ❌ **"Ukuran file terlalu besar. Maksimal 5MB"**
- ❌ **"Format file tidak didukung. Gunakan JPG, PNG, atau WebP"**
- ❌ **"Dimensi gambar terlalu kecil. Minimal 1200x400px"**
- ❌ **"Rasio aspek tidak sesuai. Disarankan 3:1 (landscape)"**
- ✅ **"Gambar berhasil diupload"**

## 🎨 Recommended Image Specs

| Spec      | Value           | Note                   |
| --------- | --------------- | ---------------------- |
| Width     | 1920px - 2560px | Full HD to 2K          |
| Height    | 640px - 853px   | Maintains 3:1 ratio    |
| File Size | < 2MB           | Optimal untuk web      |
| Format    | WebP            | Best compression       |
| Quality   | 80-85%          | Balance size & quality |

### Example Dimensions

- ✅ 1920x640 (perfect 3:1)
- ✅ 2400x800 (perfect 3:1)
- ✅ 1800x600 (perfect 3:1)
- ⚠️ 1600x600 (2.67:1 - acceptable with tolerance)
- ❌ 1200x800 (1.5:1 - too square)

## 🔍 Testing

```bash
# 1. Pastikan Supabase bucket sudah dibuat
# 2. Test upload via dashboard
pnpm dev

# 3. Navigate to:
http://localhost:3001/dashboard/hero-slides

# 4. Try upload image dan verify:
# - Preview muncul
# - Image tersimpan di Supabase
# - Tampil di homepage slider
```

## 🐛 Troubleshooting

### Upload Failed

1. **Check Supabase bucket exists**: `hero-slides`
2. **Check policies**: Public read + Authenticated insert/delete
3. **Check .env**: SUPABASE credentials valid
4. **Check image**: Meets size & dimension requirements
5. **Check console**: Browser console for detailed errors

### Image Not Showing

1. **Check bucket is public**
2. **Verify image URL** in database (should be Supabase URL)
3. **Check CORS** settings in Supabase
4. **Clear cache** and reload page

## 📚 Code References

- Upload utility: [src/lib/upload-hero-image.ts](../src/lib/upload-hero-image.ts)
- Modal component: [src/modules/hero/components/HeroSlideModal.tsx](../src/modules/hero/components/HeroSlideModal.tsx)
- Server actions: [src/modules/hero/actions.ts](../src/modules/hero/actions.ts)

## 🎯 Best Practices

1. **Use WebP format** untuk ukuran file lebih kecil
2. **Compress images** sebelum upload (TinyPNG, Squoosh, dll)
3. **Use descriptive filenames** untuk tracking
4. **Test on mobile** untuk memastikan responsive
5. **Keep file size < 2MB** untuk loading cepat
