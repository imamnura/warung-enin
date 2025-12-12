# 🚀 Quick Start: Hero Image Upload

## ⚡ Setup (One-time)

### 1. Create Supabase Bucket

```bash
# Login ke Supabase Dashboard
https://supabase.com
```

1. Go to **Storage** → **New Bucket**
2. Name: `hero-slides`
3. ✅ **Public bucket** (PENTING!)
4. Create

### 2. Add Policies

Pilih bucket `hero-slides` → **Policies**:

**SELECT (Read):**

- Template: "Enable read access for all users"

**INSERT (Upload):**

- Template: "Enable insert for authenticated users only"

**DELETE:**

- Template: "Enable delete for authenticated users only"

### 3. Verify .env

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

## 📸 Image Requirements

| Requirement        | Value           |
| ------------------ | --------------- |
| **Max Size**       | 5MB             |
| **Min Dimensions** | 1200x400px      |
| **Aspect Ratio**   | 3:1 (landscape) |
| **Formats**        | JPG, PNG, WebP  |

## 🎯 Recommended Specs

- **Dimensions**: 1920x640 atau 2400x800
- **File Size**: < 2MB (compress dengan TinyPNG)
- **Format**: WebP (best compression)
- **Quality**: 80-85%

## 💡 Usage

### Dashboard Upload

```
1. Login sebagai Admin
2. Dashboard → Hero Slides
3. Tambah Slide / Edit
4. Pilih mode input:
   📎 Link URL   → Paste URL
   📤 Upload File → Choose file

5. Preview otomatis muncul
6. Simpan
```

### Validation

Sistem akan otomatis validasi:

- ✅ File size max 5MB
- ✅ Dimensions min 1200x400
- ✅ Aspect ratio 3:1 (±20% tolerance)
- ✅ Format JPG/PNG/WebP

### Auto Cleanup

- Update slide → Old image dihapus
- Delete slide → Image dihapus
- External URLs → Tidak dihapus

## 🧪 Quick Test

```bash
# 1. Start dev server
pnpm dev

# 2. Open dashboard
http://localhost:3001/dashboard/hero-slides

# 3. Test upload:
# - Valid image (1920x640, < 2MB) → ✅ Success
# - Too small (800x600) → ❌ Error
# - Too large (> 5MB) → ❌ Error
# - Wrong ratio (1200x800) → ❌ Error
```

## ⚠️ Common Issues

### Upload Failed

- ✅ Check bucket `hero-slides` exists
- ✅ Check bucket is **public**
- ✅ Check policies are set
- ✅ Check .env credentials

### Image Not Showing

- ✅ Verify URL in database
- ✅ Check bucket permissions
- ✅ Clear browser cache

## 📁 Storage Structure

```
hero-slides/
  ├── hero-1701234567890-abc123.jpg
  └── hero-1701234568901-def456.webp
```

## 📚 Full Documentation

[docs/HERO_IMAGE_UPLOAD.md](./HERO_IMAGE_UPLOAD.md)
