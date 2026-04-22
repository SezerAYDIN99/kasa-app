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

  // BURASI SENİN MEVCUT SİSTEMİN
  console.log(sayfa + " açıldı");

  // örnek:
  // document.getElementById("icerik").innerHTML = ...
}
