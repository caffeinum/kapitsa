# coding: utf-8
from flask import Flask
from flask import request
from datetime import datetime
import numpy as np
import os.path
import json, random, traceback, sqlite3, uuid, shutil
from sklearn.ensemble import GradientBoostingClassifier
import pickle

app = Flask(__name__)
departments = {u'ФОПФ' : 0, u'ФИВТ' : 1, u'ФУПМ' : 2, u'ФАКИ' : 3, u'ФАЛТ' : 4, u'ФПФЭ' : 5, u'ФРТК' : 6, u'ФМХФ/ФБМФ' : 7,
        u'ФФКЭ' : 8, u'ФНБИК' : 9, u'Другое' : 10}
with open('clf.pickle', 'rb') as handle:
    clf = pickle.load(handle)


def get_date():
    return str(datetime.now())


class DB(object):
    def __init__(self, filename):
        if os.path.isfile(filename):
            shutil.copy(filename, "backup_" + filename)

        self.conn = sqlite3.connect(filename)
        self._try_create_table()

    def _try_create_table(self):
        with self.conn:
            self.conn.execute('''CREATE TABLE IF NOT EXISTS users (date text, id text, json text, vector text, final_status text, score real)''')

    def _get_random_id(self):
        return str(uuid.uuid4()).split("-")[0]

    def create_record(self, json_data, vector, score):
        json_str = json.dumps(json_data)
        vector_str = str(vector)
        id = self._get_random_id()        

        with self.conn:
            self.conn.execute('''INSERT INTO users (date, id, json, vector, score) VALUES (?, ?, ?, ?, ?)''', 
            (get_date(), id, json_str, vector_str, score) )

        return id

    def update_final_status(self, id, status):
        with self.conn:
            self.conn.execute('''UPDATE users SET final_status = ? WHERE id = ?''', (status, id) )


db = DB("kapitsa.db")
# id = db.create_record('test', 1)
# db.update_final_status(id, "i was fucked")

def get_reply_json(is_ok, score=-1, id=None):
    return json.dumps( {"OK": is_ok, "score": score, "id": id})


fields = ["department", "relatives", "social_activity", "increased_scholarship", "exam_retakes", "influenced_by", "religion", "nutrition", "lectures", "sport"]

def fill_json(j):
    for field in fields:
        if field not in j:
            j[field] = -999.0 # np.nan

    j["friends"] = float(j.get("friends", -999))
    j["exam points"] = float(j.get("exam points", -999))
    return j


@app.route('/get-pict')
def process_json():
    data = request.args.get('data', '')
    data = data.encode('utf-8')

    print "Get data:", data
        
    try:
        j = json.loads(data)
        j = fill_json(j)

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
        if j["social_activity"] == u'Нет':
            X[12] = 1


        #13 column for grant
        if j["increased_scholarship"] == u'Да':
            X[13] = 1
        elif j["increased_scholarship"] == u'Нет':
            X[13] = 0

        #14, 15, 16 column for retakes
        X[14] = 0
        X[15] = 0
        X[16] = 0
        if j["exam_retakes"] == u'Не больше трёх':
            X[14] = 1
        elif j["exam_retakes"] == u'Больше трёх':
            X[15] = 1
        elif j["exam_retakes"] == u'Не было ни одной':
            X[16] = 1

        #17, 18, 19 column for influence
        X[17] = 0
        X[18] = 0
        X[19] = 0
        if j["influenced_by"] == u'Любимый преподаватель':
            X[17] = 1
        elif j["influenced_by"] == u'Семья':
            X[18] = 1
        elif j["influenced_by"] == u'Кто-то из друзей':
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

        X[26] = j["friends"]
        X[27] = j["exam points"]
        score = clf.predict_proba(X.reshape(1,-1))[:,1][0]
        print "X= ", np.array(X)
        print "score= ", score

        if np.isnan(score):
            print "Err: score is nan"
            return get_reply_json(False)

        score = str(np.clip(score, 0.05, 0.95))
    except:
        traceback.print_exc()
        return get_reply_json(False)

    id = db.create_record(j, list(X), score)

    return get_reply_json(True, score, id)


@app.route('/feedback')
def process_feedback():
    id = request.args.get('id', '')
    status = request.args.get('status', '')
    print "Get id= %s,  status= %s" % (id, status)

    db.update_final_status(id, status)

