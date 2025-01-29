import time
from utils import * 


df_file = str(input("Enter the name of the CSV file: "))
df = pd.read_csv(df_file)
print('Uploaded File of Shape: ', df.shape)
time.sleep(1)
print(df.columns)

#allow user to choose what column they want to model
while True:
    try:
        # Prompt user for a column name
        column_name = str(input("Enter the column name: "))
        
        # Check if the column exists
        if column_name not in df.columns:
            raise ValueError(f"Column '{column_name}' does not exist. Please try again.")
        
        # If column exists, break the loop
        print(f"Column '{column_name}' exists!")
        break
    except ValueError as e:
        print(e)

print('Cleaning Data...')
indexes_with_nan = df[df[column_name].isna()].index
# Remove rows with NaN values in the specified column from the whole DataFrame
df = df.drop(index=indexes_with_nan)

time.sleep(1)
n_topics = int(input("How many topics?"))
n_words = int(input("How many words per topic?"))
print(" Starting Topic Modelling...")
topics = get_topics(df[column_name], n_topics, n_words)
#save topics as file
with open('topics.txt', 'w') as f:
    for topic, keywords in topics.items():
        f.write(f"{topic}: {', '.join(keywords)}\n")

print("Topics saved to topics.txt")
print(topics)

user_input = input("Label these topics, separated by commas (topic1, topic2...etc): ")
# Split the input string by commas and strip whitespace from each word
topic_list = [word.strip() for word in user_input.split(",")]


print("Mapping topics onto responses")
df['Category'] = categorize_responses(df[column_name], topic_list)
#save horizontal bar chart to file
df['Category'].value_counts().plot(kind='barh')
plt.title('Response Distribution by Topic')
plt.xlabel('Number of Responses')
plt.ylabel('Topic')
plt.savefig('horizontal_bar_chart.png')
print("Horizontal bar chart saved to horizontal_bar_chart.png")

