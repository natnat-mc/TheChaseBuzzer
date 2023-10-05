function userInfoToClient(userInfo) {
    for (const user in userInfo) {
        const userId = user.replaceAll(" ","_");
        if ($("#userListPanel").find("#"+userId).length >= 1) {
            //update buzzer icon of existing user
            $("#userListPanel").find("#"+userId).find("img").attr("data-buzzerId",userInfo[user].buzzerId);
            $("#userListPanel").find("#"+userId).find("img").attr("src", userInfo[user].buzzerId+".png");
        }
        else {
            //new user
            $("#"+userInfo[user].teamName+"List").find("ul").append("<li id="+userId+">"+"<img src="+userInfo[user].buzzerId+".png data-buzzerId="+userInfo[user].buzzerId+" class=userListBuzzerSelections>"+user+"<var></var></li>");
        }
    }
}

function gameStateToClient(currentTeam, currentScore) {
    $("#PlayersList").css("opacity", 0.5);
    $("#ChasersList").css("opacity", 0.5);
    $("#"+currentTeam+"List").css("opacity", 1);
    
    $("#currentTeam").html(currentTeam+" turn");
    $("#currentScore").html(currentScore);
}

function clearBuzzers() {
    $("#firstBuzz").html("");
    $("#userListPanel").find("var").html("");
}

function buzzInfoToClient(buzzInfo, soundOn) {
    //play sound for first buzz in
    if ($("#firstBuzz").html() == "") {
        $("#firstBuzz").html(buzzInfo[0].userName);
        const userId = buzzInfo[0].userName.replaceAll(" ","_");
        let buzzerId = $("#userListPanel").find("#"+userId).find("img").attr("data-buzzerId");
        let buzzerSound = new Audio(buzzerId+".wav");
        if (soundOn == true) {
            buzzerSound.play();
        }
    }

    for (let i=0; i < buzzInfo.length; i++) {
        const userId = buzzInfo[i].userName.replaceAll(" ","_");
        // $("#userListPanel").find("#"+userId).find("var").html(" ("+buzzInfo[i].lateTime/1000+")");
        $("#userListPanel").find("#"+userId).find("var").html(" ["+buzzInfo[i].buzzOrder+"]");
    }    
}

function idkListToClient(idkList) {
    idkList.forEach((userName) => {
        const userId = userName.replaceAll(" ","_");
        $("#userListPanel").find("#"+userId).find("var").html("<div style='display: inline; font-family: Times New Roman; font-size: 20px;'> ¯\\\_(ツ)_/¯</div>");
    });
}

function passToClient(teamName, soundOn) {
    let passSound = new Audio("PikminDeath.wav");
    if (soundOn == true) {
        passSound.play();
    }
    $("#firstBuzz").html(teamName+" have Passed!");
}

// function selectBuzzer(buzzerId) {
//     if (buzzerId == "Mystery") {
//         buzzerId = buzzerOptions[Math.floor(Math.random()*(buzzerOptions.length-1))];
//     }
//     let buzzerSound = new Audio(buzzerId+".wav");
//     $("#buzzer").attr("src", buzzerId+".png" );
//     buzzerSound.play();
//     return buzzerSound;
// }

let objectionSound = new Audio("AAObjection.wav");
function objectionToClient(userName) {
    objectionSound.play();
    $("#objection").html("<img src='AAObjection.gif?"+Math.random()+"'><br>"+userName+" is objecting!<br>");
}

function clearObjectionToClient() {
    $("#objection").html("");
}