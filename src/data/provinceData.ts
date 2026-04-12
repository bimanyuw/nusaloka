import type { ProvinceInfo } from "@/types/province";

export const fallbackProvinceData: ProvinceInfo = {
  score: 65,
  status: "Waspada",
  recommendation:
    "Pantau pasokan dan harga komoditas utama. Koordinasikan dengan BULOG untuk buffer stock.",
  substitution:
    "Diversifikasi ke komoditas lokal yang tersedia di wilayah sekitar.",
  production: 120000,
  demand: 135000,
  priceIndex: 8,
  topCommodity: "Beras",
  cluster: "stabil",
  riskFactors: ["Pasokan sedikit di bawah kebutuhan", "Harga fluktuatif"],
  shapFactors: [
    { label: "Harga beras", value: -3.2, direction: "neg" },
    { label: "Prod. lokal", value: -2.1, direction: "neg" },
    { label: "Logistik", value: 1.8, direction: "pos" },
  ],
};

export const provinceData: Record<string, ProvinceInfo> = {
  Aceh: {
    score: 80,
    status: "Aman",
    recommendation:
      "Pertahankan buffer stock beras dan optimalkan distribusi ke wilayah pedalaman. Manfaatkan surplus untuk redistribusi ke Sumatra Utara jika diperlukan.",
    substitution:
      "Jagung dan ubi kayu tersedia sebagai substitusi beras saat harga naik. Sagu lokal juga potensial untuk wilayah pesisir.",
    production: 1850000,
    demand: 1620000,
    priceIndex: 2,
    topCommodity: "Beras",
    cluster: "surplus",
    riskFactors: ["Curah hujan tidak merata di beberapa kabupaten"],
    shapFactors: [
      { label: "Prod. lokal", value: 4.2, direction: "pos" },
      { label: "Logistik", value: 3.1, direction: "pos" },
      { label: "Harga beras", value: -1.4, direction: "neg" },
    ],
  },

  "Sumatera Utara": {
    score: 81,
    status: "Aman",
    recommendation:
      "Tingkatkan kapasitas cold storage untuk komoditas hortikultura. Distribusi ke wilayah terpencil Nias perlu diperkuat.",
    substitution:
      "Ubi jalar dan singkong berlimpah sebagai cadangan karbohidrat alternatif.",
    production: 3820000,
    demand: 3540000,
    priceIndex: 3,
    topCommodity: "Beras",
    cluster: "surplus",
    riskFactors: ["Ketimpangan distribusi antara pesisir dan dataran tinggi"],
    shapFactors: [
      { label: "Prod. lokal", value: 5.1, direction: "pos" },
      { label: "Logistik", value: 2.8, direction: "pos" },
      { label: "Curah hujan", value: 1.2, direction: "pos" },
      { label: "Harga", value: -1.9, direction: "neg" },
    ],
  },

  "Sumatera Barat": {
    score: 75,
    status: "Waspada",
    recommendation:
      "Perkuat jalur distribusi dari Padang ke kabupaten terpencil. Waspadai dampak cuaca ekstrem terhadap tanaman padi.",
    substitution:
      "Sagu dan singkong lokal dapat menggantikan beras saat musim paceklik.",
    production: 1320000,
    demand: 1280000,
    priceIndex: 6,
    topCommodity: "Beras",
    cluster: "stabil",
    riskFactors: ["Risiko bencana alam mengganggu rantai distribusi", "Harga fluktuatif di pasar lokal"],
    shapFactors: [
      { label: "Prod. lokal", value: 2.1, direction: "pos" },
      { label: "Risiko bencana", value: -3.4, direction: "neg" },
      { label: "Logistik", value: -1.8, direction: "neg" },
    ],
  },

  Riau: {
    score: 74,
    status: "Waspada",
    recommendation:
      "Kurangi ketergantungan impor beras dari Sumatera Utara. Tingkatkan kapasitas produksi lokal dan efisiensi distribusi antar kabupaten.",
    substitution:
      "Sagu Riau sangat potensial sebagai substitusi utama dengan nilai gizi kompetitif.",
    production: 620000,
    demand: 890000,
    priceIndex: 9,
    topCommodity: "Sagu",
    cluster: "stabil",
    riskFactors: ["Defisit produksi beras cukup tinggi", "Ketergantungan impor dari luar provinsi"],
    shapFactors: [
      { label: "Supply gap", value: -4.2, direction: "neg" },
      { label: "Harga", value: -2.9, direction: "neg" },
      { label: "Logistik sagu", value: 3.1, direction: "pos" },
    ],
  },

  Jambi: {
    score: 71,
    status: "Waspada",
    recommendation:
      "Tingkatkan produksi padi di lahan rawa yang belum optimal. Koordinasikan distribusi dengan Sumatera Selatan untuk mengatasi defisit musiman.",
    substitution:
      "Singkong dan jagung lokal tersedia luas sebagai substitusi karbohidrat.",
    production: 780000,
    demand: 870000,
    priceIndex: 10,
    topCommodity: "Beras",
    cluster: "stabil",
    riskFactors: ["Musim kemarau panjang mempengaruhi produksi", "Infrastruktur distribusi terbatas"],
    shapFactors: [
      { label: "Prod. padi", value: -3.1, direction: "neg" },
      { label: "Musim", value: -2.4, direction: "neg" },
      { label: "Logistik", value: -1.6, direction: "neg" },
      { label: "Singkong lokal", value: 2.8, direction: "pos" },
    ],
  },

  "Sumatera Selatan": {
    score: 76,
    status: "Waspada",
    recommendation:
      "Manfaatkan kapasitas produksi besar Musi Banyuasin untuk redistribusi ke provinsi tetangga. Perbaiki jaringan jalan distribusi pedalaman.",
    substitution:
      "Ubi jalar dan sagu OKI tersedia sebagai substitusi bernilai lokal tinggi.",
    production: 2140000,
    demand: 1980000,
    priceIndex: 5,
    topCommodity: "Beras",
    cluster: "stabil",
    riskFactors: ["Banjir periodik di lahan rawa", "Kualitas infrastruktur jalan belum merata"],
    shapFactors: [
      { label: "Prod. lokal", value: 3.4, direction: "pos" },
      { label: "Banjir periodik", value: -2.8, direction: "neg" },
      { label: "Infrastruktur", value: -1.9, direction: "neg" },
    ],
  },

  Bengkulu: {
    score: 63,
    status: "Waspada",
    recommendation:
      "Perkuat konektivitas distribusi antar kabupaten yang masih terisolasi. Prioritaskan buffer stock untuk daerah terpencil.",
    substitution:
      "Ubi jalar gunung Bengkulu dan jagung lokal potensial sebagai substitusi.",
    production: 390000,
    demand: 440000,
    priceIndex: 13,
    topCommodity: "Beras",
    cluster: "stabil",
    riskFactors: ["Infrastruktur jalan buruk ke daerah terpencil", "Produksi belum mencukupi kebutuhan lokal"],
    shapFactors: [
      { label: "Infrastruktur", value: -4.8, direction: "neg" },
      { label: "Prod. gap", value: -3.2, direction: "neg" },
      { label: "Komoditas lokal", value: 1.9, direction: "pos" },
    ],
  },

  Lampung: {
    score: 82,
    status: "Aman",
    recommendation:
      "Optimalkan surplus produksi untuk redistribusi ke DKI Jakarta dan Banten. Manfaatkan infrastruktur pelabuhan Bakauheni.",
    substitution:
      "Singkong Lampung adalah substitusi unggulan dengan produksi tertinggi nasional.",
    production: 2980000,
    demand: 2340000,
    priceIndex: 1,
    topCommodity: "Singkong",
    cluster: "surplus",
    riskFactors: ["Harga singkong fluktuatif tergantung ekspor"],
    shapFactors: [
      { label: "Surplus produksi", value: 6.2, direction: "pos" },
      { label: "Logistik pelabuhan", value: 4.8, direction: "pos" },
      { label: "Harga singkong", value: -1.2, direction: "neg" },
    ],
  },

  "Kepulauan Bangka Belitung": {
    score: 65,
    status: "Waspada",
    recommendation:
      "Diversifikasi pangan dari ketergantungan beras impor. Kembangkan budidaya ikan dan tanaman pangan lokal kepulauan.",
    substitution:
      "Ikan tangkap lokal dan umbi-umbian pesisir sebagai substitusi sumber protein dan karbohidrat.",
    production: 48000,
    demand: 220000,
    priceIndex: 18,
    topCommodity: "Beras",
    cluster: "rentan",
    riskFactors: ["Ketergantungan impor sangat tinggi", "Logistik kepulauan mahal", "Biaya distribusi tinggi"],
    shapFactors: [
      { label: "Ketergantungan impor", value: -6.1, direction: "neg" },
      { label: "Logistik kepulauan", value: -4.3, direction: "neg" },
      { label: "Ikan lokal", value: 2.4, direction: "pos" },
    ],
  },

  "Kepulauan Riau": {
    score: 66,
    status: "Waspada",
    recommendation:
      "Manfaatkan kedekatan dengan Singapura untuk efisiensi impor. Tingkatkan produksi pangan lokal kepulauan.",
    substitution:
      "Ikan laut segar dan produk perikanan lokal sangat berlimpah sebagai substitusi protein.",
    production: 32000,
    demand: 310000,
    priceIndex: 16,
    topCommodity: "Beras",
    cluster: "rentan",
    riskFactors: ["Sangat bergantung pada impor", "Harga pangan tinggi karena logistik kepulauan"],
    shapFactors: [
      { label: "Defisit produksi", value: -5.8, direction: "neg" },
      { label: "Logistik maritim", value: -3.1, direction: "neg" },
      { label: "Akses pelabuhan", value: 2.9, direction: "pos" },
    ],
  },

  "DKI Jakarta": {
    score: 84,
    status: "Aman",
    recommendation:
      "Pertahankan efisiensi distribusi dari Jawa Barat dan Lampung. Perkuat sistem cold chain untuk komoditas segar.",
    substitution:
      "Sayuran hidroponik lokal dan produk olahan sebagai substitusi saat harga pangan pokok naik.",
    production: 12000,
    demand: 4800000,
    priceIndex: 4,
    topCommodity: "Beras",
    cluster: "stabil",
    riskFactors: ["Sangat bergantung pada pasokan luar daerah"],
    shapFactors: [
      { label: "Logistik hub", value: 7.2, direction: "pos" },
      { label: "Infrastruktur", value: 5.4, direction: "pos" },
      { label: "Ketergantungan import", value: -3.8, direction: "neg" },
    ],
  },

  "Jawa Barat": {
    score: 88,
    status: "Aman",
    recommendation:
      "Pertahankan produksi padi Cianjur, Subang, dan Karawang. Optimalkan distribusi ke DKI Jakarta dan Banten.",
    substitution:
      "Jagung, singkong, dan ubi jalar berlimpah sebagai alternatif karbohidrat berkualitas.",
    production: 9800000,
    demand: 8200000,
    priceIndex: 2,
    topCommodity: "Beras",
    cluster: "surplus",
    riskFactors: ["Konversi lahan sawah menjadi pemukiman"],
    shapFactors: [
      { label: "Prod. padi", value: 7.8, direction: "pos" },
      { label: "Lumbung surplus", value: 5.2, direction: "pos" },
      { label: "Alih fungsi lahan", value: -2.1, direction: "neg" },
    ],
  },

  "Jawa Tengah": {
    score: 89,
    status: "Aman",
    recommendation:
      "Optimalkan lumbung padi Cilacap, Brebes, dan Demak. Tingkatkan efisiensi rantai pasok ke wilayah defisit nasional.",
    substitution:
      "Gaplek dan produk singkong olahan Jawa Tengah sangat potensial sebagai substitusi ekspor.",
    production: 10200000,
    demand: 8800000,
    priceIndex: 1,
    topCommodity: "Beras",
    cluster: "surplus",
    riskFactors: ["Perubahan cuaca mempengaruhi musim tanam"],
    shapFactors: [
      { label: "Kapasitas produksi", value: 8.4, direction: "pos" },
      { label: "Infrastruktur", value: 6.1, direction: "pos" },
      { label: "Cuaca", value: -1.3, direction: "neg" },
    ],
  },

  "DI Yogyakarta": {
    score: 87,
    status: "Aman",
    recommendation:
      "Pertahankan kualitas beras premium Bantul. Kembangkan potensi pangan lokal berbasis budaya untuk diversifikasi.",
    substitution:
      "Gaplek dan bahan pangan olahan tradisional Jogja berpotensi sebagai produk substitusi bernilai tinggi.",
    production: 620000,
    demand: 590000,
    priceIndex: 3,
    topCommodity: "Beras",
    cluster: "stabil",
    riskFactors: ["Keterbatasan lahan pertanian"],
    shapFactors: [
      { label: "Kualitas produksi", value: 5.9, direction: "pos" },
      { label: "Logistik terintegrasi", value: 4.3, direction: "pos" },
      { label: "Keterbatasan lahan", value: -1.8, direction: "neg" },
    ],
  },

  "Jawa Timur": {
    score: 90,
    status: "Aman",
    recommendation:
      "Manfaatkan posisi sebagai lumbung pangan nasional untuk redistribusi ke Indonesia Timur. Perkuat pelabuhan Tanjung Perak.",
    substitution:
      "Jagung Jawa Timur adalah komoditas substitusi unggulan untuk pakan dan pangan nasional.",
    production: 12400000,
    demand: 9800000,
    priceIndex: 1,
    topCommodity: "Jagung",
    cluster: "surplus",
    riskFactors: ["Alih fungsi lahan di Malang dan Jember"],
    shapFactors: [
      { label: "Surplus produksi", value: 9.1, direction: "pos" },
      { label: "Hub distribusi", value: 7.3, direction: "pos" },
      { label: "Pelabuhan Surabaya", value: 5.8, direction: "pos" },
      { label: "Alih fungsi lahan", value: -1.6, direction: "neg" },
    ],
  },

  Banten: {
    score: 82,
    status: "Aman",
    recommendation:
      "Optimalkan peran sebagai penyangga pangan DKI Jakarta. Perkuat rantai distribusi dari Serang dan Lebak.",
    substitution:
      "Ubi jalar dan sayuran Lebak dapat menggantikan beberapa komoditas impor.",
    production: 1240000,
    demand: 1180000,
    priceIndex: 4,
    topCommodity: "Beras",
    cluster: "surplus",
    riskFactors: ["Pertumbuhan urban cepat menekan lahan pertanian"],
    shapFactors: [
      { label: "Posisi strategis", value: 5.1, direction: "pos" },
      { label: "Konektivitas", value: 3.8, direction: "pos" },
      { label: "Urban sprawl", value: -2.2, direction: "neg" },
    ],
  },

  Bali: {
    score: 86,
    status: "Aman",
    recommendation:
      "Pertahankan sistem subak dan produksi beras premium Tabanan. Kembangkan rantai pangan untuk sektor pariwisata.",
    substitution:
      "Produk pangan olahan Bali dan komoditas hortikultura lokal berlimpah.",
    production: 920000,
    demand: 780000,
    priceIndex: 3,
    topCommodity: "Beras",
    cluster: "surplus",
    riskFactors: ["Konversi sawah untuk pariwisata", "Ketergantungan pada sektor wisata"],
    shapFactors: [
      { label: "Sistem subak", value: 5.4, direction: "pos" },
      { label: "Kualitas produksi", value: 4.2, direction: "pos" },
      { label: "Konversi lahan", value: -2.4, direction: "neg" },
    ],
  },

  "Nusa Tenggara Barat": {
    score: 68,
    status: "Waspada",
    recommendation:
      "Perkuat produksi jagung NTB sebagai komoditas unggulan. Tingkatkan akses air bersih untuk irigasi di daerah kering.",
    substitution:
      "Jagung NTB sangat potensial menggantikan beras sebagai karbohidrat utama.",
    production: 1120000,
    demand: 1090000,
    priceIndex: 11,
    topCommodity: "Jagung",
    cluster: "stabil",
    riskFactors: ["Kekeringan musiman cukup parah", "Infrastruktur irigasi belum optimal"],
    shapFactors: [
      { label: "Prod. jagung", value: 2.8, direction: "pos" },
      { label: "Kekeringan", value: -4.1, direction: "neg" },
      { label: "Irigasi terbatas", value: -2.9, direction: "neg" },
    ],
  },

  "Nusa Tenggara Timur": {
    score: 38,
    status: "Rawan",
    recommendation:
      "Prioritaskan redistribusi dari Sulawesi Selatan dan Jawa Timur. Aktifkan buffer stock daerah dan percepat program substitusi pangan lokal.",
    substitution:
      "Sorgum NTT adalah substitusi karbohidrat paling adaptif terhadap iklim kering di wilayah ini.",
    production: 380000,
    demand: 680000,
    priceIndex: 24,
    topCommodity: "Sorgum",
    cluster: "rentan",
    riskFactors: [
      "Kekeringan ekstrem hampir setiap tahun",
      "Defisit produksi besar",
      "Akses infrastruktur sangat terbatas",
      "Harga pangan sangat tinggi",
    ],
    shapFactors: [
      { label: "Kekeringan", value: -7.2, direction: "neg" },
      { label: "Defisit produksi", value: -6.8, direction: "neg" },
      { label: "Logistik buruk", value: -5.1, direction: "neg" },
      { label: "Sorgum lokal", value: 3.4, direction: "pos" },
    ],
  },

  "Kalimantan Barat": {
    score: 73,
    status: "Waspada",
    recommendation:
      "Kembangkan produksi padi lahan gambut secara berkelanjutan. Tingkatkan konektivitas distribusi ke perbatasan Malaysia.",
    substitution:
      "Sagu dan ubi jalar berlimpah sebagai alternatif karbohidrat lokal.",
    production: 980000,
    demand: 1020000,
    priceIndex: 8,
    topCommodity: "Beras",
    cluster: "stabil",
    riskFactors: ["Lahan gambut rentan kebakaran", "Konektivitas perbatasan terbatas"],
    shapFactors: [
      { label: "Lahan gambut", value: -3.8, direction: "neg" },
      { label: "Sagu lokal", value: 2.9, direction: "pos" },
      { label: "Konektivitas", value: -2.1, direction: "neg" },
    ],
  },

  "Kalimantan Tengah": {
    score: 62,
    status: "Waspada",
    recommendation:
      "Tingkatkan infrastruktur distribusi di sepanjang Sungai Kahayan dan Barito. Kembangkan pertanian lahan gambut berkelanjutan.",
    substitution:
      "Sagu Kalimantan Tengah sangat berlimpah dan dapat menggantikan beras untuk wilayah pedalaman.",
    production: 480000,
    demand: 620000,
    priceIndex: 15,
    topCommodity: "Sagu",
    cluster: "stabil",
    riskFactors: [
      "Infrastruktur pedalaman sangat terbatas",
      "Kebakaran hutan musim kemarau",
      "Produksi belum mencukupi",
    ],
    shapFactors: [
      { label: "Infrastruktur", value: -5.2, direction: "neg" },
      { label: "Kebakaran", value: -4.1, direction: "neg" },
      { label: "Sagu lokal", value: 3.6, direction: "pos" },
    ],
  },

  "Kalimantan Selatan": {
    score: 83,
    status: "Aman",
    recommendation:
      "Optimalkan surplus beras Hulu Sungai untuk redistribusi ke Kalimantan tetangga. Perkuat pelabuhan Banjarmasin.",
    substitution:
      "Beras Siam Unus Banjar terkenal sebagai komoditas premium yang dapat menopang kebutuhan regional.",
    production: 1820000,
    demand: 1540000,
    priceIndex: 2,
    topCommodity: "Beras",
    cluster: "surplus",
    riskFactors: ["Banjir musiman di Hulu Sungai"],
    shapFactors: [
      { label: "Surplus beras", value: 5.8, direction: "pos" },
      { label: "Pelabuhan Banjarmasin", value: 4.2, direction: "pos" },
      { label: "Banjir musiman", value: -2.1, direction: "neg" },
    ],
  },

  "Kalimantan Timur": {
    score: 85,
    status: "Aman",
    recommendation:
      "Manfaatkan kapasitas fiskal tinggi untuk investasi infrastruktur pangan. Kembangkan kawasan pertanian di IKN.",
    substitution:
      "Sayuran dataran tinggi Paser dan produk hortikultura lokal sebagai substitusi pangan segar.",
    production: 620000,
    demand: 860000,
    priceIndex: 5,
    topCommodity: "Beras",
    cluster: "stabil",
    riskFactors: ["Bergantung impor untuk memenuhi defisit", "Konsentrasi populasi di Balikpapan-Samarinda"],
    shapFactors: [
      { label: "Kapasitas fiskal", value: 6.4, direction: "pos" },
      { label: "Infrastruktur", value: 4.8, direction: "pos" },
      { label: "Defisit beras", value: -2.8, direction: "neg" },
    ],
  },

  "Kalimantan Utara": {
    score: 58,
    status: "Waspada",
    recommendation:
      "Prioritaskan pengembangan pertanian subsisten di daerah perbatasan. Manfaatkan kerjasama lintas batas dengan Sabah Malaysia.",
    substitution:
      "Sagu dan ubi hutan lokal potensial sebagai substitusi di daerah terpencil perbatasan.",
    production: 120000,
    demand: 280000,
    priceIndex: 21,
    topCommodity: "Beras",
    cluster: "rentan",
    riskFactors: [
      "Provinsi termuda dengan infrastruktur terbatas",
      "Defisit produksi besar",
      "Biaya logistik sangat tinggi ke perbatasan",
    ],
    shapFactors: [
      { label: "Infrastruktur terbatas", value: -6.2, direction: "neg" },
      { label: "Defisit produksi", value: -5.4, direction: "neg" },
      { label: "Kerjasama perbatasan", value: 2.1, direction: "pos" },
    ],
  },

  "Sulawesi Utara": {
    score: 72,
    status: "Waspada",
    recommendation:
      "Manfaatkan posisi strategis sebagai hub regional Filipina-Asia Pasifik. Kembangkan produksi komoditas ekspor untuk meningkatkan devisa.",
    substitution:
      "Kelapa dan produk olahannya sangat berlimpah sebagai substitusi pangan lokal.",
    production: 580000,
    demand: 620000,
    priceIndex: 9,
    topCommodity: "Kelapa",
    cluster: "stabil",
    riskFactors: ["Ketergantungan komoditas ekspor rentan fluktuasi", "Produksi padi terbatas"],
    shapFactors: [
      { label: "Posisi hub regional", value: 3.8, direction: "pos" },
      { label: "Kelapa lokal", value: 3.2, direction: "pos" },
      { label: "Fluktuasi ekspor", value: -3.1, direction: "neg" },
    ],
  },

  "Sulawesi Tengah": {
    score: 70,
    status: "Waspada",
    recommendation:
      "Tingkatkan produksi kakao dan padi di lembah Palu dan Parigi. Perkuat infrastruktur pasca gempa 2018.",
    substitution:
      "Sagu Sulawesi Tengah dan ubi kayu lokal tersedia luas sebagai alternatif karbohidrat.",
    production: 1040000,
    demand: 1080000,
    priceIndex: 11,
    topCommodity: "Beras",
    cluster: "stabil",
    riskFactors: ["Rekonstruksi pasca gempa masih berlangsung", "Infrastruktur jalan belum pulih"],
    shapFactors: [
      { label: "Infrastruktur pasca gempa", value: -4.8, direction: "neg" },
      { label: "Prod. lokal", value: 2.4, direction: "pos" },
      { label: "Sagu lokal", value: 2.1, direction: "pos" },
    ],
  },

  "Sulawesi Selatan": {
    score: 85,
    status: "Aman",
    recommendation:
      "Optimalkan posisi sebagai lumbung pangan Indonesia Timur. Maksimalkan kapasitas pelabuhan Makassar untuk redistribusi ke Papua dan NTT.",
    substitution:
      "Jagung Sulawesi Selatan dan ubi jalar lokal tersedia berlimpah sebagai substitusi beras.",
    production: 5640000,
    demand: 4280000,
    priceIndex: 2,
    topCommodity: "Beras",
    cluster: "surplus",
    riskFactors: ["Cuaca ekstrem mempengaruhi produksi pesisir"],
    shapFactors: [
      { label: "Surplus produksi", value: 7.8, direction: "pos" },
      { label: "Hub logistik timur", value: 6.2, direction: "pos" },
      { label: "Pelabuhan Makassar", value: 5.1, direction: "pos" },
      { label: "Cuaca ekstrem", value: -1.4, direction: "neg" },
    ],
  },

  "Sulawesi Tenggara": {
    score: 69,
    status: "Waspada",
    recommendation:
      "Perkuat produksi padi di Konawe dan Kolaka. Tingkatkan konektivitas pulau-pulau terluar dengan ferry bersubsidi.",
    substitution:
      "Sagu Muna dan Buton sangat berlimpah sebagai substitusi karbohidrat lokal berkualitas.",
    production: 680000,
    demand: 720000,
    priceIndex: 12,
    topCommodity: "Sagu",
    cluster: "stabil",
    riskFactors: ["Konektivitas kepulauan terbatas", "Biaya logistik antar pulau tinggi"],
    shapFactors: [
      { label: "Konektivitas kepulauan", value: -4.2, direction: "neg" },
      { label: "Sagu lokal", value: 3.8, direction: "pos" },
      { label: "Prod. padi", value: -1.9, direction: "neg" },
    ],
  },

  Gorontalo: {
    score: 67,
    status: "Waspada",
    recommendation:
      "Kembangkan potensi jagung Gorontalo yang sudah dikenal nasional. Tingkatkan kapasitas pengolahan dan distribusi ke Kalimantan.",
    substitution:
      "Jagung Gorontalo adalah substitusi karbohidrat unggulan dengan reputasi pasar yang baik.",
    production: 520000,
    demand: 480000,
    priceIndex: 10,
    topCommodity: "Jagung",
    cluster: "stabil",
    riskFactors: ["Keterbatasan infrastruktur pengolahan pascapanen", "Fluktuasi harga jagung nasional"],
    shapFactors: [
      { label: "Jagung lokal", value: 4.1, direction: "pos" },
      { label: "Infrastruktur pengolahan", value: -3.6, direction: "neg" },
      { label: "Fluktuasi harga", value: -2.8, direction: "neg" },
    ],
  },

  "Sulawesi Barat": {
    score: 56,
    status: "Waspada",
    recommendation:
      "Prioritaskan pembangunan infrastruktur distribusi. Kembangkan produksi padi di lembah Mamasa dan Polewali.",
    substitution:
      "Pisang dan ubi jalar lokal Sulawesi Barat sangat berlimpah sebagai substitusi pangan pokok.",
    production: 310000,
    demand: 410000,
    priceIndex: 18,
    topCommodity: "Beras",
    cluster: "rentan",
    riskFactors: [
      "Provinsi termuda di Sulawesi dengan infrastruktur terbatas",
      "Defisit produksi cukup besar",
      "Akses jalan terbatas",
    ],
    shapFactors: [
      { label: "Infrastruktur terbatas", value: -5.8, direction: "neg" },
      { label: "Defisit produksi", value: -4.9, direction: "neg" },
      { label: "Komoditas lokal", value: 2.6, direction: "pos" },
    ],
  },

  Maluku: {
    score: 48,
    status: "Rawan",
    recommendation:
      "Aktifkan redistribusi dari Sulawesi Selatan. Kembangkan potensi sagu Maluku sebagai komoditas pangan strategis nasional.",
    substitution:
      "Sagu Maluku adalah warisan komoditas lokal terbaik yang dapat menggantikan beras sepenuhnya.",
    production: 240000,
    demand: 520000,
    priceIndex: 22,
    topCommodity: "Sagu",
    cluster: "rentan",
    riskFactors: [
      "Logistik kepulauan sangat mahal",
      "Defisit produksi besar",
      "Ketergantungan impor tinggi",
      "Harga pangan di atas rata-rata nasional",
    ],
    shapFactors: [
      { label: "Logistik kepulauan", value: -6.8, direction: "neg" },
      { label: "Defisit produksi", value: -5.4, direction: "neg" },
      { label: "Sagu lokal", value: 4.2, direction: "pos" },
      { label: "Akses laut", value: 1.8, direction: "pos" },
    ],
  },

  "Maluku Utara": {
    score: 52,
    status: "Rawan",
    recommendation:
      "Perkuat distribusi antar pulau dengan armada kapal bersubsidi. Manfaatkan potensi sagu dan rempah untuk diversifikasi pangan.",
    substitution:
      "Sagu halmahera dan umbi lokal sangat potensial menggantikan beras yang harus diimpor.",
    production: 180000,
    demand: 380000,
    priceIndex: 20,
    topCommodity: "Sagu",
    cluster: "rentan",
    riskFactors: [
      "Terdiri dari ratusan pulau kecil",
      "Biaya logistik antar pulau sangat tinggi",
      "Keterbatasan infrastruktur",
    ],
    shapFactors: [
      { label: "Fragmentasi pulau", value: -6.2, direction: "neg" },
      { label: "Biaya logistik", value: -5.1, direction: "neg" },
      { label: "Sagu lokal", value: 3.9, direction: "pos" },
    ],
  },

  "Papua Barat": {
    score: 45,
    status: "Rawan",
    recommendation:
      "Aktifkan program redistribusi dari Sulawesi Selatan dan Jawa Timur. Percepat pembangunan infrastruktur jalan dan pelabuhan lokal.",
    substitution:
      "Sagu Papua Barat adalah sumber karbohidrat lokal utama yang harus diperkuat pengolahannya.",
    production: 86000,
    demand: 340000,
    priceIndex: 28,
    topCommodity: "Sagu",
    cluster: "rentan",
    riskFactors: [
      "Infrastruktur sangat terbatas",
      "Defisit pangan kronis",
      "Biaya distribusi sangat tinggi",
      "Keterisolasian geografis",
    ],
    shapFactors: [
      { label: "Keterisolasian", value: -7.4, direction: "neg" },
      { label: "Defisit produksi", value: -6.1, direction: "neg" },
      { label: "Sagu lokal", value: 3.2, direction: "pos" },
      { label: "Program subsidi", value: 2.4, direction: "pos" },
    ],
  },

  "Papua Barat Daya": {
    score: 43,
    status: "Rawan",
    recommendation:
      "Provinsi baru — prioritaskan pembangunan sistem distribusi pangan. Aktifkan program food security dari pusat.",
    substitution:
      "Sagu dan hasil tangkap laut lokal Sorong sebagai substitusi utama pangan pokok.",
    production: 62000,
    demand: 260000,
    priceIndex: 30,
    topCommodity: "Sagu",
    cluster: "rentan",
    riskFactors: [
      "Provinsi baru (DOB 2022) — sistem distribusi belum terbentuk",
      "Infrastruktur sangat minim",
      "Data produksi masih terbatas",
    ],
    shapFactors: [
      { label: "Infrastruktur baru", value: -7.8, direction: "neg" },
      { label: "Sistem distribusi", value: -6.4, direction: "neg" },
      { label: "Sagu lokal", value: 2.8, direction: "pos" },
    ],
  },

  Papua: {
    score: 28,
    status: "Rawan",
    recommendation:
      "Prioritas nasional tertinggi. Aktifkan redistribusi besar dari Sulawesi Selatan dan Jawa Timur. Percepat pembangunan jalan Trans-Papua dan pelabuhan pedalaman.",
    substitution:
      "Sagu Papua merupakan komoditas substitusi utama yang harus segera diperkuat produksi dan distribusinya di tingkat kabupaten.",
    production: 140000,
    demand: 820000,
    priceIndex: 38,
    topCommodity: "Sagu",
    cluster: "rentan",
    riskFactors: [
      "Defisit produksi sangat besar",
      "Infrastruktur sangat terbatas",
      "Biaya logistik ekstrem",
      "Keterisolasian geografis parah",
      "Harga pangan 2-3x rata-rata nasional",
    ],
    shapFactors: [
      { label: "Harga beras", value: -8.4, direction: "neg" },
      { label: "Prod. lokal", value: -6.1, direction: "neg" },
      { label: "Curah hujan", value: -4.8, direction: "neg" },
      { label: "Logistik", value: -3.9, direction: "neg" },
      { label: "Sagu lokal", value: 2.4, direction: "pos" },
    ],
  },

  "Papua Selatan": {
    score: 40,
    status: "Rawan",
    recommendation:
      "Provinsi baru — percepat pembangunan infrastruktur distribusi. Manfaatkan potensi pertanian Merauke sebagai lumbung pangan.",
    substitution:
      "Beras Merauke dan sagu lokal adalah dua komoditas unggulan yang perlu diperkuat produksinya.",
    production: 480000,
    demand: 680000,
    priceIndex: 26,
    topCommodity: "Beras",
    cluster: "rentan",
    riskFactors: [
      "Sistem distribusi baru belum optimal",
      "Konektivitas dengan Papua induk terbatas",
      "Infrastruktur jalan sangat minim",
    ],
    shapFactors: [
      { label: "Infrastruktur", value: -6.9, direction: "neg" },
      { label: "Defisit distribusi", value: -5.2, direction: "neg" },
      { label: "Potensi Merauke", value: 4.1, direction: "pos" },
    ],
  },

  "Papua Tengah": {
    score: 33,
    status: "Rawan",
    recommendation:
      "Wilayah pegunungan terisolasi — prioritaskan distribusi udara dan program ketahanan pangan berbasis komunitas lokal.",
    substitution:
      "Ubi jalar pegunungan Papua adalah substitusi karbohidrat lokal paling adaptif dan bernutrisi tinggi.",
    production: 92000,
    demand: 420000,
    priceIndex: 35,
    topCommodity: "Ubi Jalar",
    cluster: "rentan",
    riskFactors: [
      "Wilayah pegunungan sangat terisolasi",
      "Tidak ada akses jalan ke banyak distrik",
      "Ketergantungan distribusi via udara",
      "Biaya pangan sangat tinggi",
    ],
    shapFactors: [
      { label: "Keterisolasian", value: -8.1, direction: "neg" },
      { label: "Infrastruktur udara", value: -5.6, direction: "neg" },
      { label: "Ubi jalar lokal", value: 4.8, direction: "pos" },
    ],
  },

  "Papua Pegunungan": {
    score: 31,
    status: "Rawan",
    recommendation:
      "Prioritas darurat — distribusi via udara harus diperkuat. Kembangkan program pertanian pegunungan berbasis komunitas adat.",
    substitution:
      "Ubi jalar dan keladi pegunungan adalah sumber pangan utama yang sudah dikenal masyarakat adat Papua.",
    production: 78000,
    demand: 380000,
    priceIndex: 40,
    topCommodity: "Ubi Jalar",
    cluster: "rentan",
    riskFactors: [
      "Wilayah tersulit dijangkau di Indonesia",
      "Tidak ada akses darat sama sekali",
      "Harga pangan tertinggi secara nasional",
      "Ketergantungan total pada distribusi udara",
    ],
    shapFactors: [
      { label: "Akses sangat terbatas", value: -9.2, direction: "neg" },
      { label: "Biaya logistik ekstrem", value: -7.8, direction: "neg" },
      { label: "Ubi jalar lokal", value: 5.1, direction: "pos" },
      { label: "Komunitas adat", value: 3.2, direction: "pos" },
    ],
  },
};
