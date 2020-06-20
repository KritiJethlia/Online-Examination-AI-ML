import json
import copy
from flask import Flask,request,jsonify
from flask_cors import CORS
from bson import ObjectId
from flask_pymongo import pymongo
from pymongo import MongoClient 
# import loading_functions as lf
# import helping_functions as hf
# import numpy as np
from evaluate1 import call_this

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
    print(CheckList)
    marks=call_this(CheckList)
    print(marks)
    return jsonify(marks)


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