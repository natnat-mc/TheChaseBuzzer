function setupBuzzerOptions() {
    let buzzerOptions = ["Kirbeep","MPYosh","MPDog","MPCat","Wow","Ooh","MarioBoing","TheNumberEight"];
    buzzerOptions.forEach((buzzerName) => {
        $("#buzzerOptions").append("<img id='"+buzzerName+"' src='"+buzzerName+".png'>");
    });
    return buzzerOptions;
}

function userInfoToClient(userInfo) {
    $("#PlayersList").find("ul").html("");
    $("#ChasersList").find("ul").html("");
    console.log(userInfo);
   
    for (const user in userInfo) {
        const userId = user.replaceAll(" ","_");
        $("#"+userInfo[user].teamName+"List").find("ul").append("<li id="+userId+">"+user+"<var></var></li>");
    }
}

function gameStateToClient(currentTeam, currentScore) {
    $("#PlayersList").css("opacity", 0.5);
    $("#ChasersList").css("opacity", 0.5);
    $("#"+currentTeam+"List").css("opacity", 1);
    
    $("#currentTeam").html(currentTeam+" turn");
    $("#currentScore").html(currentScore);
}

function buzzInfoToClient(buzzInfo, buzzerSound) {
    //play sound for first buzz in
    if ($("#firstBuzz").html() == "") {
        buzzerSound.play();
        $("#firstBuzz").html(buzzInfo[0].userName);
        const userId = buzzInfo[0].userName.replaceAll(" ","_");
        $("#userListPanel").find("#"+userId).css("font-weight", 900);
        $("#userListPanel").find("#"+userId).find("var").html(" (BUZZ)")
    }

    for (let i=1; i < buzzInfo.length; i++) {
        const userId = buzzInfo[i].userName.replaceAll(" ","_");
        $("#userListPanel").find("#"+userId).find("var").html(" ("+buzzInfo[i].lateTime/1000+")");
    }    
}