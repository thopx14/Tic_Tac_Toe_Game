function openChoosePlayernameForm(event) {
  overlayPlayerName.style.display = "block";
  backdrop.style.display = "block";
  inputElement.focus(); // Set the focus on the input element
  // Get the current playerID by useing dataset HTMLElement property
  currentPlayerID = +event.target.dataset.playerid; // +"1" = 1 -> convert string to number!
}

function cancelPlayerNameSelection() {
  overlayPlayerName.style.display = "none";
  backdrop.style.display = "none";
  inputElement.value = "";
  warningPlayerNameEmpty("hide");
}

function submitPlayerNameForm(event) {
  event.preventDefault(); // This will disable form submission.
  const formData = new FormData(event.target);
  const playerName = formData.get("playername").trim(); // Get the attribute 'name' on the input element e.g.
  // console.log(playerName);
  // This is possible due to "Truthy" and "Falsy" values.
  // ! playerName is like playerName = "";
  if (!playerName) {
    warningPlayerNameEmpty("show");
    return;
  }

  // Update the players name
  if (currentPlayerID > 0) {
    const currentPlayerConfigElement = document.getElementById(
      "player-" + currentPlayerID + "-config"
    );
    if (currentPlayerConfigElement) {
      player[currentPlayerID -1].name = playerName;
      currentPlayerConfigElement.children[1].textContent = playerName;
    }

    cancelPlayerNameSelection();
  }
}

function warningPlayerNameEmpty(show) {
  if (show === "show") {
    errorEnteringPlayerNameElement.style.display = "block";
    inputElement.classList.add("warning");
  } else if (show === "hide") {
    errorEnteringPlayerNameElement.style.display = "none";
    inputElement.classList.remove("warning");
  }
}
