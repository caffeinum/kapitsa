# coding: utf-8
from flask import Flask
from flask import request
from datetime import datetime
import numpy as np
import os.path
import json, random, traceback, sqlite3, uuid, shutil
import pickle

app = Flask(__name__)

def load_clf():
    global clf
    clf = pickle.load(open('clf.pickle', 'rb'))

def get_date():
    return str(datetime.now())

def isnan(x):
    if x is None:
        return True
    if type(x) is float:
        return np.isnan(x)
    return False


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
load_clf()
# id = db.create_record('test', 1)
# db.update_final_status(id, "i was fucked")

def get_reply_json(is_ok, score=-1, id=None):
    return json.dumps( {"OK": is_ok, "score": score, "id": id})


fields = ["department", "relatives", "social_activity", "increased_scholarship", "exam_retakes", "influenced_by", "religion", "nutrition", "lectures", "sport"]

def fill_json(j):
    for field in fields:
        if field not in j:
            j[field] = np.nan

    j["friends"] = float(j.get("friends", np.nan))
    j["exam points"] = float(j.get("exam points", np.nan))
    return j


deps = [u'ФОПФ', u'ФИВТ', u'ФУПМ', u'ФАКИ', u'ФАЛТ', u'ФПФЭ', u'ФРТК', u'ФМХФ/ФБМФ', u'ФФКЭ', u'ФНБИК', u'Другое']

def json_to_vec(j):
    def find(x, pattern):
        x = j[x]
        if isnan(x):
            return x
        return pattern in x
    
    def find_ind(x, _list):
        x = j[x]
        if isnan(x):
            return x
        for i in xrange(len(_list)):
            if _list[i] in x:
                return i
        return np.nan
    
    X = np.zeros(24)
    if j["department"] in deps:
        X[deps.index(j["department"])] = 1
    
    i = len(deps)
    X[i] = find("relatives", u"Да"); i+= 1
    X[i] = find("social_activity", u"Да"); i+= 1
    X[i] = find("increased_scholarship", u"Да"); i+= 1
    X[i] = find_ind("exam_retakes", [u"Не было", u"Не больше", u"Больше"]); i+= 1
    X[i] = find_ind("influenced_by", [u"емья", u"друз", u"препод"]); i+= 1
    X[i] = find("religion", u"Да"); i+= 1
    X[i] = find("nutrition", u"столов"); i+= 1
    X[i] = find_ind("lectures", [u"всегд", u"полов", u"редко"]); i+= 1
    X[i] = find("sport", u"Да"); i+= 1
    
    X[i] = j["friends"]; i+= 1
    X[i] = j["exam_points_maths"]; i+= 1
    X[i] = j["exam_points_phys"]; i += 1
    X[i] = j["exam_points_russ"]; i+= 1
    return X


@app.route('/get-pict')
def process_json():
    data = request.args.get('data', '')
    data = data.encode('utf-8')

    print "Get data:", data
        
    try:
        raw_json = json.loads(data)
        j = fill_json(dict(raw_json))
        X = json_to_vec(j)
        print "X=", X
        score = clf.predict_proba(X.reshape(1,-1))[:,1][0]
        print "score= ", score

        if isnan(score):
            print "Err: score is nan"
            return get_reply_json(False)

        score = str(np.clip(score, 0.05, 0.95))

        id = db.create_record(raw_json, list(X), score)
        return get_reply_json(True, score, id)
    except:
        traceback.print_exc()
        return get_reply_json(False)

    


@app.route('/feedback')
def process_feedback():
    id = request.args.get('id', '')
    status = request.args.get('status', '')
    print "Get id= %s,  status= %s" % (id, status)

    db.update_final_status(id, status)

