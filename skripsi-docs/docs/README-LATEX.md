# 📄 LaTeX Thesis Template - Scheduler AI

Template LaTeX lengkap untuk skripsi Universitas Gunadarma dengan format yang sesuai panduan akademik.

## 🎯 Files Utama

- `skripsi-template-complete.tex` - Template LaTeX lengkap dengan semua konten BAB 1-5
- `compile-latex.sh` - Script untuk kompilasi otomatis
- `pandoc-config.yaml` - Konfigurasi untuk konversi dari Markdown

## 🚀 Quick Start

### 1. Install LaTeX (MacTeX)
```bash
brew install --cask mactex
```

Setelah instalasi, restart terminal atau jalankan:
```bash
eval "$(/usr/libexec/path_helper)"
```

### 2. Compile PDF
```bash
./compile-latex.sh
```

### 3. Edit Konten
Edit file `skripsi-template-complete.tex` untuk:
- Menambahkan nama penguji pada lembar pengesahan
- Mengisi tanggal sidang
- Menyesuaikan konten sesuai kebutuhan

## 📝 Features Template

### ✅ Format Gunadarma Compliant
- Times New Roman 12pt
- Spasi 1.5 (onehalfspacing)
- Margin: 4cm (kiri/atas), 3cm (kanan/bawah)
- Numbering: Roman untuk preliminary pages, Arabic untuk content

### ✅ Struktur Lengkap
- Halaman judul dengan informasi mahasiswa
- Lembar pengesahan dengan nama pembimbing
- Abstrak (Bahasa Indonesia & English)
- Kata pengantar
- Daftar isi, tabel, dan gambar
- 5 BAB lengkap dengan konten
- Daftar pustaka dengan 21 referensi Harvard format

### ✅ Diagram dan Tabel
- Arsitektur sistem dengan TikZ
- Entity Relationship Diagram
- Tabel performa dan hasil pengujian
- Code listings dengan syntax highlighting

### ✅ Informasi Personal
- **Nama**: Dewiana Aryani Rahmat
- **NIM**: 10121332
- **Pembimbing**: Lintang Yuniar Banowosari
- **Program Studi**: Sistem Informasi
- **Fakultas**: FIKTI Universitas Gunadarma

## 🛠️ Troubleshooting

### LaTeX Not Found
```bash
# Install MacTeX
brew install --cask mactex

# Setup PATH
eval "$(/usr/libexec/path_helper)"

# Verify installation
which pdflatex
```

### Compilation Errors
1. Check `.log` file untuk error details:
   ```bash
   cat skripsi-template-complete.log
   ```

2. Common issues:
   - Missing packages: Install dengan `tlmgr install <package>`
   - Syntax errors: Check LaTeX syntax pada baris yang error
   - Memory issues: Increase LaTeX memory limit

### Package Missing
```bash
# Update LaTeX packages
sudo tlmgr update --self
sudo tlmgr update --all

# Install specific package
sudo tlmgr install <package-name>
```

## 📊 Document Stats

- **Total Pages**: ~65 halaman
- **Word Count**: ~15,000 kata
- **References**: 21 sumber (Harvard format)
- **Tables**: 6 tabel hasil penelitian
- **Figures**: 5 diagram dan gambar
- **Code Listings**: 8 contoh kode implementasi

## 🎨 Customization

### Mengubah Warna Diagram
Edit style TikZ di preamble:
```latex
fill=blue!10  % Background boxes
fill=yellow!20  % Entity boxes
```

### Menambah/Edit Konten
- BAB 1-5: Edit langsung di file `.tex`
- Tabel: Gunakan format `tabular` atau `longtable`
- Gambar: Tambah dengan `\includegraphics`
- Referensi: Tambah di `\begin{thebibliography}`

### Format Sitasi
Template menggunakan format Harvard:
```latex
\bibitem{key}
Author, A. (Year). Title. Journal, Volume(Issue), pages. DOI: xxx
```

## 📄 Output

Setelah kompilasi berhasil:
- `skripsi-template-complete.pdf` - PDF final
- Auxiliary files (`.aux`, `.log`, `.toc`, dll.) - File sementara kompilasi

## 💡 Tips

1. **Backup**: Selalu backup file `.tex` sebelum edit besar
2. **Version Control**: Gunakan Git untuk tracking changes
3. **Incremental**: Compile sering untuk catch errors early
4. **Preview**: Gunakan LaTeX editor dengan live preview
5. **References**: Gunakan reference manager untuk bibliography

---

**Good luck dengan thesis defense! 🎓**