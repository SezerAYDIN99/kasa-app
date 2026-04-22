const supabaseUrl = "https://ffzkszqwbnbemxifnsdf.supabase.co";
const supabaseKey = "sb_publishable_cleGW4OCPFllXjiJzq6Rqg_cSETwd0Y";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Yetki kontrol
async function yetkiKontrol(sayfa) {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    alert("Giriş yapmanız gerekiyor");
    return false;
  }

  const { data } = await supabase
    .from("yetkiler")
    .select("*")
    .eq("email", user.email);

  if (!data || data.length === 0) {
    alert("Yetkiniz yoktur");
    return false;
  }

  // ADMIN kontrol
  const adminMi = data.some(x => x.rol === "admin");
  if (adminMi) return true;

  // SAYFA kontrol
  const izinVar = data.some(x => 
    x.sayfa && x.sayfa.toLowerCase() === sayfa.toLowerCase()
  );

  if (!izinVar) {
    alert("Bu sayfaya yetkiniz yok");
    return false;
  }

  return true;
}
async function baslat() {
  const izin = await yetkiKontrol("dashboard");

  if (!izin) return;

  console.log("Giriş başarılı");
}

baslat();
async function loadNakit(){

  const { data, error } = await supabase
    .from("banka_ozet")
    .select("*");

  if(error){
    alert(error.message);
    return;
  }

  const table = document.getElementById("bankaTable");
  table.innerHTML = "";

  let toplam = 0;

  data.forEach(r => {

    toplam += Number(r.toplam || 0);

    table.innerHTML += `
      <tr>
        <td>${r.banka}</td>
        <td>${Number(r.tl).toFixed(2)}</td>
        <td>${Number(r.usd).toFixed(2)}</td>
        <td>${Number(r.euro).toFixed(2)}</td>
        <td>${Number(r.altin).toFixed(2)}</td>
        <td>${Number(r.toplam).toFixed(2)}</td>
      </tr>
    `;
  });

  document.getElementById("toplamBakiye").innerText =
    toplam.toFixed(2) + " ₺";
}


async function girisYap() {
  const email = document.getElementById("email").value;
  const sifre = document.getElementById("sifre").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: sifre
  });

  if (error) {
    alert("Giriş hatalı");
    return;
  }

  alert("Giriş başarılı");
  location.reload();
}

async function sayfaAc(sayfa) {

  const izin = await yetkiKontrol(sayfa);
  if (!izin) return;

  if(sayfa === "nakit"){
    loadNakit();
  }

  console.log(sayfa + " açıldı");
}
