import gensim
import nltk
import numpy as np 
import scipy

model = gensim.models.KeyedVectors.load_word2vec_format('GoogleNews-vectors-negative300.bin.gz', binary=True,limit=500000)




def preprocess(sentence):
    sentence = sentence.lower()
    tokenizer = nltk.RegexpTokenizer(r"\w+")
    new_words = tokenizer.tokenize(sentence)
    return new_words



def average_vec(sentence):
    n = len(sentence)
    present_words = []
    for word in sentence:
        if(word in model.vocab):
            present_words.append(word)
    avg = np.mean([model[word] for word in present_words],axis=0)
    return avg


#list passed here
def give_similarity(answers):
    distance = [100000 for i in range(len(answers))]
    closest = [i for i in range(len(answers))]
    for i in range(len(answers)):
        for j in range(len(answers)):
            if(i!=j):
                sentence1 = preprocess(answers[i])
                sentence2 = preprocess(answers[j])
                avg_1 = average_vec(sentence1)
                avg_2 = average_vec(sentence2)
                dist = scipy.spatial.distance.cosine(avg_1,avg_2)
                if(dist<distance[i]):
                    distance[i] = dist
                    closest[i] = j
    return(distance,closest)



def similarity(distances):
    sim = [0 for i in range(len(distances))]
    for i in range(len(distances)):
        sim[i] = 1 - distances[i]
    return sim


answers = ['my name is a','my name is a','my name is b','Obama speaks to the press','Obama spoke to the press']

dist,clo = give_similarity(answers)

print(similarity(dist))

print(clo)
