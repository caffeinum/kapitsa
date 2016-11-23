# coding: utf-8
from flask import Flask
from flask import request
from datetime import datetime
import numpy as np
import json
import csv
import random
from sklearn.ensemble import GradientBoostingClassifier
import pickle

app = Flask(__name__)
departments = {u'ФОПФ' : 0, u'ФИВТ' : 1, u'ФУПМ' : 2, u'ФАКИ' : 3, u'ФАЛТ' : 4, u'ФПФЭ' : 5, u'ФРТК' : 6, u'ФМХФ/ФБМФ' : 7,
        u'ФФКЭ' : 8, u'ФНБИК' : 9, u'Другое' : 10}
with open('clf.pickle', 'rb') as handle:
    clf = pickle.load(handle)

@app.route('/get-pict')
def process_json():
    data = request.args.get('data', '')
    data = data.encode('utf-8')
        
    with open("answers.txt", "a") as f:	
        f.write( str(data) + "\n" )

    try:
        j = json.loads(data)
    except:
        print "Bad json", data
        return random.random()

    try:
        X = np.zeros(28) - 999.
        for key in departments.items():
            X[key[1]] = 0.
            if j["department"] == key[0]:
                X[key[1]] = 1.

        #11 column for relatives
        if j["relatives"] == u'Да':
            X[11] = 1
        elif j["relatives"] == u'Нет':
            X[11] = 0

        #12 column for social activity
        X[12] = 0
        if j["social activity"] == u'Нет':
            X[12] = 1


        #13 column for grant
        if j["increased scholarships"] == u'Да':
            X[13] = 1
        elif j["increased scholarships"] == u'Нет':
            X[13] = 0

        #14, 15, 16 column for retakes
        X[14] = 0
        X[15] = 0
        X[16] = 0
        if j["exam retakes"] == u'Не больше трёх':
            X[14] = 1
        elif j["exam retakes"] == u'Больше трёх':
            X[15] = 1
        elif j["exam retakes"] == u'Не было ни одной':
            X[16] = 1

        #17, 18, 19 column for influence
        X[17] = 0
        X[18] = 0
        X[19] = 0
        if j["influenced by"] == u'Любимый преподаватель':
            X[17] = 1
        elif j["influenced by"] == u'Семья':
            X[18] = 1
        elif j["influenced by"] == u'Кто-то из друзей':
            X[19] = 1

        #20 column for religy
        if j["religion"] == u'Да':
            X[20] = 1
        elif j["religion"] == u'Нет':
            X[20] = 0

        #21 column for foor
        if j["nutrition"] == u'Чаще обедал в столовой':
            X[21] = 1
        elif j["nutrition"] == u'Чаще готовил сам':
            X[21] = 0

        #22, 23, 24 column for lectures
        X[22] = 0
        X[23] = 0
        X[24] = 0
        if j["lectures"] == u'Посетил примерно половину':
            X[22] = 1
        elif j["lectures"] == u'Очень редко':
            X[23] = 1
        elif j["lectures"] == u'Почти всегда':
            X[24] = 1


        #25 column for sport
        if j["sport"] == u'Да':
            X[25] = 1
        elif j["sport"] == u'Нет':
            X[25] = 0

        X[26] = float(j["friends"])
        X[27] = float(j["exam points"])
        print (np.array(X))
        score = clf.predict_proba(X.reshape(1,-1))[:,1][0]
	score = np.nan_to_num(score)
        print (score)
    except:
        print "Bad data", data
        return random.random() 

    values = [str(datetime.now())] + [str(i) if isinstance(i, (float, int)) else i for i in j.values()]
    answer_line = u",".join( values )

    with open("answers.csv", "a") as f:
        f.write( answer_line.encode('utf-8') + "\n" )

    return str(score)
