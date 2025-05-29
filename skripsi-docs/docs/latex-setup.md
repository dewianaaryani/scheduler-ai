# 📄 LaTeX Setup untuk Skripsi Gunadarma

## 🎯 Keunggulan LaTeX vs Word/Pandoc

### ✅ **Advantages of LaTeX:**
- **Precise formatting control** sesuai exact requirements Gunadarma
- **Automatic numbering** untuk chapters, sections, figures, tables
- **Professional typography** dengan Times New Roman yang proper
- **Consistent formatting** tanpa manual adjustment
- **Superior bibliography management** dengan BibTeX
- **Cross-references** yang automatic dan accurate
- **Version control friendly** (text-based format)

### 📊 **Format Compliance:**
| Requirement | Word/Pandoc | LaTeX |
|-------------|-------------|-------|
| Font: Times New Roman 12pt | ⚠️ Manual | ✅ Automatic |
| Margins: 4-3-4-3 cm | ⚠️ Manual | ✅ Automatic |
| Line spacing: 1.5 | ⚠️ Manual | ✅ Automatic |
| Page numbering | ⚠️ Manual | ✅ Automatic |
| Chapter formatting | ⚠️ Manual | ✅ Automatic |
| Bibliography style | ⚠️ Manual | ✅ Automatic |

## 🛠️ Installation Requirements

### **macOS:**
```bash
# Install LaTeX distribution
brew install --cask mactex

# Install pandoc (if not already installed)
brew install pandoc

# Verify installation
latex --version
pdflatex --version
```

### **Alternative: Lightweight LaTeX:**
```bash
# For smaller installation
brew install --cask basictex
sudo tlmgr update --self
sudo tlmgr install collection-fontsrecommended
sudo tlmgr install collection-latex
```

## 📁 File Structure

```
skripsi-docs/
├── skripsi-template.tex           # Main LaTeX template
├── SKRIPSI-FINAL-FORMATTED.md     # Source content
├── convert-to-latex.sh            # Conversion script
├── bib/
│   └── references.bib             # Bibliography database
├── images/
│   ├── logo-gunadarma.png
│   ├── system-architecture.png
│   └── performance-charts.png
└── output/
    ├── skripsi-template.pdf       # Final PDF
    └── skripsi-template.tex       # Generated LaTeX
```

## 🎨 Template Features

### **1. Exact Gunadarma Compliance:**
```latex
% Margins: Top 4cm, Bottom 3cm, Left 4cm, Right 3cm
\\usepackage[top=4cm,bottom=3cm,left=4cm,right=3cm]{geometry}

% Times New Roman font
\\usepackage{times}

% 1.5 spacing
\\onehalfspacing
```

### **2. Automatic Chapter Formatting:**
```latex
% BAB format: 14pt, Bold, UPPERCASE, Center
\\titleformat{\\chapter}[display]
  {\\normalfont\\large\\bfseries\\centering}
  {\\MakeUppercase{\\chaptertitlename\\ \\thechapter}}
  {0pt}
  {\\large\\MakeUppercase}
```

### **3. Page Numbering:**
```latex
% Roman for preliminary pages
\\pagenumbering{roman}

% Arabic for content pages
\\pagenumbering{arabic}
```

### **4. Code Listings:**
```latex
% Syntax highlighting untuk code
\\lstset{
  basicstyle=\\footnotesize\\ttfamily,
  backgroundcolor=\\color{gray!10},
  frame=single,
  numbers=left,
  breaklines=true
}
```

## 🚀 Usage Instructions

### **Method 1: Automated Script**
```bash
# Run conversion script
./convert-to-latex.sh

# Output: skripsi-template.pdf
```

### **Method 2: Manual LaTeX Compilation**
```bash
# Compile LaTeX to PDF
pdflatex skripsi-template.tex
pdflatex skripsi-template.tex  # Run twice for cross-refs

# View PDF
open skripsi-template.pdf
```

### **Method 3: Pandoc + LaTeX Template**
```bash
# Convert markdown to LaTeX with custom template
pandoc SKRIPSI-FINAL-FORMATTED.md \\
  --template=skripsi-template.tex \\
  -o skripsi-output.tex

# Compile to PDF
pdflatex skripsi-output.tex
```

## 📝 Content Integration

### **Automatic Content Insertion:**
Template sudah include placeholder untuk:
- ✅ Halaman judul dengan format exact
- ✅ Lembar pengesahan template
- ✅ Abstrak Indonesia & English
- ✅ Kata pengantar template
- ✅ Daftar isi automatic
- ✅ Daftar tabel & gambar automatic
- ✅ Bibliography dengan proper formatting

### **Adding Full Content:**
```latex
% Include content dari markdown conversion
\\input{bab1-pendahuluan}
\\input{bab2-tinjauan-pustaka}
\\input{bab3-metode-penelitian}
\\input{bab4-hasil-pembahasan}
\\input{bab5-penutup}
```

## 🎯 Benefits for Thesis

### **1. Professional Output:**
- **Perfect formatting** compliance dengan Gunadarma standards
- **Consistent typography** throughout document
- **High-quality PDF** output untuk submission

### **2. Time Saving:**
- **No manual formatting** adjustments needed
- **Automatic numbering** untuk everything
- **Easy updates** without breaking layout

### **3. Academic Standards:**
- **Proper bibliography** formatting
- **Cross-references** yang accurate
- **Professional tables** dan figures

## 📊 Comparison Summary

| Aspect | LaTeX | Word + Manual | Pandoc |
|--------|-------|---------------|--------|
| **Setup Time** | Medium | Low | Low |
| **Learning Curve** | Medium | Low | Low |
| **Format Precision** | Excellent | Manual | Good |
| **Consistency** | Excellent | Manual | Good |
| **Bibliography** | Excellent | Manual | Good |
| **Final Quality** | Excellent | Variable | Good |
| **Maintenance** | Low | High | Medium |

## 🎓 Recommendation

**For Dewiana's thesis:** LaTeX is **highly recommended** because:

1. ✅ **Perfect compliance** dengan exact Gunadarma requirements
2. ✅ **Professional appearance** untuk academic submission  
3. ✅ **Time-saving** untuk final formatting
4. ✅ **Future-proof** untuk revisions dan updates
5. ✅ **Industry standard** untuk academic documents

**Next steps:**
1. Install MacTeX: `brew install --cask mactex`
2. Run conversion script: `./convert-to-latex.sh`
3. Review and customize template as needed
4. Compile final PDF untuk submission

LaTeX akan memberikan hasil yang **significantly better** dibanding Word manual formatting! 🎯✨