# coding: utf-8
from flask import Flask
from flask import request
import json
import random
#import boosting
app = Flask(__name__)


@app.route('/get-pict')
def process_json():
	data = request.args.get('data', '')
	data = data.encode('utf-8')
	try:
		#{"exam_points":"280","friends":"655","sport":"Нет","department":"ФУПМ","relatives":"Нет","increased scholarships":"Нет","exam retakes":"Не больше трёх","influenced by":"Кто-то из друзей","religion":"Нет","nutrition":"Чаще обедал в столовой","lectures":"Очень редко"}:

		j = json.loads(data)

		with open("answers.txt", "a") as f:
			f.write( data + "\n" )
	except:
		print "Bad json", data
		return random.random()
		#return "Bad json, " + str(data)

	try:
		score = 0.4 + float(j["exam_points"]) * 0.2 / 300.0  - float(j["friends"]) * 0.05 / 1500.0 + (j["department"] == u"ФОПФ") * 0.13 - (j["department"] == u"ФИВТ") * 0.11  + (j["exam retakes"] == u"Не больше трёх") * 0.07 - (j["lectures"] == u"Очень редко") * 0.03
		score = min(score, 0.95)
		score = max(score, 0.05)

	except:
	 	print "Bad data", data
		return random.random() 
	 	#return "Bad data, " + str(data)


	return str(score)
