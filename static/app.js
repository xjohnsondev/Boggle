class BoggleGame {

    constructor(secs = 60){
        this.score = 0;
        this.wordBank = new Set();

        this.timeLimit = secs
        this.countDown()

        $("#guess-form").on("submit", this.handleGuess.bind(this));
        this.timer = setInterval(this.countDown.bind(this), 1000)
    }

    async endGame(){
        $("#guess-form").hide();
        const resp = await axios.post("/post-score", { score: this.score });
        if (resp.data.brokeRecord) {
          this.showMessage(`New record: ${this.score}`, "ok");
        } else {
          this.showMessage(`Final score: ${this.score}`, "ok");
        }
    }

    showTimer(){
        $("#timer").text(this.timeLimit);
    }

    countDown(){
        this.timeLimit -= 1;
        this.showTimer();

        if (this.timeLimit === 0){
            clearInterval(this.timer)
            $('#timer').hide();
            this.endGame();
        }
    }

    showScore(guess){
        // adds word value to score
        this.score += guess.length;
        const $score = $("#score");
        $score.text(`Score: ${this.score}`);
        
    }

    async handleGuess(evt){
        evt.preventDefault();
        
        const $guess = $('.guess');
        let guess = $guess.val().toUpperCase();
        if (!guess) return;
        
        console.log(guess)

        if (this.wordBank.has(guess)) {
            this.showMessage(`${guess} has already been guessed`, "err");
            return;
        }

        // check server for validity
        const resp = await axios.get("/check-answer", { params: { guess: guess }});
        console.log(resp)
        if (resp.data.result === "not-word") {
        this.showMessage(`${guess} is not a valid English word`, "err");
        } 
        else if (resp.data.result === "not-on-board") {
        this.showMessage(`${guess} is not a valid word on this board`, "err");
        } 
        else {
        this.showScore(guess);
        this.wordBank.add(guess);
        this.showMessage(`Added: ${guess}`, "ok");
        }
        $guess.val("");
    }

    showMessage(msg, cls) {
    $("#message")
      .text(msg)
      .removeClass()
      .addClass(cls);
    }

}

let game = new BoggleGame();