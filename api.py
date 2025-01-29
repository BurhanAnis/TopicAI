from flask import Flask, request, jsonify, send_file
import pandas as pd
from utils import get_topics, categorize_responses

app = Flask(__name__)

topic_labels_store = {}
topic_results_store = {}

@app.route('/upload-csv', methods=['POST'])
def upload_csv():
    try:
        file = request.files['file']
        df = pd.read_csv(file)
        columns = df.columns.tolist()
        return jsonify({'columns': columns}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
@app.route('/get-topics', methods=['POST'])
def lda():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file'}), 400
        
        file = request.files['file']
        df = pd.read_csv(file)
        data = request.form
        column_name = data.get('column_name')

        if column_name not in df.columns:
            return jsonify({'error': 'Column not found'}), 400
        
        nan_id = df[df[column_name].isna()].index
        df = df.drop(index=nan_id)
        if df.empty:
            return jsonify({'error': 'No data after clearning'}), 400
        
        n_topics = int(data['n_topics'])
        n_words = int(data['n_words'])

        topics = get_topics(df[column_name], n_topics, n_words)
        topic_results_store.update(topics)

        return jsonify({'topics': topics}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
@app.route('/save-labels', methods=['POST'])
def save_labels():
    try:
        # Validate request data
        data = request.get_json()
        if not data or 'labels' not in data:
            return jsonify({'error': 'Missing "labels" in request body'}), 400

        topic_labels = data['labels']  # Dictionary mapping topics to labels

        # Ensure labels are correctly formatted
        if not isinstance(topic_labels, dict):
            return jsonify({'error': 'Labels must be a dictionary mapping topics to labels'}), 400

        # Store the labels in memory
        topic_labels_store.update(topic_labels)

        return jsonify({'message': 'Labels saved successfully', 'labels': topic_labels_store}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

@app.route('/categorize-responses', methods=['POST'])
def categoriz():
    try: 
        file = request.files['file']
        df = pd.read_csv(file)
        data = request.form
        column_name = data.get('column_name')
        df = df.dropna(subset=[column_name])
        topics = list(topic_labels_store.values())
        df['Category'] = categorize_responses(df[column_name], topics)
        return jsonify({'data': df.to_dict(orient='records')}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
@app.route('/save-topics-csv', methods=['POST'])
def save_topics_csv():
    """Saves topics from `get-topics` endpoint as a CSV file."""
    try:
        if not topic_results_store:
            return jsonify({'error': 'No topics found. Generate topics first using /get-topics'}), 400

        df = pd.DataFrame(dict([(key, pd.Series(value)) for key, value in topic_results_store.items()]))
        df = df.transpose()
        csv_path = "topics.csv"
        df.to_csv(csv_path, index_label="Topic")
        
        return send_file(csv_path, as_attachment=True, mimetype="text/csv")

    except Exception as e:
        return jsonify({'error': str(e)}), 400
        

@app.route('/get-topic-distribution', methods=['POST'])
def get_topic_distribution():
    """Returns the topic distribution as JSON for frontend chart rendering."""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']
        df = pd.read_csv(file)
        data = request.form
        column_name = data.get('column_name')

        if not column_name or column_name not in df.columns:
            return jsonify({'error': f'Column "{column_name}" not found'}), 400

        df = df.dropna(subset=[column_name])

        if df.empty:
            return jsonify({'error': 'No valid data to process'}), 400

        if not topic_labels_store:
            return jsonify({'error': 'No topic labels saved'}), 400

        topics = list(topic_labels_store.values())
        df['Category'] = categorize_responses(df[column_name], topics)

        # Compute topic distribution
        distribution = df['Category'].value_counts().to_dict()

        return jsonify({'distribution': distribution}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400




