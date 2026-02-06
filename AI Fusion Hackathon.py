import streamlit as st
from openai import OpenAI

client = OpenAI(api_key="YOUR_API_KEY")

st.title("AI Study Buddy 📚")
topic = st.text_input("Enter a topic (e.g., JavaScript loops):")

if st.button("Generate Study Material"):
    if topic:
        # Flashcards
        flashcards = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role":"user","content":f"Create 5 flashcards on {topic} with Q&A format"}]
        )
        st.subheader("Flashcards")
        st.write(flashcards.choices[0].message.content)

        # Quiz
        quiz = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role":"user","content":f"Generate a 3-question multiple-choice quiz on {topic} with answers"}]
        )
        st.subheader("Quiz")
        st.write(quiz.choices[0].message.content)

        # Bilingual Explanation
        bilingual = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role":"user","content":f"Explain {topic} in English and Hindi with simple analogies"}]
        )
        st.subheader("Bilingual Explanation")
        st.write(bilingual.choices[0].message.content)