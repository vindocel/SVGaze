# SVGaze Wiki Setup Guide

This folder contains pre-made wiki pages for the SVGaze GitHub Wiki.

---

## How to Enable and Setup the Wiki

### Step 1: Enable Wiki on GitHub

1. Go to your repository: https://github.com/vindocel/SVGaze
2. Click **Settings** tab
3. Scroll down to **Features** section
4. Check the box next to **Wikis**
5. Click **Save**

### Step 2: Clone Wiki Repository

The wiki is a separate Git repository. Clone it:

```bash
# Clone the wiki repository
git clone https://github.com/vindocel/SVGaze.wiki.git

# Navigate into it
cd SVGaze.wiki
```

### Step 3: Copy Wiki Files

Copy all files from this `wiki/` folder to the cloned wiki repository:

**Windows:**
```bash
# From the main SVGaze directory
xcopy /E /I wiki\*.md ..\SVGaze.wiki\
```

**macOS/Linux:**
```bash
# From the main SVGaze directory
cp wiki/*.md ../SVGaze.wiki/
```

### Step 4: Push to GitHub

```bash
# Navigate to wiki repository
cd ../SVGaze.wiki

# Add all files
git add .

# Commit
git commit -m "docs: add comprehensive wiki documentation"

# Push to GitHub
git push origin master
```

### Step 5: Verify

1. Go to https://github.com/vindocel/SVGaze/wiki
2. You should see all wiki pages
3. Sidebar navigation should appear
4. Home page should be the landing page

---

## Wiki Pages Included

### Main Pages
- **Home.md** - Wiki home page with navigation
- **Quick-Start.md** - Quick start guide
- **Gallery-Guide.md** - Complete gallery documentation
- **Editor-Guide.md** - Complete editor documentation
- **Categorization.md** - Categorization system guide

### Navigation
- **_Sidebar.md** - Sidebar navigation menu

---

## Customization

### Edit Pages

1. Clone wiki repository (if not already):
   ```bash
   git clone https://github.com/vindocel/SVGaze.wiki.git
   ```

2. Edit markdown files locally

3. Commit and push changes:
   ```bash
   git add .
   git commit -m "docs: update wiki pages"
   git push
   ```

### Add New Pages

1. Create new `.md` file in wiki repository
2. Add link to `_Sidebar.md` for navigation
3. Add link to `Home.md` if needed
4. Commit and push

### Update Links

All internal wiki links use this format:
```markdown
[Link Text](Page-Name)
```

External links use full URLs:
```markdown
[Link Text](https://example.com)
```

---

## Wiki Structure

```
SVGaze.wiki/
├── Home.md                    # Landing page
├── Quick-Start.md             # Quick start guide
├── Gallery-Guide.md           # Gallery documentation
├── Editor-Guide.md            # Editor documentation
├── Categorization.md          # Categorization system
├── _Sidebar.md                # Navigation sidebar
└── [other pages to add]       # Future pages
```

---

## Future Pages to Add

Create these pages as needed:

### User Guides
- Installation.md
- Basic-Usage.md
- Search-and-Filters.md
- Favorites.md
- Export-Formats.md
- SVGO.md
- Transformations.md
- Internationalization.md
- Themes.md
- Color-Picker.md
- Settings.md
- Keyboard-Shortcuts.md

### Developer Docs
- Architecture.md
- API-Reference.md
- Contributing.md
- Code-Style.md
- Testing-Guidelines.md
- Project-Structure.md

### Help
- FAQ.md
- Troubleshooting.md
- Browser-Compatibility.md
- CORS-Errors.md
- Performance-Issues.md

---

## Maintenance

### Keep Wiki Updated

When you update the main repository:

1. Update corresponding wiki pages
2. Keep version numbers in sync
3. Update screenshots if UI changes
4. Add new features to wiki

### Sync with Docs

The `docs/` folder in the main repo should complement the wiki:

- **docs/** - Detailed technical documentation
- **wiki/** - User-friendly guides and tutorials

Keep both in sync but with different audiences in mind.

---

## Troubleshooting

### Can't Clone Wiki

**Problem:** `fatal: repository not found`

**Solution:**
1. Enable wiki in repository settings first
2. Create at least one page via GitHub UI
3. Then clone will work

### Push Rejected

**Problem:** `! [rejected] master -> master (fetch first)`

**Solution:**
```bash
git pull --rebase
git push
```

### Sidebar Not Showing

**Problem:** Sidebar doesn't appear

**Solution:**
1. File must be named exactly `_Sidebar.md`
2. Must be in root of wiki repository
3. Push to GitHub and refresh

---

## Additional Resources

- [GitHub Wiki Documentation](https://docs.github.com/en/communities/documenting-your-project-with-wikis)
- [Markdown Guide](https://guides.github.com/features/mastering-markdown/)
- [SVGaze Main Docs](https://github.com/vindocel/SVGaze/tree/main/docs)

---

## Quick Commands Reference

```bash
# Enable wiki (do via GitHub UI first)

# Clone wiki
git clone https://github.com/vindocel/SVGaze.wiki.git

# Copy files from this folder
cp wiki/*.md ../SVGaze.wiki/

# Navigate to wiki
cd ../SVGaze.wiki

# Add and commit
git add .
git commit -m "docs: add wiki pages"

# Push
git push origin master

# Update existing wiki
cd SVGaze.wiki
git pull
# make changes
git add .
git commit -m "docs: update wiki"
git push
```

---

**Questions?** Open an issue or discussion in the main repository.
