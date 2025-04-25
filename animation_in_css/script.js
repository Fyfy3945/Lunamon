let wallet = 0;
let circulation = 1000000;
let savings = 0;
let savingsCode = null; // sera défini à la première utilisation
let scorePoints = 0;
let bonusInterval = null;
let prestige = 0;
let hall = [];
let unlocked = new Set(); // Pour stocker les succès débloqués

const buttonBuy = document.getElementById("buy");
const text = document.getElementById("console");
const walletDisplay = document.getElementById("wallet");
const numberInput = document.getElementById("value");
const buttonSell = document.getElementById("sell");
const buttonSave = document.getElementById("save");
const savingsDisplay = document.getElementById("savings");
const buttonExchange = document.getElementById("exchange");
const scoreDisplay = document.getElementById("score");
const buttonUnsave = document.getElementById("unsave");
const buttonReinject = document.getElementById("reinject");
const reinjectAmountSelect = document.getElementById("reinjectAmount");
const prestigeDisplay = document.getElementById("prestige");
const titleDisplay = document.getElementById("title");
const hallDisplay = document.getElementById("hall");
const shop = document.getElementById("shop");
const achievementList = document.getElementById("achievements");
const achievements = [
    { id: 1, condition: () => prestige >= 20, label: "Premier Prestige 🥉" },
    { id: 2, condition: () => prestige >= 50, label: "Prestige confirmé 🥈" },
    { id: 3, condition: () => prestige >= 100, label: "Maître du Prestige 🥇" },
    { id: 4, condition: () => hall.length >= 5, label: "Collectionneur 🎨" },
    { id: 5, condition: () => hall.length >= 10, label: "Architecte Astral 🏛️" },
];
const cosmeticItems = [
    { name: "Statue en bronze", cost: 10000, prestige: 1 },
    { name: "Statue en argent", cost: 25000, prestige: 3 },
    { name: "Statue en or", cost: 50000, prestige: 5 },
    { name: "Affiche vintage", cost: 5000, prestige: 1 },
    { name: "Affiche légendaire", cost: 20000, prestige: 4 },
    { name: "Lampe en cristal", cost: 15000, prestige: 2 },
    { name: "Écharpe de prestige", cost: 10000, prestige: 2 },
    { name: "Parc luxuriant", cost: 70000, prestige: 6 },
    { name: "Fontaine en marbre", cost: 100000, prestige: 10 },
    { name: "Médaille d'honneur sacrée", cost: 250000, prestige: 15 },
    { name: "Sablier éternel", cost: 300000, prestige: 20 },
    { name: "Tapisserie des Astres", cost: 40000, prestige: 3 },
    { name: "Globe céleste lumineux", cost: 80000, prestige: 5 },
    { name: "Trône de l’Élu", cost: 120000, prestige: 8 },
    { name: "Mini-Jardin Galactique", cost: 30000, prestige: 2 },
    { name: "Coffret de runes anciennes", cost: 60000, prestige: 4 },
    { name: "Mur des Ancêtres", cost: 90000, prestige: 6 },
    { name: "Horloge interstellaire", cost: 150000, prestige: 10 },
    { name: "Comète suspendue", cost: 200000, prestige: 12 },
    { name: "Œuf de créature céleste", cost: 250000, prestige: 15 },
    { name: "Sanctuaire lunaire miniature", cost: 300000, prestige: 18 },
];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

buttonBuy.addEventListener("click", (event) => {
    const toBuy = parseInt(numberInput.value, 10);
    if (isNaN(toBuy) || toBuy <= 0) {
        text.innerHTML = "Veuillez entrer un montant valide";
        return;
    }
    if (toBuy > circulation) {
        text.innerHTML = "Montant trop élevé. Pas assez de Lunamon en circulation.";
        return;
    }
    wallet += toBuy;
    circulation -= toBuy;
    walletDisplay.innerHTML = `Lunamon : ${wallet} | En circulation : ${circulation}`;
    text.innerHTML = `Vous avez acheté ${toBuy} Lunamon`;
    sleep(1000).then(() => { text.innerHTML = " "; });
});
buttonSell.addEventListener("click", (event) => {
    const toSell = parseInt(numberInput.value, 10);
    if (isNaN(toSell) || toSell <= 0) {
        text.innerHTML = "Veuillez entrer un montant valide";
        return;
    }
    if (toSell > wallet) {
        text.innerHTML = "Montant trop élevé. Pas assez de Lunamon dans le porte-monnaie.";
        return;
    }
    wallet -= toSell;
    circulation += toSell;
    walletDisplay.innerHTML = `Lunamon : ${wallet} | En circulation : ${circulation}`;
    text.innerHTML = `Vous avez vendu ${toSell} Lunamon`;
    sleep(1000).then(() => { text.innerHTML = " "; });
});
buttonSave.addEventListener("click", () => {
    const amountToSave = parseInt(numberInput.value, 10);

    if (isNaN(amountToSave) || amountToSave <= 0) {
        text.innerHTML = "Veuillez entrer un montant valide à épargner.";
        return;
    }

    if (amountToSave > wallet) {
        text.innerHTML = "Vous n'avez pas assez de Lunamon pour épargner ce montant.";
        return;
    }

    if (savingsCode === null) {
        const newCode = prompt("Définissez un code secret pour l'épargne :");
        if (!newCode) {
            text.innerHTML = "Code non défini. Épargne annulée.";
            return;
        }
        savingsCode = newCode;
        alert("Code défini ! Vous pouvez maintenant épargner.");
    } else {
        const enteredCode = prompt("Entrez votre code d'épargne :");
        if (enteredCode !== savingsCode) {
            text.innerHTML = "Code incorrect. Épargne annulée.";
            return;
        }
    }

    wallet -= amountToSave;
    savings += amountToSave;
    startDynamicBonus();

    walletDisplay.innerHTML = `Lunamon : ${wallet} | En circulation : ${circulation}`;
    savingsDisplay.innerHTML = `Épargne : ${savings} Lunamon`;
    text.innerHTML = `Vous avez épargné ${amountToSave} Lunamon`;
    sleep(1000).then(() => { text.innerHTML = " "; });
});
buttonExchange.addEventListener("click", () => {
    const amountToExchange = parseInt(numberInput.value, 10);

    if (isNaN(amountToExchange) || amountToExchange <= 0) {
        text.innerHTML = "Veuillez entrer un montant valide à échanger.";
        return;
    }

    if (amountToExchange > wallet) {
        text.innerHTML = "Pas assez de Lunamon dans le porte-monnaie.";
        return;
    }

    wallet -= amountToExchange;
    scorePoints += amountToExchange * 2; // 1 Lunamon = 2 ScorePoints

    walletDisplay.innerHTML = `Lunamon : ${wallet} | En circulation : ${circulation}`;
    scoreDisplay.innerHTML = `ScorePoints : ${scorePoints}`;
    text.innerHTML = `Vous avez échangé ${amountToExchange} Lunamon contre ${amountToExchange} ScorePoints`;
    sleep(1000).then(() => { text.innerHTML = " "; });
});
buttonUnsave.addEventListener("click", () => {
    const amountToUnsave = parseInt(numberInput.value, 10);

    if (isNaN(amountToUnsave) || amountToUnsave <= 0) {
        text.innerHTML = "Veuillez entrer un montant valide à retirer.";
        return;
    }

    if (amountToUnsave > savings) {
        text.innerHTML = "Pas assez de Lunamon épargnés pour ce retrait.";
        return;
    }

    if (savingsCode === null) {
        text.innerHTML = "Aucun code défini. Vous n'avez pas encore épargné.";
        return;
    }

    const enteredCode = prompt("Entrez votre code d'épargne pour retirer :");
    if (enteredCode !== savingsCode) {
        text.innerHTML = "Code incorrect. Retrait annulé.";
        return;
    }

    savings -= amountToUnsave;
    wallet += amountToUnsave;
    startDynamicBonus();

    walletDisplay.innerHTML = `Lunamon : ${wallet} | En circulation : ${circulation}`;
    savingsDisplay.innerHTML = `Épargne : ${savings} Lunamon`;
    text.innerHTML = `Vous avez retiré ${amountToUnsave} Lunamon depuis l'épargne`;
    sleep(1000).then(() => { text.innerHTML = " "; });
});
buttonReinject.addEventListener("click", () => {
    const amountToReinject = parseInt(reinjectAmountSelect.value, 10); // Récupère le montant sélectionné

    if (scorePoints < amountToReinject / 10) { // On vérifie si on a assez de ScorePoints
        text.innerHTML = `Vous avez besoin de ${amountToReinject / 10} ScorePoints pour réinjecter ce montant.`;
        return;
    }

    scorePoints -= amountToReinject / 10; // Déduit les ScorePoints nécessaires
    circulation += amountToReinject; // Ajoute les Lunamon en circulation

    walletDisplay.innerHTML = `Lunamon : ${wallet} | En circulation : ${circulation}`;
    scoreDisplay.innerHTML = `ScorePoints : ${scorePoints}`;
    text.innerHTML = `${amountToReinject} Lunamon ont été réinjectés en circulation !`;
    sleep(1000).then(() => { text.innerHTML = " "; });
});
function applySavingsBonus() {
    const millionsSaved = Math.floor(savings / 1000000);
    if (millionsSaved > 0) {
        const bonus = millionsSaved * 100000;
        scorePoints += bonus;
        scoreDisplay.innerHTML = `ScorePoints : ${scorePoints}`;
        text.innerHTML = `💰 Bonus d'épargne : +${bonus} ScorePoints pour ${millionsSaved}M épargné(s)`;
        sleep(3000).then(() => { text.innerHTML = " "; });
    }
}
function startDynamicBonus() {
    if (bonusInterval) clearInterval(bonusInterval); // Nettoie l’ancien intervalle

    const millionsSaved = Math.floor(savings / 1000000);
    let interval = 30000 - (Math.floor(savings / 5000000) * 5000); // Réduit 5 sec par palier de 5M

    if (interval < 5000) interval = 5000; // Minimum 5 sec

    bonusInterval = setInterval(() => {
        applySavingsBonus();
        startDynamicBonus(); // Relance le calcul si épargne a changé
    }, interval);
}
function updatePrestigeTitle() {
    let title = "";
    document.body.classList.remove("anim-stars");

    if (prestige >= 100) {
        title = "🌟 Grand Gardien des Astres";
        document.body.className = "prestige-skin-3";
    } else if (prestige >= 50) {
        title = "✨ Maître Céleste";
        document.body.className = "prestige-skin-2";
    } else if (prestige >= 20) {
        title = "🔮 Apprenti Astral";
        document.body.className = "prestige-skin-1";
    } else {
        title = "Décorateur Novice";
        document.body.className = "";
    }
    titleDisplay.textContent = title;
}
function renderHall() {
    hallDisplay.innerHTML = "";
    hall.forEach(item => {
        const el = document.createElement("div");
        el.className = "item" + (item.prestige >= 10 ? " high-prestige" : "");
        el.innerText = `${item.name}\n+${item.prestige} Prestige`;
        hallDisplay.appendChild(el);
    });
}
function renderShop() {
    cosmeticItems.forEach(item => {
        const btn = document.createElement("button");
        btn.innerText = `Acheter ${item.name} (${item.cost} pts)`;
        btn.onclick = () => {
            if (scorePoints >= item.cost) {
                scorePoints -= item.cost;
                prestige += item.prestige;
                hall.push(item);

                const priceIncrease = Math.random() * 0.03 + 0.02; // Augmente le prix de 2% à 5%
                item.cost *= (1 + priceIncrease); // Augmente le coût de l'objet
                item.cost = Math.round(item.cost);

                prestigeDisplay.textContent = `Prestige : ${prestige}`;
                document.getElementById("score").textContent = `ScorePoints : ${scorePoints}`;

                btn.textContent = `Acheter ${item.name} (${Math.round(item.cost)} pts)`; // Met à jour le texte du bouton

                renderHall();
                updatePrestigeTitle();
                checkAchievements();
            } else {
                alert("Pas assez de ScorePoints !");
            }
        };
        shop.appendChild(btn);
    });
}
function checkAchievements() {
    achievements.forEach(a => {
        if (!unlocked.has(a.id) && a.condition()) {
            unlocked.add(a.id);
            const li = document.createElement("li");
            li.textContent = a.label;
            li.style.color = "#FFD700";
            achievementList.appendChild(li);
        }
    });
}
function showPrestigeStats() {
    const details = document.getElementById("prestigeDetails");
    let totalCost = hall.reduce((acc, item) => acc + item.cost, 0);
    let highestItem = hall.reduce((max, item) => item.prestige > max.prestige ? item : max, { prestige: 0 });

    details.innerHTML = `
        <p>Nombre d'objets achetés : ${hall.length}</p>
        <p>Coût total investi : ${totalCost} scorePoints</p>
        <p>Objet le plus prestigieux : ${highestItem.name} (+${highestItem.prestige})</p>
    `;
    document.getElementById("prestigeModal").style.display = "block";
}

renderShop();
startDynamicBonus();