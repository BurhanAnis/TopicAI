import streamlit as st
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation

# Function to perform LDA
def perform_lda(text_data, num_topics=5):
    vectorizer = CountVectorizer(stop_words='english')
    text_matrix = vectorizer.fit_transform(text_data)
    lda_model = LatentDirichletAllocation(n_components=num_topics, random_state=42)
    lda_model.fit(text_matrix)
    topics = lda_model.components_
    feature_names = vectorizer.get_feature_names_out()
    topic_keywords = []
    for topic_weights in topics:
        top_keywords = [feature_names[i] for i in topic_weights.argsort()[-10:]]
        topic_keywords.append(top_keywords)
    return topic_keywords, lda_model.transform(text_matrix)

# Initialize session state
if "topic_labels" not in st.session_state:
    st.session_state.topic_labels = {}

if "doc_topic_matrix" not in st.session_state:
    st.session_state.doc_topic_matrix = None

if "topics" not in st.session_state:
    st.session_state.topics = None

# Streamlit App
st.title("NLP Topic Modeling Demo")
st.write("Upload your CSV file, select a column with text data, and analyze topics using LDA.")

# File upload
uploaded_file = st.file_uploader("Upload CSV", type=["csv"])

if uploaded_file:
    df = pd.read_csv(uploaded_file)
    st.write("Preview of Uploaded Data:")
    st.dataframe(df.head())

    # Column selection
    column_name = st.selectbox("Select the column with text data:", df.columns)

    if column_name:
        # Run LDA Analysis
        if st.button("Run LDA Analysis"):
            text_data = df[column_name].dropna().astype(str).tolist()
            topics, doc_topic_matrix = perform_lda(text_data)

            # Store results in session state
            st.session_state.topics = topics
            st.session_state.doc_topic_matrix = doc_topic_matrix

            # Initialize default labels if not already set
            if not st.session_state.topic_labels:
                st.session_state.topic_labels = {i: f"Topic {i + 1}" for i in range(len(topics))}

        # Ensure topics are displayed if they exist
        if "topics" in st.session_state and st.session_state.topics:
            st.write("Identified Topics and Keywords:")
            for i, keywords in enumerate(st.session_state.topics):
                st.write(f"Topic {i + 1}: {', '.join(keywords)}")

        # Assign Custom Labels
        if "topics" in st.session_state and st.session_state.topics:
            st.write("Assign Custom Labels to Topics:")
            for i, keywords in enumerate(st.session_state.topics):
                st.session_state.topic_labels[i] = st.text_input(
                    f"Label for Topic {i + 1}:",
                    value=st.session_state.topic_labels.get(i, f"Topic {i + 1}"),
                    key=f"label_input_{i}"
                )

            # Save labels button
            if st.button("Save Labels"):
                st.success("Labels saved successfully!")

        # Backward Analysis
        if st.button("Map Responses to Topics"):
            # Ensure LDA has been run
            if st.session_state.doc_topic_matrix is None or st.session_state.topics is None:
                st.error("Please run LDA analysis first.")
            elif not all(st.session_state.topic_labels.values()):
                st.error("Please assign labels to all topics before running the analysis.")
            else:
                # Initialize an empty column for Topic_Label
                response_labels = [None] * len(df)

                # Get non-NA rows and assign labels
                non_na_indices = df[column_name].dropna().index
                for idx, doc_topics in zip(non_na_indices, st.session_state.doc_topic_matrix):
                    dominant_topic = doc_topics.argmax()
                    response_labels[idx] = st.session_state.topic_labels.get(
                        dominant_topic, f"Topic {dominant_topic + 1}"
                    )

                df["Topic_Label"] = response_labels

                # Show Distribution
                st.write("Response Distribution by Topic:")
                distribution = df["Topic_Label"].value_counts(dropna=True)
                st.bar_chart(distribution)

                # Display Updated DataFrame
                st.write("Labeled Data:")
                st.dataframe(df)
