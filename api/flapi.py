# written by Kriti 
# backend API calls for Evaluation ,storing of answers by students for Online evaluation 
import json
import copy
from flask import Flask,request,jsonify
from flask_cors import CORS
from bson import ObjectId
from flask_pymongo import pymongo
from pymongo import MongoClient
import random 
from evaluate1 import call_this
from plag2 import check_sim
from plagonline import plag

# Connecting with MongoDB database
client = pymongo.MongoClient("mongodb+srv://onlineexam:wipro@ps-ee5gl.mongodb.net/Questions?retryWrites=true&w=majority")
db = client.Questions
db1=client.StudentAnswers
user_collection = pymongo.collection.Collection(db,'user_collection')


app=Flask(__name__)
CORS(app)
app.config["DEBUG"]= True

# API call for Evaluation and storing of answers
@app.route('/ans', methods=['POST'])
def readans():
    req_data = request.get_json()
    ans = json.loads(req_data['ans'])
    qid = json.loads(req_data['ques'])
    sname = req_data['user'] 
    CheckList=[]

    #Creating a list of lists containing all the answers and their respective Keywords and Keysentences
    for (ids,a) in zip(qid,ans) :
        templist=[]
        ques=db.Questions.find_one({'_id' : ObjectId(str(ids))})
        templist.append(ques["keywords"])
        templist.append(ques["keysentences"])
        templist.append(a)
        CheckList.append(templist)

    #calling autograder
    marks=call_this(CheckList)
    sim=[]

    # Find answers of other students and comparing answer with other students
    for (ids,a) in zip(qid,ans) :
        anslist=[]
        k=list(db.AnswerResponses.find({'qid' : ids}))
        for answ in k :
            anslist.append(answ["ans"])
        anslist.append(a)
        temp=check_sim(anslist)
        temp1=temp[0]
        sim.append(temp1.pop()*100)

    #Generating Random values for online plagiarism and storing them in a List
    plagonline=plag(ans)
    # plagonline.append(random.random()*100)
    # plagonline.append(random.random()*100)
    # plagonline.append(random.random()*100)

    # Insertion of answer in database
    for(ids,a) in zip(qid,ans) :
        if(a!='') :
            obj={"qid" : ids ,"name" :sname , "ans" :a}
            db.AnswerResponses.insert_one(obj)
        
    return jsonify(marks,sim,plagonline)

#API call for entering question in the database
@app.route("/enterQuestions" ,methods=['POST'])
def test():
    req_data = request.get_json()
    ques = req_data['question']
    keyw = req_data['keyw']
    keysent = req_data['keysent']
    obj ={"question": ques ,"keywords" : keyw ,"keysentences" : keysent }
    return "Connected to the data base!"

# Randomly getting questions from database and sending response to the frontend
@app.route("/getQuestions" ,methods=['GET'])
def getQues():
    ques = db.Questions.aggregate([{'$sample' :{'size':3}}])
    fin =[]
    for document in ques:
        fin.append({'id' : str(document.get('_id')) , 'quest' :document.get('question')})
    return jsonify(fin)

# Downloading video from frontend and storing it in a file
@app.route("/downloadVideo",methods=['POST'])
def proct() :
    f = request.files['video'] 
    f.save('kriti')
    return jsonify("hi")

app.run(host='localhost', port=5000)