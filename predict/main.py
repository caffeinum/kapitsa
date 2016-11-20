from flask import Flask
import json
app = Flask(__name__)

@app.route('/')
def index():
    return 'Privet, Lesha!'

@app.route('/hello/<jsonn>')
def process_json(jsonn):
	try:
		j = json.loads(jsonn)
	except:
		print "Bad json", jsonn
		return None

	return j