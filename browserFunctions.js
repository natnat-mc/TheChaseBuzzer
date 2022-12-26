function setupBuzzerOptions() {
    let buzzerOptions = ["Kirbeep","MPYosh","MPDog","MPCat","Wow","Ooh","MarioBoing","TheNumberEight"];
    buzzerOptions.forEach((buzzerName) => {
        $("#buzzerOptions").append("<img id='"+buzzerName+"' src='"+buzzerName+".png'>");
    });
    return buzzerOptions;
}
function userListsToClient(playerList, chaserList) {
    $("#playerList").html("");
    $("#chaserList").html("");
    playerList.forEach((playerName) => {
        $("#playerList").append("<li>"+playerName+"</li>");
    });
    chaserList.forEach((chaserName) => {
        $("#chaserList").append("<li>"+chaserName+"</li>");
    });
}

function gameStateToClient(currentTeam, currentScore) {
    $("#currentTeam").html(currentTeam);
    $("#currentScore").html(currentScore);
}

function buzzListToClient(buzzList, buzzerSound) {
    //play sound for first buzz in
    if ($("#buzzList").html() == "") {
        buzzerSound.play();
    }
    $("#buzzList").html(buzzList.join());
}