let currentUser = null;

function show(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function signup() {
  const email = val("email");
  if (localStorage.getItem(email)) return alert("User already exists");

  localStorage.setItem(email, JSON.stringify({
    name: val("name"),
    password: val("password"),
    guardian: val("guardian"),
    reminders: [],
    appointments: []
  }));
  login();
}

function login() {
  const email = val("email");
  const user = JSON.parse(localStorage.getItem(email));
  if (!user || user.password !== val("password"))
    return alert("Invalid login");

  currentUser = email;
  document.getElementById("auth").classList.add("hidden");
  document.getElementById("navbar").classList.remove("hidden");
  document.getElementById("guardianNo").innerText = user.guardian;
  document.getElementById("welcomeMsg").innerText = `Welcome, ${user.name}`;
  show("home");
  loadData();
}

function logout() {
  location.reload();
}

function addReminder() {
  const u = getUser();
  u.reminders.push({
    name: val("medName"),
    time: val("medTime"),
    days: val("medDays"),
    done: false
  });
  saveUser(u);
  loadData();
}

function bookAppointment() {
  const u = getUser();
  u.appointments.push({
    text: `${val("doctor")} | ${val("appDate")} ${val("appTime")} | ${val("appReason")}`,
    done: false
  });
  saveUser(u);
  loadData();
}

function loadData() {
  const u = getUser();

  const r = document.getElementById("reminderList");
  r.innerHTML = "";
  u.reminders.forEach((m,i) => {
    r.innerHTML += `
      <li>
        💊 ${m.name} at ${m.time} (${m.days} days)
        ${m.done ? "✅" : `<button onclick="markMed(${i})">Mark Done</button>`}
      </li>`;
  });

  const a = document.getElementById("appointmentList");
  a.innerHTML = "";
  u.appointments.forEach((x,i) => {
    a.innerHTML += `
      <li>
        📅 ${x.text}
        ${x.done ? "✅" : `<button onclick="markApp(${i})">Mark Done</button>`}
      </li>`;
  });
}

function markMed(i) {
  const u = getUser();
  u.reminders[i].done = true;
  saveUser(u);
  loadData();
}

function markApp(i) {
  const u = getUser();
  u.appointments[i].done = true;
  saveUser(u);
  loadData();
}

function sendEmergencyNotification() {
  const u = getUser();
  const msg = `🚨 EMERGENCY! Contact guardian: ${u.guardian}`;
  if ("Notification" in window) {
    if (Notification.permission === "granted")
      new Notification("MEDISYNC Emergency", { body: msg });
    else Notification.requestPermission();
  }
  alert(msg);
}

function showTodaySchedule() {
  const u = getUser();
  let out = "📅 TODAY'S SCHEDULE\n\n";
  u.reminders.forEach(m => out += `💊 ${m.name} at ${m.time}\n`);
  u.appointments.forEach(a => out += `📅 ${a.text}\n`);
  alert(out || "No schedule today");
}

function val(id) {
  return document.getElementById(id).value;
}
function getUser() {
  return JSON.parse(localStorage.getItem(currentUser));
}
function saveUser(u) {
  localStorage.setItem(currentUser, JSON.stringify(u));
}
