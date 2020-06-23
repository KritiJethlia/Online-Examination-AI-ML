# created by Pranay
# Checks plagiarism between answers of students

# importing Natural Language tool kit for natural language processing
import nltk

# Removes the punctuation from the sentences
def preprocess(sentence):
    sentence = sentence.lower()
    tokenizer = nltk.RegexpTokenizer(r"\w+")
    new_words = tokenizer.tokenize(sentence)
    return new_words

# Compares two sentences of two different answers
def compare(words1,words2):
    max_count = 0
    for i in range(len(words1)):
        for j in range(len(words2)):
            if(words1[i]==words2[j]):
                temp_i = i
                temp_j = j
                count = 0
                while(words1[temp_i]==words2[temp_j]):
                    count = count + 1
                    temp_i = temp_i + 1
                    temp_j = temp_j + 1
                    if(temp_i>=len(words1)):
                        break
                    if(temp_j>=len(words2)):
                        break
                if(count>max_count and count>1):
                    max_count = count
    return max_count

# Takes List of answers and returns plagiarism level and most similar answers
def check_sim(answers):
    n = len(answers)
    sim = [0 for i in range(0,n)]
    check = [i for i in range(0,n)]
    for i in range(n):
        for j in range(n):
            if(i!=j and answers[i]!='' and answers[j]!=''):
                sentences1 = answers[i].split('.')
                sentences2 = answers[j].split('.')
                sentence_similarities = [0 for i in range(len(sentences1))]
                for k in range(len(sentences1)):
                    sentence1_words = preprocess(sentences1[k])
                    for l in range(len(sentences2)):
                        sentence2_words = preprocess(sentences2[l])
                        if(len(sentence1_words)>0) :
                            max_similarity = compare(sentence1_words,sentence2_words)/len(sentence1_words)
                        if(max_similarity>sentence_similarities[k]):
                            sentence_similarities[k] = max_similarity
                temp_avg = sum(sentence_similarities)/len(sentence_similarities)
                if(temp_avg>sim[i]):
                    sim[i] = temp_avg
                    check[i] = j
    return (sim,check)


