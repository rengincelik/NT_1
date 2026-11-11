// Türkçe
export default {
  meta: {
    title: "Narkolepsi",
    description: "2 dakikada narkolepsi ön taraması (İsviçre Narkolepsi Ölçeği).",
    dateLocale: "tr-TR",
  },

  site: { name: "Narkolepsi" },

  nav: {
    aria: "Ana menü",
    home: "Ana sayfa",
    about: "Hakkımda",
    narcolepsy: "Narkolepsi",
    test: "Test",
  },

  lang: { label: "Dil" },

	theme: { toggle: "Koyu tema" },

  refs: {
    title: "Kaynaklar",
    cite: "Kaynak {n}",
  },

	about: {
		lead: "Kendimi bildim bileli aşırı yorgun ve uykuluydum. Yer, zaman fark etmeksizin her an, her yerde uyuyabiliyordum. Ne zaman doktora gitsem hep aynı yanıtı aldım: 'Tahlillerin temiz, bir sorunun yok.'",
		big: "Sonunda gerçeği öğrendim: Haklıymışım, ortada gerçekten ciddi bir problem varmış.",
		p1: "Bu siteyi benimle benzer durumda olan ve 'bende bir gariplik var' diyen kişiler için hazırladım. Aşağıda 2 farklı tarama testi göreceksiniz. Epworth (ESS) genel gün içi uykululuk seviyenizi ölçerken, İsviçre Narkolepsi Ölçeği (SNS) özellikle Tip 1 Narkolepsi semptomlarına odaklanır. Bu testler teşhis koymaz ama klinik durumlarda yüksek paralellik gösterir.",
		p2: "Uyku sağlığımızın en kritik ama en çok ihmal edilen parçası. Eğer tükenmişliğinizle ilgili en ufak bir şüpheniz varsa, bu testleri çözmek size bir fikir verebilir. Sonuçlarınız şüphe uyandırırsa bir uzmana görünmekte fayda var. Narkolepsi hakkında daha detaylı açıklamayı ise sayfanın devamında bulabilirsiniz."
	},

  home: {
    tagline: "İsviçre Narkolepsi Ölçeği (SNS) · yaklaşık 2 dakika",
    start: "Teste geç",
    views: "görüntülenme",
    tests: "tamamlanan test",
  },

  // body: paragraf dizisi. "## " ile başlayan satır başlık olur. [@anahtar] kaynak numarası ekler (js/references.js).

	narcolepsy: {
		title: "Narkolepsi",
		body: [
			"Narkolepsi, beynin uyku-uyanıklık döngüsünü düzgün düzenleyememesine bağlı, kronik nörolojik bir aşırı uykululuk hastalığıdır.[@scammell2015][@bassetti2021] Genellikle ergenlikte ya da genç yetişkinlikte başlar ve ömür boyu sürer.[@dauvilliers2007]",
			"Kataplektik narkolepsi dünyada yetişkinlerin yaklaşık %0,02'sini, yani yaklaşık 2.000 kişide 1'ini etkiler.[@dauvilliers2007] Belirtiler çoğu zaman narkolepsi olarak tanınmaz ve çalışmalar tanıya kadar geçen ortalama sürenin 15 yıla kadar çıkabildiğini bildirir.[@thorpy2014]",

			"## Nedeni",
			"Tip 1 narkolepsinin ayırt edici özelliği, hipotalamusun lateral bölgesindeki oreksin (hipokretin) üreten sinir hücrelerinin kaybıdır.[@nishino2000][@thannickal2000] En olası açıklama otoimmün bir süreçtir.[@dauvilliers2007][@bassetti2021]",
			"Genetik yatkınlık: kataplektik narkolepsisi olanların neredeyse tamamı HLA-DQB1*06:02 aleline sahiptir.[@mignot2001]",
			"Çevresel tetikleyiciler: şimdiye kadar saptanan en güçlü çevresel risk, hem enfeksiyon hem aşı yoluyla influenza A (H1N1)'dir.[@bonvalet2017]",

			"## Beş belirti",
			"Narkolepsi, gece uykusunun bölünmesini de içeren beş belirtiyle (pentad) tanımlanır.[@dauvilliers2007]",
			"1. Aşırı gündüz uykululuğu. Her hastada vardır: sürekli uykulu olma ve gün boyunca karşı konulamaz uyku atakları.[@scammell2015]",
			"2. Katapleksi. Kahkaha, heyecan ya da öfke gibi güçlü duyguların tetiklediği, bilinç açıkken ani ve kısa süreli kas gücü kaybı.[@sturzenegger2004]",
			"3. Uyku felci. Uykuya dalarken ya da uyanırken geçici olarak hareket edememe veya konuşamama.[@dauvilliers2007]",
			"4. Hipnagojik / hipnopompik halüsinasyonlar. Uykuya dalarken ya da uyanırken yaşanan canlı, çoğu zaman korkutucu algılar.[@dauvilliers2007]",
			"5. Bölünen gece uykusu. Gündüz uykulu olunmasına rağmen gece sık hareket etme ve sık uyanma.[@dauvilliers2007]",

			"## Türleri",
			"Uluslararası Uyku Bozuklukları Sınıflaması (3. baskı) iki tür ayırır.[@aasm2014][@sateia2014]",
			"Tip 1 (NT1): katapleksi vardır ya da beyin-omurilik sıvısında (BOS) hipokretin-1 düzeyi düşüktür (110 pg/mL veya altı).",
			"Tip 2 (NT2): katapleksi yoktur, BOS hipokretin-1 düzeyi normaldir ya da ölçülmemiştir.",

			"## Tanı nasıl konur",
			"Kesin tanı, kapsamlı bir klinik ve laboratuvar değerlendirmesi gerektirir.[@aasm2014]",
			"Gece polisomnografisi (PSG), gece uykusunun yapısına bakar ve obstrüktif uyku apnesi gibi diğer nedenleri dışlar.",
			"Çoklu Uyku Latansı Testi (MSLT), uykuya ne kadar hızlı daldığınızı (ortalama 8 dakika veya daha kısa) ve uykuya dalıştan hemen sonra REM uykusunun başlayıp başlamadığını (iki veya daha fazla uyku başlangıcı REM dönemi) ölçer.[@aasm2014][@littner2005]",
			"Bu sitedeki test olan İsviçre Narkolepsi Ölçeği (SNS), Tip 1 narkolepsi için kullanılan, beş soruluk kısa bir tarama aracıdır ve soruları yukarıdaki beş belirtiyi kapsar. Farklı toplumlarda yapılan çalışmalar, Tip 1 narkolepsiyi diğer uykululuk nedenlerinden yüksek duyarlılık ve özgüllükle ayırdığını göstermiştir.[@sturzenegger2004][@sturzenegger2018][@bargiotas2019] Ölçeğin Türkçe sürümünün geçerlik ve güvenirliği gösterilmiştir.[@demir2023] Tip 2'yi saptayamaz ve bir tarama aracı tanının yerini tutmaz.[@bargiotas2019]",
			"BOS hipokretin-1 ölçümü, Tip 1 narkolepsi için altın standart biyobelirteçtir.[@nishino2000]",

			"## Tedavi",
			"Tedavi, ilaçları davranışsal önlemlerle birleştirir ve genellikle ömür boyu sürdürülmesi gerekir.[@bassetti2021]",
			"Planlı gündüz şekerlemeleri ve çeşitli ilaçlar uykululuğu azaltır, başka ilaçlar da katapleksiyi azaltır. Seçim kişinin belirtilerine bağlıdır ve bir uzman tarafından yapılır.[@bassetti2021]",
			"Oreksin reseptör agonistleri, doğrudan hipokretin eksikliğini hedefleyen yeni bir yaklaşımdır. Ağustos 2026'da FDA, oral bir oreksin reseptör-2 (OX2R) agonisti olan oveporexton'u (Orzeyful) yetişkinlerde Tip 1 narkolepsi için onayladı. Oreksin sinyalinin kaybını doğrudan hedefleyen ilk ilaçtır.[@fda2026]",

			"## Sonra ne yapmalı",
			"Bu belirtiler size tanıdık geliyorsa bir nöroloji ya da uyku tıbbı uzmanına başvurun. Uykululuğunuzun, kas güçsüzlüğünüzün ve uyku sorunlarınızın ne zaman olduğunu ve kullandığınız ilaçları not edip yanınızda götürün.",
			"Hiçbir ilacı kendi kendinize başlamayın, bırakmayın ya da değiştirmeyin. Tarama testi yalnızca ilk adımdır.",
		],
	},

  test: {
    title: "Kendini test et",
    switchLabel: "Test seç",
    progress: "Soru {n} / {total}",
    prev: "← Geri",
    next: "İleri →",
    finish: "Sonucu gör",
    tip: "{min}–{max} tuşlarıyla cevapla, ok tuşlarıyla ya da sağa sola kaydırarak gez.",
  },

  // Testler: her test kendi adı, alt başlığı, soruları, seçenekleri, sonuç mesajları ve PDF özetiyle ayrı bir blok.
  // Yeni test: config.js > TESTS'e ekle, buraya tests.<id> bloğu ekle (ARCHITECTURE.md > Yeni test ekleme).
  tests: {
    sns: {
      name: "İsviçre Narkolepsi Ölçeği (SNS)",
      subtitle: "İsviçre Narkolepsi Ölçeği (SNS) · yaklaşık 2 dakika",

      questions: [
        "Gündüz vakti kendinizi aniden uykuya dalarken buluyor musunuz?",
        "Heyecanlandığınızda, güldüğünüzde veya öfkelendiğinizde kaslarınızda ani bir gevşeme veya güçsüzlük (diz çözülmesi, çene düşmesi vb.) hissediyor musunuz?",
        "Gece uykularınız sık sık bölünür mü, deliksiz uyumakta zorlanır mısınız?",
        "Uykuya dalarken veya uyanırken vücudunuzu hareket ettiremediğiniz (uyku felci) durumlar oluyor mu?",
        "Uykuya dalarken veya uyanırken rüya benzeri, çok canlı ve korkutucu görüntüler ya da sesler (halüsinasyon) yaşar mısınız?",
      ],

      scale: ["Hiç", "Nadiren", "Bazen", "Sık", "Hep"],

      messages: {
        suspect: {
          title: "Skorun şüpheli bir duruma işaret ediyor",
          body: "Bunu ihmal etme. Bir nöroloji veya uyku uzmanından randevu almayı erteleme. Yalnız değilsin.",
        },
        unlikely: {
          title: "Skorun eşiğin altında",
          body: "Bu, bir sorun olmadığı anlamına gelmez. Yine de şikâyetlerin devam ediyorsa bir uzmana danış.",
        },
        neutral: {
          title: "Cevapların alındı",
          body: "Skorunu yorumlayan eşik henüz eklenmedi. Şikâyetlerin seni rahatsız ediyorsa bir nöroloji veya uyku uzmanıyla konuş. Yalnız değilsin.",
        },
      },

      print: {
        title: "Narkolepsi ön tarama cevapları",
        note: "Bu özet bir teşhis değildir. Bir nöroloji veya uyku uzmanıyla paylaşmak için hazırlanmıştır.",
      },
    },

    ess: {
      name: "Epworth Uykululuk Ölçeği (ESS)",
      subtitle: "Epworth Uykululuk Ölçeği (ESS) · yaklaşık 2 dakika",

      // Yönerge ve maddeler lisanslı metindir (Mapi Research Trust, ESS_AU1.0_tur-TR1_10NOV2022). Değiştirme.
      intro: [
        "Aşağıdaki durumlarda sadece yorgun hissediyor olmak yerine, uyuklamaya ya da uykuya dalmaya ne kadar eğilimlisiniz?",
        "Bu ankete yakın zamanlardaki olağan yaşam biçiminizi düşünerek cevap veriniz.",
        "Bunlardan bazılarını yakın zamanda yapmamış olsanız bile, olsaydı sizi nasıl etkilemiş olacağını bulmaya çalışınız.",
        "Her soruyu yapabileceğiniz en iyi biçimde cevaplandırmanız önemlidir.",
      ],

      questions: [
        "Otururken ve okurken",
        "TV seyrederken",
        "Umumi bir yerde (örn. sinema, tiyatro ya da bir toplantıda) bir şey yapmadan otururken",
        "Bir arabada bir saat boyunca ara vermeden yolcu olarak bulunurken",
        "Öğleden sonra koşullar izin verdiğinde dinlenmek için uzanırken",
        "Biriyle oturup konuşurken",
        "Alkol almadığınız bir öğle yemeği sonrası sessizce otururken",
        "Bir arabada, trafikte birkaç dakika duruyorken",
      ],

      scale: ["Hiç uyuklama yok", "Uyuklama ihtimali hafif", "Uyuklama ihtimali orta düzeyde", "Uyuklama ihtimali yüksek"],

      // Bant başlıkları yazarın yorum adlarının karşılığıdır (ESS Scaling and Scoring v2.0). Gövde metinleri bize aittir, lisanslı değildir.
      messages: {
        lowerNormal: {
          title: "Normal aralıkta, düşük gündüz uykululuğu",
          body: "Skorun normal aralığın alt kısmında. Yine de gündüzleri alışılmadık derecede uykulu hissediyorsan ya da seni endişelendiren başka belirtiler varsa bir hekimle konuş. Tek başına bir skor hiçbir şeyi dışlamaz.",
        },
        higherNormal: {
          title: "Normal aralıkta, yüksek gündüz uykululuğu",
          body: "Skorun normal aralıkta, ama üst kısmında. Birçok sağlıklı insan bu aralıkta çıkar. Uykululuk günlük hayatını zorluyorsa bir hekime söyle.",
        },
        mild: {
          title: "Hafif düzeyde aşırı gündüz uykululuğu",
          body: "Skorun hafif düzeyde aşırı gündüz uykululuğuna işaret ediyor. Nedenleri çok olabilir: yetersiz uyku ya da uyku apnesi gibi uyku bozuklukları. Özellikle sık tekrarlıyorsa bir hekimle konuşmaya değer.",
        },
        moderate: {
          title: "Orta düzeyde aşırı gündüz uykululuğu",
          body: "Skorun orta düzeyde aşırı gündüz uykululuğuna işaret ediyor. Nedenleri çok olabilir, bir hekim ya da uyku uzmanı bunları araştırabilir. Araba kullanırken dikkatli ol, uykulu hissediyorsan kullanma.",
        },
        severe: {
          title: "Ağır düzeyde aşırı gündüz uykululuğu",
          body: "Skorun ağır düzeyde aşırı gündüz uykululuğuna işaret ediyor. Lütfen yakın zamanda bir hekime ya da uyku uzmanına başvur. Uykulu hissediyorsan araç ya da makine kullanma.",
        },
      },

      print: {
        title: "Epworth Uykululuk Ölçeği cevapları",
        note: "Bu özet bir teşhis değildir. ESS genel gündüz uykululuğunu ölçer, nedenini göstermez. Bir hekim ya da uyku uzmanıyla paylaşmak için hazırlanmıştır.",
      },

      copyright: "ESS © MW Johns 1990-1997. Lisans ile kullanılır",
    },
  },

  result: {
    cover: "Silerek gör",
    hint: "Parmağınla ya da fareyle silerek sonucu gör.",
    skip: "Silmeden göster",
    pdf: "PDF olarak kaydet",
    pdfTip: "Açılan pencerede hedef olarak \"PDF olarak kaydet\"i seç. Doktora götürebileceğin bir cevap özeti çıkar.",
    edit: "Cevapları düzenle",
    restart: "Baştan başla",
    score: "Skor: {score} / {max}",
  },

  share: {
    button: "WhatsApp'ta paylaş",
    text: "2 dakikada narkolepsi ön taraması. Kendimde fark etmem 15 yıl sürdü, belki sana da yardımı olur:",
  },

  footer: {
    role: "Kısa bir tanım",
    note: "Bu sayfa bir teşhis aracı değildir. Yalnızca bir nöroloji veya uyku uzmanına gitmen gerekip gerekmediği konusunda fikir verir. Cevapların bu cihazdan çıkmaz, hiçbir yere kaydedilmez.",
    statsNote: "Bu site yalnızca ziyaret ve tamamlanan test sayısını anonim olarak sayar. Cevapların ve sonucun hiçbir yere gönderilmez.",
  },
};