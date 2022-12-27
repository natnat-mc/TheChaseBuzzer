function setupBuzzerOptions() {
    let buzzerOptions = ["Kirbeep","MPYosh","MPDog","MPCat","Wow","Ooh","MarioBoing","TheNumberEight"];
    buzzerOptions.forEach((buzzerName) => {
        $("#buzzerOptions").append("<img id='"+buzzerName+"' src='"+buzzerName+".png'>");
    });
    return buzzerOptions;
}

function userInfoToClient(userInfo) {
    $("#PlayersList").html("");
    $("#ChasersList").html("");
    for (const user in userInfo) {
        $("#"+userInfo[user].teamName+"List").append("<li id="+user+">"+user+"<var></var></li>");
    }
}

function gameStateToClient(currentTeam, currentScore) {
    $("#currentTeam").html(currentTeam+" turn");
    $("#currentScore").html(currentScore);
}

function buzzInfoToClient(buzzInfo, buzzerSound) {
    //play sound for first buzz in
    if (buzzInfo.length == 1) {
        buzzerSound.play();
        $("#firstBuzz").html(buzzInfo[0].userName);
        $("#userListPanel").find("#"+buzzInfo[0].userName).css("font-weight", 900);
        $("#userListPanel").find("#"+buzzInfo[0].userName).find("var").html(" (BUZZ)")
    }

    for (let i=1; i < buzzInfo.length; i++) {
        $("#userListPanel").find("#"+buzzInfo[i].userName).find("var").html(" ("+buzzInfo[i].lateTime/1000+")");
    }    
}