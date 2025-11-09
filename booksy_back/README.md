# Booksy — Backend Setup

Ghid rapid pentru configurarea și rularea backend-ului aplicației **Booksy**.

---

## 1 Creeaza si activeaza mediul virtual (venv)

```bash
python -m venv venv
#e un exe care trebuie rulat
venv\Scripts\activate
```

---

## 2 Instalează dependențele

```bash
pip install -r requirements.txt
```

---

## 3 Aplică migrațiile bazei de date

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 4 Creaza un superuser

```bash
python manage.py createsuperuser
```

## 5 Rulează serverul

```bash
python manage.py runserver
```

---
