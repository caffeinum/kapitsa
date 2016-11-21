# coding: utf-8
from flask import Flask
from flask import request
from datetime import datetime
import json
<<<<<<< HEAD
import csv
=======
import random
>>>>>>> f5541e02eafe1b4623396e7da8464f1257b1c294
#import boosting
app = Flask(__name__)


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
		score = 0.4 + float(j["exam_points"]) * 0.2 / 300.0  - float(j["friends"]) * 0.05 / 1500.0 + (j["department"] == u"ФОПФ") * 0.13 - (j["department"] == u"ФИВТ") * 0.11  + (j["exam retakes"] == u"Не больше трёх") * 0.07 - (j["lectures"] == u"Очень редко") * 0.03
		score = min(score, 0.95)
		score = max(score, 0.05)

	except:
	 	print "Bad data", data
		return random.random() 

	values = [str(datetime.now())] + [str(i) if isinstance(i, (float, int)) else i for i in j.values()]		
	answer_line = u",".join( values )
	
	with open("answers.csv", "a") as f:	
		f.write( answer_line.encode('utf-8') + "\n" )

	return str(score)

