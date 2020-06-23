# created by Saif
# Evaluates answers on the basis of pre defined tests
import numpy as np
import time
import loading_functions as lf
import helping_functions as hf

# Takes List of List as inputs and returns the list of % matching for every answer
def call_this(lisss):

    counter=0
    big_var=lisss
    res=[]
    while counter<len(big_var) :
        
        #test to find % of keywords present
        def test1() :                
            hit=0
            for keyword in key_text :
                for word in ans_text :
                    if word.lower()==keyword :
                        hit=hit+1
                        break
            accuracy=(hit/(len(key_text)-synonyms-1))
            if accuracy > 1.0 :
                accuracy=1.0
            grad_vec[0]=accuracy

        #test 2 to find avg of min distance of keywords and answer words
        def test2() :      
            summ=0
            j=0
            for keyword_vec in key_vecs :
                absmin=hf.vector_distance(ans_vec[0],keyword_vec)
                i=0
                min_index=0
                for answ in ans_vec :
                    temp_distance=hf.vector_distance(answ,keyword_vec)
                    if temp_distance<absmin :
                        absmin=temp_distance
                        min_index=i
                    i=i+1
                j=j+1
                summ=summ+absmin
            grad_vec[1]=(summ/len(key_vecs))

        #function to calculate avg exact similarities between key sentence words and answer sentence words
        def test4() :
            aggr=0.0
            for l1 in sens_text :
                w1=l1.split()
                max_match=0.0
                for l2 in ans_sent_text :
                    w2=l2.split()
                    common_words=[]
                    for w3 in w1 :
                        if w3 in w2 :
                            common_words.append(w3)
                    current_match=len(common_words)/len(w1)
                    if current_match>max_match :
                        max_match=current_match
                aggr=aggr+max_match
            grad_vec[2]=(aggr/len(sens_text))

        #low level intelligence funtion for catching anomalies in Neural Network output and setting thresholds
        def test6(match) :
            p1,p2,p3=(grad_vec[0],grad_vec[1],grad_vec[2])

            # Catching anamolies
            if p1<=0.2 and match>=0.8 and p3<=0.2 :
                match=0.0
            if p1==1.0 and p3==1.0 :
                match=1
            if p1==0.0 and p3==0.0 and p2>3.0:
                match=0.0
            if p1<0.15 and p3<0.15 and p2>5.0 :
                if p2>7.5 :
                    match=0.0
                else :
                    match=0.1

            # Setting thresholds
            if match>0.85 :
                match=1
            elif match <=0.85 and match>0.8 :
                match=0.9
            elif match<=0.8 and match>0.7 :
                match=0.8
            elif match<=0.7 and match>0.6 :
                match=0.7
            elif match<=0.6 and match>0.5 :
                match=0.6
            elif match<=0.5 and match>0.4 :
                match=0.5
            elif match<=0.4 and match>0.3 :
                match=0.4
            elif match<=0.3 and match>0.2 :
                match=0.3
            elif match<=0.2 and match>0.1 :
                match=0.2
            elif match<=0.1 and match>0.05 :
                match=0.1
            else :
                match=0.0

            if p1==0.0 and p3==0.0 :
                match=0.0
            return match
            





        #calling function to load the sets in respected text files
        lf.load_for_testing(big_var[counter])       
        
        if len(big_var[counter][2])==0 :
            res.append(0.0)
            counter=counter+1
            continue
        counter=counter+1
        grad_vec=[0.0, 0.0, 0.0]

        # Loading data into local variables
        ans_text ,ans_text_filt, ans_vec, ans_sent_text, ans_sent_vect, key_text, key_text_filt, key_vecs, synonyms, sens_text, sens_vect =lf.load_all()

        test1()
        try :
            test2()
        except :
            grad_vec=[0.0,50.0,0.0]
        test4()

        temp_vector=np.zeros((3,1))
        for i in range(3) :
            temp_vector[i][0]=grad_vec[i]

        # Moderating setting parameter
        if temp_vector[1]>3.0 and temp_vector[1]<4.0 :
            temp_vector[1]=temp_vector[1]-1.20
        elif temp_vector[1]>4.0 and temp_vector[1]<5.0 :
            temp_vector[1]=temp_vector[1]-1.70
        elif temp_vector[1]>5.0 and temp_vector[1]<6.0 :
            temp_vector[1]=temp_vector[1]-2.20
        elif temp_vector[1]>6.0 and temp_vector[1]<7.0 :
            temp_vector[1]=temp_vector[1]-2.70
        elif temp_vector[1]>7.0 and temp_vector[1]<8.0 :
            temp_vector[1]=temp_vector[1]-3.20
        elif temp_vector[1]>8.0 and temp_vector[1]<9.0 :
            temp_vector[1]=temp_vector[1]-3.70
        elif temp_vector[1]>9.0 and temp_vector[1]<10.0 :
            temp_vector[1]=temp_vector[1]-4.20
        raw_match=hf.predict_matching(temp_vector)
        if temp_vector[0] == 0.0 and temp_vector[1] == 0.0 and temp_vector[2] == 0.0 :
            res.append(0.0)
        else :
            res.append(test6(raw_match))
    
    return res
