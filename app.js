// ============================================
// BETZONE JAVASCRIPT
// ============================================


// ============================================
// DEMO WALLET
// ============================================

let balance =
    Number(
        localStorage.getItem("betzoneBalance")
    ) || 0;


function updateBalance() {

    document.getElementById("balance")
        .textContent =
        balance.toFixed(2);

    localStorage.setItem(
        "betzoneBalance",
        balance
    );
}


updateBalance();


// ============================================
// FOOTBALL MATCHES
// ============================================

const matches = [

    {
        id: 1,

        league: "Premier League",

        home: "FC Nurembred",

        away: "FC Ingolstadt",

        // For demonstration:
        // this match is already live.

        startTime:
            new Date(
                Date.now() - 45 * 60 * 1000
            ),

        homeScore: 2,

        awayScore: 0,

        odds: {
            home: 1.60,
            // draw: "10.50❌",
            // away: 5.20
        }

    },


    {
        id: 2,

        league: "La Liga",

        home: "France",

        away: "Italy",

        // Starts 45 minutes from now

        startTime:
            new Date(
                Date.now() + 45 * 60 * 1000
            ),

        homeScore: 0,

        awayScore: 0,

        odds: {
            home: 1.85,
            // draw: 3.60,
            // away: 3.90
        }

    },


    {
        id: 3,

        league: "Serie A",

        home: "Belgium",

        away: "Turkey",

        // Starts in 2 hours

        startTime:
            new Date(
                Date.now() + 2 * 60 * 60 * 1000
            ),

        homeScore: 0,

        awayScore: 0,

        odds: {
            home: 1.59,
            // draw: 3.20,
            // away: 3.10
        }

    },


    {
        id: 4,

        league: "Premier League",

        home: "DenMark",

        away: "Portugal",

        // Finished yesterday

        startTime:
            new Date(
                Date.now() - 4 * 60 * 60 * 1000
            ),

        homeScore: 2,

        awayScore: 4,

        odds: {
            // home: 1.70,
            // draw: 3.60,
            away: 4.80
        }

    }

];


// ============================================
// BET SLIP
// ============================================

let betSlip = [];


// ============================================
// MATCH STATUS
// ============================================

function getMatchStatus(match) {

    const now =
        new Date();

    const start =
        new Date(
            match.startTime
        );


    // Demo: match lasts 2 hours

    const end =
        new Date(
            start.getTime()
            +
            2 * 60 * 60 * 1000
        );


    if (now < start) {

        return "upcoming";

    }


    if (
        now >= start &&
        now < end
    ) {

        return "live";

    }


    return "finished";

}


// ============================================
// COUNTDOWN
// ============================================

function getCountdown(match) {

    const now =
        new Date();

    const start =
        new Date(
            match.startTime
        );


    let seconds =
        Math.floor(
            (start - now) / 1000
        );


    if (seconds <= 0) {

        return "Started";

    }


    const hours =
        Math.floor(
            seconds / 3600
        );


    seconds %= 3600;


    const minutes =
        Math.floor(
            seconds / 60
        );


    const secs =
        seconds % 60;


    return (
        String(hours).padStart(2, "0")
        + ":" +
        String(minutes).padStart(2, "0")
        + ":" +
        String(secs).padStart(2, "0")
    );

}


// ============================================
// MATCH MINUTE
// ============================================

function getMatchMinute(match) {

    const now =
        new Date();

    const start =
        new Date(
            match.startTime
        );


    const minutes =
        Math.floor(
            (now - start) / 60000
        );


    return Math.max(
        1,
        Math.min(
            minutes,
            90
        )
    );

}


// ============================================
// DISPLAY MATCHES
// ============================================

function displayMatches() {

    const live =
        document.getElementById(
            "liveMatches"
        );


    const upcoming =
        document.getElementById(
            "upcomingMatches"
        );


    const finished =
        document.getElementById(
            "finishedMatches"
        );


    live.innerHTML = "";

    upcoming.innerHTML = "";

    finished.innerHTML = "";


    matches.forEach(match => {

        const status =
            getMatchStatus(match);


        const html =
            createMatchCard(
                match,
                status
            );


        if (
            status === "live"
        ) {

            live.innerHTML += html;

        }

        else if (
            status === "upcoming"
        ) {

            upcoming.innerHTML += html;

        }

        else {

            finished.innerHTML += html;

        }

    });

}


// ============================================
// CREATE MATCH CARD
// ============================================

function createMatchCard(
    match,
    status
) {

    let statusHTML = "";

    let middleHTML = "";


    if (
        status === "live"
    ) {

        statusHTML = `
            <span class="status-live">
                🔴 LIVE ${getMatchMinute(match)}'
            </span>
        `;


        middleHTML = `
            <div class="center-score">
                ${match.homeScore}
                -
                ${match.awayScore}
            </div>

            <div class="match-time">
                Match started
            </div>
        `;

    }


    else if (
        status === "upcoming"
    ) {

        statusHTML = `
            <span class="status-upcoming">
                🟢 UPCOMING
            </span>
        `;


        middleHTML = `
            <div class="center-score">
                VS
            </div>

            <div class="match-time">
                Starts in ${getCountdown(match)}
            </div>
        `;

    }


    else {

        statusHTML = `
            <span class="status-finished">
                ⚪ FINISHED
            </span>
        `;


        middleHTML = `
            <div class="center-score">
                ${match.homeScore}
                -
                ${match.awayScore}
            </div>

            <div class="match-time">
                Match ended
            </div>
        `;

    }


    /*
        Betting is disabled on finished
        matches.
    */

    const disabled =
        status === "finished"
            ? "disabled"
            : "";


    return `

        <div class="match-card">

            <div class="match-header">

                <span>
                    ${match.league}
                </span>

                ${statusHTML}

            </div>


            <div class="match-body">

                <div class="teams">

                    <div class="team">
                        ${match.home}
                    </div>


                    <div>
                        ${middleHTML}
                    </div>


                    <div class="team">
                        ${match.away}
                    </div>

                </div>


                <div class="odds">

                    <button
                        class="odd-btn"
                        ${disabled}
                        onclick="
                            selectBet(
                                ${match.id},
                                '${match.home}',
                                ${match.odds.home}
                            )
                        ">

                        1

                        <strong>
                            ${match.odds.home}
                        </strong>

                    </button>


                    <button
                        class="odd-btn"
                        ${disabled}
                        onclick="
                            selectBet(
                                ${match.id},
                                'Draw',
                                ${match.odds.draw}
                            )
                        ">

                        X

                        <strong>
                            ${match.odds.draw}
                        </strong>

                    </button>


                    <button
                        class="odd-btn"
                        ${disabled}
                        onclick="
                            selectBet(
                                ${match.id},
                                '${match.away}',
                                ${match.odds.away}
                            )
                        ">

                        2

                        <strong>
                            ${match.odds.away}
                        </strong>

                    </button>

                </div>

            </div>

        </div>

    `;

}


// ============================================
// SELECT BET
// ============================================

function selectBet(
    matchId,
    selection,
    odds
) {

    const match =
        matches.find(
            item =>
                item.id === matchId
        );


    if (
        getMatchStatus(match)
        ===
        "finished"
    ) {

        alert(
            "This match has finished."
        );

        return;

    }


    /*
       Only one selection per match.
    */

    betSlip =
        betSlip.filter(
            bet =>
                bet.matchId !== matchId
        );


    betSlip.push({

        matchId,

        selection,

        odds

    });


    renderBetSlip();

}


// ============================================
// DISPLAY BET SLIP
// ============================================

function renderBetSlip() {

    const container =
        document.getElementById(
            "betItems"
        );


    document.getElementById(
        "betCount"
    ).textContent =
        betSlip.length;


    if (
        betSlip.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-slip">

                <div>🎟️</div>

                <p>
                    Your bet slip is empty
                </p>

                <small>
                    Select an odd to add a bet
                </small>

            </div>

        `;


        updateOdds();

        return;

    }


    container.innerHTML =
        betSlip.map(
            (bet, index) => `

            <div class="bet-item">

                <strong>
                    ${bet.selection}
                </strong>

                <br>

                <small>
                    Odds: ${bet.odds}
                </small>


                <button
                    class="remove-btn"
                    onclick="
                        removeBet(${index})
                    ">

                    Remove

                </button>

            </div>

        `
        ).join("");


    updateOdds();

}


// ============================================
// REMOVE BET
// ============================================

function removeBet(index) {

    betSlip.splice(
        index,
        1
    );

    renderBetSlip();

}


// ============================================
// TOTAL ODDS
// ============================================

function getTotalOdds() {

    if (
        betSlip.length === 0
    ) {

        return 0;

    }


    return betSlip.reduce(
        (
            total,
            bet
        ) =>
            total * bet.odds,

        1
    );

}


// ============================================
// UPDATE ODDS
// ============================================

function updateOdds() {

    const total =
        getTotalOdds();


    document.getElementById(
        "totalOdds"
    ).textContent =
        total.toFixed(2);


    calculateWin();

}


// ============================================
// POTENTIAL WIN
// ============================================

function calculateWin() {

    const stake =
        Number(
            document.getElementById(
                "stake"
            ).value
        ) || 0;


    const totalOdds =
        getTotalOdds();


    const win =
        stake * totalOdds;


    document.getElementById(
        "potentialWin"
    ).textContent =
        win.toFixed(2);

}


// ============================================
// DEMO DEPOSIT
// ============================================

function depositMoney() {

    const amount =
        Number(
            prompt(
                "Enter demo deposit amount:"
            )
        );


    if (
        !amount ||
        amount <= 0
    ) {

        return;

    }


    /*
       DEMO ONLY.

       This changes the local browser wallet.
       It does NOT move real money.
    */

    balance += amount;


    updateBalance();


    alert(
        `Demo deposit successful!\n\n` +
        `₦${amount.toFixed(2)} added to wallet.`
    );

}


// ============================================
// PLACE BET
// ============================================

function placeBet() {

    if (
        betSlip.length === 0
    ) {

        alert(
            "Please select an odd first."
        );

        return;

    }


    const stake =
        Number(
            document.getElementById(
                "stake"
            ).value
        );


    if (
        !stake ||
        stake <= 0
    ) {

        alert(
            "Enter a valid stake."
        );

        return;

    }


    if (
        stake > balance
    ) {

        alert(
            "Insufficient demo wallet balance."
        );

        return;

    }


    const totalOdds =
        getTotalOdds();


    const potential =
        stake * totalOdds;


    /*
       DEMO wallet transaction
    */

    balance -= stake;


    updateBalance();


    alert(

        "Bet placed successfully!\n\n" +

        "Stake: ₦" +
        stake.toFixed(2) +

        "\nTotal odds: " +
        totalOdds.toFixed(2) +

        "\nPotential win: ₦" +
        potential.toFixed(2)

    );


    betSlip = [];


    document.getElementById(
        "stake"
    ).value = "";


    renderBetSlip();

}


// ============================================
// CATEGORY FILTER
// ============================================

function showCategory(category) {

    const live =
        document.getElementById(
            "liveMatches"
        );

    const upcoming =
        document.getElementById(
            "upcomingMatches"
        );

    const finished =
        document.getElementById(
            "finishedMatches"
        );


    live.parentElement.style.display =
        "block";

    upcoming.parentElement.style.display =
        "block";

    finished.parentElement.style.display =
        "block";


    if (
        category === "live"
    ) {

        upcoming.parentElement.style.display =
            "none";

        finished.parentElement.style.display =
            "none";

    }


    if (
        category === "upcoming"
    ) {

        live.parentElement.style.display =
            "none";

        finished.parentElement.style.display =
            "none";

    }


    if (
        category === "finished"
    ) {

        live.parentElement.style.display =
            "none";

        upcoming.parentElement.style.display =
            "none";

    }

}


// ============================================
// START
// ============================================

displayMatches();

renderBetSlip();


// Refresh match status every second
// so countdowns and LIVE status update.

setInterval(
    displayMatches,
    1000
);
