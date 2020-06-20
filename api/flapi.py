import json
import copy
from flask import Flask,request,jsonify
from flask_cors import CORS
from bson import ObjectId
from flask_pymongo import pymongo
from pymongo import MongoClient 
import loading_functions as lf
import helping_functions as hf
import numpy as np
# from ev import *

client = pymongo.MongoClient("mongodb+srv://onlineexam:wipro@ps-ee5gl.mongodb.net/Questions?retryWrites=true&w=majority")
db = client.Questions
user_collection = pymongo.collection.Collection(db,'user_collection')
# CheckList=[]

app=Flask(__name__)
CORS(app)
app.config["DEBUG"]= True

@app.route('/ans', methods=['POST'])
def readans():
    req_data = request.get_json()
    # print(req_data)
    ans = json.loads(req_data['ans'])
    qid = json.loads(req_data['ques'])
    CheckList=[]
    for (ids,a) in zip(qid,ans) :
        templist=[]
        ques=db.Questions.find_one({'_id' : ObjectId(str(ids))})
        templist.append(ques["keywords"])
        templist.append(ques["keysentences"])
        templist.append(a)
        CheckList.append(templist)
        # Over here we need the evaluate function and checlist is the big var in evaluate
    # counter=0
    # while counter<len(CheckList) :
    #     lf.load_for_testing(CheckList[counter])       #calling function to load the sets in respected text files
    #     counter=counter+1

    #     ans_text ,ans_text_filt, ans_vec, ans_sent_text, ans_sent_vect, key_text, key_text_filt, key_vecs, synonyms, sens_text, sens_vect =lf.load_all()
    #     grad_vec=[0.0, 0.0, 0.0]
    #     ev.test1()
    #     ev.test2()
    #     ev.test4()
    #     temp_vector=np.zeros((3,1))
    #     for i in range(3) :
    #         temp_vector[i][0]=grad_vec[i]
    #     if temp_vector[1]>3.0 and temp_vector[1]<4.0 :
    #         temp_vector[1]=temp_vector[1]-1.20
    #     elif temp_vector[1]>4.0 and temp_vector[1]<5.0 :
    #         temp_vector[1]=temp_vector[1]-1.70
    #     elif temp_vector[1]>5.0 and temp_vector[1]<6.0 :
    #         temp_vector[1]=temp_vector[1]-2.20
    #     elif temp_vector[1]>6.0 and temp_vector[1]<7.0 :
    #         temp_vector[1]=temp_vector[1]-2.70
    #     elif temp_vector[1]>7.0 and temp_vector[1]<8.0 :
    #         temp_vector[1]=temp_vector[1]-3.20
    #     elif temp_vector[1]>8.0 and temp_vector[1]<9.0 :
    #         temp_vector[1]=temp_vector[1]-3.70
    #     elif temp_vector[1]>9.0 and temp_vector[1]<10.0 :
    #         temp_vector[1]=temp_vector[1]-4.20
    #         #print("Time for doing calculations:",time.time()-t0)
    #     raw_match=hf.predict_matching(temp_vector)
    #     print("Matching in question",counter,":",ev.test6(raw_match))
    # print(CheckList[0][0][0])
    return jsonify(ans)


@app.route("/enterQuestions" ,methods=['POST'])
def test():
    req_data = request.get_json()
    ques = req_data['question']
    keyw = req_data['keyw']
    keysent = req_data['keysent']
    obj ={"question": ques ,"keywords" : keyw ,"keysentences" : keysent }
    db.Questions.insert_one(obj)
    return "Connected to the data base!"

@app.route("/getQuestions" ,methods=['GET'])
def getQues():
    ques = db.Questions.aggregate([{'$sample' :{'size':3}}])
    fin =[]
    for document in ques:
        fin.append({'id' : str(document.get('_id')) , 'quest' :document.get('question')})
    return jsonify(fin)

app.run(host='localhost', port=5000)