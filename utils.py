import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.manifold import TSNE
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.metrics.pairwise import cosine_similarity
import argparse 
import time

def display_topics(model, feature_names, no_top_words):
    topics = {}
    for topic_idx, topic in enumerate(model.components_):
        topics[f"Topic {topic_idx+1}"] = [feature_names[i] for i in topic.argsort()[:-no_top_words - 1:-1]]
    return topics


def get_topics(data, n_topics = 5, n_words = 5):
    """
    Perform topic modelling on a given dataset using LatentDirichletAllocation.

    Parameters
    ----------
    data : pandas Series
        The text data to be modelled.
    n_topics : int, optional
        The number of topics to model. Defaults to 5.
    n_words : int, optional
        The number of top words to return for each topic. Defaults to 5.

    Returns
    -------
    topics : dict
        A dictionary where the key is the topic number and the value is a list of
        the top words in that topic.
    """
    vectorizer = TfidfVectorizer(stop_words='english')
    X = vectorizer.fit_transform(data)
    lda = LatentDirichletAllocation(n_components=n_topics, random_state=0)
    lda.fit(X)
    topics = display_topics(lda, vectorizer.get_feature_names_out(), n_words)
    return topics

def get_topic_term_matrix(data, n_topics = 5):
    vectorizer = TfidfVectorizer(stop_words='english')
    X = vectorizer.fit_transform(data)
    lda = LatentDirichletAllocation(n_components=n_topics, random_state=0)
    lda.fit(X)
    return lda.components_

def get_feature_names(data):
    vectorizer = TfidfVectorizer(stop_words='english')
    X = vectorizer.fit_transform(data)
    return vectorizer.get_feature_names_out()


def categorize_responses(responses, topics):
    # Vectorize topics and responses
    vectorizer = TfidfVectorizer()
    topic_vectors = vectorizer.fit_transform(topics)
    response_vectors = vectorizer.transform(responses)

    # Match each response to the closest topic
    categories = []
    for response_vec in response_vectors:
        similarities = cosine_similarity(response_vec, topic_vectors)
        best_match_idx = similarities.argmax()
        categories.append(topics[best_match_idx])

    return categories