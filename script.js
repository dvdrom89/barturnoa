const apiUrl = "https://script.google.com/macros/s/AKfycbx_3yeauOxznQ0WqJ7xLEpmxCQXgXRV1w3_0au3VAJh1AdTNICGbbWjxz1Gj3b5jgRs/exec";

function loadUser() {
  const userId = document.getElementById("userId").value.trim();
  if (!userId) {
    alert("Inserisci un ID valido.");
    return;
  }

  fetch(`${apiUrl}?action=getUserData&id=${userId}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.getElementById("user-name").innerText = `Benvenuto, ${data.name}`;
        document.getElementById("user-credit").innerText = data.credit;
        document.getElementById("user-history").innerHTML = "";

        data.history.forEach(item => {
          const li = document.createElement("li");
          li.innerText = `${item.data}: ${item.voce} - € ${item.importo}`;
          document.getElementById("user-history").appendChild(li);
        });

        document.getElementById("login-section").style.display = "none";
        document.getElementById("user-section").style.display = "block";

        new QRCode(document.getElementById("qrcode"), {
          text: userId,
          width: 180,
          height: 180
        });
      } else {
        alert("Utente non trovato.");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Errore durante il caricamento dei dati.");
    });
}

function logout() {
  document.getElementById("login-section").style.display = "block";
  document.getElementById("user-section").style.display = "none";
  document.getElementById("userId").value = "";
  document.getElementById("qrcode").innerHTML = "";
}
