from flask import Flask
import json
app = Flask(__name__)

@app.route('/')
def index():
    return 'Privet, Lesha!'

@app.route('/hello/<jsonn>')
def process_json(jsonn):
	print "GET", str(jsonn)
	try:
		j = json.loads(jsonn)
	except:
		print "Bad json", jsonn
		return None
	print "SEND", str(j)
	return j
