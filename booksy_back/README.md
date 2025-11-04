# Booksy
This is a project for the Collective Project subject at the university.

### Problem: 
There are many cases where people are looking for certain books but can't find them anywhere, neither in bookstores or second-hand stores nor in libraries.

### Solution: 
An app through which books can be rented/borrowed.

# Application features:

- user can list the books they rent

- user makes a request for a book they want to borrow

- user searches the list of books already put up for rent

- user searches the list of rental requests

- user searches for a book/author and receives as a result the list of books listed for rent and the list of rental requests

- user makes a request to rent a book to another user (either as someone who wants to borrow someone's book, or as someone who wants to borrow someone's book)

- users can provide feedback/reviews to other users (for trust)

- users can receive medals at different thresholds (e.g.: 10 books rented to someone, 20 books rented from someone)

- users can provide feedback to the rented book (regarding its condition)

- users can create an account in application

- results can be displayed in order of closest locations

# 📚 Booksy — Backend Setup

Ghid rapid pentru configurarea și rularea backend-ului aplicației **Booksy**.

---

## 🚀 Setup rapid

```bash
git clone https://github.com/CocotinaP/Booksy.git
cd Booksy/backend
```

---

## 🐍 Creează mediul virtual

### 💻 Mac / Linux
```bash
python3 -m venv venv
source venv/bin/activate
```

### 🪟 Windows
```bash
python -m venv venv
venv\Scripts\activate
```

---

## 📦 Instalează dependențele

```bash
pip install -r requirements.txt
```

---

## 🗃️ Migrații și bază de date

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## ▶️ Rulează serverul

```bash
python manage.py runserver
```

👉 Aplicația rulează la: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

---

## 🔄 Actualizează proiectul local

```bash
git pull origin main
pip install -r requirements.txt
python manage.py migrate
```

---

## 🌿 Lucrează pe un branch nou

```bash
git checkout -b feature/nume-feature
git add .
git commit -m "feat: scurtă descriere"
git push origin feature/nume-feature
```

---

## ⚠️ Conflicte de merge

```bash
git add .
git commit -m "resolve: merge conflicts"
git pull origin main
```

---

## 💡 Sfaturi

- Activează mereu mediul virtual  
- Testează local înainte de commit  
- Folosește branch-uri: `feature/`, `fix/`, `refactor/`