let TIMEOUT_SECONDS = 180;
let TIMEOUT_STRING = "three minutes";
let secondsRemaining = TIMEOUT_SECONDS;

let gameTimer;
let oldVal;
let problemNumber = 0;
let problemPoints = 0;
let currentScore = 0;
let numCorrect = 0;
let problemsOrder;
let debug = false;
let lastTarget = '';
let mobile = false;
let showShadow = false;
let skippedProblems = [];
let showSkipped = false;
let currentUser = null;
let currentMode = 'timed';
let currentDuration = 180;
let currentUserPersonalBest = 0;
let personalBests = {};
let currentProblem = null;
let practiceHelpUsedCurrentProblem = false;
let practiceHelpUsed = 0;
let practiceSolvedAlone = 0;

function mobileCheck() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayLaTeXInBody() {
    renderMathInElement(document.body, {
        options: {
            throwOnError: false,
            display: false
        }
    });
}

// A simple timer
function displayTime(secs) {
    let minutes = Math.floor(secs / 60) % 60;
    let seconds = secs % 60;
    let displayText = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
    $("#timer").text(displayText);
}

function displayInfiniteTime() {
    katex.render(`\\infty`, $("#timer")[0]);
}

function startTimer(onTimeoutFunc) {
    secondsRemaining = TIMEOUT_SECONDS;
    gameTimer = setInterval(function() {
        secondsRemaining--;
        displayTime(secondsRemaining);
        if (secondsRemaining == 0) {
            clearInterval(timer);
            onTimeoutFunc();
        }
    }, 1000);
}

function toggleShowSkipped() {
  $("#skipped-problems").toggle();
  showSkipped = !showSkipped;
  $("#show-skipped-button").text(showSkipped ? "Hide Skipped" : "Show Skipped");
}

function showIntro() {
    $("#game-window").hide();
    $("#ending-window").hide();
    $("#intro-window").show();
    $("#score-submission").show();

    let introText = "How many formulas can you type? Choose a time limit, or practice in Zen Mode.";
    $("#intro-text").html(introText);

    if (mobileCheck()) {
      $("#hint-list").prepend("<li><span style=\"color:red\"><b>Consider switching to a desktop browser</b></span></li>")
      mobile = true;
    }

    displayLaTeXInBody();
    $("#container").show();
}

function endGame() {
    clearTimeout(gameTimer);

    $("#intro-window").hide();
    $("#game-window").hide();
    $("#ending-window").show();
    displayLaTeXInBody();

    if (currentMode === 'practice') {
        $('#ending-title').text('Practice Complete!');
        $('#ending-text').text('You went through all ' + problems.length + ' problems.');
        $('#ending-personal-best').text('');
        $('#practice-stats').html(
            '<table class="practice-table">' +
            '<tr><td>On your own</td><td><b>' + practiceSolvedAlone + '</b></td></tr>' +
            '<tr><td>Used solution</td><td><b>' + practiceHelpUsed + '</b></td></tr>' +
            '<tr><td>Skipped</td><td><b>' + skippedProblems.length + '</b></td></tr>' +
            '</table>'
        ).show();
        $('#score-submission').hide();
        $('#leaderboard-section').hide();
    } else {
        $('#ending-title').text('Game Over!');
        $('#practice-stats').hide();
        $('#score-submission').show();
        $('#leaderboard-section').show();

        let problemsText = numCorrect + ((numCorrect == 1) ? " problem" : " problems");
        $("#ending-text").text("You finished " + problemsText + " for a total score of " + currentScore);

        $('#leaderboard-title').text(currentDuration > 0 ? durationLabel(currentDuration) + ' Leaderboard' : 'Leaderboard');
        loadLeaderboard('today');
        saveGameResult(currentScore, numCorrect, currentMode, currentDuration);

        if (currentUser && currentDuration > 0) {
            if (currentScore >= currentUserPersonalBest) {
                $('#ending-personal-best').text('New personal best for ' + durationLabel(currentDuration) + '!');
                personalBests[currentDuration] = currentScore;
                currentUserPersonalBest = currentScore;
            } else {
                $('#ending-personal-best').text('Your best for ' + durationLabel(currentDuration) + ': ' + currentUserPersonalBest + ' points');
            }
        } else if (!currentUser) {
            $('#ending-personal-best').text('Sign in to track your progress.');
        } else {
            $('#ending-personal-best').text('');
        }
    }
    
    skippedProblems.forEach(idx => {
      let target = problems[problemsOrder[idx % problems.length]];
      let targetId = 'skipTarget' + idx;
      let skippedProblemsHtml = `
        <p class="problem-header"><span class="title">${target.title}</span></p>
        <div class="latex">
          <div id="${targetId}"></div>
        </div>
        <br>
        <div disabled class="latex-source answer">${target.latex}</div>
        <br><br>
      `;
        $("#skipped-problems").append(skippedProblemsHtml);

        katex.render(target.latex, $("#" + targetId)[0], {
            throwOnError: false,
            displayMode: true
        });
    });
    displayLaTeXInBody();

    $("#skipped-problems").hide()
    $("#show-skipped-button").text("Show Skipped");
    showSkipped = false;
    if (skippedProblems.length > 0) {
      $("#show-skipped-message").show();
      $("#show-skipped-button").show();
    } else {
      $("#show-skipped-message").hide();
      $("#show-skipped-button").hide();
    }
}


function showAllProblems() {
    $("#intro-window").hide();
    $("#ending-window").hide();
    $("#game-window").hide();
    $("#browse-window").show();

    $("#browse-count").text(problems.length);
    const list = $("#browse-list").empty();

    // Build all DOM entries first (no KaTeX yet)
    problems.forEach((problem, i) => {
        const targetId = 'browse-target-' + i;
        const sourceId = 'browse-source-' + i;
        const entry = document.createElement('div');
        entry.className = 'browse-entry';
        entry.innerHTML =
            '<div class="browse-entry-header">' +
                '<span class="browse-number">' + (i + 1) + '.</span>' +
                '<span class="browse-entry-title">' + escapeHtml(problem.title) + '</span>' +
                '<button class="latex-button browse-toggle" data-source="' + sourceId + '">LaTeX</button>' +
            '</div>' +
            '<div class="browse-formula"><div id="' + targetId + '"></div></div>' +
            '<div id="' + sourceId + '" class="browse-source" style="display:none;">' + escapeHtml(problem.latex) + '</div>';
        list[0].appendChild(entry);
    });

    // Render KaTeX in batches so the UI stays responsive
    const BATCH = 20;
    let idx = 0;
    function renderBatch() {
        const end = Math.min(idx + BATCH, problems.length);
        for (; idx < end; idx++) {
            const el = document.getElementById('browse-target-' + idx);
            if (el) {
                katex.render(problems[idx].latex, el, { throwOnError: false, displayMode: true });
            }
        }
        if (idx < problems.length) {
            setTimeout(renderBatch, 0);
        }
    }
    setTimeout(renderBatch, 0);

    list.on('click', '.browse-toggle', function() {
        const sourceId = $(this).data('source');
        $('#' + sourceId).toggle();
    });
}

function durationLabel(seconds) {
    return (seconds / 60) + ' min';
}

function startGame(durationSeconds) {
    currentDuration = durationSeconds;
    currentMode = durationSeconds === 0 ? 'zen' : 'timed';
    currentUserPersonalBest = personalBests[durationSeconds] || 0;

    if (durationSeconds > 0) {
        TIMEOUT_SECONDS = durationSeconds;
        TIMEOUT_STRING = durationLabel(durationSeconds);
    }

    problemNumber = 0;
    currentScore = 0;
    numCorrect = 0;
    oldVal = "";
    problemsOrder = [...Array(problems.length).keys()];
    shuffleArray(problemsOrder);
    skippedProblems = [];

    $("#intro-window").hide();
    $("#ending-window").hide();
    $("#game-window").show();
    $("#skipped-problems").html("");
    $("#skipped-problems").hide();

    displayLaTeXInBody();
    $("#score").text(0);

    if (durationSeconds > 0) {
        $('#show-solution-button').hide();
        displayTime(TIMEOUT_SECONDS);
        loadProblem();
        startTimer(function() { endGame(); });
    } else {
        $('#show-solution-button').show();
        displayInfiniteTime();
        loadProblem();
    }
}

function startPracticeMode() {
    currentMode = 'practice';
    currentDuration = 0;
    practiceHelpUsed = 0;
    practiceSolvedAlone = 0;
    practiceHelpUsedCurrentProblem = false;

    problemNumber = 0;
    currentScore = 0;
    numCorrect = 0;
    oldVal = "";
    problemsOrder = [...Array(problems.length).keys()];
    shuffleArray(problemsOrder);
    skippedProblems = [];

    $("#intro-window").hide();
    $("#ending-window").hide();
    $("#game-window").show();
    $("#skipped-problems").html("");
    $("#skipped-problems").hide();

    displayLaTeXInBody();
    $("#score").text("0 / " + problems.length);
    $('#show-solution-button').show();
    displayInfiniteTime();
    loadProblem();
}

function loadProblem() {
    if (currentMode === 'practice' && problemNumber >= problems.length) {
        endGame();
        return;
    }

    // clear current work
    $('#out').empty();
    $('#user-input').val('');

    // reset styling
    $('#out').parent().removeClass("correct");
    $('#user-input').prop("disabled", false);
    if (!mobile) {
      $('#user-input').focus();
    }

    // load problem
    let target = problems[problemsOrder[problemNumber % problems.length]];
    if (debug) {
      target = problems[problemNumber + 179];
    }
    problemNumber += 1;
    currentProblem = target;

    practiceHelpUsedCurrentProblem = false;
    $('#show-solution-button').text('Show Solution');
    $('#solution-display').hide();

    // load problem text
    let problemText = "Problem " + problemNumber + ": " + target.title;
    $("#problem-title").text(problemText);
    problemPoints = Math.ceil(target.latex.length / 10.0);
    let pointsText = "(" + problemPoints + ((problemPoints == 1) ? " point)" : " points)");
    $("#problem-points").text(pointsText);

    displayLaTeXInBody();

    // load problem body
    katex.render(target.latex, $("#target")[0], {
        throwOnError: false,
        displayMode: true
    });
    // load problem body
    katex.render(target.latex, $("#shadow-target")[0], {
        throwOnError: false,
        displayMode: true
    });

    oldVal = "";
};

function normalize(input) {
  normalizations.forEach(
    rule => input = input.replace(rule["rule"], rule["replacement"])
  );
  return input;
}

function validateProblem() {
    let currentVal = normalize($("#user-input").val());
    if (currentVal == oldVal) {
        return; // check to prevent multiple simultaneous triggers
    }

    oldVal = currentVal;
    // action to be performed on textarea changed
    katex.render(currentVal, $("#out")[0], {
        throwOnError: false,
        displayMode: true
    });

    if (currentVal == '') {
      // Defensively return if the input is empty.
      return;
    }


    if ($("#target").width() != $("#out").width()) {
        // Return if the element widths are different.
        return;
    }

    html2canvas($('#target')[0], {}).then(function (targetCanvas) {
        $('#out').parent().removeClass("correct");
        let width = targetCanvas.width;
        let height = targetCanvas.height;
        let targetData = targetCanvas.getContext("2d").getImageData(0, 0, width, height);
        let curTarget = $('#problem-title').text();
        html2canvas($('#out')[0], {}).then(function (outCanvas) {
            if (outCanvas.width != width || outCanvas.height != height) {
              console.log("doesn't match");
              return;
            }
            let outData = outCanvas.getContext("2d").getImageData(0, 0, width, height);
            let diff = pixelmatch(targetData.data, outData.data, undefined, width, height, {threshold: 0.1});
            let result = "";
            console.log("diff is " + diff)
            if (diff == 0) {
                if (lastTarget == curTarget) {
                  return;
                }
                lastTarget = curTarget;
                currentScore += problemPoints;
                numCorrect += 1;

                if (currentMode === 'practice') {
                    if (practiceHelpUsedCurrentProblem) {
                        practiceHelpUsed++;
                    } else {
                        practiceSolvedAlone++;
                    }
                    $("#score").text(numCorrect + " / " + problems.length);
                } else {
                    $("#score").text(currentScore);
                }

                // Styling changes
                $('#out').parent().addClass("correct");
                $('#user-input').prop("disabled", true);

                // Load new problem
                setTimeout(loadProblem, 1500);
            }
        });
    });
}

// Helper function to escape HTML special characters
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Auth functions
function updateAuthUI() {
    if (currentUser) {
        const initial = currentUser.displayName ? currentUser.displayName[0].toUpperCase() : '?';
        $('#account-button').text(initial).addClass('account-button-signed-in');
        loadIntroBest();
    } else {
        $('#account-button').text('Sign in').removeClass('account-button-signed-in');
        $('#account-panel').hide();
        personalBests = {};
        currentUserPersonalBest = 0;
        $('#intro-personal-best').html('Want to see your highscores? <button class="link-button" id="intro-signin-link">Sign in &rarr;</button>');
    }
}

async function loadIntroBest() {
    if (!currentUser) {
        $('#intro-personal-best').text('');
        personalBests = {};
        return;
    }
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        personalBests = userDoc.exists ? (userDoc.data().personalBests || {}) : {};

        const parts = [180, 300, 600].map(d => {
            const b = personalBests[d] || 0;
            return durationLabel(d) + ': ' + (b > 0 ? b + ' pts' : '—');
        });
        $('#intro-personal-best').text('Your bests: ' + parts.join('  ·  '));
    } catch (e) {
        console.error(e);
    }
}

async function loadAccountPanel() {
    $('#panel-name').text(currentUser.displayName);
    $('#panel-best').text('Loading…');
    $('#panel-history').html('<p class="panel-empty">Loading…</p>');

    try {
        const uid = currentUser.uid;
        const userDoc = await db.collection('users').doc(uid).get();
        const bests = userDoc.exists ? (userDoc.data().personalBests || {}) : {};
        const anyBest = Object.values(bests).some(v => v > 0);
        if (anyBest) {
            const parts = [180, 300, 600].map(d => {
                const b = bests[d] || 0;
                return durationLabel(d) + ': ' + (b > 0 ? b + ' pts' : '—');
            });
            $('#panel-best').text(parts.join('  ·  '));
        } else {
            $('#panel-best').text('No games yet.');
        }

        const gamesSnap = await db.collection('users').doc(uid).collection('games')
            .orderBy('timestamp', 'desc').limit(10).get();

        $('#panel-history').empty();
        if (gamesSnap.empty) {
            $('#panel-history').html('<p class="panel-empty">No games yet.</p>');
        } else {
            gamesSnap.forEach(doc => {
                const d = doc.data();
                const ts = d.timestamp ? d.timestamp.toDate() : null;
                const date = ts ? ts.toLocaleDateString('de-DE') + ', ' + ts.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : '—';
                $('#panel-history').append(
                    `<div class="history-entry">${d.score} pts &nbsp;·&nbsp; ${d.numCorrect} formulas &nbsp;·&nbsp; ${d.duration > 0 ? durationLabel(d.duration) : 'zen'} &nbsp;·&nbsp; ${date}</div>`
                );
            });
        }
    } catch (e) {
        console.error(e);
        $('#panel-best').text('Error loading stats.');
    }
}

async function saveGameResult(score, numCorrect, mode, duration) {
    if (!currentUser) return;
    try {
        const uid = currentUser.uid;
        await db.collection('users').doc(uid).collection('games').add({
            score, numCorrect, mode, duration,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        if (duration > 0 && score > (personalBests[duration] || 0)) {
            const userRef = db.collection('users').doc(uid);
            await userRef.set({
                displayName: currentUser.displayName,
                personalBests: { ...personalBests, [duration]: score }
            }, { merge: true });
        }
    } catch (e) {
        console.error('Error saving game:', e);
    }
}

// Leaderboard functions
async function submitScore(name, score) {
    try {
        await db.collection('leaderboard').add({
            name: name.trim(),
            score: score,
            duration: currentDuration,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        loadLeaderboard('today'); // Refresh leaderboard after submission
    } catch (error) {
        console.error("Error submitting score:", error);
    }
}

async function loadLeaderboard(timeRange) {
    const leaderboardList = $("#leaderboard-list");
    leaderboardList.empty();
    
    try {
        let query = db.collection('leaderboard').where('duration', '==', currentDuration);

        const now = new Date();
        if (timeRange === 'today') {
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            query = query.where('timestamp', '>=', startOfDay);
        } else if (timeRange === 'month') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            query = query.where('timestamp', '>=', startOfMonth);
        }

        const snapshot = await query.orderBy('score', 'desc').limit(10).get();
        
        if (snapshot.empty) {
            leaderboardList.append('<p>No scores yet!</p>');
            return;
        }
        
        let rank = 1;
        snapshot.forEach((doc) => {
            const data = doc.data();
            const scoreEntry = `
                <div class="leaderboard-entry" style="margin: 5px 0;">
                    <span class="rank">#${rank}</span>
                    <span class="name">${escapeHtml(data.name)}</span>
                    <span class="score">${data.score} points</span>
                </div>
            `;
            leaderboardList.append(scoreEntry);
            rank++;
        });
    } catch (error) {
        console.error("Error loading leaderboard:", error);
        leaderboardList.append('<p>Error loading leaderboard</p>');
    }
}

// Start by showing the intro.
$(document).ready(function() {
    // Handlers
    $("#start-button-3min").click(function() { startGame(180); });
    $("#start-button-5min").click(function() { startGame(300); });
    $("#start-button-10min").click(function() { startGame(600); });
    $("#start-button-untimed").click(function() { startGame(0); });
    $("#start-button-practice").click(function() { startPracticeMode(); });
    $("#start-button-browse").click(function() { showAllProblems(); });
    $("#browse-back-button").click(function() {
        $("#browse-window").hide();
        showIntro();
    });

    $("#skip-button").click(function() {
        skippedProblems.push(problemNumber - 1);
        loadProblem();
    });

    $("#show-skipped-button").click(function() {
      toggleShowSkipped();
    })

    $("#end-game-button").click(function() {
        endGame();
    });

    $("#user-input").on("change keyup paste", function() {
        validateProblem()
    });

    $("#show-solution-button").click(function() {
        if ($('#solution-display').is(':hidden')) {
            $('#solution-display').text(currentProblem.latex).show();
            $(this).text('Hide Solution');
            if (currentMode === 'practice') practiceHelpUsedCurrentProblem = true;
        } else {
            $('#solution-display').hide();
            $(this).text('Show Solution');
        }
    });

    $("#shadow-checkbox").change(_ => {
        $("#shadow-target").toggle();
    });

    $("#l-shadow-checkbox").keydown(e => {
      if (e.which == 13 /* enter */) {
        $("#shadow-checkbox").prop("checked", !$("#shadow-checkbox").prop("checked"));
        $("#shadow-target").toggle();
      }
    });

    // Leaderboard handlers
    $("#submit-score").click(function() {
        const playerName = $("#player-name").val().trim();
        if (playerName.length === 0) {
            alert("Please enter your name");
            return;
        }
        if (playerName.length > 30) {
            alert("Name must be 30 characters or less");
            return;
        }
        
        submitScore(playerName, currentScore);
        $("#score-submission").hide();
    });
    
    $("#today-scores, #month-scores, #all-time-scores").click(function() {
        const timeRange = $(this).attr('id').replace('-scores', '');
        
        // Update active button
        $(".leaderboard-controls .latex-button").removeClass('active');
        $(this).addClass('active');
        
        loadLeaderboard(timeRange);
    });
    
    $("#play-again-button").click(function() {
        showIntro();
    });

    // Auth handlers
    auth.onAuthStateChanged(user => {
        currentUser = user;
        updateAuthUI();
    });

    $("#account-button").click(function() {
        if (!currentUser) {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider).catch(err => console.error(err));
        } else {
            const panel = $('#account-panel');
            if (panel.is(':hidden')) {
                loadAccountPanel();
                panel.show();
            } else {
                panel.hide();
            }
        }
    });

    $("#panel-signout").click(function() {
        auth.signOut();
        $('#account-panel').hide();
    });

    $(document).click(function(e) {
        if (!$(e.target).closest('#account-widget').length) {
            $('#account-panel').hide();
        }
    });

    $(document).on('click', '#intro-signin-link', function() {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).catch(err => console.error(err));
    });

    showIntro();
});
