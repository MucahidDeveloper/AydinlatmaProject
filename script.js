// Yeni Satır Ekleme //
function addNewLine(yeni) {
  const tbody = document.getElementById("sonucCetveli").querySelector("tbody");
  const newLine = document.createElement("tr");
  newLine.classList.add("sonucSatir");
  yeni.forEach((value) => {
    const element = document.createElement("td");
    element.textContent = value;
    newLine.appendChild(element);
  });

  // Silme Butunu ekleme //
  const silme = document.createElement("td");
  silme.classList.add("silBtn");
  silme.textContent = "x";
  newLine.appendChild(silme);
  silme.addEventListener("click", () => {
    newLine.remove();
  });
  tbody.appendChild(newLine);
}

// Kordon Uzunluğu Bulmak
function CBulmak(H, b) {
  if (typeof kordonTablosu[H] === "undefined") {
    alert("Bu kadar Yüksek Bina Yok!");
    return;
  }

  if (typeof kordonTablosu[H] === "number") {
    return kordonTablosu[H];
  } else {
    let closestKey = Object.keys(kordonTablosu[H]).reduce((prev, curr) => {
      return Math.abs(curr - b) < Math.abs(prev - b) ? curr : prev;
    });
    return kordonTablosu[H][closestKey];
  }
}

// Lamp tipleri gösterme
const lamb = document.getElementById("lamba");
lamb.addEventListener("change", () => akislar(lamb.value));
akislar(lamb.value);

function akislar(lambaturu) {
  const akis = document.getElementById("akis");
  akis.innerHTML = "";

  const selectedLamp = getLampByName(lambaturu);
  if (selectedLamp) {
    for (const [watt, value] of Object.entries(selectedLamp)) {
      const option = document.createElement("option");
      option.textContent = `${watt} W`;
      option.setAttribute("value", value);
      akis.appendChild(option);
    }
  }

  function getLampByName(name) {
    switch (name) {
      case "Akkor":
        return Akkor;
      case "Flurs":
        return Flurs;
      case "Halide":
        return Halide;
      case "CivaBuh":
        return CivaBuh;
      case "SodBuh":
        return SodBuh;
      case "HalojenKap":
        return HalojenKap;
      case "HalojenAmp":
        return HalojenAmp;
      case "cabHalojenAmp":
        return cabHalojenAmp;
      case "komFlurs":
        return komFlurs;
      default:
        return null;
    }
  }
}

// Verim faktoru Bulmak //
function oranBulma(obj, target) {
  const closestValues = enYakin(obj, target);

  if (closestValues.before !== null && closestValues.after !== null) {
    const beforeValue = obj[closestValues.before];
    const afterValue = obj[closestValues.after];

    const weightBefore =
      (closestValues.after - target) /
      (closestValues.after - closestValues.before);
    const weightAfter = 1 - weightBefore;

    const interpolatedValue =
      beforeValue * weightBefore + afterValue * weightAfter;

    return interpolatedValue;
  }

  return null;
}

function enYakin(obj, target) {
  let closestValues = { before: null, after: null };

  Object.keys(obj).forEach((key) => {
    const numKey = parseFloat(key);

    if (!isNaN(numKey) && numKey <= target) {
      if (!closestValues.before || numKey > closestValues.before) {
        closestValues.before = numKey;
      }
    }

    if (!isNaN(numKey) && numKey >= target) {
      if (!closestValues.after || numKey < closestValues.after) {
        closestValues.after = numKey;
      }
    }
  });

  return closestValues;
}

function verimBulmak(tablo, bir, iki, idx, uc = undefined) {
  let x;
  if (tablo === 1) {
    x = verimTablosuBir[bir][iki][uc][idx];
  } else if (tablo === 2) {
    x = verimTablosuIki[bir][iki][idx];
  } else if (tablo === 3) {
    x = verimTablosuUc[bir][iki][idx];
  }

  let Oran;
  if (x === undefined) {
    if (tablo === 1) {
      Oran = oranBulma(verimTablosuBir[bir][iki][uc], idx);
    } else {
      Oran = oranBulma(verimTablosuIki[bir][iki], idx) / 100;
    }
  } else {
    Oran = x / 100;
  }
  return Oran;
}

// Ekle //
const ekle = document.getElementById("verimForm");

ekle.addEventListener("submit", function (event) {
  event.preventDefault();

  const a = document.getElementById("odaUzun").value;
  const b = document.getElementById("odaGenis").value;
  const H = document.getElementById("odaYuksek").value;
  const my = document.getElementById("masaYuksek").value || false;
  const tavanRenk = document.getElementById("tavanRenk").value || false;
  const duvarRenk = document.getElementById("duvarRenk").value || false;
  const zeminRenk = document.getElementById("zeminRenk").value || false;
  let boyarenki = document.getElementById("boyarenki").value || false;
  const tip = document.getElementById("tip").value;
  const lambAkis = document.getElementById("akis").value;
  const kirlenmeDurumu = document.getElementById("kirlenmeDurumu").value;
  const temizlamaSure = document.getElementById("temizlamaSure").value;
  const lamba = document.getElementById("lamba").value;

  const Yer = ekle.elements.Yer;
  const E = Yer.value;
  const selectedYer = Yer.options[Yer.selectedIndex].text;

  let d = false;
  let h;
  let c;
  let K;
  let verim;

  function boyutlarFarkli() {
    if (a == b) {
      K = a / h;
      verim = verimBulmak(yontem, tip, boyarenki, K);
    } else {
      K = a / h;
      let verimA = (verimBulmak(yontem, tip, boyarenki, K) * 1) / 3;
      K = b / h;
      let verimB = (verimBulmak(yontem, tip, boyarenki, K) * 1) / 3;

      verim = 3 * verimB + (verimA - verimB);
    }
    return verim;
  }

  let yontem = 1;
  const Alan = a * b;

  // Verimlere kontrol etmek
  if (!a || !b || !H) {
    alert("Lütfen temel boyutları girin");
    return;
  }

  // Yöntem 1
  if (my) {
    h = H - my;
    if (h < 1) {
      alert(
        "Eşya uzunluğu mekânın yüksekliğinden büyük olamaz. Eşyanın ve mekânı yükseklerini kontrol edin."
      );
      return;
    }

    K = Alan / (h * a + h * b);
    if (!tavanRenk || !duvarRenk || !zeminRenk) {
      alert("Tavan, duvar ve zemin renklerini girdiğinizden emin olun.");
      return;
    } else {
      verim = verimBulmak(1, tavanRenk, duvarRenk, K, zeminRenk);
    }

    d =
      document.getElementById("kurFactorNum").value ||
      kurlenmeTablosu[lamba][tip][temizlamaSure][kirlenmeDurumu];
  } else {
    c = CBulmak(H, b);
    h = H - (1 + c);

    // Yöntem 2
    if (boyarenki) {
      yontem = 2;
      verim = boyutlarFarkli();
    } else {
      // Yöntem 3
      yontem = 3;
      if (tavanRenk == 0.8 && duvarRenk == 0.5) {
        boyarenki = "A";
      } else if (tavanRenk == 0.5 && duvarRenk == 0.3) {
        boyarenki = "B";
      } else {
        alert("Tavan ve duvar renklerinden emin olun, koyu mu beyaz mı?");
        return;
      }
      boyutlarFarkli();
    }
  }

  const Akisi = E * Alan * d || E * Alan;
  const toplamAkisi = Akisi / verim;
  const sayi = toplamAkisi / lambAkis;

  const newStr = [
    selectedYer,
    a,
    b,
    Alan,
    H,
    K.toFixed(3),
    verim.toFixed(3),
    E,
    tip,
    lamba,
    lambAkis,
    Math.ceil(sayi),
    yontem,
  ];
  addNewLine(newStr);
});

// Sonuç Cetveli Yazdırmak //
document.getElementById("yazdir").addEventListener("click", function () {
  printJS({
    printable: "sonucCetveli",
    type: "html",
    targetStyles: ["*"],
    header: "",
    css: "./style.css",
  });
});
