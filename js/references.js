// Kaynak kayıtları (dilden bağımsız). Metinde [@anahtar] ile kullanılır.
// { anahtar: { text, url? } }  url yalnızca http(s):// ile başlarsa link olur.
// Hepsi 2026-11-10'da PubMed / yayıncı / DOI kayıtlarıyla karşılaştırıldı.
export const REFERENCES = {
  aasm2014: {
    text: "American Academy of Sleep Medicine (AASM). (2014). International Classification of Sleep Disorders (3rd ed.). Darien, IL: AASM.",
    // Kitap, DOI yok. Bilerek link verilmedi.
  },
  bargiotas2019: {
    text: "Bargiotas, P., et al. (2019). The Swiss Narcolepsy Scale (SNS) and its short form (sSNS) for the discrimination of narcolepsy in patients with central disorders of hypersomnolence. Journal of Neurology, 266, 2137-2143.",
    url: "https://doi.org/10.1007/s00415-019-09365-2",
  },
  bassetti2021: {
    text: "Bassetti, C. L. A., et al. (2021). European guideline and expert statements on the management of narcolepsy in adults and children. European Journal of Neurology, 28(9), 2815-2830.",
    url: "https://doi.org/10.1111/ene.14888",
  },
  bonvalet2017: {
    text: "Bonvalet, M., Ollila, H. M., Ambati, A., & Mignot, E. (2017). Autoimmunity in narcolepsy. Current Opinion in Pulmonary Medicine, 23(6), 522-529.",
    url: "https://doi.org/10.1097/MCP.0000000000000426",
  },
  dauvilliers2007: {
    text: "Dauvilliers, Y., Arnulf, I., & Mignot, E. (2007). Narcolepsy with cataplexy. The Lancet, 369(9560), 499-511.",
    url: "https://doi.org/10.1016/S0140-6736(07)60237-2",
  },
  demir2023: {
    text: "Demir, A. B., Bargiotas, P., Tuncel Berktaş, D., İsmailoğulları, S., Akyıldız, U. O., Karadeniz, D., Benbir Şenel, G., & Bassetti, C. L. A. (2023). A Turkish validity and reliability study of the Swiss Narcolepsy Scale. Clinical and Translational Neuroscience, 7(3), 16.",
    url: "https://doi.org/10.3390/ctn7030016",
  },
  fda2026: {
    text: "U.S. Food and Drug Administration. (2026, August 5). FDA approves first drug to treat the full range of narcolepsy type 1 symptoms [Press announcement].",
    url: "https://www.fda.gov/news-events/press-announcements/fda-approves-first-drug-treat-full-range-narcolepsy-type-1-symptoms",
  },
  littner2005: {
    text: "Littner, M. R., et al. (2005). Practice parameters for clinical use of the multiple sleep latency test and the maintenance of wakefulness test. Sleep, 28(1), 113-121.",
    url: "https://doi.org/10.1093/sleep/28.1.113",
  },
  mignot2001: {
    text: "Mignot, E., Lin, L., Rogers, W., Honda, Y., Qiu, X., Lin, X., ... & Risch, N. (2001). Complex HLA-DR and -DQ interactions confer risk of narcolepsy-cataplexy in three ethnic groups. American Journal of Human Genetics, 68(3), 686-699.",
    url: "https://pubmed.ncbi.nlm.nih.gov/11179016/",
  },
  nishino2000: {
    text: "Nishino, S., Ripley, B., Overeem, S., Lammers, G. J., & Mignot, E. (2000). Hypocretin (orexin) deficiency in human narcolepsy. The Lancet, 355(9197), 39-40.",
    url: "https://doi.org/10.1016/S0140-6736(99)05582-8",
  },
  sateia2014: {
    text: "Sateia, M. J. (2014). International classification of sleep disorders-third edition: highlights and modifications. Chest, 146(5), 1387-1394.",
    url: "https://doi.org/10.1378/chest.14-0970",
  },
  scammell2015: {
    text: "Scammell, T. E. (2015). Narcolepsy. New England Journal of Medicine, 373(27), 2654-2662.",
    url: "https://doi.org/10.1056/NEJMra1500587",
  },
  sturzenegger2004: {
    text: "Sturzenegger, C., & Bassetti, C. L. (2004). The clinical spectrum of narcolepsy with cataplexy: a reappraisal. Journal of Sleep Research, 13(4), 395-406.",
    url: "https://doi.org/10.1111/j.1365-2869.2004.00422.x",
  },
  sturzenegger2018: {
    text: "Sturzenegger, C., Baumann, C. R., Lammers, G. J., Kallweit, U., van der Zande, W. L., & Bassetti, C. L. (2018). Swiss Narcolepsy Scale: a simple screening tool for hypocretin-deficient narcolepsy with cataplexy. Clinical and Translational Neuroscience, 2(2), 34.",
    url: "https://doi.org/10.1177/2514183X18794175",
  },
  thannickal2000: {
    text: "Thannickal, T. C., Moore, R. Y., Nienhuis, R., Ramanathan, L., Gulyani, S., Aldrich, M., Cornford, M., & Siegel, J. M. (2000). Reduced number of hypocretin neurons in human narcolepsy. Neuron, 27(3), 469-474.",
    url: "https://doi.org/10.1016/S0896-6273(00)00058-1",
  },
  thorpy2014: {
    text: "Thorpy, M. J., & Krieger, A. C. (2014). Delayed diagnosis of narcolepsy: characterization and impact. Sleep Medicine, 15(5), 502-507.",
    url: "https://doi.org/10.1016/j.sleep.2014.01.015",
  },
};
