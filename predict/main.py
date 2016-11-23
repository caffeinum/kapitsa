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
departments = {'ФОПФ' : 0, 'ФИВТ' : 1, 'ФУПМ' : 2, 'ФАКИ' : 3, 'ФАЛТ' : 4, 'ФПФЭ' : 5, 'ФРТК' : 6, 'ФМХФ/ФБМФ' : 7,
        'ФФКЭ' : 8, 'ФНБИК' : 9, 'Другое' : 10}
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
        if j["relatives"] == 'Да':
            X[11] = 1
        elif j["relatives"] == 'Нет':
            X[11] = 0

        #12 column for social activity
        X[12] = 0
        if j["social activity"] == 'Нет':
            X[12] = 1


        #13 column for grant
        if j["increased scholarships"] == 'Да':
            X[13] = 1
        elif j["increased scholarships"] == 'Нет':
            X[13] = 0

        #14, 15, 16 column for retakes
        X[14] = 0
        X[15] = 0
        X[16] = 0
        if j["exam retakes"] == 'Не больше трёх':
            X[14] = 1
        elif j["exam retakes"] == 'Больше трёх':
            X[15] = 1
        elif j["exam retakes"] == 'Не было ни одной':
            X[16] = 1

        #17, 18, 19 column for influence
        X[17] = 0
        X[18] = 0
        X[19] = 0
        if j["influenced by"] == 'Любимый преподаватель':
            X[17] = 1
        elif j["influenced by"] == 'Семья':
            X[18] = 1
        elif j["influenced by"] == 'Кто-то из друзей':
            X[19] = 1

        #20 column for religy
        if j["religion"] == 'Да':
            X[20] = 1
        elif j["religion"] == 'Нет':
            X[20] = 0

        #21 column for foor
        if j["nutrition"] == 'Чаще обедал в столовой':
            X[21] = 1
        elif j["nutrition"] == 'Чаще готовил сам':
            X[21] = 0

        #22, 23, 24 column for lectures
        X[22] = 0
        X[23] = 0
        X[24] = 0
        if j["lectures"] == 'Посетил примерно половину':
            X[22] = 1
        elif j["lectures"] == 'Очень редко':
            X[23] = 1
        elif j["lectures"] == 'Почти всегда':
            X[24] = 1


        #25 column for sport
        if j["sport"] == 'Да, занимался':
            X[25] = 1

        X[26] = float(j["friends"])
        X[27] = float(j["exam points"])
        print (np.array(X))
        score = clf.predict_proba(X.reshape(1,-1))[:,1][0]
        score = np.nan_to_num(score) #Bad and ugly

    except:
        print "Bad data", data
        return random.random() 

    values = [str(datetime.now())] + [str(i) if isinstance(i, (float, int)) else i for i in j.values()]
    answer_line = ",".join( values )

    with open("answers.csv", "a") as f:
        f.write( answer_line + "\n" )

    return str(score)
