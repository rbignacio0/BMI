/* =========================================
   BMI Calculator — Frontend Logic
   ========================================= */

(function () {
  'use strict';

  const STORAGE_KEY = 'bmi-calc-v1';
  const DEFAULTS = {
    system: 'metric',
    heightCm: 170,
    weightKg: 70,
    heightFeet: 5,

    weightLb: 150,
  };

  const els = {
    systemRadios: document.querySelectorAll('input[name="system"]'),
    bmiForm: document.getElementById('bmiForm'),
    calcBtn: document.getElementById('calcBtn'),
    btnText: document.querySelector('.btn-text'),
    btnLoading: document.querySelector('.btn-loading'),
    // metric
    heightCm: document.getElementById('heightCm'),
    weightKg: document.getElementById('weightKg'),
    heightLabel: document.getElementById('heightLabel'),
    heightLabelImperial: document.getElementById('heightLabelImperial'),
    weightLabel: document.getElementById('weightLabel'),
    weightLabelLb: document.getElementById('weightLabelLb'),
    heightHint: document.getElementById('heightHint'),
    weightHint: document.getElementById('weightHint'),
    weightHintLb: document.getElementById('weightHintLb'),
    grpHeightCm: document.getElementById('grpHeightCm'),
    grpHeightImperial: document.getElementById('grpHeightImperial'),
    grpWeightLb: document.getElementById('grpWeightLb'),
    // imperial
    heightFeet: document.getElementById('heightFeet'),
    weightLb: document.getElementById('weightLb'),
    // result
    resultCard: document.getElementById('resultCard'),
    errorMsg: document.getElementById('errorMsg'),
    bmiValue: document.getElementById('bmiValue'),
    categoryBadge: document.getElementById('categoryBadge'),
    categoryDesc: document.getElementById('categoryDesc'),
    gaugeProgress: document.getElementById('gaugeProgress'),
    dispHeight: document.getElementById('dispHeight'),
    dispWeight: document.getElementById('dispWeight'),
    dispRange: document.getElementById('dispRange'),
  };

  let system = 'metric';

  /* ---------- persistence ---------- */
  function loadPrefs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p.system) system = p.system;
        return p;
      }
    } catch (_) {}
    return null;
  }

  function savePrefs(payload) {
    try {
      const p = Object.assign({}, loadPrefs() || {}, payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch (_) {}
  }

  function applyPrefs(p) {
    if (!p) return;
    // restore unit system
    if (p.system) {
      system = p.system;
      els.systemRadios.forEach((r) => (r.checked = r.value === p.system));
    }
    // restore inputs
    if (p.heightCm != null) els.heightCm.value = p.heightCm;
    if (p.weightKg != null) els.weightKg.value = p.weightKg;
    if (p.heightFeet != null) els.heightFeet.value = p.heightFeet;

    if (p.weightLb != null) els.weightLb.value = p.weightLb;
  }

  /* ---------- labels / unit switching ---------- */
  function updateLabels() {
    const metric = system === 'metric';
    els.grpHeightCm.style.display = metric ? '' : 'none';
    els.grpHeightImperial.style.display = metric ? 'none' : '';
    els.grpWeightLb.style.display = metric ? 'none' : '';

    if (metric) {
      els.heightLabel.textContent = 'Height (centimeters)';
      els.weightLabel.textContent = 'Weight (kilograms)';
      els.heightHint.textContent = 'e.g. 170 cm';
      els.weightHint.textContent = 'e.g. 70 kg';
      els.heightCm.placeholder = 'e.g. 170';
      els.weightKg.placeholder = 'e.g. 70';
      els.heightCm.step = '0.1';
      els.weightKg.step = '0.1';
      els.heightCm.min = '10';
      els.weightKg.min = '1';
      els.heightCm.max = '300';
      els.weightKg.max = '300';
    } else {
      els.heightLabelImperial.textContent = 'Height (feet)';
      els.weightLabelLb.textContent = 'Weight (pounds)';
      els.weightHintLb.textContent = 'e.g. 150 lb';
      els.heightFeet.placeholder = 'ft';

      els.weightLb.placeholder = 'e.g. 150';
      els.heightFeet.step = '1';

      els.weightLb.step = '0.1';
      els.heightFeet.min = '0';

      els.weightLb.min = '1';
      els.heightFeet.max = '8';

      els.weightLb.max = '1000';
    }
  }

  /* ---------- calculation ---------- */
  // returns { bmi, heightMeters, weightKg, category }
  function compute(system, h, w) {
    let heightMeters, weightKg;

    if (system === 'metric') {
      heightMeters = h / 100; // convert cm to m
      weightKg = w;
    } else {
      // h = feet, w = pounds
      heightMeters = h * 0.3048;
      weightKg = w * 0.45359237;
    }

    const bmi = weightKg / (heightMeters * heightMeters);
    return { bmi, heightMeters, weightKg, category: classify(bmi) };
  }

  function classify(bmi) {
    if (bmi < 18.5) return { cls: 'underweight', cat: 'Underweight', desc: 'Below healthy weight' };
    if (bmi < 25) return { cls: 'normal', cat: 'Normal', desc: 'Healthy weight' };
    if (bmi < 30) return { cls: 'overweight', cat: 'Overweight', desc: 'Above healthy weight' };
    return { cls: 'obese', cat: 'Obese', desc: 'Above healthy weight' };
  }

  /* ---------- gauge ---------- */
  // BMI gauge spans roughly 12 to 40 for visual mapping
  function gaugeOffsetFor(bmi) {
    const minBmi = 12;
    const maxBmi = 40;
    const pct = Math.min(Math.max((bmi - minBmi) / (maxBmi - minBmi), 0), 1);
    const total = 264;
    return total * (1 - pct);
  }

  function categoryColor(cls) {
    switch (cls) {
      case 'underweight': return '#2563eb';
      case 'normal': return '#059669';
      case 'overweight': return '#d97706';
      case 'obese': return '#dc2626';
      default: return '#2563eb';
    }
  }

  /* ---------- healthy range for height ---------- */
  function healthyRangeText(heightMeters, system) {
    const lowKg = 18.5 * heightMeters * heightMeters;
    const highKg = 24.9 * heightMeters * heightMeters;
    if (system === 'metric') {
      return lowKg.toFixed(1) + ' – ' + highKg.toFixed(1) + ' kg';
    }
    const lowLb = lowKg / 0.45359237;
    const highLb = highKg / 0.45359237;
    return lowLb.toFixed(0) + ' – ' + highLb.toFixed(0) + ' lb';
  }

  function displayHeightText(heightMeters, system) {
    if (system === 'metric') return (heightMeters * 100).toFixed(0) + ' cm';



    return (heightMeters / 0.3048).toFixed(2) + ' ft';
  }

  function displayWeightText(weightKg, system) {
    if (system === 'metric') return weightKg.toFixed(1) + ' kg';
    return (weightKg / 0.45359237).toFixed(0) + ' lb';
  }

  /* ---------- rendering ---------- */
  function renderResult(res) {
    const bmi = Number(res.bmi).toFixed(1);
    const cls = res.category;

    els.bmiValue.textContent = bmi;
    els.categoryBadge.textContent = cls.cat;
    els.categoryBadge.className = 'category-badge ' + cls.cls;
    els.categoryDesc.textContent = cls.desc;

    els.dispHeight.textContent = displayHeightText(res.heightMeters, system);
    els.dispWeight.textContent = displayWeightText(res.weightKg, system);
    els.dispRange.textContent = healthyRangeText(res.heightMeters, system);

    requestAnimationFrame(() => {
      els.gaugeProgress.style.stroke = categoryColor(cls.cls);
      els.gaugeProgress.style.strokeDashoffset = gaugeOffsetFor(res.bmi);
    });

    els.errorMsg.style.display = 'none';
    els.resultCard.style.display = 'block';
    els.resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function clearResults() {
    els.resultCard.style.display = 'none';
    els.errorMsg.style.display = 'none';
  }

  function showError(msg) {
    els.errorMsg.textContent = msg;
    els.errorMsg.style.display = 'block';
    els.resultCard.style.display = 'none';
  }

  function setLoading(loading) {
    els.calcBtn.disabled = loading;
    els.btnText.style.display = loading ? 'none' : 'inline';
    els.btnLoading.style.display = loading ? 'inline' : 'none';
  }

  /* ---------- validation ---------- */
  function validate() {
    if (system === 'metric') {
      const h = parseFloat(els.heightCm.value);
      const w = parseFloat(els.weightKg.value);
      if (isNaN(h) || h <= 0) return 'Please enter a valid positive height.';
      if (isNaN(w) || w <= 0) return 'Please enter a valid positive weight.';
      return null;
    }
    const ft = parseFloat(els.heightFeet.value || 0);

    const w = parseFloat(els.weightLb.value);

    if (!isNaN(ft) && (ft < 0 || ft > 8)) return 'Feet must be between 0 and 8.';

    if (ft <= 0) return 'Please enter a valid positive height.';
    if (isNaN(w) || w <= 0) return 'Please enter a valid positive weight.';
    return null;
  }


  function gatherInputs() {
    if (system === 'metric') {
      return {
        h: parseFloat(els.heightCm.value),
        w: parseFloat(els.weightKg.value),
      };
    }
    return {
      h: parseFloat(els.heightFeet.value || 0),
      w: parseFloat(els.weightLb.value),

    };
  }

  /* ---------- submit ---------- */
  async function handleSubmit(e) {
    e.preventDefault();
    clearResults();

    const err = validate();
    if (err) {
      showError(err);
      return;
    }

    setLoading(true);
    try {
      // Try API first if available (online mode), fallback to client-side
      let res;
      try {
        const inputs = gatherInputs();
        const fetchRes = await fetch('/bmicalc/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ system, ...inputs })
        });
        if (fetchRes.ok) {
          const data = await fetchRes.json();
          res = {
            bmi: data.Bmi,
            heightMeters: data.HeightMeters,
            weightKg: data.WeightKg,
            category: data.Category
          };
        } else {
          // API returned error, fallback to client-side
          throw new Error('API error');
        }
      } catch (fetchErr) {
        // Fallback to client-side calculation (offline mode)
        console.log('API not available, using client-side calculation');
        const inputs = gatherInputs();
        res = compute(system, inputs.h, inputs.w);
      }

      savePrefs({
        system,
        heightCm: system === 'metric' ? inputs.h : Math.round(res.heightMeters * 100),
        weightKg: system === 'metric' ? inputs.w : res.weightKg,
        heightFeet: system === 'imperial' ? inputs.h : undefined,

        weightLb: system === 'imperial' ? inputs.w : undefined,
      });
      renderResult(res);
    } catch (err) {
      showError(err.message || 'Unable to calculate BMI. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  /* ---------- init ---------- */
  function init() {
    const prefs = loadPrefs();
    applyPrefs(prefs);

    if (prefs && prefs.system) {
      system = prefs.system;
      els.systemRadios.forEach((r) => (r.checked = r.value === system));
    }

// Auto-convert values when switching unit systems
function convertValues() {
  if (system === 'metric') {
    // metric -> imperial
    const hCm = parseFloat(els.heightCm.value);
    const wKg = parseFloat(els.weightKg.value);
    if (!isNaN(hCm) && hCm > 0) els.heightFeet.value = (hCm / 30.48).toFixed(2);
    if (!isNaN(wKg) && wKg > 0) els.weightLb.value = (wKg / 0.45359237).toFixed(2);
  } else {
    // imperial -> metric
    const hFt = parseFloat(els.heightFeet.value);
    const wLb = parseFloat(els.weightLb.value);
    if (!isNaN(hFt) && hFt > 0) els.heightCm.value = (hFt * 30.48).toFixed(1);
    if (!isNaN(wLb) && wLb > 0) els.weightKg.value = (wLb * 0.45359237).toFixed(1);
  }
}

    els.systemRadios.forEach((radio) => {
      radio.addEventListener('change', (e) => {
        system = e.target.value;
        convertValues();
        savePrefs({ system });
        updateLabels();
        clearResults();
      });
    });

    els.bmiForm.addEventListener('submit', handleSubmit);
    // Auto-clear stale results when user edits any input
    const allInputs = [els.heightCm, els.weightKg, els.heightFeet, els.weightLb];
    allInputs.forEach((input) => {
      input.addEventListener('input', () => {
        clearResults();
      });
    });


    updateLabels();

    // Restore last result if present
    if (prefs && prefs.lastBmi != null) {
      renderResult({
        bmi: prefs.lastBmi,
        heightMeters: prefs.lastHeightMeters,
        weightKg: prefs.lastWeightKg,
        category: classify(prefs.lastBmi),
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Inject manifest link only when served over http/https (avoids CORS on file://)
  if (location.protocol === 'http:' || location.protocol === 'https:') {
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = 'manifest.json';
    document.head.appendChild(manifestLink);
  }

  // Service worker registration (secure contexts only)
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('sw.js').catch((_) => {});
  }
})();



