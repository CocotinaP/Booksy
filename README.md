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


---

## Cloneaza Proiectul

```bash
git clone https://github.com/CocotinaP/Booksy.git
cd Booksy/backend
```

---

### Pentru rulare, citeste README.md din folderele de front si back


# Cand te apuci de lucru

---

## 1 Trage ultimele modificări din GitHub

```bash
git pull origin main
pip install -r requirements.txt
```

---

## 2 Lucrează pe un branch nou

```bash
#creare branch
#Folosește branch-uri: `feature/`, `fix/`, `refactor/`
git checkout -b feature/nume-feature


#salveaza modificarile
git add .
git commit -m "feat: scurtă descriere"


#mai tragi inca o data branch-ul  ca sa nu ai merge conflicts
git pull origin main --rebase #s-ar putea sa fie conflicte de rezolvat
#le rezolvi, apoi rulezi(daca nu ai conflicte, nu rulezi):
#============
git rebase --continue
#============


git push origin feature/nume-feature
```

---

## 💡 Sfaturi

- Activează mereu mediul virtual
- Testează local înainte de commit
- Pt backend, testam cu postman API-ul