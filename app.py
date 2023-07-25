from flask import Flask, request, render_template, session, jsonify
from boggle import Boggle

app = Flask(__name__)

app.config['SECRET_KEY'] = "key"

boggle_game = Boggle()

@app.route('/')
def home_page():
    # home page
    return render_template('game-start.html')

@app.route('/game-board')
def play_game():
    # generate game board and start game

    board = boggle_game.make_board()
    session['board'] = board

    return render_template('game-board.html', board=board)

@app.route('/check-answer')
def check_answer():
    # Checks word
    guess = request.args['guess']
    board = session["board"]
    response = boggle_game.check_valid_word(board, guess)

    return jsonify({'result': response})
   
@app.route("/post-score", methods=["POST"])
def post_score():
    """Receive score, update nplays, update high score if appropriate."""

    score = request.json["score"]
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)

    session['nplays'] = nplays + 1
    session['highscore'] = max(score, highscore)

    return jsonify(brokeRecord=score > highscore)
