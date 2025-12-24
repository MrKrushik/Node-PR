# 🏛️ Antique Treasures - Timeless Collections

A modern web application for managing and showcasing antique items with a beautiful UI and smooth animations.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Routes](#routes)
- [Usage](#usage)
- [File Descriptions](#file-descriptions)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

✅ **Antique Management System**
- Add new antique items
- Edit existing items
- Delete items
- View all antiques in a beautiful table

✅ **Beautiful UI/UX**
- Modern dark theme with cyan accents
- Smooth animations and transitions
- Responsive design (mobile, tablet, desktop)
- Professional 404 error page
- Interactive buttons with hover effects

✅ **Security**
- Query parameter-based access control
- Middleware authentication
- Protected routes

✅ **Database Integration**
- MongoDB connection
- Antique model with all fields
- CRUD operations

---

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js
- EJS (Template Engine)
- MongoDB
- Mongoose ODM

**Frontend:**
- HTML5
- CSS3 (Gradient, Animations, Flexbox)
- JavaScript (Vanilla)
- Bootstrap 5

**Tools:**
- Nodemon (for development)
- Git

---

## 📥 Installation

### Prerequisites
- Node.js (v12 or higher)
- MongoDB (local or cloud)
- Git

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd antique-treasures
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file** (if needed)
```
PORT=8780
MONGODB_URI=mongodb://localhost:27017/antique-treasures
```

4. **Create database config**
Create `config/db.config.js`:
```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/antique-treasures', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully!');
});

mongoose.connection.on('error', (err) => {
    console.log('MongoDB connection error:', err);
});
```

5. **Create antique model**
Create `model/antique.model.js`:
```javascript
const mongoose = require('mongoose');

const antiqueSchema = new mongoose.Schema({
    antique_name: String,
    antique_age: Number,
    antique_price: Number,
    antique_category: String,
    antique_image: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Antique', antiqueSchema);
```

6. **Start the server**
```bash
npm start
```
or with nodemon:
```bash
nodemon server.js
```

---

## 📁 Project Structure

```
antique-treasures/
├── config/
│   └── db.config.js                 # MongoDB connection
├── model/
│   └── antique.model.js             # Antique schema
├── views/
│   ├── index.ejs                    # Home page
│   ├── addpage.ejs                  # Add antique page
│   ├── editpage.ejs                 # Edit antique page
│   └── 404.ejs                      # 404 error page
├── style/
│   ├── index.css                    # Home page styling
│   ├── addpage.css                  # Add page styling
│   └── 404.css                      # 404 page styling
├── server.js                        # Main server file
├── package.json                     # Dependencies
└── README.md                        # This file
```

---

## ⚙️ Configuration

### Server Port
Default: `8780`

Change in `server.js`:
```javascript
const PORT = 8780;
```

### Middleware Authentication
Query parameter required: `?name=krushik`

Example: `http://localhost:8780/?name=krushik`

To change the password, modify in `server.js`:
```javascript
if (req.query.name === "krushik") {  // Change "krushik" to your password
    next();
}
```

---

## 🛣️ Routes

### Public Routes (No Authentication)
| Route | Method | Description |
|-------|--------|-------------|
| `/404` | GET | 404 error page |
| `/addantiquePage` | GET | Add antique form page |
| `/addantique` | POST | Add antique to database |
| `/editantique/:id` | GET | Edit antique form page |
| `/updateantique` | POST | Update antique in database |
| `/deleteantique` | GET | Delete antique from database |

### Protected Routes (Require Authentication)
| Route | Method | Description | Requirement |
|-------|--------|-------------|-------------|
| `/` | GET | Home page with antiques list | `?name=krushik` |

### 404 Route
| Route | Method | Description |
|-------|--------|-------------|
| `*` (any undefined route) | ANY | Catch-all 404 page |

---

## 🚀 Usage

### 1. Access Home Page
Navigate to: `http://localhost:8780/?name=krushik`

You'll see:
- Header with navigation
- Antiques collection table
- Add, Edit, Delete buttons
- Contact section
- Footer

### 2. Add New Antique
1. Click **"+ Add New antique"** button
2. Fill in the form:
   - Antique Item Name (e.g., "Jay Hind")
   - Antique Age (e.g., 200)
   - Price in ₹ (e.g., 80000)
   - Category (Furniture, Jewelry, Coins, etc.)
   - Image URL Link
3. Click **"Submit antique Details"**
4. Redirected to home page with new item added

### 3. Edit Antique
1. On home page, click **"Edit"** button on any item
2. Form opens with current data pre-filled
3. Make changes
4. Click **"Save Changes"**
5. Redirected to home page with updated data

### 4. Delete Antique
1. On home page, click **"Delete"** button on any item
2. Item deleted immediately
3. Redirected to home page

### 5. 404 Page
Access any invalid URL:
- `http://localhost:8780/xyz`
- `http://localhost:8780/invalid`

You'll see:
- Beautiful 404 page with animations
- Rotating spaceman SVG
- Twinkling stars background
- **"🚀 Go to Home"** button → Home page
- **"← Go Back"** button → Previous page

---

## 📄 File Descriptions

### `server.js`
Main Express server file containing:
- All routes (GET, POST)
- Middleware setup
- Database connection
- Error handling
- Server listening on port 8780

### `views/index.ejs`
Home page with:
- Header with navigation
- Antiques collection table
- Add button
- Edit/Delete buttons
- Premium collection showcase
- Contact section
- Footer

### `views/addpage.ejs`
Add antique form with:
- Left side: Colored design with emoji
- Right side: Form with all fields
- Input validation
- Submit button
- Back to home link

### `views/editpage.ejs`
Edit antique form with:
- Pre-filled form fields
- Hidden ID field
- Save changes button
- Cancel/Go back link

### `views/404.ejs`
404 error page with:
- Animated background
- Twinkling stars
- Floating 404 text
- Rotating spaceman SVG
- Glow effects
- Two action buttons
- Mouse parallax effect

### `style/index.css`
Home page styling with:
- Modern dark theme
- Cyan (#00d4ff) accent color
- Table styling with hover effects
- Button animations
- Responsive grid layout
- Card designs

### `style/addpage.css`
Add/Edit page styling with:
- Split layout (left design, right form)
- Floating animations
- Form input styling
- Button hover effects
- Responsive design

### `style/404.css`
404 page styling with:
- Gradient background animation
- Twinkling star animation
- Floating 404 text animation
- Button styling with hover effects
- Pulse animation for glow effects
- Mobile responsive

---

## 🔧 Troubleshooting

### Problem: "404 page showing on home"
**Solution:** Add query parameter in URL
```
http://localhost:8780/  ❌ (404)
http://localhost:8780/?name=krushik  ✅ (Home page)
```

### Problem: "Add button not opening add page"
**Solution:** Make sure you're on home page with query parameter first
```
http://localhost:8780/?name=krushik
```

### Problem: "Form not submitting"
**Solution:** Check form field names match exactly:
- `antique_name`
- `antique_age`
- `antique_price`
- `antique_category`
- `antique_image`

### Problem: "Database connection error"
**Solution:** 
1. Check MongoDB is running
2. Verify connection string in `db.config.js`
3. Check network connectivity

### Problem: "CSS not loading"
**Solution:** 
1. Verify files in `style/` folder
2. Check file names match exactly in HTML
3. Hard refresh browser (Ctrl+Shift+R)

### Problem: "Images not loading in table"
**Solution:** 
1. Use valid image URLs (http:// or https://)
2. Check URL is accessible
3. Try different image URL

---

## 📝 Example Data

### Add Antique Example
```
Name: Jay Hind
Age: 200 years
Price: ₹80,000
Category: Jewelry
Image: https://example.com/image.jpg
```

### Categories Available
- 🪑 Furniture
- 💍 Jewelry
- 🪙 Coins
- 🖼️ Paintings
- ⏰ Clocks
- 🗿 Sculptures

---

## 🎨 Design Features

### Color Scheme
| Color | Use |
|-------|-----|
| #00d4ff (Cyan) | Primary buttons, links, accents |
| #0a0e27 (Dark) | Background |
| #ffb700 (Gold) | Category badges |
| #ff006e (Pink) | Delete buttons, highlights |
| #06ffa5 (Green) | Add buttons, success states |

### Animations
- ✨ Floating 404 text
- ⭐ Twinkling stars
- 🌀 Rotating spaceman
- 💫 Pulsing glow effects
- 🖱️ Mouse parallax

---

## 📞 Support

For issues or questions:
1. Check Troubleshooting section
2. Verify all files are in correct folders
3. Check browser console for errors (F12)
4. Check server console for backend errors

---

## 📜 License

This project is open source and available for educational purposes.

---

## 👨‍💻 Author

Built with ❤️ for Antique Treasures Management

**Enjoy!** 🚀✨