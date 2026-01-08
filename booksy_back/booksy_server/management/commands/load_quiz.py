from django.core.management.base import BaseCommand
from booksy_server.models.quiz import QuizQuestion, QuizAnswerOption
from booksy_server.models.book import Genre


class Command(BaseCommand):
    help = "Load extended quiz questions and answers (15 questions)"

    def handle(self, *args, **kwargs):
        # Ensure genres exist
        genres = {
            "Fantasy": Genre.objects.get_or_create(name="Fantasy")[0],
            "Mystery": Genre.objects.get_or_create(name="Mystery")[0],
            "Romance": Genre.objects.get_or_create(name="Romance")[0],
            "Sci-Fi": Genre.objects.get_or_create(name="Sci-Fi")[0],
            "Non-fiction": Genre.objects.get_or_create(name="Non-fiction")[0],
        }

        quiz_data = [
            {
                "text": "Cum îți petreci o seară perfectă?",
                "options": [
                    ("Explorând lumi magice", "Fantasy"),
                    ("Rezolvând mistere", "Mystery"),
                    ("Vizionând o poveste romantică", "Romance"),
                    ("Gândindu-mă la viitor și tehnologie", "Sci-Fi"),
                ]
            },
            {
                "text": "Ce tip de personaje te atrag cel mai mult?",
                "options": [
                    ("Eroi curajoși și creaturi fantastice", "Fantasy"),
                    ("Detectivi inteligenți și criminali misterioși", "Mystery"),
                    ("Îndrăgostiți care trec prin provocări", "Romance"),
                    ("Oameni de știință, exploratori ai spațiului", "Sci-Fi"),
                ]
            },
            {
                "text": "Ce emoție cauți într-o carte?",
                "options": [
                    ("Uimire și aventură", "Fantasy"),
                    ("Suspans și tensiune", "Mystery"),
                    ("Căldură și emoție", "Romance"),
                    ("Curiozitate intelectuală", "Non-fiction"),
                ]
            },
            {
                "text": "Ce ai prefera să citești într-o vacanță?",
                "options": [
                    ("O poveste epică", "Fantasy"),
                    ("Un thriller captivant", "Mystery"),
                    ("O poveste de dragoste relaxantă", "Romance"),
                    ("O carte care mă învață ceva nou", "Non-fiction"),
                ]
            },
            {
                "text": "Ce lume te fascinează cel mai mult?",
                "options": [
                    ("Regate magice și creaturi legendare", "Fantasy"),
                    ("Orașe pline de secrete", "Mystery"),
                    ("Locuri romantice și povești de suflet", "Romance"),
                    ("Planete îndepărtate și viitorul omenirii", "Sci-Fi"),
                ]
            },
            {
                "text": "Ce tip de final preferi?",
                "options": [
                    ("O victorie eroică", "Fantasy"),
                    ("O rezolvare inteligentă a misterului", "Mystery"),
                    ("Un final fericit", "Romance"),
                    ("Un final deschis care te pune pe gânduri", "Sci-Fi"),
                ]
            },
            {
                "text": "Ce te motivează să continui o carte?",
                "options": [
                    ("Lumea fascinantă", "Fantasy"),
                    ("Intriga și suspansul", "Mystery"),
                    ("Relațiile dintre personaje", "Romance"),
                    ("Ideile noi și conceptele interesante", "Non-fiction"),
                ]
            },
            {
                "text": "Ce tip de conflict te atrage?",
                "options": [
                    ("Bine vs. rău", "Fantasy"),
                    ("Detectiv vs. criminal", "Mystery"),
                    ("Inimă vs. rațiune", "Romance"),
                    ("Om vs. tehnologie", "Sci-Fi"),
                ]
            },
            {
                "text": "Ce ai prefera să explorezi?",
                "options": [
                    ("O lume magică", "Fantasy"),
                    ("O crimă complicată", "Mystery"),
                    ("O poveste de iubire", "Romance"),
                    ("O civilizație extraterestră", "Sci-Fi"),
                ]
            },
            {
                "text": "Ce te inspiră cel mai mult?",
                "options": [
                    ("Curajul și sacrificiul", "Fantasy"),
                    ("Inteligența și logica", "Mystery"),
                    ("Empatia și emoția", "Romance"),
                    ("Inovația și progresul", "Sci-Fi"),
                ]
            },
            {
                "text": "Ce tip de ritm preferi într-o carte?",
                "options": [
                    ("Aventură constantă", "Fantasy"),
                    ("Tensiune crescândă", "Mystery"),
                    ("Dezvoltare emoțională lentă", "Romance"),
                    ("Idei complexe și explicații", "Non-fiction"),
                ]
            },
            {
                "text": "Ce te atrage într-o copertă de carte?",
                "options": [
                    ("Simboluri magice", "Fantasy"),
                    ("Elemente întunecate și enigmatice", "Mystery"),
                    ("Culori calde și romantice", "Romance"),
                    ("Design minimalist și futurist", "Sci-Fi"),
                ]
            },
            {
                "text": "Ce ai prefera să înveți dintr-o carte?",
                "options": [
                    ("Lecții despre curaj", "Fantasy"),
                    ("Cum funcționează mintea umană", "Mystery"),
                    ("Cum iubesc oamenii", "Romance"),
                    ("Cum funcționează lumea", "Non-fiction"),
                ]
            },
            {
                "text": "Ce te face să te atașezi de un personaj?",
                "options": [
                    ("Puterile sau destinul său", "Fantasy"),
                    ("Inteligența și deducția", "Mystery"),
                    ("Vulnerabilitatea și emoțiile", "Romance"),
                    ("Gândirea inovatoare", "Sci-Fi"),
                ]
            },
            {
                "text": "Ce atmosferă preferi într-o poveste?",
                "options": [
                    ("Mistică și magică", "Fantasy"),
                    ("Întunecată și tensionată", "Mystery"),
                    ("Caldă și emoțională", "Romance"),
                    ("Rece, tehnologică și futuristă", "Sci-Fi"),
                ]
            },
        ]

        # Insert into DB
        for q_data in quiz_data:
            question = QuizQuestion.objects.create(text=q_data["text"])
            for option_text, genre_name in q_data["options"]:
                QuizAnswerOption.objects.create(
                    question=question,
                    text=option_text,
                    genre=genres[genre_name],
                    weight=1
                )

        self.stdout.write(self.style.SUCCESS("Extended 15-question quiz loaded successfully!"))
