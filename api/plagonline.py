from random import *



def plag(answers):
    plags = [0 for i in range(len(answers))]
    for i in range(len(answers)):
    	if(answers[i]!=''):
        	plags[i] = randint(1,100)
    return plags



